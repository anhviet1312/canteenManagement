from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import AuditLog

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.get("/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "user_info": l.user_info,
            "action": l.action,
            "target": l.target,
            "details": l.details
        }
        for l in logs
    ]
