import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ApprovalLevel3View() {
  const { purchaseRequests, approveRequest, rejectRequest, currentUser } = useApp();

  const [selectedPR, setSelectedPR] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // STRICT RBAC: Accountant only evaluates requests pending Level 3 (PENDING_ACCOUNTANT)
  const pendingRequests = purchaseRequests.filter(pr => pr.status === 'PENDING_ACCOUNTANT');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phân Hệ Kế Toán Trưởng
            </span>
            <span className="text-xs text-slate-400">Level 3 Budget & Pricing Audit</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Thẩm Định Đơn Giá Nhà Cung Cấp & Ngân Sách (Cấp 3)</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Người phê duyệt: <strong className="text-white">{currentUser.full_name} (Kế toán trưởng)</strong> • Kiểm soát đối chiếu đơn giá hợp đồng khung và hạn mức chi trước khi trình Chủ tịch HĐT.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-800 text-amber-300 font-mono text-xs font-bold">
          {pendingRequests.length} phiếu đang chờ thẩm định
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
          <p className="font-semibold text-slate-300 text-sm">Không có đề xuất nào đang chờ thẩm định đơn giá Cấp 3.</p>
          <p className="text-slate-500">Tất cả các phiếu đã được Kế toán duyệt hoặc chưa đến cấp này.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(pr => (
            <div key={pr.id} className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{pr.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Chờ Kế toán duyệt giá & ngân sách
                    </span>
                    <span className="text-xs text-slate-400">• Đã qua duyệt Cấp 2 bởi TP. TCHC</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{pr.title}</h3>
                  <p className="text-xs text-slate-400">
                    Đối tác cung cấp: <strong className="text-white">{pr.supplier_name}</strong> • Người lập: {pr.created_by}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Tổng ngân sách xin chuẩn chi:</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {pr.total_amount.toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* Items detail */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Mặt hàng</th>
                      <th className="p-2.5 text-center">ĐVT</th>
                      <th className="p-2.5 text-right">Số lượng</th>
                      <th className="p-2.5 text-right">Đơn giá hợp đồng</th>
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

              {/* Action Buttons for Accountant */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Đơn giá khớp hợp đồng khung. Sau khi duyệt sẽ chuyển tới Chủ tịch Hội đồng trường ký chi.
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPR(pr);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold transition"
                  >
                    Yêu cầu đàm phán lại
                  </button>

                  <button
                    onClick={() => approveRequest(pr.id, "Đơn giá khớp hợp đồng và nằm trong hạn mức ngân sách tuần")}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Phê Duyệt Đơn Giá & Ngân Sách (Cấp 3)</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPR && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-400" />
              Yêu Cầu Thương Thảo Lại {selectedPR.id}
            </h3>
            <p className="text-xs text-slate-300">Nhập lý do tài chính để Bếp trưởng và NCC điều chỉnh giá:</p>
            <textarea
              rows="3"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Đơn giá thịt bò tăng cao hơn 10% so với cam kết quý 4..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs">Hủy</button>
              <button
                onClick={() => {
                  rejectRequest(selectedPR.id, rejectReason || "Đơn giá vượt khung ngân sách");
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Xác Nhận Từ Chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
