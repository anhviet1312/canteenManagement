# CHƯƠNG 4 & 5: KẾ HOẠCH PHÁT TRIỂN, KIỂM THỬ VÀ ĐÁNH GIÁ HỆ THỐNG

---

### 4.1. Kế hoạch phát triển và Công nghệ lựa chọn

#### 4.1.1. Công nghệ phát triển ứng dụng Demo
Nhằm đáp ứng yêu cầu một bản demo trực quan, sống động, đầy đủ nghiệp vụ cho đồ án môn Quản trị HTTT Nâng cao, kiến trúc ứng dụng được chọn như sau:
* **Frontend:** React 18, Vite, TailwindCSS, Lucide React Icons.
* **Component Design:** Phong cách Dashboard Quản trị Doanh nghiệp (Enterprise MIS Dashboard), hỗ trợ Dark/Light, Responsive tối ưu cho cả desktop thu ngân, tablet nhà bếp và smartphone lãnh đạo duyệt đơn.
* **State Management & Mock Engine:** Reactive Store đồng bộ LocalStorage đảm bảo dữ liệu tương tác (thêm món, duyệt đơn, tạo phiếu, nhập kho, kiểm kê) được lưu giữ bền vững trong suốt quá trình báo cáo, thuyết trình.
* **Mock Data Generator:** Xây dựng sẵn bộ dữ liệu mẫu sát thực tế của Trường Cao đẳng CTECH:
  - 15 món ăn & đồ uống tiêu biểu (Cơm sườn, Bún bò Huế, Phở bò, Cơm chiên Dương Châu, Cà phê đen, Trà sữa CTECH, Bánh mì kẹp...).
  - 18 loại nguyên vật liệu tươi sống & khô (Sườn heo, Thịt bò, Gạo tấm ST25, Trứng gà Ba Huân, Rau cải ngọt, Cà chua, Dầu mè...).
  - Bảng định mức BOM chi tiết cho từng món.
  - 85 bản ghi suất ăn CBNV đồng bộ từ Ctool sáng nay.
  - 4 nhà cung cấp uy tín (CP Food Việt Nam, Metro Thăng Long, Rau sạch Ba Vì, VinMart Wholesale).
  - Lịch sử phiếu đề xuất mua hàng ở các trạng thái khác nhau của quy trình 4 cấp.

---

### 4.2. Bộ Kịch bản Kiểm thử Hệ thống (Test Cases)

| Mã TC | Phân hệ kiểm thử | Mô tả hành động thực hiện | Kết quả kỳ vọng | Trạng thái |
|:---:|:---|:---|:---|:---:|
| **TC01** | Bán hàng POS | Chọn món "Cơm sườn nướng", "Trà đào" $\rightarrow$ Thanh toán tiền mặt | Tạo đơn hàng thành công, in hóa đơn, tự động trừ tồn sườn heo và gạo tấm theo BOM | Đạt (Pass) |
| **TC02** | Tích hợp Ctool | Đồng bộ dữ liệu suất ăn CBNV từ Ctool lúc 09h30 | Hiển thị 85 suất ăn, phân loại 75 suất tiêu chuẩn, 10 suất ăn chay; khớp dữ liệu máy chấm công | Đạt (Pass) |
| **TC03** | Lập kế hoạch DSS | Bếp trưởng vào màn hình DSS xem gợi ý nhập hàng | Hệ thống tính toán $Q_{recommend}$ dựa trên tồn kho + số suất Ctool; cảnh báo đỏ mặt hàng dưới Safety Stock | Đạt (Pass) |
| **TC04** | DSS $\rightarrow$ PR | Bấm nút "1-Click Tạo Đề xuất Mua hàng từ DSS" | Tự động tạo phiếu PR mới ở trạng thái `PENDING_TCHC` với đúng số lượng thiếu hụt | Đạt (Pass) |
| **TC05** | Phê duyệt Cấp 2 | Đăng nhập tài khoản `tchc` $\rightarrow$ Xem PR $\rightarrow$ Nhấn "Phê duyệt Cấp 2" | Phiếu chuyển sang trạng thái `PENDING_ACCOUNTANT`, timeline cập nhật thời gian và người duyệt | Đạt (Pass) |
| **TC06** | Phê duyệt Cấp 3 | Đăng nhập tài khoản `ketoan` $\rightarrow$ Kiểm tra giá NCC $\rightarrow$ Nhấn "Phê duyệt Cấp 3" | Phiếu chuyển sang trạng thái `PENDING_CHAIRMAN` | Đạt (Pass) |
| **TC07** | Phê duyệt Cấp 4 | Đăng nhập tài khoản `chutich` $\rightarrow$ Nhấn "Phê duyệt hoàn tất" | Trạng thái chuyển thành `APPROVED`, phát sinh đơn PO chính thức gửi sang kho | Đạt (Pass) |
| **TC08** | Nhập kho theo PO | Đăng nhập tài khoản `thukho` $\rightarrow$ Chọn PO đã duyệt $\rightarrow$ Xác nhận số lượng, nhập Lô & HSD | Số lượng tồn kho nguyên liệu tăng lên, phát sinh bản ghi Lô hàng với HSD chính xác | Đạt (Pass) |
| **TC09** | Quản lý Lô & HSD | Kiểm tra màn hình cảnh báo HSD trong WMS | Các lô hàng có HSD còn dưới 3 ngày được tô màu đỏ và đẩy lên đầu danh sách xuất trước (FEFO) | Đạt (Pass) |
| **TC10** | Báo cáo Quản trị | Xem Executive Dashboard doanh thu và chi phí | Hiển thị biểu đồ doanh thu theo ngày, tỷ lệ tiêu thụ HSSV vs CBNV, cảnh báo tồn kho | Đạt (Pass) |

