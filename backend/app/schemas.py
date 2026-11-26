from pydantic import BaseModel
from typing import List, Optional

class UserOut(BaseModel):
    id: str
    username: str
    full_name: str
    role: str
    department: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True

class SwitchRoleRequest(BaseModel):
    user_id: str

class LoginRequest(BaseModel):
    username: str
    password: str

class CartItem(BaseModel):
    id: str
    name: str
    code: Optional[str] = None
    price: float
    quantity: int

class OrderCreate(BaseModel):
    customer_type: str
    customer_name: str
    items: List[CartItem]
    subtotal: float
    discount: float
    total_amount: float
    payment_method: str
    cashier_name: Optional[str] = "Thu ngân"
    ctool_meal_id: Optional[str] = None

class PurchaseItemCreate(BaseModel):
    material_id: str
    material_name: str
    unit: str
    quantity: float
    unit_price: float
    amount: float

class PurchaseRequestCreate(BaseModel):
    title: str
    supplier_id: str
    supplier_name: str
    total_amount: float
    items: List[PurchaseItemCreate]
    note: Optional[str] = None

class ApprovalAction(BaseModel):
    note: Optional[str] = "Đồng ý phê duyệt"

class RejectAction(BaseModel):
    reason: str

class BatchReceiveItem(BaseModel):
    lot_code: str
    exp_date: str

class GoodsReceiveRequest(BaseModel):
    batches: dict # material_id -> { lot_code, exp_date }

class StockAdjustRequest(BaseModel):
    material_id: str
    actual_count: float
    reason: str

class DSSParamRequest(BaseModel):
    safety_factor: float = 1.0
    student_growth: float = 1.1
