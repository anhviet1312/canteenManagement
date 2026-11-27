import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileCheck2, CheckCircle2, XCircle, AlertCircle, PackageCheck } from 'lucide-react';

export default function ApprovalLevel4View() {
  const { purchaseRequests, approveRequest, rejectRequest, currentUser } = useApp();

  const [selectedPR, setSelectedPR] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // STRICT RBAC: Chairman only evaluates requests pending Level 4 (PENDING_CHAIRMAN)
  const pendingRequests = purchaseRequests.filter(pr => pr.status === 'PENDING_CHAIRMAN');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Biểu Mẫu BM01
            </span>
            <span className="text-xs text-slate-400">Chủ Tịch Hội Đồng Trường - Ký Phê Duyệt Chi Tối Cao (Cấp 4)</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Ký Phê Duyệt Chi Ngân Sách Tối Cao (Cấp 4)</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Lãnh đạo phê duyệt: <strong className="text-white">{currentUser.full_name} (Chủ tịch HĐT)</strong> • Khi ký duyệt, hệ thống sẽ tự động ban hành Đơn mua hàng (PO chính thức) và gửi sang Kho tiếp nhận.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 font-mono text-xs font-bold">
          {pendingRequests.length} phiếu chờ ký duyệt chi
        </span>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-400 space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-50" />
          <p className="font-semibold text-slate-300 text-sm">Không có hồ sơ nào đang chờ Chủ tịch ký duyệt chi.</p>
          <p className="text-slate-500">Tất cả các khoản chi đã được ban hành thành đơn mua hàng (PO).</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map(pr => (
            <div key={pr.id} className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-rose-400">{pr.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Chờ Chủ tịch HĐT ký chi tối cao
                    </span>
                    <span className="text-xs text-slate-400">• Đã qua thẩm định: Bếp trưởng → TP. TCHC → Kế toán trưởng</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{pr.title}</h3>
                  <p className="text-xs text-slate-400">
                    Đối tác nhận đơn: <strong className="text-white">{pr.supplier_name}</strong> • Khởi tạo: {pr.created_by}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Số tiền chuẩn chi:</span>
                  <span className="text-xl font-bold text-emerald-400 font-mono">
                    {pr.total_amount.toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* Items detail */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Mặt hàng thực phẩm</th>
                      <th className="p-2.5 text-center">ĐVT</th>
                      <th className="p-2.5 text-right">Khối lượng</th>
                      <th className="p-2.5 text-right">Đơn giá thẩm định</th>
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

              {/* Action Buttons for Chairman */}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-emerald-400" />
                  Ký duyệt sẽ ban hành mã Đơn Đặt Hàng (PO) chính thức và chuyển tiếp sang Kho tiếp nhận.
                </span>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPR(pr);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold transition"
                  >
                    Bác bỏ
                  </button>

                  <button
                    onClick={() => approveRequest(pr.id, "Phê duyệt chi ngân sách tối cao. Ban hành Đơn mua hàng PO chính thức.")}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ký Phê Duyệt Chi Hoàn Tất (Cấp 4) - Ban Hành PO</span>
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
              Bác Bỏ Đề Xuất Chi {selectedPR.id}
            </h3>
            <p className="text-xs text-slate-300">Ý kiến chỉ đạo của Chủ tịch Hội đồng trường:</p>
            <textarea
              rows="3"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Chỉ đạo điều chỉnh ngân sách..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs">Hủy</button>
              <button
                onClick={() => {
                  rejectRequest(selectedPR.id, rejectReason || "Chủ tịch HĐT không thông qua chuẩn chi");
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Xác Nhận Bác Bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
