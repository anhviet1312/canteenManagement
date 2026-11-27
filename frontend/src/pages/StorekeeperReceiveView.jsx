import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getVNDateString } from '../utils/dateUtils';
import { PackageCheck, ArrowDownToLine, CheckCircle2, Calendar, ShieldAlert, Eye, Lock } from 'lucide-react';

export default function StorekeeperReceiveView() {
  const { purchaseRequests, receiveGoodsIntoWarehouse, currentUser } = useApp();

  const [selectedPO, setSelectedPO] = useState(null);
  const [batchInputs, setBatchInputs] = useState({});

  const isStorekeeper = currentUser?.role === 'STOREKEEPER';

  // Filter: ONLY POs approved by Chairman that are pending physical receipt in warehouse
  const pendingReceiptPOs = purchaseRequests.filter(
    pr => pr.status === 'APPROVED' && pr.warehouse_status === 'PENDING_RECEIPT'
  );

  const handleOpenReceiptModal = (pr) => {
    setSelectedPO(pr);
    const initialInputs = {};
    pr.items?.forEach(item => {
      initialInputs[item.material_id] = {
        lot_code: `LOT-${getVNDateString().replace(/-/g, '')}-${item.material_name.slice(0, 3).toUpperCase()}`,
        exp_date: getVNDateString(5)
      };
    });
    setBatchInputs(initialInputs);
  };

  const handleConfirmReceive = async () => {
    if (!selectedPO) return;
    await receiveGoodsIntoWarehouse(selectedPO.id, batchInputs);
    setSelectedPO(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Phân Hệ Thủ Kho (WMS)
            </span>
            <span className="text-xs text-slate-400">Goods Receipt & PO Fulfillment</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Tiếp Nhận Đơn Mua Hàng Từ PO Đã Phê Duyệt 4 Cấp</h2>
          {isStorekeeper ? (
            <p className="text-xs text-slate-300 mt-0.5">
              Thủ kho: <strong className="text-white">{currentUser.full_name}</strong> • Kiểm đếm thực tế, ghi nhận Mã Lô sản xuất và Hạn sử dụng (EXP) vào hệ thống kho.
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
                • Nghiệp vụ nhập kho thực tế thuộc thẩm quyền của <strong className="text-cyan-400">Thủ kho (Bùi Đức Thắng)</strong>
              </span>
            </div>
          )}
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold">
          {pendingReceiptPOs.length} đơn PO sẵn sàng nhận hàng
        </span>
      </div>

      {pendingReceiptPOs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
          <p className="font-semibold text-slate-300 text-sm">Hiện không có đơn PO nào đang chờ tiếp nhận.</p>
          <p className="text-slate-500">Tất cả các đơn mua hàng đã được thủ kho nhập vào hệ thống đầy đủ.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReceiptPOs.map(pr => (
            <div key={pr.id} className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                      Đơn PO: {pr.po_number}
                    </span>
                    <span className="text-xs text-slate-400">Mã đề xuất: {pr.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Chủ tịch HĐT đã ký duyệt chi
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{pr.title}</h3>
                  <p className="text-xs text-slate-400">
                    Nhà cung cấp giao hàng: <strong className="text-white">{pr.supplier_name}</strong> • Tổng giá trị: <span className="text-emerald-400 font-bold">{pr.total_amount.toLocaleString()} đ</span>
                  </p>
                </div>

                {isStorekeeper ? (
                  <button
                    onClick={() => handleOpenReceiptModal(pr)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center space-x-2"
                  >
                    <ArrowDownToLine className="w-4 h-4" />
                    <span>Tiếp Nhận & Nhập Kho Ngay</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenReceiptModal(pr)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 shadow-sm"
                      title="Xem mẫu biên bản nhập kho thực tế"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Xem Mẫu Nhập Kho</span>
                    </button>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Chỉ Thủ kho được nhập</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Items in PO */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Mặt hàng</th>
                      <th className="p-2.5 text-center">ĐVT</th>
                      <th className="p-2.5 text-right">Khối lượng đặt mua</th>
                      <th className="p-2.5 text-right">Đơn giá</th>
                      <th className="p-2.5 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {pr.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-white">{it.material_name}</td>
                        <td className="p-2.5 text-center text-slate-400">{it.unit}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-white">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono text-slate-300">{it.unit_price.toLocaleString()} đ</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">{it.amount.toLocaleString()} đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Xác nhận Nhập kho & Ghi nhận Lô Hàng */}
      {selectedPO && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
                  Biên Bản Nhập Kho Thực Tế - PO #{selectedPO.po_number}
                  {!isStorekeeper && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Chế độ Xem Trước
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">Thủ kho kiểm đếm thực tế, ghi nhận Mã Lô xuất xứ và Hạn sử dụng (EXP) cho từng nguyên liệu.</p>
              </div>
              <button onClick={() => setSelectedPO(null)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <div className="space-y-3">
              {selectedPO.items?.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{item.material_name}</span>
                    <span className="text-emerald-400 font-mono font-bold">SL thực nhận: {item.quantity} {item.unit}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-slate-400 block mb-1">Mã Lô Sản Xuất (Batch Code):</label>
                      <input
                        type="text"
                        disabled={!isStorekeeper}
                        value={batchInputs[item.material_id]?.lot_code || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setBatchInputs(prev => ({
                            ...prev,
                            [item.material_id]: { ...prev[item.material_id], lot_code: val }
                          }));
                        }}
                        className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono ${!isStorekeeper ? 'opacity-60 cursor-not-allowed bg-slate-950' : ''}`}
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Hạn Sử Dụng (Expiry Date):</label>
                      <input
                        type="date"
                        disabled={!isStorekeeper}
                        value={batchInputs[item.material_id]?.exp_date || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setBatchInputs(prev => ({
                            ...prev,
                            [item.material_id]: { ...prev[item.material_id], exp_date: val }
                          }));
                        }}
                        className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono ${!isStorekeeper ? 'opacity-60 cursor-not-allowed bg-slate-950' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-slate-800">
              <div>
                {!isStorekeeper && (
                  <p className="text-xs text-amber-400 flex items-center gap-1.5 font-medium">
                    <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    Vui lòng đăng nhập tài khoản Thủ kho (Bùi Đức Thắng) để thực hiện nhập kho thực tế.
                  </p>
                )}
              </div>
              <div className="flex space-x-2 ml-auto">
                <button onClick={() => setSelectedPO(null)} className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold">
                  {isStorekeeper ? 'Hủy bỏ' : 'Đóng xem trước'}
                </button>
                {isStorekeeper ? (
                  <button
                    onClick={handleConfirmReceive}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xác Nhận Tiếp Nhận & Nhập Kho</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed rounded-xl text-xs font-bold flex items-center space-x-1.5 opacity-60"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Không có quyền nhập kho</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
