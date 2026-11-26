# BẢNG THEO DÕI TIẾN ĐỘ DỰ ÁN (TASK CHECKLIST)
## HỆ THỐNG THÔNG TIN QUẢN LÝ CĂNG TIN TRƯỜNG CAO ĐẲNG CTECH
**Môn học:** Quản trị Hệ thống Thông tin Nâng cao (Cao học MIS)  
**Kiến trúc:** Phân tách Frontend (React 18 + Vite + Tailwind) & Backend (Python FastAPI + Neon Cloud PostgreSQL)

---

## I. TỔNG QUAN TIẾN ĐỘ THỰC HIỆN

| Nhóm hạng mục | Trọng số | Trạng thái | Ghi chú |
|:---|:---:|:---:|:---|
| **1. Bộ tài liệu Phân tích & Thiết kế (`docs/`)** | 100% | ✅ **HOÀN TẤT** | Đầy đủ 6 file tài liệu theo chuẩn đề cương cao học + Kịch bản thuyết trình bảo vệ |
| **2. Cơ sở dữ liệu PostgreSQL 17 (`canteen_ctech`)** | 100% | ✅ **HOÀN TẤT** | Đã tạo CSDL, 12 bảng quan hệ và nạp dữ liệu mẫu thực tế của CTECH |
| **3. Backend Python FastAPI (`backend/`)** | 100% | ✅ **HOÀN TẤT** | 9 routers API, SQLAlchemy ORM, Pydantic validation, CORS, Swagger UI `/docs` |
| **4. Kiến trúc Frontend & API Client (`frontend/`)** | 100% | ✅ **HOÀN TẤT** | Cấu hình proxy, `apiClient.js`, Context API kết nối trực tiếp PostgreSQL |
| **5. Giao diện cá nhân hóa theo từng Role (Strict RBAC)** | 100% | ✅ **HOÀN TẤT** | 19 View chuyên biệt theo 7 Vai trò; DOM lọc sạch sẽ, tuyệt đối không lộ quyền chéo |
| **6. Kịch bản chạy song song & Kiểm thử liên thông** | 100% | ✅ **HOÀN TẤT** | File `start_system.bat` 1-click & script `npm run dev` song song, kiểm thử API 100% pass |

---

## II. CHI TIẾT TỪNG HẠNG MỤC ĐÃ HOÀN THÀNH

### 1. Tài liệu Học thuật & Thiết kế (`docs/`)
- [x] `docs/01_Tong_Quan_Va_Khao_Sat_Hien_Trang.md`: Khảo sát quy trình căng tin CTECH, phân tích 5 bài toán cốt lõi.
- [x] `docs/02_Phan_Tich_Yeu_Cau_Va_Mo_Hinh_Hoa.md`: 8 tác nhân, 9 nhóm chức năng, sơ đồ Use Case, Activity, Sequence.
- [x] `docs/03_Thiet_Ke_Kien_Truc_Va_CSDL.md`: Kiến trúc 3-Tier phân tách FE-BE, ERD, Schema 12 bảng PostgreSQL, ma trận phân quyền RBAC nghiêm ngặt theo Use Case.
- [x] `docs/04_Thiet_Ke_Chi_Tiet_Phe_Duyet_4_Cap_Va_DSS.md`: Chi tiết quy trình phê duyệt 4 cấp & Thuật toán DSS $Q = \max(0, D + SS - I - Q_{in})$.
- [x] `docs/05_Ke_Hoach_Phat_Trien_Kiem_Thu_Va_Trien_Khai.md`: Kế hoạch kiểm thử với 10 Test Cases, kế hoạch bàn giao triển khai.
- [x] `docs/06_Kich_Ban_Demo_Thuyet_Trinh.md` & `KICH_BAN_DEMO.md`: Kịch bản thuyết trình bảo vệ 12–15 phút kèm lời thoại mẫu từng phút và bộ câu hỏi phản biện của hội đồng.

