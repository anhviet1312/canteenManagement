from .database import engine, Base, SessionLocal
from .models import (
    User, Category, Material, Product, Recipe, Supplier,
    PurchaseRequest, PurchaseItem, PurchaseTimeline,
    InventoryBatch, CtoolMeal, Order, OrderItem, AuditLog
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).count() > 0:
        db.close()
        print("Database already seeded.")
        return

    print("Seeding PostgreSQL database with CTECH Canteen data...")

    # 1. Users
    users = [
        User(id="u1", username="admin", password_hash="admin123", full_name="Ban Quản trị HTTT", role="ADMIN", department="Trung tâm CNTT"),
        User(id="u2", username="chefnvd", password_hash="chef123", full_name="Nguyễn Văn Đạt", role="CHEF", department="Tổ Bếp Căn tin"),
        User(id="u3", username="mai.tchc", password_hash="tchc123", full_name="Trần Thị Mai", role="TCHC", department="Phòng Tổ chức - Hành chính"),
        User(id="u4", username="long.kt", password_hash="kt123", full_name="Lê Hoàng Long", role="ACCOUNTANT", department="Phòng Kế toán - Tài chính"),
        User(id="u5", username="tuan.chutich", password_hash="ct123", full_name="TS. Phạm Minh Tuấn", role="CHAIRMAN", department="Hội đồng trường CTECH"),
        User(id="u6", username="thang.kho", password_hash="kho123", full_name="Bùi Đức Thắng", role="STOREKEEPER", department="Bộ phận Kho thực phẩm"),
        User(id="u7", username="linh.pos", password_hash="pos123", full_name="Đặng Thùy Linh", role="CASHIER", department="Tổ Thu ngân Căn tin")
    ]
    db.add_all(users)

    # 2. Categories
    categories = [
        Category(id="cat-meal", name="Cơm & Suất ăn", type="PRODUCT", icon="Utensils"),
        Category(id="cat-noodle", name="Bún / Phở / Mì", type="PRODUCT", icon="Soup"),
        Category(id="cat-drink", name="Đồ uống & Trà", type="PRODUCT", icon="Coffee"),
        Category(id="cat-snack", name="Ăn nhẹ & Bánh mì", type="PRODUCT", icon="Sandwich"),
    ]
    db.add_all(categories)

    # 3. Suppliers
    suppliers = [
        Supplier(id="sup-1", name="Công ty CP Chăn nuôi C.P. Việt Nam", contact="0912.345.678 (Mr. Tuấn)", address="KCN Biên Hòa 2, Đồng Nai"),
        Supplier(id="sup-2", name="Đại siêu thị Metro Thăng Long (MM Mega Market)", contact="0988.765.432 (Ms. Lan)", address="Phạm Văn Đồng, Hà Nội"),
        Supplier(id="sup-3", name="Hợp tác xã Rau sạch Công nghệ cao Ba Vì", contact="0904.556.778 (Mr. Hưng)", address="Huyện Ba Vì, Hà Nội"),
        Supplier(id="sup-4", name="Công ty Thực phẩm Thực Dưỡng CTECH Food", contact="024.3322.1100", address="Khu công nghệ cao Hòa Lạc")
    ]
    db.add_all(suppliers)
    db.commit()

    # 4. Materials
    materials = [
        Material(id="mat-1", code="NVL-THITHEO", name="Thịt sườn heo tươi", unit="kg", current_stock=14.5, safety_stock=25.0, min_order_qty=20, avg_cost=120000, supplier_id="sup-1", category="Thực phẩm tươi"),
        Material(id="mat-2", code="NVL-THITBO", name="Thịt bò bắp phi lê", unit="kg", current_stock=8.0, safety_stock=15.0, min_order_qty=10, avg_cost=240000, supplier_id="sup-1", category="Thực phẩm tươi"),
        Material(id="mat-3", code="NVL-THITGA", name="Thịt gà đùi góc tư", unit="kg", current_stock=22.0, safety_stock=20.0, min_order_qty=15, avg_cost=75000, supplier_id="sup-1", category="Thực phẩm tươi"),
        Material(id="mat-4", code="NVL-GAO", name="Gạo thơm ST25 CTECH", unit="kg", current_stock=85.0, safety_stock=100.0, min_order_qty=50, avg_cost=26000, supplier_id="sup-2", category="Lương thực khô"),
        Material(id="mat-5", code="NVL-TRUNG", name="Trứng gà Ba Huân", unit="quả", current_stock=180, safety_stock=200, min_order_qty=100, avg_cost=3200, supplier_id="sup-3", category="Thực phẩm tươi"),
        Material(id="mat-6", code="NVL-RAUCAI", name="Rau cải ngọt Ba Vì", unit="kg", current_stock=6.5, safety_stock=18.0, min_order_qty=15, avg_cost=18000, supplier_id="sup-3", category="Rau củ quả"),
        Material(id="mat-7", code="NVL-TOM", name="Tôm thẻ chân trắng tươi", unit="kg", current_stock=4.2, safety_stock=12.0, min_order_qty=10, avg_cost=195000, supplier_id="sup-1", category="Thực phẩm tươi"),
        Material(id="mat-8", code="NVL-DAUAN", name="Dầu thực vật Neptune (Can 5L)", unit="can", current_stock=6, safety_stock=10, min_order_qty=5, avg_cost=245000, supplier_id="sup-2", category="Gia vị khô"),
        Material(id="mat-9", code="NVL-BUN", name="Bún tươi sợi nhỡ", unit="kg", current_stock=12.0, safety_stock=20.0, min_order_qty=15, avg_cost=14000, supplier_id="sup-3", category="Lương thực tươi"),
        Material(id="mat-10", code="NVL-CFE", name="Hạt cà phê Robusta rang xay", unit="kg", current_stock=7.5, safety_stock=10.0, min_order_qty=5, avg_cost=180000, supplier_id="sup-2", category="Đồ uống nguyên liệu"),
    ]
    db.add_all(materials)
    db.commit()

    # 5. Products
    products = [
        Product(id="prod-1", code="COM-SUON", name="Cơm sườn nướng mật ong", category_id="cat-meal", price=35000, cost_price=21500, is_meal_eligible=True, image="🍖"),
        Product(id="prod-2", code="COM-GA", name="Cơm gà xối mỡ giòn da", category_id="cat-meal", price=35000, cost_price=20000, is_meal_eligible=True, image="🍗"),
        Product(id="prod-3", code="BUN-BO", name="Bún bò Huế đặc biệt", category_id="cat-noodle", price=40000, cost_price=24000, is_meal_eligible=True, image="🍜"),
        Product(id="prod-4", code="COM-CHIEN-DC", name="Cơm chiên Dương Châu tôm thịt", category_id="cat-meal", price=35000, cost_price=19500, is_meal_eligible=True, image="🍚"),
        Product(id="prod-5", code="BM-OP-LA", name="Bánh mì 2 trứng ốp la + pate", category_id="cat-snack", price=20000, cost_price=10500, is_meal_eligible=False, image="🥪"),
        Product(id="prod-6", code="CFE-DEN", name="Cà phê đen đá CTECH", category_id="cat-drink", price=15000, cost_price=4500, is_meal_eligible=False, image="☕"),
        Product(id="prod-7", code="CFE-SUA", name="Cà phê sữa đá pha phin", category_id="cat-drink", price=18000, cost_price=6500, is_meal_eligible=False, image="🧋"),
        Product(id="prod-8", code="TRA-DAO", name="Trà đào cam sả thanh nhiệt", category_id="cat-drink", price=22000, cost_price=7000, is_meal_eligible=False, image="🍹")
    ]
    db.add_all(products)
    db.commit()

    # 6. Recipes (BOM)
    recipes = [
        # Com suon
        Recipe(id="rec-1", product_id="prod-1", material_id="mat-1", quantity=0.15),
        Recipe(id="rec-2", product_id="prod-1", material_id="mat-4", quantity=0.12),
        Recipe(id="rec-3", product_id="prod-1", material_id="mat-6", quantity=0.08),
        Recipe(id="rec-4", product_id="prod-1", material_id="mat-8", quantity=0.005),
        # Com ga
        Recipe(id="rec-5", product_id="prod-2", material_id="mat-3", quantity=0.22),
        Recipe(id="rec-6", product_id="prod-2", material_id="mat-4", quantity=0.12),
        Recipe(id="rec-7", product_id="prod-2", material_id="mat-6", quantity=0.06),
        # Bun bo
        Recipe(id="rec-8", product_id="prod-3", material_id="mat-2", quantity=0.09),
        Recipe(id="rec-9", product_id="prod-3", material_id="mat-9", quantity=0.18),
        Recipe(id="rec-10", product_id="prod-3", material_id="mat-6", quantity=0.05),
        # Com chien
        Recipe(id="rec-11", product_id="prod-4", material_id="mat-4", quantity=0.13),
        Recipe(id="rec-12", product_id="prod-4", material_id="mat-7", quantity=0.05),
        Recipe(id="rec-13", product_id="prod-4", material_id="mat-5", quantity=1.0),
        # Banh mi
        Recipe(id="rec-14", product_id="prod-5", material_id="mat-5", quantity=2.0),
        # Cafe den
        Recipe(id="rec-15", product_id="prod-6", material_id="mat-10", quantity=0.025),
        # Cafe sua
        Recipe(id="rec-16", product_id="prod-7", material_id="mat-10", quantity=0.025),
    ]
    db.add_all(recipes)
    db.commit()

    # 7. Purchase Requests & Timeline (4-Stage Workflow)
    pr1 = PurchaseRequest(
        id="PR-202611-001",
        title="Đề xuất nhập sườn heo và gạo ST25 phục vụ tuần 48",
        created_by="Nguyễn Văn Đạt (Bếp trưởng)",
        created_at="2026-11-25 14:30",
        supplier_id="sup-1",
        supplier_name="Công ty CP Chăn nuôi C.P. Việt Nam",
        total_amount=6850000,
        status="APPROVED",
        current_level=4,
        po_number="PO-202611-001",
        warehouse_status="PENDING_RECEIPT",
        note="Đã được Chủ tịch HĐT duyệt chi"
    )
    db.add(pr1)

    pr2 = PurchaseRequest(
        id="PR-202611-002",
        title="Đề xuất bổ sung thịt bò phi lê và tôm tươi đột xuất",
        created_by="Nguyễn Văn Đạt (Bếp trưởng)",
        created_at="2026-11-26 07:15",
        supplier_id="sup-1",
        supplier_name="Công ty CP Chăn nuôi C.P. Việt Nam",
        total_amount=4350000,
        status="PENDING_ACCOUNTANT",
        current_level=3,
        po_number=None,
        warehouse_status="NONE",
        note="Phục vụ hội nghị giảng viên chiều nay"
    )
    db.add(pr2)

    pr3 = PurchaseRequest(
        id="PR-202611-003",
        title="Nhập rau củ quả tươi và trứng gà sạch Ba Vì",
        created_by="Nguyễn Văn Đạt (Bếp trưởng)",
        created_at="2026-11-26 08:00",
        supplier_id="sup-3",
        supplier_name="Hợp tác xã Rau sạch Công nghệ cao Ba Vì",
        total_amount=1180000,
        status="PENDING_TCHC",
        current_level=2,
        po_number=None,
        warehouse_status="NONE",
        note="Nhập theo khuyến nghị DSS"
    )
    db.add(pr3)
    db.commit()

    pr_items = [
        PurchaseItem(id="pi-1", request_id="PR-202611-001", material_id="mat-1", material_name="Thịt sườn heo tươi", unit="kg", quantity=45, unit_price=120000, amount=5400000),
        PurchaseItem(id="pi-2", request_id="PR-202611-001", material_id="mat-4", material_name="Gạo thơm ST25 CTECH", unit="kg", quantity=50, unit_price=29000, amount=1450000),
        PurchaseItem(id="pi-3", request_id="PR-202611-002", material_id="mat-2", material_name="Thịt bò bắp phi lê", unit="kg", quantity=15, unit_price=240000, amount=3600000),
        PurchaseItem(id="pi-4", request_id="PR-202611-002", material_id="mat-7", material_name="Tôm thẻ chân trắng tươi", unit="kg", quantity=5, unit_price=150000, amount=750000),
        PurchaseItem(id="pi-5", request_id="PR-202611-003", material_id="mat-6", material_name="Rau cải ngọt Ba Vì", unit="kg", quantity=30, unit_price=18000, amount=540000),
        PurchaseItem(id="pi-6", request_id="PR-202611-003", material_id="mat-5", material_name="Trứng gà Ba Huân", unit="quả", quantity=200, unit_price=3200, amount=640000)
    ]
    db.add_all(pr_items)

    pr_tls = [
        PurchaseTimeline(request_id="PR-202611-001", step=1, role="CHEF", name="Nguyễn Văn Đạt (Bếp trưởng)", action="CREATED", time="2026-11-25 14:30", note="Lập đề xuất dựa trên cảnh báo thiếu hụt kho"),
        PurchaseTimeline(request_id="PR-202611-001", step=2, role="TCHC", name="Trần Thị Mai (TP. TCHC)", action="APPROVED", time="2026-11-25 15:15", note="Xác nhận số lượng CBNV và HSSV tuần tới tăng"),
        PurchaseTimeline(request_id="PR-202611-001", step=3, role="ACCOUNTANT", name="Lê Hoàng Long (Kế toán trưởng)", action="APPROVED", time="2026-11-25 16:00", note="Đơn giá khớp hợp đồng khung năm 2026"),
        PurchaseTimeline(request_id="PR-202611-001", step=4, role="CHAIRMAN", name="TS. Phạm Minh Tuấn (Chủ tịch HĐT)", action="APPROVED", time="2026-11-25 16:45", note="Phê duyệt chi ngân sách"),
        PurchaseTimeline(request_id="PR-202611-002", step=1, role="CHEF", name="Nguyễn Văn Đạt (Bếp trưởng)", action="CREATED", time="2026-11-26 07:15", note="Tiêu thụ bún bò và cơm chiên tăng 35%"),
        PurchaseTimeline(request_id="PR-202611-002", step=2, role="TCHC", name="Trần Thị Mai (TP. TCHC)", action="APPROVED", time="2026-11-26 07:45", note="Đồng ý nhu cầu chuẩn bị cho hội thảo chiều nay"),
        PurchaseTimeline(request_id="PR-202611-003", step=1, role="CHEF", name="Nguyễn Văn Đạt (Bếp trưởng)", action="CREATED", time="2026-11-26 08:00", note="Nhập theo kế hoạch DSS sáng 26/11")
    ]
    db.add_all(pr_tls)
    db.commit()

    # 8. Batches (FEFO)
    batches = [
        InventoryBatch(id="bat-1", lot_code="LOT-20261124-HEO", material_id="mat-1", material_name="Thịt sườn heo tươi", initial_qty=30, current_qty=14.5, unit="kg", mfg_date="2026-11-24", exp_date="2026-11-28", status="USABLE"),
        InventoryBatch(id="bat-2", lot_code="LOT-20261122-BO", material_id="mat-2", material_name="Thịt bò bắp phi lê", initial_qty=20, current_qty=8.0, unit="kg", mfg_date="2026-11-22", exp_date="2026-11-27", status="NEAR_EXPIRY"),
        InventoryBatch(id="bat-3", lot_code="LOT-20261115-GAO", material_id="mat-4", material_name="Gạo thơm ST25 CTECH", initial_qty=150, current_qty=85.0, unit="kg", mfg_date="2026-11-15", exp_date="2027-05-15", status="USABLE"),
        InventoryBatch(id="bat-4", lot_code="LOT-20261125-RAU", material_id="mat-6", material_name="Rau cải ngọt Ba Vì", initial_qty=25, current_qty=6.5, unit="kg", mfg_date="2026-11-25", exp_date="2026-11-28", status="USABLE"),
        InventoryBatch(id="bat-5", lot_code="LOT-20261120-TRUNG", material_id="mat-5", material_name="Trứng gà Ba Huân", initial_qty=300, current_qty=180, unit="quả", mfg_date="2026-11-20", exp_date="2026-12-05", status="USABLE")
    ]
    db.add_all(batches)
    db.commit()

    # 9. Ctool Meals
    ctool_data = [
        CtoolMeal(id="ct-1", staff_code="CTECH-0102", staff_name="TS. Phạm Minh Tuấn", department="Ban Giám Hiệu", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="07:35", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-2", staff_code="CTECH-0215", staff_name="ThS. Trần Thị Mai", department="Phòng TCHC", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="07:45", biometric_verified=True, is_served=True, serve_time="11:40"),
        CtoolMeal(id="ct-3", staff_code="CTECH-0304", staff_name="Lê Hoàng Long", department="Phòng Kế toán", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="07:50", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-4", staff_code="CTECH-0412", staff_name="Nguyễn Văn Đạt", department="Tổ Bếp Căn tin", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="06:30", biometric_verified=True, is_served=True, serve_time="11:15"),
        CtoolMeal(id="ct-5", staff_code="CTECH-0520", staff_name="ThS. Đỗ Thu Hằng", department="Khoa CNTT & Trí tuệ nhân tạo", meal_type="VEGETARIAN", meal_type_name="Suất ăn Chay", check_in_time="08:10", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-6", staff_code="CTECH-0521", staff_name="TS. Hoàng Quốc Việt", department="Khoa CNTT & Trí tuệ nhân tạo", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="08:05", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-7", staff_code="CTECH-0610", staff_name="ThS. Vũ Đức Nam", department="Khoa Kinh tế & Quản trị", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="08:20", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-8", staff_code="CTECH-0612", staff_name="Nguyễn Quỳnh Chi", department="Phòng Tuyển sinh & Truyền thông", meal_type="VEGETARIAN", meal_type_name="Suất ăn Chay", check_in_time="08:15", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-9", staff_code="CTECH-0701", staff_name="Trịnh Đình Quang", department="Phòng Đào tạo", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="07:55", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-10", staff_code="CTECH-0803", staff_name="Bùi Đức Thắng", department="Tổ Quản lý Thiết bị & Kho", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="07:10", biometric_verified=True, is_served=True, serve_time="11:30"),
        CtoolMeal(id="ct-11", staff_code="CTECH-0911", staff_name="Nguyễn Lan Hương", department="Khoa Ngôn ngữ Quốc tế", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="08:25", biometric_verified=True, is_served=False, serve_time=None),
        CtoolMeal(id="ct-12", staff_code="CTECH-0914", staff_name="Phạm Thanh Tùng", department="Khoa Cơ điện tử", meal_type="STANDARD", meal_type_name="Suất ăn Tiêu chuẩn", check_in_time="Chưa chấm công", biometric_verified=False, is_served=False, serve_time=None)
    ]
    db.add_all(ctool_data)
    db.commit()

    # 10. Initial Orders
    ord1 = Order(id="ORD-20261126-001", order_time="2026-11-26 11:32", customer_type="STUDENT", customer_name="Sinh viên K18 CNTT", subtotal=114000, discount=0, total_amount=114000, payment_method="VIETQR", cashier_name="Đặng Thùy Linh")
    ord2 = Order(id="ORD-20261126-002", order_time="2026-11-26 11:40", customer_type="STAFF_CTOOL", customer_name="ThS. Trần Thị Mai (P. TCHC)", subtotal=35000, discount=35000, total_amount=0, payment_method="CTOOL_VOUCHER", cashier_name="Đặng Thùy Linh")
    ord3 = Order(id="ORD-20261126-003", order_time="2026-11-26 11:45", customer_type="STUDENT", customer_name="Sinh viên K19 Quản trị", subtotal=55000, discount=0, total_amount=55000, payment_method="CASH", cashier_name="Đặng Thùy Linh")
    db.add_all([ord1, ord2, ord3])
    db.commit()

    # 11. Audit Logs
    logs = [
        AuditLog(id="log-1", timestamp="2026-11-26 07:15:20", user_info="Nguyễn Văn Đạt (Bếp trưởng)", action="TẠO_ĐỀ_XUẤT_MUA", target="Phiếu PR-202611-002", details="Đề xuất mua thịt bò 15kg, tôm 5kg tổng 4.350.000đ"),
        AuditLog(id="log-2", timestamp="2026-11-26 07:45:10", user_info="Trần Thị Mai (TP. TCHC)", action="PHÊ_DUYỆT_CẤP_2", target="Phiếu PR-202611-002", details="Đã duyệt nhu cầu, chuyển tiếp sang Kế toán"),
        AuditLog(id="log-3", timestamp="2026-11-26 08:00:00", user_info="Hệ thống Ctool Adapter", action="ĐỒNG_BỘ_DỮ_LIỆU", target="Dữ liệu Ctool & Chấm công", details="Đồng bộ 85 suất ăn CBNV đăng ký sáng nay"),
        AuditLog(id="log-4", timestamp="2026-11-26 11:32:45", user_info="Đặng Thùy Linh (Thu ngân)", action="TẠO_HÓA_ĐƠN", target="Đơn hàng ORD-20261126-001", details="Thanh toán thành công 114.000đ qua VietQR"),
        AuditLog(id="log-5", timestamp="2026-11-26 11:32:46", user_info="Hệ thống BOM Engine", action="TRỪ_TỒN_KHO_TỰ_ĐỘNG", target="Kho Thực Phẩm", details="Trừ 0.3kg sườn heo, 0.24kg gạo ST25, 0.16kg rau cải")
    ]
    db.add_all(logs)
    db.commit()

    db.close()
    print("PostgreSQL database successfully initialized and seeded!")

if __name__ == "__main__":
    seed_database()
