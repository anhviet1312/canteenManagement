import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users2, RefreshCw, Fingerprint, CheckCircle2, Clock, Search, Building2 } from 'lucide-react';

export default function CtoolMonitorView() {
  const { ctoolMeals, toggleMealServed, syncWithCtool, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const totalMeals = ctoolMeals.length;
  const servedCount = ctoolMeals.filter(m => m.is_served).length;
  const standardCount = ctoolMeals.filter(m => m.meal_type === 'STANDARD').length;
  const vegetarianCount = ctoolMeals.filter(m => m.meal_type === 'VEGETARIAN').length;
  const checkedInCount = ctoolMeals.filter(m => m.biometric_verified).length;

  const filteredMeals = ctoolMeals.filter(m => {
    const matchSearch =
      m.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.staff_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (filterType === 'ALL') return true;
    if (filterType === 'STANDARD') return m.meal_type === 'STANDARD';
    if (filterType === 'VEGETARIAN') return m.meal_type === 'VEGETARIAN';
    if (filterType === 'SERVED') return m.is_served;
    if (filterType === 'NOT_SERVED') return !m.is_served;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Tích Hợp Hệ Sinh Thái CTECH
            </span>
            <span className="text-xs text-slate-400">CTool ERP & Biometric Machine Integration</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Giám Sát Suất Ăn Cán Bộ Giảng Viên & Điểm Danh Vân Tay</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Dữ liệu kết nối tự động từ máy chấm công buổi sáng giúp Bếp trưởng chuẩn bị đúng số lượng nấu, tránh lãng phí.
          </p>
        </div>

        <button
          onClick={syncWithCtool}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Đồng Bộ API Ctool Ngay</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Tổng Suất Đăng Ký Ăn Trưa:</span>
          <div className="text-2xl font-bold text-white font-mono">{totalMeals} suất</div>
          <p className="text-[11px] text-slate-500">Chốt trước 09h30 sáng trên Ctool</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Đã Quét Chấm Công Sáng:</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">{checkedInCount} / {totalMeals}</div>
          <p className="text-[11px] text-slate-500">Máy vân tay các sảnh tầng</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Phân Loại Suất Ăn:</span>
          <div className="text-sm font-bold text-white flex items-center gap-2 pt-1 font-mono">
            <span className="text-blue-400">{standardCount} mặn</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">{vegetarianCount} chay</span>
          </div>
          <p className="text-[11px] text-slate-500">Bếp trưởng chuẩn bị khay riêng</p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-slate-400">Đã Nhận Suất Trưa:</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {servedCount} / {totalMeals} <span className="text-xs text-slate-400 font-normal">({Math.round((servedCount / totalMeals) * 100 || 0)}%)</span>
          </div>
          <p className="text-[11px] text-slate-500">Đã quẹt thẻ tại quầy phục vụ</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 text-xs">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo Mã CB, Họ tên, Phòng ban..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-1.5 overflow-x-auto">
            {['ALL', 'NOT_SERVED', 'SERVED', 'STANDARD', 'VEGETARIAN'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterType === tab ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'ALL' ? 'Tất cả' : tab === 'NOT_SERVED' ? 'Chưa nhận' : tab === 'SERVED' ? 'Đã nhận' : tab === 'STANDARD' ? 'Suất Tiêu chuẩn' : 'Suất Chay'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Mã CBNV</th>
                <th className="p-3">Họ và Tên</th>
                <th className="p-3">Khoa / Phòng Ban</th>
                <th className="p-3">Loại Suất Ăn</th>
                <th className="p-3">Giờ Điểm Danh Vân Tay</th>
                <th className="p-3 text-center">Trạng Thái Nhận Suất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredMeals.map(staff => (
                <tr key={staff.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-400">{staff.staff_code}</td>
                  <td className="p-3 font-semibold text-white">{staff.staff_name}</td>
                  <td className="p-3 text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {staff.department}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      staff.meal_type === 'VEGETARIAN' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {staff.meal_type_name}
                    </span>
                  </td>
                  <td className="p-3 font-mono">
                    {staff.biometric_verified ? (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <Fingerprint className="w-3.5 h-3.5 text-emerald-400" />
                        {staff.check_in_time}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Chưa chấm công</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {staff.is_served ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Đã nhận ({staff.serve_time || '11:40'})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        Chưa nhận suất
                      </span>
                    )}
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