### 2. Cơ sở Dữ liệu Quan hệ Neon Cloud PostgreSQL
- [x] Đã kết nối thành công tới Neon PostgreSQL Serverless (`ep-lively-dream-bik2el6o-pooler.c-5.ap-southeast-1.aws.neon.tech`).
- [x] Đã đồng bộ toàn bộ cấu trúc Schema 12 bảng quan hệ có khóa ngoại:
  1. `users` (Danh sách người dùng và vai trò RBAC)
  2. `categories` (Phân loại món ăn, đồ uống)
  3. `suppliers` (Hồ sơ nhà cung cấp thực phẩm)
  4. `materials` (Nguyên vật liệu, tồn kho hiện tại, tồn an toàn, MOQ, đơn giá bình quân)
  5. `products` (Sản phẩm thành phẩm, giá bán, giá thành BOM)
  6. `recipes` (Định mức nguyên liệu BOM cho từng món)
  7. `purchase_requests` (Phiếu đề xuất mua hàng & trạng thái phê duyệt 4 cấp, kho nhận)
  8. `purchase_items` (Chi tiết mặt hàng, số lượng, đơn giá, thành tiền trong phiếu mua)
  9. `purchase_timeline` (Dấu vết phê duyệt, người duyệt, thời gian, ý kiến)
  10. `inventory_batches` (Quản lý lô hàng thực tế, hạn sử dụng FEFO, mã lô LOT)
  11. `ctool_meals` (Danh sách suất ăn CBNV đăng ký qua Ctool & đối soát vân tay)
  12. `orders` & `order_items` (Lịch sử đơn bán lẻ POS và chi tiết khấu trừ nguyên liệu)
  13. `audit_logs` (Nhật ký kiểm toán hệ thống không thể xóa sửa)
- [x] Nạp dữ liệu mẫu khởi tạo hoàn tất qua `backend/app/seed.py` vào Neon DB.

### 3. Backend Python FastAPI (`backend/`)
- [x] Cấu hình kết nối PostgreSQL qua SQLAlchemy (`backend/app/database.py`).
- [x] 12 ORM Models kế thừa Base (`backend/app/models.py`).
- [x] Khai báo Schemas Pydantic validation (`backend/app/schemas.py`).
- [x] 9 API Routers độc lập:
  - `auth.py`: Quản lý tài khoản, danh sách vai trò, xác thực đăng nhập (`/api/auth/login`), đăng xuất (`/api/auth/logout`), chuyển đổi vai trò (`/api/auth/switch`).
  - `menu.py`: Danh mục, món ăn, bóc tách định mức BOM (`/api/menu/products`).
  - `pos.py`: Tạo đơn hàng POS, tự động khấu trừ kho theo BOM (`/api/pos/checkout`).
  - `approval.py`: Quy trình phê duyệt 4 cấp, kiểm soát phân quyền chặt chẽ từng cấp (`/api/approval/requests/{id}/approve`).
  - `inventory.py`: Quản lý nguyên vật liệu, lô hàng FEFO, tiếp nhận hàng theo PO, kiểm kê chênh lệch (`/api/inventory/receive/{id}`).
  - `dss.py`: Thuật toán DSS gợi ý lượng đặt hàng theo công thức chuỗi cung ứng (`/api/dss/calculate`).
  - `ctool.py`: Quản lý suất ăn CBNV, đối soát vân tay, đồng bộ Ctool (`/api/ctool/sync`).
  - `reports.py`: Báo cáo chỉ số điều hành Dashboard & Nhập-Xuất-Tồn (`/api/reports/dashboard`, `/api/reports/nxt`).
  - `audit.py`: Nhật ký kiểm toán hệ thống (`/api/audit/logs`).
- [x] Middleware CORS cho phép kết nối từ Vite (`localhost:5173`).
- [x] File chạy server: `backend/run_backend.py` (cổng 8000).

### 4. Kiến trúc Frontend & Phân quyền Nghiêm ngặt (Strict RBAC)
- [x] Thư mục dự án `frontend/` độc lập với `package.json`, `vite.config.js`, `tailwind.config.js`.
- [x] Proxy cấu hình chuyển `/api` sang FastAPI Backend `http://127.0.0.1:8000`.
- [x] `frontend/src/api/apiClient.js` tự động truyền Header vai trò (`x-user-role`, `x-user-name`).
- [x] `frontend/src/data/roles.js` xác định ma trận quyền nghiêm ngặt: Mỗi vai trò chỉ truy cập đúng danh sách `allowedTabs`.
- [x] `frontend/src/context/AppContext.jsx` quản lý dữ liệu đồng bộ thời gian thực từ PostgreSQL.
- [x] **Sidebar theo Role:** Chỉ hiển thị các tab trong `allowedTabs`. Menu của các chức năng không được phép sẽ **biến mất hoàn toàn khỏi DOM**.
- [x] **Màn hình Đăng nhập & Đăng xuất chuẩn bảo mật (`LoginView.jsx`):**
  - Giao diện đăng nhập với Username/Password, kiểm tra xác thực trực tiếp trên Neon DB.
  - Tích hợp bảng **chọn nhanh 7 vai trò (1-click Quick Login)** hỗ trợ hội đồng chấm đồ án và demo trực quan.
  - Tích hợp nút **Đăng xuất (Logout)** trên Header để thoát tài khoản và quay về màn hình đăng nhập.
