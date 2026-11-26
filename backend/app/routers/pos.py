from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Order, OrderItem, Product, Recipe, Material, AuditLog, CtoolMeal
from ..schemas import OrderCreate
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/pos", tags=["pos"])

@router.get("/orders")
def get_orders(cashier: str = None, db: Session = Depends(get_db)):
    query = db.query(Order).order_by(Order.order_time.desc())
    if cashier:
        query = query.filter(Order.cashier_name == cashier)
    orders = query.all()
    results = []
    for o in orders:
        results.append({
            "id": o.id,
            "time": o.order_time,
            "customer_type": o.customer_type,
            "customer_name": o.customer_name,
            "subtotal": o.subtotal,
            "discount": o.discount,
            "total_amount": o.total_amount,
            "payment_method": o.payment_method,
            "cashier_name": o.cashier_name,
            "items": [
                {
                    "product_id": it.product_id,
                    "product_name": it.product_name,
                    "quantity": it.quantity,
                    "price": it.price,
                    "subtotal": it.subtotal
                }
                for it in o.items
            ]
        })
    return results

@router.post("/checkout")
def checkout_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    order_id = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Create Order
    new_order = Order(
        id=order_id,
        order_time=now_str,
        customer_type=order_data.customer_type,
        customer_name=order_data.customer_name,
        subtotal=order_data.subtotal,
        discount=order_data.discount,
        total_amount=order_data.total_amount,
        payment_method=order_data.payment_method,
        cashier_name=order_data.cashier_name or "Đặng Thùy Linh"
    )
    db.add(new_order)

    # 2. Update Ctool Meal if Staff Meal
    if order_data.customer_type == "STAFF_CTOOL" and order_data.ctool_meal_id:
        cmeal = db.query(CtoolMeal).filter(CtoolMeal.id == order_data.ctool_meal_id).first()
        if cmeal:
            cmeal.is_served = True
            cmeal.serve_time = datetime.now().strftime("%H:%M")

    # 3. Add Order Items & Calculate BOM Deductions
    material_deductions = {} # material_id -> qty
    for item in order_data.items:
        oi = OrderItem(
            id=f"oi-{uuid.uuid4().hex[:8]}",
            order_id=order_id,
            product_id=item.id,
            product_name=item.name,
            quantity=item.quantity,
            price=item.price,
            subtotal=item.price * item.quantity
        )
        db.add(oi)

        # Lookup BOM
        product = db.query(Product).filter(Product.id == item.id).first()
        if product and product.recipes:
            for r in product.recipes:
                deduction_qty = r.quantity * item.quantity
                material_deductions[r.material_id] = material_deductions.get(r.material_id, 0.0) + deduction_qty

    # 3. Deduct raw materials from PostgreSQL materials table
    deduction_details = []
    for mat_id, qty in material_deductions.items():
        mat = db.query(Material).filter(Material.id == mat_id).first()
        if mat:
            mat.current_stock = max(0.0, round(mat.current_stock - qty, 2))
            deduction_details.append(f"{mat.name}: -{qty:.2f}{mat.unit}")

    # 4. Audit Log
    summary_str = ", ".join(deduction_details) if deduction_details else "Không bóc tách BOM"
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=now_str,
        user_info=f"{order_data.cashier_name} (Thu ngân)",
        action="TẠO_ĐƠN_BÁN_HÀNG",
        target=f"Đơn #{order_id}",
        details=f"Tổng tiền: {order_data.total_amount:,.0f}đ ({order_data.payment_method}). Khấu trừ BOM: {summary_str}"
    )
    db.add(log)

    db.commit()

    return {
        "status": "success",
        "order_id": order_id,
        "message": f"Thanh toán thành công đơn #{order_id}!",
        "deductions": deduction_details,
        "order": {
            "id": order_id,
            "time": now_str,
            "total_amount": order_data.total_amount,
            "customer_name": order_data.customer_name,
            "payment_method": order_data.payment_method,
            "items": [{"name": i.name, "quantity": i.quantity, "price": i.price} for i in order_data.items]
        }
    }
