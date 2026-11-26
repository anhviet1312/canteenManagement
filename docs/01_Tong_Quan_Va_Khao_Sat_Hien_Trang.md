# TÀI LIỆU PHÂN TÍCH THIẾT KẾ HỆ THỐNG THÔNG TIN QUẢN LÝ CĂNG TIN TRƯỜNG CAO ĐẲNG CTECH
## PHẦN MỞ ĐẦU & CHƯƠNG 1: TỔNG QUAN VÀ KHẢO SÁT HIỆN TRẠNG

---

### PHẦN MỞ ĐẦU

#### 1. Lý do chọn đề tài
Trong môi trường giáo dục đại học và cao đẳng hiện đại, căng tin không đơn thuần là nơi cung cấp dịch vụ ăn uống cho cán bộ giảng viên, nhân viên (CBNV) và học sinh sinh viên (HSSV), mà còn là một mắt xích quan trọng đảm bảo sức khỏe, an toàn vệ sinh thực phẩm và nâng cao chất lượng đời sống học đường.
Tại Trường Cao đẳng CTECH, quy mô đào tạo liên tục mở rộng với hàng nghìn sinh viên và hàng trăm cán bộ giảng viên. Nhu cầu phục vụ ăn trưa, giải khát và suất ăn công nghiệp theo ca diễn ra với tần suất cao, tập trung vào các khung giờ cao điểm. Tuy nhiên, hoạt động quản lý căng tin hiện tại vẫn mang tính phân tán, sử dụng nhiều công cụ rời rạc (phiếu giấy, sổ tay, bảng tính Excel, hệ thống Ctool độc lập của nhà trường). Điều này dẫn tới nhiều bất cập: thất thoát nguyên vật liệu, khó khăn trong việc dự báo nhu cầu chế biến, thiếu minh bạch trong chi phí mua sắm thực phẩm và mất nhiều thời gian trong quy trình trình ký duyệt chi.
Xuất phát từ thực tiễn trên, việc nghiên cứu và thực hiện đề tài **"Xây dựng Hệ thống thông tin Quản lý Căng tin Trường Cao đẳng CTECH"** trong khuôn khổ môn học *Quản trị Hệ thống thông tin Nâng cao* bậc Cao học là vô cùng cấp thiết và có giá trị ứng dụng thực tiễn cao.

#### 2. Mục tiêu thực hiện đề tài
* **Mục tiêu tổng quát:** Xây dựng một Hệ thống Thông tin Quản lý (MIS) tập trung, tích hợp đầy đủ các phân hệ quản lý vận hành căng tin, hỗ trợ tự động hóa chuỗi cung ứng từ lập kế hoạch, mua hàng, nhập xuất kho đến chế biến, bán hàng và báo cáo tài chính quản trị.
* **Mục tiêu cụ thể:**
  1. Chuẩn hóa quy trình quản lý danh mục hàng hóa, nguyên vật liệu và định mức chế biến (BOM - Bill of Materials).
  2. Số hóa quy trình bán hàng tại quầy (POS), tích hợp đa kênh thanh toán (tiền mặt, mã QR, tài khoản suất ăn).
  3. Xây dựng quy trình phê duyệt mua hàng trực tuyến 4 cấp (Bếp trưởng $\rightarrow$ Trưởng phòng TCHC $\rightarrow$ Kế toán $\rightarrow$ Chủ tịch HĐT) giúp minh bạch tài chính và rút ngắn thời gian xử lý.
  4. Quản lý kho theo thời gian thực (FIFO/FEFO), kiểm soát hạn sử dụng và cảnh báo tồn kho an toàn.
  5. Xây dựng phân hệ Hỗ trợ ra quyết định (DSS - Decision Support System) nhằm dự báo nhu cầu tiêu thụ và tự động gợi ý kế hoạch nhập hàng tối ưu.
  6. Tích hợp dữ liệu hai chiều với hệ thống Ctool (hệ thống quản lý nội bộ của trường) và máy chấm công để xác định chính xác số lượng suất ăn CBNV cần chuẩn bị mỗi ngày.