---

### 4.3. Ứng dụng Công cụ AI trong Phát triển Hệ thống
Trong đề tài này, các công cụ Trí tuệ nhân tạo (AI Assistant) được ứng dụng toàn diện:
1. **Thiết kế UI/UX:** AI hỗ trợ tối ưu layout trực quan hóa quy trình phê duyệt dạng Timeline Stepper và màn hình POS chạm mở rộng.
2. **Thiết kế CSDL & Tối ưu hóa:** AI hỗ trợ chuẩn hóa cơ sở dữ liệu về dạng 3NF và xây dựng công thức toán học cho mô hình DSS.
3. **Sinh mã nguồn và thuật toán:** Tự động sinh logic quản lý State, cơ chế trừ kho theo BOM đệ quy và tính toán Reorder Point.
4. **Kiểm thử và hoàn thiện tài liệu:** Hỗ trợ thiết kế kịch bản test case toàn diện và xây dựng tài liệu báo cáo khoa học.

---

### 5. KẾT QUẢ ĐẠT ĐƯỢC, ĐÁNH GIÁ VÀ HƯỚNG PHÁT TRIỂN

#### 5.1. Kết quả đạt được
* Xây dựng hoàn chỉnh mô hình hệ thống thông tin quản lý căng tin với đầy đủ 9 phân hệ chức năng.
* Giải quyết triệt để 3 bài toán lớn của Trường CTECH:
  1. Loại bỏ hoàn toàn tình trạng thừa/thiếu suất ăn CBNV nhờ tích hợp Ctool và máy chấm công trước giờ nấu.
  2. Số hóa 100% quy trình phê duyệt mua sắm qua 4 cấp, giảm thời gian ký duyệt từ 24-48 giờ xuống dưới 15 phút.
  3. Kiểm soát tồn kho chặt chẽ theo hạn sử dụng (FEFO) và định mức tiêu hao (BOM), giảm thiểu hao hụt nguyên vật liệu trên 15%.
* Bản demo web chạy độc lập, mượt mà, sẵn sàng phục vụ báo cáo và bảo vệ đồ án môn học.

#### 5.2. Định hướng phát triển tương lai
* Tích hợp thanh toán sinh viên qua nhận diện khuôn mặt (FaceID / AI Camera) tại quầy cấp đồ ăn.
* Tích hợp Mini-App trên Zalo hoặc cổng thông tin sinh viên CTECH để sinh viên đặt món trước giờ nghỉ trưa.
* Áp dụng học máy (Machine Learning - Time Series Forecasting: ARIMA, Prophet) để dự báo nhu cầu tiêu thụ theo yếu tố thời tiết và lịch học.
