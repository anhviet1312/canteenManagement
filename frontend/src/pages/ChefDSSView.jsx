import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import {
  BrainCircuit,
  Sparkles,
  Users2,
  Layers,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function ChefDSSView() {
  const { createPurchaseRequest, setActiveTab } = useApp();

  const [safetyFactor, setSafetyFactor] = useState(1.0);
  const [studentDemandGrowth, setStudentDemandGrowth] = useState(1.1);
  const [dssData, setDssData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch DSS calculation from FastAPI
  useEffect(() => {
    let isMounted = true;
    const fetchDSS = async () => {
      try {
        setLoading(true);
        const data = await apiClient.calculateDSS(safetyFactor, studentDemandGrowth);
        if (isMounted) setDssData(data);
      } catch (err) {
        console.error("Lỗi tính toán DSS:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDSS();
    return () => { isMounted = false; };
  }, [safetyFactor, studentDemandGrowth]);

  const results = dssData?.results || [];
  const recommendedItems = results.filter(r => r.q_recommend > 0);
  const totalCost = recommendedItems.reduce((sum, r) => sum + r.cost_estimate, 0);

  const handle1ClickCreatePR = async () => {
    if (recommendedItems.length === 0) return;

    const prPayload = {
      title: `[DSS Auto] Đề xuất nhập nguyên vật liệu theo dự báo ngày mai (${recommendedItems.length} mặt hàng)`,
      supplier_id: "sup-1",
      supplier_name: "Công ty CP Chăn nuôi C.P. Việt Nam",
      total_amount: totalCost,
      items: recommendedItems.map(r => ({
        material_id: r.material_id,
        material_name: r.material_name,
        unit: r.unit,
        quantity: r.q_recommend,
        unit_price: r.avg_cost,
        amount: r.cost_estimate
      })),
      note: `Hệ thống DSS tự động tính toán dựa trên ${dssData?.ctool_count || 85} suất ăn Ctool và mức tồn an toàn ${safetyFactor * 100}%.`
    };

    await createPurchaseRequest(prPayload);
    setActiveTab('chef_pr');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Decision Support System (DSS)
            </span>
            <span className="text-xs text-slate-400">Hỗ Trợ Ra Quyết Định Nhập Hàng</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Mô Hình Dự Báo & Tối Ưu Tồn Kho Bếp</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Áp dụng thuật toán $Q = \max\left(0, D_{ctool} + D_{hssv} + SS - I_{current} - Q_{incoming}\right)$ giải quyết bài toán chống lãng phí thực phẩm tươi.
          </p>
        </div>

        <button
          disabled={recommendedItems.length === 0}
          onClick={handle1ClickCreatePR}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2"
        >
          <BrainCircuit className="w-4 h-4" />
          <span>1-Click Chuyển Thành Đề Xuất Mua Hàng ({recommendedItems.length} mặt hàng)</span>
        </button>
      </div>

      {/* Controller Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs">
        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Users2 className="w-4 h-4 text-blue-400" /> Suất Ăn CBNV (Ctool)
            </span>
            <span className="font-mono text-emerald-400 font-bold">{dssData?.ctool_count || 85} suất</span>
          </div>
          <p className="text-[11px] text-slate-400">Số lượng cán bộ nhân viên đã đăng ký suất ăn</p>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-white">
              <Layers className="w-4 h-4 text-cyan-400" /> Hệ Số Tồn An Toàn (SS)
            </span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(safetyFactor * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.1"
            value={safetyFactor}
            onChange={e => setSafetyFactor(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Tiết kiệm (80%)</span>
            <span>Chuẩn (100%)</span>
            <span>Dự phòng cao (150%)</span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-white">
              <TrendingUp className="w-4 h-4 text-amber-400" /> Dự Báo Sinh Viên
            </span>
            <span className="font-mono text-amber-400 font-bold">
              {studentDemandGrowth >= 1 ? `+${Math.round((studentDemandGrowth - 1) * 100)}%` : `-${Math.round((1 - studentDemandGrowth) * 100)}%`}
            </span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.4"
            step="0.05"
            value={studentDemandGrowth}
            onChange={e => setStudentDemandGrowth(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Mùa thi (-20%)</span>
            <span>Bình thường</span>
            <span>Có hội thảo (+40%)</span>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs">
          <div>
            <h3 className="font-bold text-white text-sm">Bảng Gợi Ý Số Lượng Cần Mua</h3>
            <p className="text-slate-400">Tổng dự toán khuyến nghị: <strong className="text-emerald-400">{totalCost.toLocaleString()} đ</strong></p>
          </div>
          {loading && <span className="text-xs text-cyan-400 font-mono">Đang tính toán qua Python API...</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Nguyên Vật Liệu</th>
                <th className="p-3 text-right">Tồn Hiện Tại (I)</th>
                <th className="p-3 text-right">Nhu Cầu Ctool (D1)</th>
                <th className="p-3 text-right">Dự Báo HSSV (D2)</th>
                <th className="p-3 text-right">Tồn An Toàn (SS)</th>
                <th className="p-3 text-right">Đang Giao (PO)</th>
                <th className="p-3 text-center">Trạng Thái DSS</th>
                <th className="p-3 text-right">Khuyến Nghị Nhập (Q)</th>
                <th className="p-3 text-right">Dự Toán Chi Phí</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {results.map((r, idx) => (
                <tr key={idx} className={`hover:bg-slate-800/40 ${r.priority === 'CRITICAL' ? 'bg-rose-950/20' : ''}`}>
                  <td className="p-3 font-semibold text-white">{r.material_name}</td>
                  <td className="p-3 text-right font-mono font-bold text-white">{r.current_stock} {r.unit}</td>
                  <td className="p-3 text-right font-mono text-blue-400">{r.ctool_demand} {r.unit}</td>
                  <td className="p-3 text-right font-mono text-amber-400">{r.student_demand} {r.unit}</td>
                  <td className="p-3 text-right font-mono text-slate-400">{r.safety_stock} {r.unit}</td>
                  <td className="p-3 text-right font-mono text-cyan-400">{r.incoming > 0 ? `+${r.incoming}` : '0'} {r.unit}</td>
                  <td className="p-3 text-center">
                    {r.priority === 'CRITICAL' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        🔴 Thiếu hụt nghiêm trọng
                      </span>
                    ) : r.priority === 'REORDER' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        🟡 Cần nhập bổ sung
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        🟢 Đầy đủ an toàn
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-sm">
                    {r.q_recommend > 0 ? (
                      <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700">
                        {r.q_recommend} {r.unit}
                      </span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-200">
                    {r.q_recommend > 0 ? `${r.cost_estimate.toLocaleString()} đ` : '—'}
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
