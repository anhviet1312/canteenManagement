import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Users2, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function GeneralReportsView() {
  const { dashboardMetrics, ctoolMeals, purchaseRequests, materials, currentUser } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Phân Hệ Trưởng Phòng TCHC
            </span>
            <span className="text-xs text-slate-400">Operations & Logistics Summary</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Báo Cáo Tổng Hợp Vận Hành & Khối Dịch Vụ Căn Tin</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Báo cáo tổng hợp tình hình phục vụ suất ăn CBNV, tiến độ các đề xuất mua hàng và cảnh báo hậu cần cho Trưởng phòng TCHC.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Tiến Độ Phục Vụ Suất Ăn Ctool:</span>
            <Users2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {dashboardMetrics?.served_ctool || 0} / {ctoolMeals.length} suất
          </div>
          <p className="text-[11px] text-slate-500">Tỷ lệ CBNV đã nhận suất ăn hôm nay</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Phiếu Đề Xuất Đang Xử Lý:</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {purchaseRequests.filter(p => p.status !== 'APPROVED' && p.status !== 'REJECTED').length} phiếu
          </div>
          <p className="text-[11px] text-slate-500">Trong tiến trình phê duyệt 4 cấp</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Nguyên Liệu Cần Bổ Sung (Dưới SS):</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono">
            {materials.filter(m => m.current_stock <= m.safety_stock).length} mặt hàng
          </div>
          <p className="text-[11px] text-slate-500">Cần Bếp trưởng kích hoạt mua sắm</p>
        </div>
      </div>
    </div>
  );
}
