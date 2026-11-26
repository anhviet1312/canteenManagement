from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(30), nullable=False) # ADMIN, CHEF, TCHC, ACCOUNTANT, CHAIRMAN, STOREKEEPER, CASHIER
    department = Column(String(100))
    is_active = Column(Boolean, default=True)

class Category(Base):
    __tablename__ = "categories"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    type = Column(String(20), nullable=False) # PRODUCT | MATERIAL
    icon = Column(String(50), default="Utensils")

class Material(Base):
    __tablename__ = "materials"

    id = Column(String(50), primary_key=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    unit = Column(String(30), nullable=False)
    current_stock = Column(Float, default=0.0)
    safety_stock = Column(Float, default=10.0)
    min_order_qty = Column(Float, default=5.0)
    avg_cost = Column(Float, default=0.0)
    supplier_id = Column(String(50), nullable=True)
    category = Column(String(100), default="Thực phẩm tươi")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(50), primary_key=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    category_id = Column(String(50), ForeignKey("categories.id"))
    price = Column(Float, nullable=False)
    cost_price = Column(Float, default=0.0)
    is_meal_eligible = Column(Boolean, default=False)
    image = Column(String(10), default="🍖")

    recipes = relationship("Recipe", back_populates="product", cascade="all, delete-orphan")

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(String(50), primary_key=True)
    product_id = Column(String(50), ForeignKey("products.id"))
    material_id = Column(String(50), ForeignKey("materials.id"))
    quantity = Column(Float, nullable=False)

    product = relationship("Product", back_populates="recipes")

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(String(50), primary_key=True)
    name = Column(String(200), nullable=False)
    contact = Column(String(100))
    address = Column(String(255))

class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"

    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    created_by = Column(String(100), nullable=False)
    created_at = Column(String(50), nullable=False)
    supplier_id = Column(String(50), ForeignKey("suppliers.id"))
    supplier_name = Column(String(200))
    total_amount = Column(Float, nullable=False)
    status = Column(String(30), nullable=False) # PENDING_TCHC, PENDING_ACCOUNTANT, PENDING_CHAIRMAN, APPROVED, REJECTED
    current_level = Column(Integer, default=2)
    po_number = Column(String(50), nullable=True)
    warehouse_status = Column(String(30), default="NONE") # NONE, PENDING_RECEIPT, RECEIVED
    note = Column(Text, nullable=True)

    items = relationship("PurchaseItem", back_populates="request", cascade="all, delete-orphan")
    timeline = relationship("PurchaseTimeline", back_populates="request", cascade="all, delete-orphan")

class PurchaseItem(Base):
    __tablename__ = "purchase_items"

    id = Column(String(50), primary_key=True)
    request_id = Column(String(50), ForeignKey("purchase_requests.id"))
    material_id = Column(String(50), ForeignKey("materials.id"))
    material_name = Column(String(150), nullable=False)
    unit = Column(String(30), nullable=False)
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    amount = Column(Float, nullable=False)

    request = relationship("PurchaseRequest", back_populates="items")

class PurchaseTimeline(Base):
    __tablename__ = "purchase_timeline"

    id = Column(Integer, primary_key=True, autoincrement=True)
    request_id = Column(String(50), ForeignKey("purchase_requests.id"))
    step = Column(Integer, nullable=False)
    role = Column(String(30), nullable=False)
    name = Column(String(100), nullable=False)
    action = Column(String(50), nullable=False) # CREATED, APPROVED, REJECTED
    time = Column(String(50), nullable=False)
    note = Column(Text, nullable=True)

    request = relationship("PurchaseRequest", back_populates="timeline")

class InventoryBatch(Base):
    __tablename__ = "inventory_batches"

    id = Column(String(50), primary_key=True)
    lot_code = Column(String(50), nullable=False)
    material_id = Column(String(50), ForeignKey("materials.id"))
    material_name = Column(String(150), nullable=False)
    initial_qty = Column(Float, nullable=False)
    current_qty = Column(Float, nullable=False)
    unit = Column(String(30), nullable=False)
    mfg_date = Column(String(20), nullable=False)
    exp_date = Column(String(20), nullable=False)
    status = Column(String(30), default="USABLE") # USABLE, NEAR_EXPIRY, EXPIRED

class CtoolMeal(Base):
    __tablename__ = "ctool_meals"

    id = Column(String(50), primary_key=True)
    staff_code = Column(String(50), nullable=False)
    staff_name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    meal_type = Column(String(30), nullable=False) # STANDARD, VEGETARIAN
    meal_type_name = Column(String(100), nullable=False)
    check_in_time = Column(String(20))
    biometric_verified = Column(Boolean, default=False)
    is_served = Column(Boolean, default=False)
    serve_time = Column(String(20), nullable=True)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String(50), primary_key=True)
    order_time = Column(String(50), nullable=False)
    customer_type = Column(String(30), nullable=False) # STUDENT, STAFF_CTOOL
    customer_name = Column(String(100), nullable=False)
    subtotal = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    payment_method = Column(String(30), nullable=False) # CASH, VIETQR, CTOOL_VOUCHER
    cashier_name = Column(String(100), nullable=False)

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(50), primary_key=True)
    order_id = Column(String(50), ForeignKey("orders.id"))
    product_id = Column(String(50))
    product_name = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True)
    timestamp = Column(String(50), nullable=False)
    user_info = Column(String(150), nullable=False)
    action = Column(String(50), nullable=False)
    target = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
