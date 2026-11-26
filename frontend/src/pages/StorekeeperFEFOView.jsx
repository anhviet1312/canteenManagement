import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar } from 'lucide-react';

export default function StorekeeperFEFOView() {
  const { inventoryBatches, currentUser } = useApp();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Phân Hệ Thủ Kho (WMS)
            </span>
            <span className="text-xs text-slate-400">First Expired, First Out (FEFO)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Kiểm Soát Lô Hàng & Hạn Sử Dụng Theo Nguyên Tắc FEFO</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Thủ kho: <strong className="text-white">{currentUser.full_name}</strong> • Tự động sắp xếp các lô theo hạn dùng gần nhất để ưu tiên xuất kho chế biến trước.
          </p>
        </div>

        <span className="text-xs text-slate-400">
          Tổng số lô quản lý: <strong className="text-white">{inventoryBatches.length}</strong>
        </span>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-5 space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Số Lô (Batch No)</th>
                <th className="p-3">Tên Nguyên Liệu</th>
                <th className="p-3 text-right">Số Lượng Còn Lại</th>
                <th className="p-3">Ngày Sản Xuất</th>
                <th className="p-3">Ngày Hết Hạn (EXP)</th>
                <th className="p-3 text-center">Trạng Thái FEFO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {inventoryBatches.map(batch => {
                const today = new Date();
                const exp = new Date(batch.exp_date);
                const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
                const isNearExp = daysLeft <= 3 && daysLeft >= 0;
                const isExpired = daysLeft < 0;

                return (
                  <tr key={batch.id} className={`hover:bg-slate-800/40 ${isNearExp ? 'bg-rose-950/20' : ''}`}>
                    <td className="p-3 font-mono font-bold text-cyan-400">{batch.lot_code}</td>
                    <td className="p-3 font-semibold text-white">{batch.material_name}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      {batch.current_qty} / {batch.initial_qty} {batch.unit}
                    </td>
                    <td className="p-3 text-slate-400 font-mono">{batch.mfg_date}</td>
                    <td className="p-3 font-mono font-bold text-slate-200">{batch.exp_date}</td>
                    <td className="p-3 text-center">
                      {isExpired ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                          ĐÃ HẾT HẠN
                        </span>
                      ) : isNearExp ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          Cận date ({daysLeft} ngày nữa) - Ưu tiên xuất!
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Tốt ({daysLeft} ngày)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
