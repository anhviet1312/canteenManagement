"""
Script Khôi Phục CSDL Chuẩn Phục Vụ Demo & Thuyết Trình
Hệ thống Thông tin Căn tin CTECH (MIS Cao học)
"""
import sys
import os

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.seed import seed_database

def reset():
    print("==================================================================")
    print("🚀 [CTECH CANTEEN MIS] BẮT ĐẦU KHÔI PHỤC CSDL DEMO CHUẨN...")
    print("==================================================================")
    
    seed_database(force=True)
    
    print("==================================================================")
    print("✅ ĐÃ KHÔI PHỤC THÀNH CÔNG TRẠNG THÁI DEMO VÀNG (GOLDEN DEMO STATE)!")
    print("==================================================================")
    print("📊 Tóm tắt trạng thái số liệu sẵn sàng cho buổi thuyết trình:")
    print("  1. Bếp trưởng & DSS: Tồn kho Sườn heo = 14.5kg (< 25kg Tồn an toàn -> Kích hoạt cảnh báo DSS).")
    print("  2. Quy trình Duyệt 4 cấp (BM01):")
    print("     - Phiếu PR-202611-003: Chờ TP. TCHC duyệt (Cấp 2).")
    print("     - Phiếu PR-202611-002: Chờ Kế toán trưởng duyệt (Cấp 3).")
    print("     - Phiếu PR-202611-001: Đã duyệt chi (PO-202611-001) chờ Thủ kho tiếp nhận & nhập kho.")
    print("  3. Suất ăn Ctool (BM02): 12 CBNV (Đúng tỷ lệ demo, sẵn sàng bấm Chốt 21h00).")
    print("  4. Quầy POS & Kho WMS: Giỏ hàng trống, 5 Lô hàng FEFO sạch đẹp.")
    print("  5. Phân quyền RBAC: Chuẩn hóa 100% nguyên tắc phân nhiệm SoD.")
    print("==================================================================")
    print("👉 Bạn chỉ cần F5 lại trình duyệt web và bắt đầu buổi Demo!")
    print("==================================================================")

if __name__ == "__main__":
    reset()