- [x] **Xây dựng 19 View chuyên biệt theo từng Role:**
  1. **Thu ngân (`CASHIER`):**
     - `CashierPOSView.jsx`: Màn hình POS bán hàng (chọn món, tính tiền, voucher Ctool, in hóa đơn, trừ kho tự động BOM).
     - `CashierHistoryView.jsx`: Lịch sử các đơn do thu ngân thực hiện trong ca.
     - *Ẩn hoàn toàn:* Không có nút duyệt, không có kho, không có DSS.
  2. **Bếp trưởng (`CHEF`):**
     - `ChefMenuBOMView.jsx`: Quản lý Thực đơn & Bảng định mức BOM.
     - `ChefDSSView.jsx`: Kế hoạch DSS (thanh trượt tham số & 1-click sinh đề xuất mua hàng).
     - `ChefPRView.jsx`: Đề xuất mua hàng PR (có nút Lập phiếu mới; **tuyệt đối không hiển thị các nút Duyệt Cấp 2, 3, 4**).
     - `CtoolMonitorView.jsx`: Theo dõi suất ăn CBNV cần chế biến.
  3. **Trưởng phòng TCHC (`TCHC`):**
     - `ApprovalLevel2View.jsx`: **CHỈ hiển thị nút "Phê duyệt Cấp 2"** và **"Từ chối"** cho phiếu `PENDING_TCHC`.
     - `CtoolMonitorView.jsx`: Giám sát suất ăn CBNV Ctool & đối soát vân tay.
     - `GeneralReportsView.jsx`: Báo cáo tổng hợp vận hành.
  4. **Kế toán trưởng (`ACCOUNTANT`):**
     - `ApprovalLevel3View.jsx`: **CHỈ hiển thị nút "Phê duyệt Cấp 3"** và đàm phán giá cho phiếu `PENDING_ACCOUNTANT`.
     - `SuppliersView.jsx`: Quản lý danh bạ Nhà cung cấp & liên hệ.
     - `FinancialReportsView.jsx`: Báo cáo Tài chính, Doanh thu POS và Giải ngân chi phí PO.
  5. **Chủ tịch Hội đồng trường (`CHAIRMAN`):**
     - `ExecutiveDashboardView.jsx`: Dashboard cấp cao (chỉ số dòng tiền, doanh thu, ngân sách).
     - `ApprovalLevel4View.jsx`: **CHỈ hiển thị nút "Ký Duyệt Chi Cấp 4 (Ban Hành PO Chính Thức)"**.
  6. **Thủ kho (`STOREKEEPER`):**
     - `StorekeeperReceiveView.jsx`: Tiếp nhận hàng theo PO đã duyệt (nhập mã LOT, HSD EXP).
     - `StorekeeperStockView.jsx`: Quản lý Tồn kho nguyên vật liệu & Nút "Điều chỉnh kiểm kê".
     - `StorekeeperFEFOView.jsx`: Quản lý Lô & Hạn sử dụng (FEFO).
  7. **Quản trị viên (`ADMIN`):**
     - `AdminDashboardView.jsx`: Bảng điều khiển toàn diện hệ thống.
     - `AdminUsersView.jsx`: Quản trị tài khoản người dùng & phân quyền RBAC.
     - `AuditLogsView.jsx`: Toàn quyền xem và giám sát Audit Logs hệ thống.

### 5. Khởi động Song song & Tích hợp
- [x] File `start_system.bat` tại thư mục gốc: Tự động khởi chạy song song Backend FastAPI (Port 8000) và Frontend Vite (Port 5173), tự động mở trình duyệt web.
- [x] Root `package.json`: Hỗ trợ `npm run dev` (sử dụng concurrently chạy cả 2 tiến trình trong 1 terminal) hoặc `npm start` (gọi `start_system.bat`).
- [x] Đã kiểm thử liên thông End-to-End: FastAPI TestClient và Vite production build đạt kết quả 100% thành công.
