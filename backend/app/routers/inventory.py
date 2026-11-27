from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Material, InventoryBatch, PurchaseRequest, AuditLog
from ..schemas import GoodsReceiveRequest, StockAdjustRequest
import uuid
from datetime import datetime
from urllib.parse import unquote

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

def get_current_user_from_header(x_user_role: str = Header(None), x_user_name: str = Header(None)):
    name = unquote(x_user_name) if x_user_name else "Bùi Đức Thắng"
    return {
        "role": x_user_role or "STOREKEEPER",
        "name": name
    }

@router.get("/materials")
def get_materials(db: Session = Depends(get_db)):
    materials = db.query(Material).all()
    return [
        {
            "id": m.id,
            "code": m.code,
            "name": m.name,
            "unit": m.unit,
            "current_stock": m.current_stock,
            "safety_stock": m.safety_stock,
            "min_order_qty": m.min_order_qty,
            "avg_cost": m.avg_cost,
            "supplier_id": m.supplier_id,
            "category": m.category
        }
        for m in materials
    ]

@router.get("/batches")
def get_batches(db: Session = Depends(get_db)):
    # Sort by expiry date (FEFO)
    batches = db.query(InventoryBatch).order_by(InventoryBatch.exp_date.asc()).all()
    results = []
    for b in batches:
        results.append({
            "id": b.id,
            "lot_code": b.lot_code,
            "material_id": b.material_id,
            "material_name": b.material_name,
            "initial_qty": b.initial_qty,
            "current_qty": b.current_qty,
            "unit": b.unit,
            "mfg_date": b.mfg_date,
            "exp_date": b.exp_date,
            "status": b.status
        })
    return results

@router.post("/receive/{pr_id}")
def receive_goods(
    pr_id: str,
    req: GoodsReceiveRequest,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    if user_info["role"] != "STOREKEEPER":
        raise HTTPException(
            status_code=403,
            detail="Nghiệp vụ nhập kho thực tế chỉ thuộc thẩm quyền của Thủ kho (STOREKEEPER). Quản trị viên chỉ có quyền giám sát."
        )

    pr = db.query(PurchaseRequest).filter(PurchaseRequest.id == pr_id).first()
    if not pr or pr.status != "APPROVED":
        raise HTTPException(status_code=400, detail="Chỉ có thể nhập kho đơn PO đã được phê duyệt Cấp 4")

    now_str = datetime.now().strftime("%Y-%m-%d")

    # Process each item
    for it in pr.items:
        batch_input = req.batches.get(it.material_id, {})
        lot_code = batch_input.get("lot_code") or f"LOT-{datetime.now().strftime('%Y%m%d')}-{it.material_name[:3].upper()}"
        exp_date = batch_input.get("exp_date") or "2026-12-05"

        # 1. Increment material stock in PostgreSQL
        mat = db.query(Material).filter(Material.id == it.material_id).first()
        if mat:
            mat.current_stock = round(mat.current_stock + it.quantity, 2)

        # 2. Create new batch record
        batch = InventoryBatch(
            id=f"bat-{uuid.uuid4().hex[:8]}",
            lot_code=lot_code,
            material_id=it.material_id,
            material_name=it.material_name,
            initial_qty=it.quantity,
            current_qty=it.quantity,
            unit=it.unit,
            mfg_date=now_str,
            exp_date=exp_date,
            status="USABLE"
        )
        db.add(batch)

    # 3. Update PR warehouse status
    pr.warehouse_status = "RECEIVED"

    # 4. Audit Log
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{user_info['name']} (Thủ kho)",
        action="NHẬP_KHO_THỰC_TẾ",
        target=f"PO #{pr.po_number}",
        details=f"Tiếp nhận {len(pr.items)} mặt hàng theo PO #{pr.po_number}. Tồn kho đã tăng tương ứng."
    )
    db.add(log)

    db.commit()
    return {"status": "success", "message": f"Nhập kho thành công cho PO #{pr.po_number}!"}

@router.post("/adjust")
def adjust_stock(
    req: StockAdjustRequest,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    if user_info["role"] != "STOREKEEPER":
        raise HTTPException(
            status_code=403,
            detail="Nghiệp vụ điều chỉnh tồn kho kiểm kê chỉ thuộc thẩm quyền của Thủ kho (STOREKEEPER). Quản trị viên chỉ có quyền giám sát."
        )

    mat = db.query(Material).filter(Material.id == req.material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="Không tìm thấy nguyên vật liệu")

    old_stock = mat.current_stock
    diff = round(req.actual_count - old_stock, 2)
    mat.current_stock = req.actual_count

    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{user_info['name']} (Thủ kho)",
        action="ĐIỀU_CHỈNH_KIỂM_KÊ",
        target=f"Nguyên liệu: {mat.name}",
        details=f"Tồn cũ: {old_stock}, Thực tế: {req.actual_count} ({'+' if diff > 0 else ''}{diff} {mat.unit}). Lý do: {req.reason}"
    )
    db.add(log)
    db.commit()

    return {"message": f"Đã cập nhật tồn kho {mat.name} về {req.actual_count} {mat.unit}."}
