import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatToGMT7 } from '../utils/dateUtils';
import {
  ClipboardList,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldAlert,
  Lock
} from 'lucide-react';

export default function ChefPRView() {
  const { purchaseRequests, materials, createPurchaseRequest, currentUser } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isChef = currentUser?.role === 'CHEF';

  // Form state
  const [title, setTitle] = useState('');
  const [supplierId, setSupplierId] = useState('sup-1');
  const [supplierName, setSupplierName] = useState('Công ty CP Chăn nuôi C.P. Việt Nam');
  const [items, setItems] = useState([
    { material_id: materials[0]?.id || 'mat-1', quantity: 10, unit_price: 120000 }
  ]);
  const [note, setNote] = useState('');

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { material_id: materials[0]?.id || 'mat-1', quantity: 5, unit_price: 50000 }
    ]);
  };

  const handleRemoveItem = (index) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateItem = (index, field, value) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        const updated = { ...item, [field]: value };
        if (field === 'material_id') {
          const mat = materials.find(m => m.id === value);
          if (mat) updated.unit_price = mat.avg_cost;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedItems = items.map(it => {
      const mat = materials.find(m => m.id === it.material_id);
      return {
        material_id: it.material_id,
        material_name: mat ? mat.name : 'Nguyên liệu',
        unit: mat ? mat.unit : 'kg',
        quantity: Number(it.quantity) || 1,
        unit_price: Number(it.unit_price) || 0,
        amount: (Number(it.quantity) || 1) * (Number(it.unit_price) || 0)
      };
    });

    await createPurchaseRequest({
      title,
      supplier_id: supplierId,
      supplier_name: supplierName,
      total_amount: calculateTotal(),
      items: formattedItems,
      note
    });

    setShowCreateModal(false);
    setTitle('');
    setNote('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Biểu Mẫu BM01
            </span>
            <span className="text-xs text-slate-400">Phiếu Đề Xuất Mua Hàng & Phê Duyệt Bốn Cấp</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Quản Lý & Theo Dõi Đề Xuất Mua Hàng</h2>
          {isChef ? (
            <p className="text-xs text-slate-300 mt-0.5">
              Người lập phiếu: <strong className="text-white">{currentUser.full_name} (Bếp trưởng)</strong> • Khởi tạo đề xuất mua (Cấp 1) và theo dõi tiến trình phê duyệt của TP. TCHC, Kế toán và Chủ tịch HĐT.
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
                • Thẩm quyền lập đề xuất mua hàng thuộc về <strong className="text-emerald-400">Bếp trưởng (Nguyễn Văn Đạt)</strong>
              </span>
            </div>
          )}
        </div>

        {isChef ? (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Phiếu Đề Xuất Mới (PR)</span>
          </button>
        ) : (
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Chỉ Bếp trưởng được lập PR</span>
          </span>
        )}
      </div>

      {/* List of PRs */}
      <div className="space-y-4">
        {purchaseRequests.map(pr => {
          const statusLabels = {
            PENDING_TCHC: { label: 'Đang chờ TP. TCHC duyệt (Cấp 2)', color: 'text-blue-400 bg-blue-950/60 border-blue-800' },
            PENDING_ACCOUNTANT: { label: 'Đang chờ Kế toán duyệt giá (Cấp 3)', color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
            PENDING_CHAIRMAN: { label: 'Đang chờ Chủ tịch HĐT ký chi (Cấp 4)', color: 'text-rose-400 bg-rose-950/60 border-rose-800' },
            APPROVED: { label: 'Đã phê duyệt hoàn tất (PO)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
            REJECTED: { label: 'Đã từ chối', color: 'text-slate-400 bg-slate-800 border-slate-700' }
          };
          const statusObj = statusLabels[pr.status] || { label: pr.status, color: 'text-slate-300' };

          return (
            <div key={pr.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{pr.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusObj.color}`}>
                      {statusObj.label}
                    </span>
                    {pr.po_number && (
                      <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700">
                        Đơn PO: {pr.po_number}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">{pr.title}</h3>
                  <p className="text-xs text-slate-400">
                    Nhà cung cấp: <strong className="text-white">{pr.supplier_name}</strong> • Lập lúc: {formatToGMT7(pr.created_at)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Dự toán ngân sách:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    {pr.total_amount.toLocaleString()} đ
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">Mặt hàng</th>
                      <th className="p-2.5 text-center">ĐVT</th>
                      <th className="p-2.5 text-right">Số lượng</th>
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

              {/* Stepper (Chef can only watch progress, no approval buttons!) */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    Quy trình duyệt: <strong>1. Bếp</strong> → <strong>2. TCHC</strong> → <strong>3. Kế toán</strong> → <strong>4. Chủ tịch HĐT</strong>
                  </span>
                </div>
                <span className="text-[11px] italic text-slate-500">
                  (Bếp trưởng chỉ lập đề xuất; quyền phê duyệt thuộc TP. TCHC, Kế toán và Chủ tịch)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal create PR */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Lập Phiếu Đề Xuất Mua Hàng Mới (PR)
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tiêu đề đề xuất: *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đề xuất nhập thịt sườn và gạo thơm..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nhà cung cấp đề xuất:</label>
                <select
                  value={supplierId}
                  onChange={e => {
                    setSupplierId(e.target.value);
                    setSupplierName(e.target.options[e.target.selectedIndex].text);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="sup-1">Công ty CP Chăn nuôi C.P. Việt Nam</option>
                  <option value="sup-2">Đại siêu thị Metro Thăng Long</option>
                  <option value="sup-3">Hợp tác xã Rau sạch Công nghệ cao Ba Vì</option>
                  <option value="sup-4">Công ty Thực phẩm Thực Dưỡng CTECH Food</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-slate-300 font-semibold">Danh mục nguyên vật liệu đề xuất:</label>
                  <button type="button" onClick={handleAddItem} className="text-blue-400 font-bold hover:underline">+ Thêm dòng</button>
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <select
                        value={it.material_id}
                        onChange={e => handleUpdateItem(idx, 'material_id', e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                      >
                        {materials.map(m => (
                          <option key={m.id} value={m.id}>{m.name} (Tồn: {m.current_stock} {m.unit})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        placeholder="SL"
                        value={it.quantity}
                        onChange={e => handleUpdateItem(idx, 'quantity', e.target.value)}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-right font-mono"
                      />
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        placeholder="Đơn giá"
                        value={it.unit_price}
                        onChange={e => handleUpdateItem(idx, 'unit_price', e.target.value)}
                        className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-right font-mono"
                      />
                      <span className="w-24 text-right font-mono font-bold text-emerald-400">
                        {((Number(it.quantity) || 0) * (Number(it.unit_price) || 0)).toLocaleString()} đ
                      </span>
                      {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(idx)} className="text-rose-400 p-1">✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Ghi chú / Giải trình:</label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Lý do đề xuất..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                ></textarea>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <div>
                  <span className="text-slate-400">Tổng dự toán:</span>
                  <span className="ml-2 font-bold text-emerald-400 text-sm font-mono">{calculateTotal().toLocaleString()} đ</span>
                </div>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium">Hủy</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-600/30">
                    Gửi Trình Duyệt Cấp 2 (TP. TCHC)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
