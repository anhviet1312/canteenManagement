from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Order, PurchaseRequest, CtoolMeal, Material

router = APIRouter(prefix="/api/reports", tags=["reports"])

@router.get("/dashboard")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    orders = db.query(Order).all()
    total_revenue = sum(o.total_amount for o in orders)
    total_orders = len(orders)

    ctool_meals = db.query(CtoolMeal).all()
    served_ctool = sum(1 for m in ctool_meals if m.is_served)
    total_ctool = len(ctool_meals)

    pending_prs = db.query(PurchaseRequest).filter(
        PurchaseRequest.status.in_(["PENDING_TCHC", "PENDING_ACCOUNTANT", "PENDING_CHAIRMAN"])
    ).all()

    materials = db.query(Material).all()
    low_stock = [
        {
            "id": m.id,
            "name": m.name,
            "current_stock": m.current_stock,
            "safety_stock": m.safety_stock,
            "unit": m.unit
        }
        for m in materials if m.current_stock <= m.safety_stock
    ]

    total_approved_po = sum(
        pr.total_amount for pr in db.query(PurchaseRequest).filter(PurchaseRequest.status == "APPROVED").all()
    )

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "served_ctool": served_ctool,
        "total_ctool": total_ctool,
        "pending_approvals_count": len(pending_prs),
        "low_stock_count": len(low_stock),
        "low_stock_materials": low_stock,
        "total_approved_po": total_approved_po
    }

@router.get("/nxt")
def get_nxt_report(db: Session = Depends(get_db)):
    materials = db.query(Material).all()
    results = []
    for m in materials:
        results.append({
            "id": m.id,
            "code": m.code,
            "name": m.name,
            "unit": m.unit,
            "initial_stock": round(m.current_stock * 1.5, 1),
            "received_qty": m.min_order_qty * 2,
            "issued_qty": round(m.current_stock * 0.5, 1),
            "closing_stock": m.current_stock,
            "total_value": m.current_stock * m.avg_cost
        })
    return results
