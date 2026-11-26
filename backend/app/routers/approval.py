from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import PurchaseRequest, PurchaseItem, PurchaseTimeline, AuditLog, User
from ..schemas import PurchaseRequestCreate, ApprovalAction, RejectAction
import uuid
from datetime import datetime
from urllib.parse import unquote

router = APIRouter(prefix="/api/approval", tags=["approval"])

def get_current_user_from_header(x_user_role: str = Header(None), x_user_name: str = Header(None)):
    name = unquote(x_user_name) if x_user_name else "Nguyễn Văn Đạt"
    return {
        "role": x_user_role or "CHEF",
        "name": name
    }

@router.get("/requests")
def get_purchase_requests(db: Session = Depends(get_db)):
    requests = db.query(PurchaseRequest).order_by(PurchaseRequest.created_at.desc()).all()
    results = []
    for pr in requests:
        items_data = [
            {
                "id": it.id,
                "material_id": it.material_id,
                "material_name": it.material_name,
                "unit": it.unit,
                "quantity": it.quantity,
                "unit_price": it.unit_price,
                "amount": it.amount
            }
            for it in pr.items
        ]
        timeline_data = [
            {
                "step": tl.step,
                "role": tl.role,
                "name": tl.name,
                "action": tl.action,
                "time": tl.time,
                "note": tl.note
            }
            for tl in sorted(pr.timeline, key=lambda x: x.step)
        ]
        results.append({
            "id": pr.id,
            "title": pr.title,
            "created_by": pr.created_by,
            "created_at": pr.created_at,
            "supplier_id": pr.supplier_id,
            "supplier_name": pr.supplier_name,
            "total_amount": pr.total_amount,
            "status": pr.status,
            "current_level": pr.current_level,
            "po_number": pr.po_number,
            "warehouse_status": pr.warehouse_status,
            "note": pr.note,
            "items": items_data,
            "timeline": timeline_data
        })
    return results

@router.post("/requests")
def create_purchase_request(
    req: PurchaseRequestCreate,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    # Only CHEF or ADMIN can create PR
    if user_info["role"] not in ["CHEF", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Chỉ Bếp trưởng mới có quyền lập đề xuất mua hàng (PR)")

    pr_count = db.query(PurchaseRequest).count() + 1
    pr_id = f"PR-202611-{pr_count:03d}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    new_pr = PurchaseRequest(
        id=pr_id,
        title=req.title,
        created_by=f"{user_info['name']} (Bếp trưởng)",
        created_at=now_str,
        supplier_id=req.supplier_id,
        supplier_name=req.supplier_name,
        total_amount=req.total_amount,
        status="PENDING_TCHC",
        current_level=2,
        po_number=None,
        warehouse_status="NONE",
        note=req.note
    )
    db.add(new_pr)

    for it in req.items:
        pi = PurchaseItem(
            id=f"pi-{uuid.uuid4().hex[:8]}",
            request_id=pr_id,
            material_id=it.material_id,
            material_name=it.material_name,
            unit=it.unit,
            quantity=it.quantity,
            unit_price=it.unit_price,
            amount=it.amount
        )
        db.add(pi)

    # Step 1 Timeline
    tl = PurchaseTimeline(
        request_id=pr_id,
        step=1,
        role="CHEF",
        name=f"{user_info['name']} (Bếp trưởng)",
        action="CREATED",
        time=now_str,
        note=req.note or "Lập đề xuất mua hàng"
    )
    db.add(tl)

    # Audit Log
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{user_info['name']} ({user_info['role']})",
        action="TẠO_ĐỀ_XUẤT_MUA",
        target=f"Phiếu {pr_id}",
        details=f"Tổng dự toán: {req.total_amount:,.0f}đ, NCC: {req.supplier_name}"
    )
    db.add(log)

    db.commit()
    return {"message": f"Tạo đề xuất {pr_id} thành công!", "pr_id": pr_id}