#### 3. Đối tượng và phạm vi nghiên cứu
* **Đối tượng nghiên cứu:** Quy trình nghiệp vụ quản lý căng tin tại trường cao đẳng; luồng thông tin và luồng vật chất trong quản lý kho thực phẩm, chế biến, mua hàng và bán lẻ; các mô hình hỗ trợ ra quyết định trong quản trị hàng tồn kho (EOQ, Safety Stock, Reorder Point).
* **Phạm vi nghiên cứu:** Toàn bộ hoạt động vận hành căng tin cơ sở chính của Trường Cao đẳng CTECH, bao gồm dịch vụ cơm trưa CBNV, suất ăn sinh viên, quầy giải khát và quản lý kho tổng thực phẩm.

#### 4. Phương pháp nghiên cứu và thực hiện
* Phương pháp điều tra, khảo sát thực tế và phỏng vấn các bên liên quan (Bếp trưởng, Kế toán, Trưởng phòng TCHC, CBNV và sinh viên).
* Phương pháp phân tích và thiết kế hệ thống theo hướng cấu trúc và hướng đối tượng (UML: Use Case, Activity, Sequence, Class Diagram).
* Phương pháp mô hình hóa dữ liệu quan hệ (ERD) và chuẩn hóa CSDL.
* Phương pháp nghiên cứu định lượng trong quản trị tồn kho và hệ hỗ trợ ra quyết định (DSS).
* Phương pháp phát triển phần mềm theo mô hình Agile/Scrum và kiểm thử hộp đen.

#### 5. Ý nghĩa khoa học và thực tiễn của đề tài
* **Ý nghĩa khoa học:** Vận dụng lý thuyết Quản trị HTTT nâng cao, kiến trúc tích hợp hệ thống doanh nghiệp (Enterprise Application Integration) và hệ hỗ trợ ra quyết định (DSS) vào giải quyết bài toán logistics nội bộ trong trường học.
* **Ý nghĩa thực tiễn:** Tạo ra sản phẩm phần mềm demo trực quan, đầy đủ nghiệp vụ, có khả năng áp dụng trực tiếp tại CTECH nhằm tiết kiệm chi phí, giảm lãng phí thực phẩm và nâng cao năng lực quản trị.

---

### CHƯƠNG 1. TỔNG QUAN VỀ HỆ THỐNG THÔNG TIN QUẢN LÝ CĂNG TIN

#### 1.1. Tổng quan về hệ thống thông tin quản lý
* **1.1.1. Khái niệm và các thành phần của HTTTQL (MIS):**
  Hệ thống thông tin quản lý là một hệ thống tích hợp giữa con người, phần cứng, phần mềm, mạng truyền thông và dữ liệu nhằm thu thập, lưu trữ, xử lý và phân phối thông tin hỗ trợ công tác lập kế hoạch, kiểm soát và ra quyết định trong tổ chức.
* **1.1.2. Vai trò của HTTT trong quản lý và ra quyết định:**
  HTTT giúp giảm thiểu sai sót chủ quan, tăng tính minh bạch, giảm thời gian xử lý thủ tục giấy tờ và cung cấp cái nhìn toàn diện về hiệu quả kinh doanh.
* **1.1.3. Hệ thống thông tin hỗ trợ quản lý và hệ hỗ trợ ra quyết định (DSS):**
  Khác với hệ thống xử lý giao dịch đơn thuần (TPS), DSS tích hợp các mô hình toán học và dữ liệu lịch sử để phân tích xu hướng, từ đó đưa ra các khuyến nghị có cơ sở khoa học (ví dụ: gợi ý lượng thịt, cá, rau cần nhập dựa trên lịch sử bán hàng và số lượng người đăng ký ăn).

#### 1.2. Tổng quan về hoạt động quản lý căng tin
* **1.2.1. Đặc điểm căng tin cơ sở giáo dục:**
  Lượng khách hàng tập trung vào các khung giờ cố định (11h30 - 13h00 trưa, giờ ra chơi). Khách hàng gồm 2 nhóm chính: HSSV (tiêu thụ đa dạng món ăn, đồ uống, thanh toán tiền mặt/chuyển khoản) và CBNV (sử dụng suất ăn theo định mức phúc lợi của trường).
* **1.2.2. Nghiệp vụ hàng hóa, nguyên vật liệu và thực đơn:**
  Phân tách rõ ràng giữa *Nguyên vật liệu tươi sống* (thịt, cá, rau củ có HSD ngắn), *Nguyên vật liệu khô/gia vị* (gạo, dầu ăn, mắm muối) và *Hàng hóa đóng gói bán lẻ* (nước ngọt, sữa, bánh mì).
