import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import { BarChart3, DollarSign, PieChart, TrendingUp, Layers, Download } from 'lucide-react';

export default function FinancialReportsView() {
  const { dashboardMetrics } = useApp();
  const [nxtData, setNxtData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    apiClient.getNXTReport().then(data => {
      if (isMounted) setNxtData(data);
    }).catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const totalRetail = dashboardMetrics?.total_revenue || 0;
  const totalPO = dashboardMetrics?.total_approved_po || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phân Hệ Kế Toán Trưởng
            </span>
            <span className="text-xs text-slate-400">Financial Accounting & Inventory Reconciliation</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Báo Cáo Tài Chính, Đối Soát & Nhập - Xuất - Tồn (N-X-T)</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Báo cáo tài chính tổng hợp phục vụ quyết toán định kỳ và kiểm soát chi phí thực phẩm.
          </p>
        </div>

        <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>In Báo Cáo Quyết Toán</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Tổng Doanh Thu Bán Lẻ POS:</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalRetail.toLocaleString()} đ</div>
          <p className="text-[11px] text-slate-500">Tiền mặt & Chuyển khoản VietQR</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Chi Phí Mua Hàng Theo PO Đã Duyệt:</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{totalPO.toLocaleString()} đ</div>
          <p className="text-[11px] text-slate-500">Đã được Chủ tịch HĐT ký chuẩn chi</p>
        </div>

        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>Tổng Giá Trị Tồn Kho Nguyên Liệu:</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {nxtData.reduce((sum, it) => sum + it.total_value, 0).toLocaleString()} đ
          </div>
          <p className="text-[11px] text-slate-500">Giá trị thực tế lưu kho hiện tại</p>
        </div>
      </div>

      {/* NXT Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Báo Cáo Nhập - Xuất - Tồn Nguyên Vật Liệu (N-X-T)
            </h3>
            <p className="text-slate-400">Kỳ đối soát: Tháng 11/2026</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Mã NVL</th>
                <th className="p-3">Tên Nguyên Liệu</th>
                <th className="p-3 text-center">ĐVT</th>
                <th className="p-3 text-right">Tồn Đầu Kỳ</th>
                <th className="p-3 text-right">Nhập Trong Kỳ (PO)</th>
                <th className="p-3 text-right">Xuất Tiêu Hao (BOM)</th>
                <th className="p-3 text-right">Tồn Cuối Kỳ</th>
                <th className="p-3 text-right">Giá Trị Tồn Kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {nxtData.map(it => (
                <tr key={it.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">{it.code}</td>
                  <td className="p-3 font-semibold text-white">{it.name}</td>
                  <td className="p-3 text-center text-slate-400">{it.unit}</td>
                  <td className="p-3 text-right font-mono">{it.initial_stock}</td>
                  <td className="p-3 text-right font-mono text-cyan-400">+{it.received_qty}</td>
                  <td className="p-3 text-right font-mono text-amber-400">-{it.issued_qty}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{it.closing_stock}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                    {it.total_value.toLocaleString()} đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
