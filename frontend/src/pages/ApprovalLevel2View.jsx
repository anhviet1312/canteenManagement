import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileCheck2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function ApprovalLevel2View() {
  const { purchaseRequests, approveRequest, rejectRequest, currentUser } = useApp();

  const [selectedPR, setSelectedPR] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // STRICT RBAC: TCHC only evaluates requests pending Level 2 (PENDING_TCHC)
  const pendingRequests = purchaseRequests.filter(pr => pr.status === 'PENDING_TCHC');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Biểu Mẫu BM01
            </span>
            <span className="text-xs text-slate-400">Trưởng Phòng TCHC - Thẩm Định Nhu Cầu (Cấp 2)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Phê Duyệt Nhu Cầu & Tính Cấp Thiết (Cấp 2)</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Người phê duyệt: <strong className="text-white">{currentUser.full_name} (TP. TCHC)</strong> • Kiểm tra sự cần thiết của nguyên liệu trước khi chuyển tiếp sang Kế toán.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-800 text-blue-300 font-mono text-xs font-bold">
          {pendingRequests.length} phiếu đang chờ duyệt
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
          <p className="font-semibold text-slate-300 text-sm">Hiện tại không có đề xuất nào đang chờ duyệt Cấp 2.</p>
          <p className="text-slate-500">Tất cả các phiếu đã được thẩm định và chuyển sang phòng Kế toán.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(pr => (
            <div key={pr.id} className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{pr.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Chờ TP. TCHC duyệt nhu cầu
                    </span>
                    <span className="text-xs text-slate-400">• Người lập: <strong className="text-white">{pr.created_by}</strong></span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{pr.title}</h3>
                  <p className="text-xs text-slate-400">
                    NCC: <strong className="text-white">{pr.supplier_name}</strong> • Giải trình: <span className="italic text-slate-300">{pr.note || 'Không có'}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Dự toán ngân sách:</span>
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
                      <th className="p-2.5 text-right">Số lượng đề xuất</th>
                      <th className="p-2.5 text-right">Đơn giá dự kiến</th>
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

              {/* Action Buttons for TCHC */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
                  Sau khi duyệt, phiếu sẽ chuyển thẳng sang Kế toán trưởng thẩm định giá.
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPR(pr);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold transition"
                  >
                    Từ chối
                  </button>

                  <button
                    onClick={() => approveRequest(pr.id, "Xác nhận tính cấp thiết và phê duyệt nhu cầu Cấp 2")}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Phê Duyệt Nhu Cầu (Cấp 2)</span>
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
              Từ Chối Đề Xuất {selectedPR.id}
            </h3>
            <p className="text-xs text-slate-300">Nhập lý do từ chối để Bếp trưởng nắm được thông tin điều chỉnh:</p>
            <textarea
              rows="3"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Nhu cầu sườn heo quá lớn so với số lượng suất ăn tuần tới..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs">Hủy</button>
              <button
                onClick={() => {
                  rejectRequest(selectedPR.id, rejectReason || "Không chấp thuận nhu cầu");
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
