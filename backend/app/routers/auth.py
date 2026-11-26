from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, AuditLog
from ..schemas import SwitchRoleRequest, LoginRequest
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["auth"])

CURRENT_ACTIVE_USER_ID = "u2" # Default: Nguyễn Văn Đạt (Bếp trưởng)

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "role": u.role,
            "department": u.department,
            "is_active": u.is_active
        }
        for u in users
    ]

@router.get("/current")
def get_current_user(user_id: str = None, db: Session = Depends(get_db)):
    global CURRENT_ACTIVE_USER_ID
    target_id = user_id or CURRENT_ACTIVE_USER_ID
    user = db.query(User).filter(User.id == target_id).first()
    if not user:
        user = db.query(User).first()
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role,
        "department": user.department,
        "is_active": user.is_active
    }

@router.post("/switch")
def switch_user(req: SwitchRoleRequest, db: Session = Depends(get_db)):
    global CURRENT_ACTIVE_USER_ID
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

    CURRENT_ACTIVE_USER_ID = user.id

    # Log audit
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{user.full_name} ({user.role})",
        action="CHUYỂN_VAI_TRÒ",
        target="Hệ thống",
        details=f"Chuyển vai trò sang {user.full_name} - {user.role}"
    )
    db.add(log)
    db.commit()

    return {
        "message": f"Đã chuyển sang vai trò: {user.full_name} ({user.role})",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "department": user.department
        }
    }

@router.post("/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or user.password_hash != req.password:
        raise HTTPException(status_code=401, detail="Tên đăng nhập hoặc mật khẩu không chính xác")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Tài khoản này đã bị tạm khóa")

    global CURRENT_ACTIVE_USER_ID
    CURRENT_ACTIVE_USER_ID = user.id

    # Log audit
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{user.full_name} ({user.role})",
        action="ĐĂNG_NHẬP_HỆ_THỐNG",
        target="Xác thực",
        details=f"Người dùng {user.username} ({user.full_name}) đăng nhập thành công vào hệ thống"
    )
    db.add(log)
    db.commit()

    return {
        "status": "success",
        "message": f"Đăng nhập thành công! Xin chào {user.full_name}",
        "user": {
            "id": user.id,
            "username": user.username,
            "full_name": user.full_name,
            "role": user.role,
            "department": user.department,
            "is_active": user.is_active
        }
    }

@router.post("/logout")
def logout_user(db: Session = Depends(get_db)):
    return {"status": "success", "message": "Đã đăng xuất thành công"}

