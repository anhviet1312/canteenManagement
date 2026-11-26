from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import CtoolMeal, AuditLog
import uuid
from datetime import datetime
from urllib.parse import unquote
import unicodedata

router = APIRouter(prefix="/api/ctool", tags=["ctool"])

def normalize_vn_str(s: str) -> str:
    if not s:
        return ""
    nfkd = unicodedata.normalize('NFKD', s)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).replace('đ', 'd').replace('Đ', 'D').lower()

def get_current_user_from_header(x_user_role: str = Header(None), x_user_name: str = Header(None)):
    name = unquote(x_user_name) if x_user_name else "Nguyễn Văn Đạt"
    return {
        "role": x_user_role or "CHEF",
        "name": name
    }

@router.get("/meals")
def get_ctool_meals(db: Session = Depends(get_db)):
    meals = db.query(CtoolMeal).all()
    return [
        {
            "id": m.id,
            "staff_code": m.staff_code,
            "staff_name": m.staff_name,
            "department": m.department,
            "meal_type": m.meal_type,
            "meal_type_name": m.meal_type_name,
            "check_in_time": m.check_in_time,
            "biometric_verified": m.biometric_verified,
            "is_served": m.is_served,
            "serve_time": m.serve_time
        }
        for m in meals
    ]

@router.get("/search")
def search_ctool_staff(query: str = "", db: Session = Depends(get_db)):
    meals = db.query(CtoolMeal).all()
    if query:
        q_norm = normalize_vn_str(query.strip())
        results = [
            m for m in meals
            if q_norm in normalize_vn_str(m.staff_name)
            or q_norm in normalize_vn_str(m.staff_code)
            or q_norm in normalize_vn_str(m.department)
        ]
    else:
        results = meals

    results.sort(key=lambda m: (m.is_served, m.staff_name))
    return [
        {
            "id": m.id,
            "staff_code": m.staff_code,
            "staff_name": m.staff_name,
            "department": m.department,
            "meal_type": m.meal_type,
            "meal_type_name": m.meal_type_name,
            "check_in_time": m.check_in_time,
            "biometric_verified": m.biometric_verified,
            "is_served": m.is_served,
            "serve_time": m.serve_time
        }
        for m in results[:15]
    ]

@router.post("/serve/{meal_id}")
def toggle_meal_serve(
    meal_id: str,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    meal = db.query(CtoolMeal).filter(CtoolMeal.id == meal_id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Không tìm thấy bản ghi suất ăn")

    meal.is_served = not meal.is_served
    if meal.is_served:
        meal.serve_time = datetime.now().strftime("%H:%M")
        log = AuditLog(
            id=f"log-{uuid.uuid4().hex[:8]}",
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            user_info=f"{user_info['name']} ({user_info['role']})",
            action="PHỤC_VỤ_SUẤT_ĂN_CTOOL",
            target=f"CBNV {meal.staff_name}",
            details=f"Mã: {meal.staff_code}, Phòng: {meal.department}"
        )
        db.add(log)
    else:
        meal.serve_time = None

    db.commit()
    return {"is_served": meal.is_served, "serve_time": meal.serve_time}

@router.post("/sync")
def sync_ctool_data(
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    # Mock real-time sync by adding newly checked-in staff if needed
    new_staff_id = f"ct-{uuid.uuid4().hex[:6]}"
    new_meal = CtoolMeal(
        id=new_staff_id,
        staff_code=f"CTECH-{datetime.now().strftime('%M%S')}",
        staff_name="Nguyễn Tiến Dũng (Bổ sung)",
        department="Khoa Du lịch & Khách sạn",
        meal_type="STANDARD",
        meal_type_name="Suất ăn Tiêu chuẩn",
        check_in_time=datetime.now().strftime("%H:%M"),
        biometric_verified=True,
        is_served=False,
        serve_time=None
    )
    db.add(new_meal)

    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info="Ctool ERP & Biometric Adapter",
        action="ĐỒNG_BỘ_CTOOL_REALTIME",
        target="Hệ sinh thái CTECH",
        details="Đồng bộ bổ sung 1 suất ăn CBNV vừa check-in máy vân tay"
    )
    db.add(log)
    db.commit()

    return {"status": "success", "message": "Đã đồng bộ thành công dữ liệu Ctool và máy chấm công!"}