* **1.2.3. Nghiệp vụ bán hàng và order:**
  Đòi hỏi tốc độ xử lý nhanh, hỗ trợ quét mã vạch/mã QR, in bill hoặc trừ ví suất ăn.
* **1.2.4. Nghiệp vụ mua hàng và quản lý NCC:**
  Lựa chọn NCC uy tín, quản lý đơn giá, thời gian giao hàng và công nợ.
* **1.2.5. Nghiệp vụ quản lý kho và chế biến:**
  Áp dụng nguyên tắc FIFO (vào trước ra trước) và FEFO (hết hạn trước ra trước). Quy đổi định mức từ món ăn thành hao hụt nguyên liệu (BOM).

#### 1.3. Khảo sát hiện trạng quản lý căng tin tại Trường Cao đẳng CTECH
* **1.3.1. Cơ cấu tổ chức:**
  Ban Giám hiệu / Chủ tịch HĐT $\rightarrow$ Phòng Tổ chức Hành chính (quản lý chung) $\rightarrow$ Bộ phận Căng tin (Bếp trưởng, Nhân viên bếp, Nhân viên bán hàng, Thủ kho) phối hợp cùng Phòng Kế toán - Tài chính.
* **1.3.2. Các công cụ rời rạc hiện hành:**
  * **Ctool:** Hệ thống quản lý trường học CTECH, nơi CBNV đăng ký chấm công và tick chọn "Có ăn trưa" trước 09h00 sáng.
  * **Ứng dụng order nước / phiếu giấy:** Quầy nước ghi sổ tay hoặc dùng phần mềm bán lẻ độc lập không liên kết kho bếp.
  * **Máy chấm công vân tay:** Đặt tại cổng và sảnh, ghi nhận dữ liệu đi làm thực tế.
  * **Sổ sách kho:** Thủ kho ghi chép bằng sổ tay và file Excel cuối tuần mới tổng hợp.
* **1.3.3. Bất cập và điểm nghẽn:**
  1. Bếp không nắm bắt kịp thời số lượng CBNV ăn trưa thực tế $\rightarrow$ Nấu thừa gây lãng phí hoặc nấu thiếu gây bức xúc.
  2. Phiếu đề xuất mua sắm viết tay phải mang qua nhiều phòng ban xin chữ ký $\rightarrow$ Mất từ 1-2 ngày, dễ chậm trễ giờ giao thực phẩm tươi.
  3. Không kiểm soát được tỷ lệ hao hụt nguyên vật liệu giữa định mức lý thuyết và thực tế chế biến.
  4. Lãnh đạo trường thiếu báo cáo tức thời về chi phí và hiệu quả vận hành.

#### 1.4. Phát biểu bài toán quản lý căng tin CTECH
Cần xây dựng một hệ thống phần mềm web tập trung đáp ứng 5 bài toán cốt lõi:
1. **Bài toán Bán hàng & Dịch vụ:** Phục vụ nhanh tại quầy, quản lý đơn hàng, hóa đơn.
2. **Bài toán Tích hợp Dữ liệu:** Tự động lấy số lượng suất ăn CBNV từ Ctool và máy chấm công trước 09h30 hàng ngày để báo cho Bếp trưởng.
3. **Bài toán Phê duyệt Mua hàng 4 Cấp:** Quy trình số hóa: Bếp trưởng lập đơn $\rightarrow$ Trưởng phòng TCHC duyệt nhu cầu $\rightarrow$ Kế toán duyệt giá/ngân sách $\rightarrow$ Chủ tịch HĐT duyệt chi cuối cùng.
4. **Bài toán Kho & Tiêu hao (BOM):** Tự động trừ tồn kho nguyên liệu khi món ăn được chế biến hoặc bán ra; cảnh báo hạn sử dụng.
5. **Bài toán Hỗ trợ Ra Quyết Định (DSS):** Thuật toán tự động tính toán nhu cầu nguyên vật liệu ngày kế tiếp và đề xuất danh mục cần mua.

---
*(Xem tiếp Tài liệu 02 về Phân tích yêu cầu và Mô hình hóa hệ thống)*
