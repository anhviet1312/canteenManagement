import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Boxes, Layers, CheckCircle2, ShieldAlert, Lock } from 'lucide-react';

export default function StorekeeperStockView() {
  const { materials, adjustStock, currentUser } = useApp();

  const isStorekeeper = currentUser?.role === 'STOREKEEPER';

  const [adjustModalMat, setAdjustModalMat] = useState(null);
  const [actualCount, setActualCount] = useState(0);
  const [adjustReason, setAdjustReason] = useState('Kiểm kê định kỳ cuối ca');

  const handleOpenAdjust = (mat) => {
    setAdjustModalMat(mat);
    setActualCount(mat.current_stock);
    setAdjustReason('Kiểm kê định kỳ cuối ca');
  };

  const handleConfirmAdjust = async () => {
    if (!adjustModalMat) return;
    await adjustStock(adjustModalMat.id, Number(actualCount), adjustReason);
    setAdjustModalMat(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Phân Hệ Thủ Kho (WMS)
            </span>
            <span className="text-xs text-slate-400">Inventory Stock & Stocktake</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Quản Lý Tồn Kho & Kiểm Kê Thực Tế</h2>
          {isStorekeeper ? (
            <p className="text-xs text-slate-300 mt-0.5">
              Thủ kho: <strong className="text-white">{currentUser.full_name}</strong> • Giám sát mức tồn kho an toàn (Safety Stock) và điều chỉnh chênh lệch kiểm kê.
            </p>
          ) : (
            <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
              <span className="text-xs text-slate-300">
                Người giám sát: <strong className="text-white">{currentUser.full_name}</strong>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                Chế độ Giám sát (Chỉ Xem)
              </span>
              <span className="text-xs text-slate-400">
                • Thao tác kiểm kê và cân chỉnh kho thuộc thẩm quyền của <strong className="text-cyan-400">Thủ kho (Bùi Đức Thắng)</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="font-semibold text-white">Danh Sách Nguyên Vật Liệu Trong Kho Thực Tế</span>
          <span className="text-slate-400">Đơn vị: kg / lít / quả / can</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Mã NVL</th>
                <th className="p-3">Tên nguyên vật liệu</th>
                <th className="p-3">Phân loại</th>
                <th className="p-3 text-right">Tồn kho thực tế</th>
                <th className="p-3 text-right">Tồn an toàn (SS)</th>
                <th className="p-3 text-center">Tình trạng</th>
                <th className="p-3 text-right">Giá vốn TB</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {materials.map(mat => {
                const isLow = mat.current_stock <= mat.safety_stock;
                const isWarning = mat.current_stock <= mat.safety_stock * 1.25 && !isLow;

                return (
                  <tr key={mat.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-slate-400">{mat.code}</td>
                    <td className="p-3 font-semibold text-white">{mat.name}</td>
                    <td className="p-3 text-slate-400">{mat.category}</td>
                    <td className="p-3 text-right font-mono font-bold text-base text-white">
                      {mat.current_stock} <span className="text-xs text-slate-400 font-normal">{mat.unit}</span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">{mat.safety_stock} {mat.unit}</td>
                    <td className="p-3 text-center">
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                          🔴 Dưới an toàn
                        </span>
                      ) : isWarning ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          🟡 Sắp chạm ngưỡng
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          🟢 Đầy đủ an toàn
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-300">{mat.avg_cost.toLocaleString()} đ</td>
                    <td className="p-3 text-center">
                      {isStorekeeper ? (
                        <button
                          onClick={() => handleOpenAdjust(mat)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium border border-slate-700 transition"
                        >
                          Kiểm kê / Chỉnh tồn
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Chỉ xem</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Điều chỉnh kiểm kê */}
      {adjustModalMat && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Kiểm Kê Kho & Điều Chỉnh Tồn Thực Tế
            </h3>
            <p className="text-xs text-slate-300">Mặt hàng: <strong className="text-white">{adjustModalMat.name}</strong></p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Tồn sổ sách phần mềm:</span>
                <span className="font-mono text-white font-bold">{adjustModalMat.current_stock} {adjustModalMat.unit}</span>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Số lượng thực đếm (Physical Count):</label>
                <input
                  type="number"
                  step="0.5"
                  value={actualCount}
                  onChange={e => setActualCount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono font-bold text-sm"
                />
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                <span className="text-slate-300">Chênh lệch:</span>
                <span className={`${actualCount - adjustModalMat.current_stock >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-mono`}>
                  {actualCount - adjustModalMat.current_stock > 0 ? '+' : ''}
                  {(actualCount - adjustModalMat.current_stock).toFixed(2)} {adjustModalMat.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 text-xs">Lý do điều chỉnh kiểm kê:</label>
              <input
                type="text"
                value={adjustReason}
                onChange={e => setAdjustReason(e.target.value)}
                placeholder="Ví dụ: Hao hụt tự nhiên trong quá trình sơ chế..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setAdjustModalMat(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs">Hủy</button>
              <button
                onClick={handleConfirmAdjust}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
              >
                Lưu Thay Đổi Kiểm Kê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
