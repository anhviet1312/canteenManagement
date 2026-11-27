import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import {
  ClipboardCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  Building,
  UserCheck,
  ShieldAlert,
  Lock
} from 'lucide-react';

export default function StorekeeperAuditBM03View() {
  const { materials, refreshAll, showNotification, currentUser } = useApp();
  const isStorekeeper = currentUser?.role === 'STOREKEEPER';
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL | MATCHED | VARIANCE

  // Modal State for New Audit Entry
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [lotCodeInput, setLotCodeInput] = useState('');
  const [actualQty, setActualQty] = useState('');
  const [auditReason, setAuditReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Print Mode State
  const [isPrinting, setIsPrinting] = useState(false);

  // Audit Records State (initialized with BM03 standard records mapped to batches/materials)
  const [auditRecords, setAuditRecords] = useState([
    {
      id: 'audit-1',
      stt: 1,
      lot_code: 'L2611-01',
      material_id: 'mat-4',
      name: 'Gạo thơm ST25 CTECH (Bắc Hương)',
      unit: 'Kg',
      book_qty: 85.0,
      actual_qty: 84.5,
      variance: -0.5,
      reason: 'Hao hụt cân đong tự nhiên trong quá trình chia suất',
      status: 'VERIFIED',
      verified_by: 'Bùi Đức Thắng'
    },
    {
      id: 'audit-2',
      stt: 2,
      lot_code: 'L2611-08',
      material_id: 'mat-1',
      name: 'Thịt sườn heo tươi C.P',
      unit: 'Kg',
      book_qty: 18.5,
      actual_qty: 18.5,
      variance: 0.0,
      reason: 'Khớp 100% số liệu thực tế (Bảo quản lạnh tốt)',
      status: 'VERIFIED',
      verified_by: 'Bùi Đức Thắng'
    },
    {
      id: 'audit-3',
      stt: 3,
      lot_code: 'L2611-12',
      material_id: 'mat-6',
      name: 'Rau cải ngọt Ba Vì',
      unit: 'Kg',
      book_qty: 6.5,
      actual_qty: 5.2,
      variance: -1.3,
      reason: 'Hỏng dập lá & loại bỏ gốc úa trong quá trình bảo quản',
      status: 'VERIFIED',
      verified_by: 'Bùi Đức Thắng'
    },
    {
      id: 'audit-4',
      stt: 4,
      lot_code: 'L2611-15',
      material_id: 'mat-5',
      name: 'Trứng gà Ba Huân',
      unit: 'Quả',
      book_qty: 180,
      actual_qty: 178,
      variance: -2,
      reason: 'Bể vỡ 2 quả khi xếp dỡ bảo quản khay',
      status: 'VERIFIED',
      verified_by: 'Bùi Đức Thắng'
    },
    {
      id: 'audit-5',
      stt: 5,
      lot_code: 'L2611-20',
      material_id: 'mat-8',
      name: 'Dầu thực vật Neptune (Can 5L)',
      unit: 'Can',
      book_qty: 6,
      actual_qty: 6,
      variance: 0,
      reason: 'Khớp số liệu nguyên niêm phong nhà máy',
      status: 'VERIFIED',
      verified_by: 'Bùi Đức Thắng'
    }
  ]);

  // Load live batches from API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getBatches();
      setBatches(data || []);
    } catch (err) {
      console.error("Lỗi tải danh sách lô kho:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Filtered records
  const filteredRecords = auditRecords.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lot_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (filterType === 'MATCHED') return item.variance === 0;
    if (filterType === 'VARIANCE') return item.variance !== 0;
    return true;
  });

  // Calculate KPIs
  const totalItems = auditRecords.length;
  const matchedItems = auditRecords.filter(r => r.variance === 0).length;
  const varianceItems = auditRecords.filter(r => r.variance !== 0).length;

  const handleOpenAdjust = (rec) => {
    setIsEditingMode(true);
    setSelectedMaterial(rec);
    setLotCodeInput(rec.lot_code);
    setActualQty(rec.actual_qty.toString());
    setAuditReason(rec.reason || '');
    setShowAdjustModal(true);
  };

  const handleOpenCreate = () => {
    setIsEditingMode(false);
    if (materials.length > 0) {
      const firstMat = materials[0];
      const matBatches = batches.filter(b => b.material_id === firstMat.id);
      const autoLot = matBatches.length > 0 ? matBatches[0].lot_code : `L2611-${firstMat.code.replace('NVL-', '')}`;
      setSelectedMaterial({
        material_id: firstMat.id,
        name: firstMat.name,
        unit: firstMat.unit,
        book_qty: firstMat.current_stock
      });
      setLotCodeInput(autoLot);
      setActualQty(firstMat.current_stock.toString());
      setAuditReason('Kiểm kê định kỳ');
    }
    setShowAdjustModal(true);
  };

  const handleSaveAdjust = async (e) => {
    e.preventDefault();
    if (!selectedMaterial || actualQty === '') return;

    try {
      setIsSubmitting(true);
      const newActual = Number(actualQty);
      const newVariance = Math.round((newActual - selectedMaterial.book_qty) * 100) / 100;

      // Update backend stock if material_id exists
      if (selectedMaterial.material_id) {
        await apiClient.adjustStock(
          selectedMaterial.material_id,
          newActual,
          auditReason || 'Kiểm kê định kỳ BM03'
        );
      }

      if (isEditingMode) {
        // Update existing record
        setAuditRecords(prev => prev.map(item => {
          if (item.id === selectedMaterial.id) {
            return {
              ...item,
              lot_code: lotCodeInput || item.lot_code,
              actual_qty: newActual,
              variance: newVariance,
              reason: auditReason,
              verified_by: currentUser?.full_name || 'Bùi Đức Thắng'
            };
          }
          return item;
        }));
      } else {
        // Create new record in audit table
        const newRecord = {
          id: `audit-${Date.now()}`,
          stt: auditRecords.length + 1,
          lot_code: lotCodeInput || `L2611-${Math.floor(Math.random() * 90 + 10)}`,
          material_id: selectedMaterial.material_id,
          name: selectedMaterial.name,
          unit: selectedMaterial.unit,
          book_qty: selectedMaterial.book_qty,
          actual_qty: newActual,
          variance: newVariance,
          reason: auditReason || (newVariance === 0 ? 'Khớp số liệu kiểm đếm' : 'Chênh lệch kiểm kê'),
          status: 'VERIFIED',
          verified_by: currentUser?.full_name || 'Bùi Đức Thắng'
        };
        setAuditRecords(prev => [newRecord, ...prev]);
      }

      showNotification(
        isEditingMode
          ? 'Đã cập nhật biên bản kiểm kê và đồng bộ tồn kho!'
          : 'Đã thêm dòng kiểm kê mới vào Biểu mẫu BM03 và đồng bộ tồn kho!',
        'success'
      );
      setShowAdjustModal(false);
      refreshAll();
    } catch (err) {
      showNotification(`Lỗi cập nhật: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Biểu Mẫu BM03
            </span>
            <span className="text-xs text-slate-400">Phiếu Kiểm Kê Kho & Xử Lý Chênh Lệch Định Kỳ</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Biên Bản Kiểm Kê Thực Tế & Đối Soát Số Sách</h2>
          {isStorekeeper ? (
            <p className="text-xs text-slate-300 mt-0.5">
              Quy chuẩn theo BM03 phục vụ đối soát giữa Thủ kho, Bếp trưởng và Phòng Kế toán theo nguyên tắc: Tồn thực tế vs Tồn sổ sách.
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
                • Thẩm quyền lập biên bản kiểm kê thuộc về <strong className="text-cyan-400">Thủ kho (Bùi Đức Thắng)</strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5 shadow"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>In Phiếu BM03</span>
          </button>
          {isStorekeeper ? (
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Dòng Kiểm Kê Mới</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Chỉ Thủ kho được tạo dòng kiểm kê</span>
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400 font-medium">Tổng Mặt Hàng Đã Kiểm Kê:</span>
          <div className="text-2xl font-bold text-white font-mono">{totalItems} mặt hàng</div>
          <p className="text-[11px] text-slate-500">Đợt kiểm kê kỳ cuối tháng 11/2026</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400 font-medium">Khớp Hoàn Toàn Số Sách:</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{matchedItems} mặt hàng</div>
          <p className="text-[11px] text-emerald-500/80">✓ Không phát hiện hao hụt bất thường</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400 font-medium">Phát Hiện Chênh Lệch / Hao Hụt:</span>
          <div className="text-2xl font-bold text-amber-400 font-mono">{varianceItems} mặt hàng</div>
          <p className="text-[11px] text-amber-500/80">Đã ghi rõ nguyên nhân & giải trình bên dưới</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo mã lô, tên nguyên liệu hoặc nguyên nhân..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'ALL' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả ({auditRecords.length})
            </button>
            <button
              onClick={() => setFilterType('MATCHED')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'MATCHED' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Khớp số liệu ({matchedItems})
            </button>
            <button
              onClick={() => setFilterType('VARIANCE')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterType === 'VARIANCE' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Có chênh lệch ({varianceItems})
            </button>
          </div>
        </div>

        {/* Master Table BM03 */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3 text-center w-12">STT</th>
                <th className="p-3">Mã Lô</th>
                <th className="p-3">Tên Hàng Hóa / Nguyên Liệu</th>
                <th className="p-3 text-center">ĐVT</th>
                <th className="p-3 text-right">Tồn Sổ Sách</th>
                <th className="p-3 text-right">Tồn Thực Tế</th>
                <th className="p-3 text-right">Chênh Lệch</th>
                <th className="p-3">Nguyên Nhân / Ghi Chú Xử Lý</th>
                <th className="p-3 text-center">Người Đối Soát</th>
                <th className="p-3 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-500">
                    Không tìm thấy dòng kiểm kê nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-cyan-300">{r.lot_code}</td>
                    <td className="p-3 font-semibold text-white">{r.name}</td>
                    <td className="p-3 text-center text-slate-400">{r.unit}</td>
                    <td className="p-3 text-right font-mono text-slate-300 font-bold">
                      {r.book_qty.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono text-white font-bold bg-slate-950/40">
                      {r.actual_qty.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">
                      {r.variance === 0 ? (
                        <span className="text-emerald-400">0</span>
                      ) : r.variance > 0 ? (
                        <span className="text-blue-400">+{r.variance}</span>
                      ) : (
                        <span className="text-rose-400">{r.variance}</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs">
                      {r.variance === 0 ? (
                        <span className="text-emerald-400/90 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {r.reason}
                        </span>
                      ) : (
                        <span className="text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {r.reason}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center text-slate-400 font-medium">
                      {r.verified_by}
                    </td>
                    <td className="p-3 text-center">
                      {isStorekeeper ? (
                        <button
                          onClick={() => handleOpenAdjust(r)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition"
                        >
                          Sửa số liệu
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Chỉ xem</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 3-Party Signatures representation according to CTECH standard */}
        <div className="pt-4 border-t border-slate-800/80 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 font-semibold mb-1">NGƯỜI LẬP BIÊN BẢN (THỦ KHO)</p>
            <p className="text-white font-bold">Bùi Đức Thắng</p>
            <p className="text-[10px] text-emerald-400 mt-1">✓ Đã kiểm đếm thực tế tại kho</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 font-semibold mb-1">BẾP TRƯỞNG XÁC NHẬN</p>
            <p className="text-white font-bold">Nguyễn Văn Đạt</p>
            <p className="text-[10px] text-emerald-400 mt-1">✓ Đã đối chiếu định mức tiêu hao</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 font-semibold mb-1">KẾ TOÁN TRƯỞNG THẨM ĐỊNH</p>
            <p className="text-white font-bold">Lê Hoàng Long</p>
            <p className="text-[10px] text-emerald-400 mt-1">✓ Đã ghi nhận sổ sách kế toán kho</p>
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                Cập Nhật Kiểm Kê (BM03)
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <form onSubmit={handleSaveAdjust} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {isEditingMode ? 'Nguyên vật liệu & Mã lô:' : 'Chọn Nguyên vật liệu kiểm kê:'}
                </label>
                {isEditingMode ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-semibold text-white flex items-center justify-between">
                    <span>{selectedMaterial.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">{selectedMaterial.lot_code}</span>
                  </div>
                ) : (
                  <select
                    value={selectedMaterial?.material_id || ''}
                    onChange={(e) => {
                      const mat = materials.find(m => m.id === e.target.value);
                      if (mat) {
                        const matBatches = batches.filter(b => b.material_id === mat.id);
                        const autoLot = matBatches.length > 0 ? matBatches[0].lot_code : `L2611-${mat.code.replace('NVL-', '')}`;
                        setSelectedMaterial({
                          material_id: mat.id,
                          name: mat.name,
                          unit: mat.unit,
                          book_qty: mat.current_stock
                        });
                        setLotCodeInput(autoLot);
                        setActualQty(mat.current_stock.toString());
                        setAuditReason('Kiểm kê định kỳ khớp số liệu');
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500 shadow-inner"
                  >
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.code}) — Tồn sổ sách: {m.current_stock} {m.unit}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {!isEditingMode && (
                <div>
                  <label className="text-slate-400 block mb-1">Mã Lô (Lot Number):</label>
                  <input
                    type="text"
                    required
                    value={lotCodeInput}
                    onChange={e => setLotCodeInput(e.target.value)}
                    placeholder="VD: L2611-01, LOT-202611-CP..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Tồn sổ sách ({selectedMaterial.unit}):</label>
                  <input
                    type="number"
                    disabled
                    value={selectedMaterial.book_qty}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 font-mono font-bold cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Tồn thực tế kiểm đếm ({selectedMaterial.unit}):</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={actualQty}
                    onChange={e => setActualQty(e.target.value)}
                    className="w-full bg-slate-950 border border-cyan-500 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {actualQty !== '' && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center font-mono">
                  <span className="text-slate-400">Chênh lệch tính toán:</span>
                  <span className={`font-bold ${
                    Number(actualQty) - selectedMaterial.book_qty === 0
                      ? 'text-emerald-400'
                      : Number(actualQty) - selectedMaterial.book_qty < 0
                      ? 'text-rose-400'
                      : 'text-blue-400'
                  }`}>
                    {Math.round((Number(actualQty) - selectedMaterial.book_qty) * 100) / 100} {selectedMaterial.unit}
                  </span>
                </div>
              )}

              <div>
                <label className="text-slate-400 block mb-1">Nguyên nhân / Giải trình chênh lệch:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Hao hụt tự nhiên, dập nát bảo quản, bể vỡ khi vận chuyển..."
                  value={auditReason}
                  onChange={e => setAuditReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-md shadow-cyan-600/30 transition flex items-center justify-center space-x-1.5"
                >
                  {isSubmitting ? (
                    <span>Đang cập nhật...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác Nhận & Lưu BM03</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
