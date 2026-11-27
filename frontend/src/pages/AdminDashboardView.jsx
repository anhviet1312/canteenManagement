import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  ClipboardCheck,
  AlertTriangle,
  History,
  ShieldCheck,
  TrendingUp,
  Server,
  ArrowRight,
  Boxes,
  UserCheck
} from 'lucide-react';

export default function AdminDashboardView() {
  const {
    users,
    materials,
    purchaseRequests,
    orders,
    auditLogs,
    ctoolMeals,
    dashboardMetrics,
    setActiveTab
  } = useApp();

  // Metrics calculation
  const totalRevenue = dashboardMetrics?.total_revenue ?? orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = dashboardMetrics?.total_orders ?? orders.length;
  const servedCtool = dashboardMetrics?.served_ctool ?? ctoolMeals.filter(m => m.is_served).length;
  const totalCtool = dashboardMetrics?.total_ctool ?? ctoolMeals.length;
  const pendingPRs = dashboardMetrics?.pending_approvals_count ?? purchaseRequests.filter(
    p => ['PENDING_TCHC', 'PENDING_ACCOUNTANT', 'PENDING_CHAIRMAN'].includes(p.status)
  ).length;
  const lowStockCount = dashboardMetrics?.low_stock_count ?? materials.filter(
    m => m.current_stock <= m.safety_stock
  ).length;
  const lowStockItems = dashboardMetrics?.low_stock_materials ?? materials.filter(
    m => m.current_stock <= m.safety_stock
  );

  // Latest 5 Audit Logs
  const recentLogs = [...auditLogs].slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white shadow flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Quản Trị Hệ Thống (System Admin)
            </span>
            <span className="text-xs text-slate-400">Trạng Thái Hệ Thống: Trực Tuyến • PostgreSQL 17</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Bảng Điều Khiển Quản Trị Vận Hành Căn Tin Toàn Diện</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Giám sát tập trung toàn bộ chỉ số vận hành thời gian thực: Bán hàng POS, Suất ăn Ctool, Phê duyệt 4 cấp và Kho hạn dùng FEFO.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Neon Cloud: <strong className="text-emerald-400 font-mono">Connected</strong></span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Phân quyền: <strong className="text-purple-300 font-mono">7 Roles (Strict RBAC)</strong></span>
          </div>
        </div>
      </div>

      {/* Row 1: 4 Operational Real-Time KPI Cards (Khớp 100% Kịch bản Demo Phần 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* KPI 1: Revenue */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" /> Doanh Thu Bán Hàng POS:
            </span>
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Hôm nay</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalRevenue.toLocaleString()} đ</div>
          <p className="text-[11px] text-slate-400">
            {totalOrders} giao dịch • Động cơ tự động trừ kho BOM
          </p>
        </div>

        {/* KPI 2: Ctool Meals */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow hover:border-cyan-500/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" /> Suất Ăn CBNV (Ctool BM02):
            </span>
            <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">Chốt 21h00</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {servedCtool} / {totalCtool} suất
          </div>
          <p className="text-[11px] text-slate-400">
            {totalCtool > 0 ? Math.round((servedCtool / totalCtool) * 100) : 0}% đã đối soát nhận cơm tại quầy POS
          </p>
        </div>

        {/* KPI 3: 4-Stage Approval */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-amber-400" /> Hồ Sơ Mua Hàng 4 Cấp (BM01):
            </span>
            <span className="p-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold">Đang luân chuyển</span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {pendingPRs} phiếu chờ duyệt
          </div>
          <p className="text-[11px] text-slate-400">
            Tổng cộng: {purchaseRequests.length} phiếu trong hệ thống
          </p>
        </div>

        {/* KPI 4: Low Stock Warnings */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1 shadow hover:border-rose-500/50 transition">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Tồn Kho Chạm Ngưỡng An Toàn:
            </span>
            <span className="p-1 rounded-lg bg-rose-500/10 text-rose-400 text-[10px] font-bold">Safety Stock</span>
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {lowStockCount} mặt hàng
          </div>
          <p className="text-[11px] text-rose-400/90 font-medium">
            Cần DSS lập kế hoạch đề xuất mua ngay
          </p>
        </div>
      </div>

      {/* Row 2: 2 Column Layout - Workflow Status & Low Stock List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): 7 Subsystems Status Overview */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Boxes className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Giám Sát Trạng Thái 7 Phân Hệ Nghiệp Vụ (Strict RBAC)</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">7 / 7 Phân Hệ Trực Tuyến</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* 1. Thu ngân */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-300">1. Quầy Bán Hàng POS (Thu ngân)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Sẵn sàng</span>
              </div>
              <p className="text-[11px] text-slate-400">Đặng Thùy Linh • Bán hàng VietQR, Voucher Ctool & Trừ kho tự động BOM.</p>
            </div>

            {/* 2. Bếp trưởng */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-300">2. Bếp & Định Mức BOM (Bếp trưởng)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">Sẵn sàng</span>
              </div>
              <p className="text-[11px] text-slate-400">Nguyễn Văn Đạt • Mô hình DSS tối ưu chuỗi cung ứng & 1-Click lập PR.</p>
            </div>

            {/* 3. TCHC */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-300">3. Thẩm Định Nhu Cầu (TP. TCHC)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">Phê duyệt Cấp 2</span>
              </div>
              <p className="text-[11px] text-slate-400">Trần Thị Mai • Kiểm soát định mức tiêu hao, giám sát suất ăn Ctool.</p>
            </div>

            {/* 4. Kế toán */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300">4. Thẩm Định Giá & NS (Kế toán trưởng)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">Phê duyệt Cấp 3</span>
              </div>
              <p className="text-[11px] text-slate-400">Lê Hoàng Long • Đối chiếu hợp đồng khung NCC & ngân sách chi.</p>
            </div>

            {/* 5. Chủ tịch HĐT */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-rose-300">5. Ký Duyệt Chi Tối Cao (Chủ tịch HĐT)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">Phê duyệt Cấp 4</span>
              </div>
              <p className="text-[11px] text-slate-400">TS. Phạm Minh Tuấn • Executive Dashboard & ban hành Đơn đặt hàng PO.</p>
            </div>

            {/* 6. Thủ kho */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-cyan-300">6. Quản Lý Kho & Hạn Dùng FEFO (Thủ kho)</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">Nhập PO & BM03</span>
              </div>
              <p className="text-[11px] text-slate-400">Bùi Đức Thắng • Tiếp nhận PO, kiểm soát hạn FEFO & biên bản kiểm kê BM03.</p>
            </div>
          </div>
        </div>

        {/* Right (1 col): Low Stock Critical Materials */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Nguyên Liệu Cần Bổ Sung Ngay
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              {lowStockItems.length} cảnh báo
            </span>
          </div>

          <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
            {lowStockItems.length === 0 ? (
              <p className="text-slate-500 text-center py-6">Mọi nguyên liệu đang ở mức an toàn.</p>
            ) : (
              lowStockItems.map((item, idx) => (
                <div key={item.id || idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white truncate max-w-[150px]">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">Ngưỡng an toàn: {item.safety_stock} {item.unit}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-rose-400 text-sm">
                      {item.current_stock} {item.unit}
                    </span>
                    <span className="block text-[9px] text-rose-400/80 uppercase font-semibold">Thiếu hụt</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Live Audit Trail Feed (5 Most Recent Events) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Nhật Ký Kiểm Toán Thời Gian Thực (Audit Trail Feed)</h3>
          </div>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold transition"
          >
            <span>Xem toàn bộ {auditLogs.length} sự kiện</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 w-32">Thời Gian</th>
                <th className="p-3 w-48">Người Thực Hiện</th>
                <th className="p-3 w-40">Hành Động</th>
                <th className="p-3 w-44">Đối Tượng</th>
                <th className="p-3">Chi Tiết Sự Kiện</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">Chưa ghi nhận sự kiện kiểm toán nào.</td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-white">{log.user_info}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-cyan-300 font-semibold">{log.target}</td>
                    <td className="p-3 text-slate-300 truncate max-w-md">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