@router.post("/requests/{pr_id}/approve")
def approve_request(
    pr_id: str,
    action: ApprovalAction,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == pr_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu đề xuất")

    role = user_info["role"]
    name = user_info["name"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Strict RBAC Check
    if pr.status == "PENDING_TCHC":
        if role not in ["TCHC", "ADMIN"]:
            raise HTTPException(status_code=403, detail="Chỉ Trưởng phòng TCHC mới có thẩm quyền duyệt Cấp 2")
        pr.status = "PENDING_ACCOUNTANT"
        pr.current_level = 3
        step_num = 2
        action_name = "PHÊ_DUYỆT_CẤP_2"
    elif pr.status == "PENDING_ACCOUNTANT":
        if role not in ["ACCOUNTANT", "ADMIN"]:
            raise HTTPException(status_code=403, detail="Chỉ Kế toán trưởng mới có thẩm quyền duyệt Cấp 3")
        pr.status = "PENDING_CHAIRMAN"
        pr.current_level = 4
        step_num = 3
        action_name = "PHÊ_DUYỆT_CẤP_3"
    elif pr.status == "PENDING_CHAIRMAN":
        if role not in ["CHAIRMAN", "ADMIN"]:
            raise HTTPException(status_code=403, detail="Chỉ Chủ tịch Hội đồng trường mới có thẩm quyền duyệt Cấp 4 (Ký duyệt chi)")
        pr.status = "APPROVED"
        pr.current_level = 4
        pr.po_number = f"PO-202611-{uuid.uuid4().hex[:4].upper()}"
        pr.warehouse_status = "PENDING_RECEIPT"
        step_num = 4
        action_name = "PHÊ_DUYỆT_CẤP_4"
    else:
        raise HTTPException(status_code=400, detail="Phiếu không ở trạng thái chờ duyệt")

    # Timeline entry
    tl = PurchaseTimeline(
        request_id=pr_id,
        step=step_num,
        role=role,
        name=f"{name} ({role})",
        action="APPROVED",
        time=now_str,
        note=action.note or "Đồng ý phê duyệt"
    )
    db.add(tl)

    # Audit Log
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{name} ({role})",
        action=action_name,
        target=f"Phiếu {pr_id}",
        details=f"Duyệt: {action.note or 'Đồng ý'}" + (f". Đã sinh PO: {pr.po_number}" if pr.po_number else "")
    )
    db.add(log)

    db.commit()
    return {
        "status": "success",
        "message": f"Phê duyệt thành công phiếu {pr_id}!",
        "new_status": pr.status,
        "po_number": pr.po_number
    }

@router.post("/requests/{pr_id}/reject")
def reject_request(
    pr_id: str,
    action: RejectAction,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == pr_id).first()
    if not pr:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu đề xuất")

    role = user_info["role"]
    name = user_info["name"]
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    # Role validation
    if pr.status == "PENDING_TCHC" and role not in ["TCHC", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Chỉ Trưởng phòng TCHC mới có quyền từ chối ở Cấp 2")
    if pr.status == "PENDING_ACCOUNTANT" and role not in ["ACCOUNTANT", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Chỉ Kế toán trưởng mới có quyền từ chối ở Cấp 3")
    if pr.status == "PENDING_CHAIRMAN" and role not in ["CHAIRMAN", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Chỉ Chủ tịch HĐT mới có quyền từ chối ở Cấp 4")

    pr.status = "REJECTED"

    tl = PurchaseTimeline(
        request_id=pr_id,
        step=len(pr.timeline) + 1,
        role=role,
        name=f"{name} ({role})",
        action="REJECTED",
        time=now_str,
        note=action.reason
    )
    db.add(tl)

    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{name} ({role})",
        action="TỪ_CHỐI_PHÊ_DUYỆT",
        target=f"Phiếu {pr_id}",
        details=f"Lý do: {action.reason}"
    )
    db.add(log)

    db.commit()
    return {"message": f"Đã từ chối phiếu {pr_id}."}
