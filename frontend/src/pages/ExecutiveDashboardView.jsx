import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, DollarSign, Users, ClipboardCheck, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function ExecutiveDashboardView() {
  const { dashboardMetrics, purchaseRequests, setActiveTab, currentUser } = useApp();

  const pendingL4 = purchaseRequests.filter(p => p.status === 'PENDING_CHAIRMAN');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow">
              Ban Lãnh Đạo Nhà Trường
            </span>
            <span className="text-xs text-slate-400">Executive Information System (EIS)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Dashboard Chỉ Số Cấp Cao - {currentUser.full_name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Báo cáo giám sát tài chính và thẩm quyền phê duyệt chi ngân sách vận hành căn tin Trường Cao đẳng CTECH.
          </p>
        </div>

        {pendingL4.length > 0 && (
          <button
            onClick={() => setActiveTab('approval_l4')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition flex items-center space-x-2 animate-bounce"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Có {pendingL4.length} đề xuất chờ Chủ tịch ký chi →</span>
          </button>
        )}
      </div>

      {/* 3 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">Doanh Thu Thu Tiền POS</p>
              <h3 className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                {(dashboardMetrics?.total_revenue || 0).toLocaleString()} đ
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">{dashboardMetrics?.total_orders || 0} giao dịch đã thanh toán</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">Ngân Sách PO Đã Chuẩn Chi</p>
              <h3 className="text-xl font-bold text-amber-400 mt-1 font-mono">
                {(dashboardMetrics?.total_approved_po || 0).toLocaleString()} đ
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Các đơn hàng đã cấp mã PO chính thức</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-400 font-medium">Phúc Lợi Suất Ăn CBNV</p>
              <h3 className="text-xl font-bold text-blue-400 mt-1 font-mono">
                {dashboardMetrics?.served_ctool || 0} / {dashboardMetrics?.total_ctool || 0}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Cán bộ GV đã nhận suất trưa</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
