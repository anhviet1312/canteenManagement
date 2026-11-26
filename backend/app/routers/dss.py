from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Material, CtoolMeal, PurchaseRequest, PurchaseItem, PurchaseTimeline, AuditLog, Supplier
from ..schemas import DSSParamRequest
import math
import uuid
from datetime import datetime
from urllib.parse import unquote

router = APIRouter(prefix="/api/dss", tags=["dss"])

def get_current_user_from_header(x_user_role: str = Header(None), x_user_name: str = Header(None)):
    name = unquote(x_user_name) if x_user_name else "Nguyễn Văn Đạt"
    return {
        "role": x_user_role or "CHEF",
        "name": name
    }

@router.post("/calculate")
def calculate_dss(
    params: DSSParamRequest,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    # Only CHEF, ADMIN, or Management can view DSS
    if user_info["role"] not in ["CHEF", "ADMIN", "TCHC", "CHAIRMAN"]:
        raise HTTPException(status_code=403, detail="Vai trò này không có quyền truy cập hệ thống DSS")

    ctool_count = db.query(CtoolMeal).count() or 85
    materials = db.query(Material).all()

    # Incoming POs not received yet
    pending_pos = db.query(PurchaseRequest).filter(
        PurchaseRequest.status == "APPROVED",
        PurchaseRequest.warehouse_status == "PENDING_RECEIPT"
    ).all()

    incoming_map = {}
    for po in pending_pos:
        for it in po.items:
            incoming_map[it.material_id] = incoming_map.get(it.material_id, 0.0) + it.quantity

    results = []
    for mat in materials:
        # 1. Ctool demand
        if mat.id == "mat-1":
            ctool_d = ctool_count * 0.15 * 0.5 # sườn heo
        elif mat.id == "mat-4":
            ctool_d = ctool_count * 0.12 # gạo ST25
        elif mat.id == "mat-6":
            ctool_d = ctool_count * 0.08 # rau
        elif mat.id == "mat-3":
            ctool_d = ctool_count * 0.22 * 0.3 # gà
        elif mat.id == "mat-2":
            ctool_d = ctool_count * 0.09 * 0.2 # bò
        else:
            ctool_d = mat.safety_stock * 0.3

        # 2. Student retail forecast
        base_student = mat.safety_stock * 0.7
        student_d = base_student * params.student_growth

        total_demand = round(ctool_d + student_d, 2)
        adj_safety = round(mat.safety_stock * params.safety_factor, 2)
        incoming = incoming_map.get(mat.id, 0.0)

        # Q formula: max(0, D + SS - I - Q_in)
        raw_q = total_demand + adj_safety - mat.current_stock - incoming
        if raw_q > 0:
            moq = mat.min_order_qty or 5.0
            q_rec = math.ceil(raw_q / moq) * moq
        else:
            q_rec = 0.0

        priority = "SAFE"
        if mat.current_stock + incoming < total_demand:
            priority = "CRITICAL" # Nguy cấp
        elif q_rec > 0:
            priority = "REORDER" # Cần đặt

        results.append({
            "material_id": mat.id,
            "material_name": mat.name,
            "unit": mat.unit,
            "current_stock": mat.current_stock,
            "ctool_demand": round(ctool_d, 2),
            "student_demand": round(student_d, 2),
            "total_demand": total_demand,
            "safety_stock": adj_safety,
            "incoming": incoming,
            "q_recommend": q_rec,
            "priority": priority,
            "avg_cost": mat.avg_cost,
            "cost_estimate": q_rec * mat.avg_cost
        })

    return {
        "ctool_count": ctool_count,
        "safety_factor": params.safety_factor,
        "student_growth": params.student_growth,
        "results": results
    }
