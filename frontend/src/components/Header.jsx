import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  RefreshCw,
  Database,
  CheckCircle2,
  Clock,
  UserCheck,
  LogOut
} from 'lucide-react';

export default function Header() {
  const {
    currentUser,
    logout,
    ROLES,
    ctoolMeals,
    syncWithCtool,
    loading
  } = useApp();

  const roleConfig = ROLES[currentUser?.role] || ROLES.CHEF;
  const servedMeals = ctoolMeals.filter(m => m.is_served).length;

  const canSyncCtool = ['CHEF', 'TCHC', 'ADMIN'].includes(currentUser?.role);

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Brand & System Info */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-lg">
          CT
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-white tracking-wide">
              CTECH CANTEEN MIS
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Trực Tuyến
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-slate-500" />
            Trường Cao đẳng CTECH • Phân quyền Nghiêm ngặt theo Role
          </p>
        </div>
      </div>

      {/* Center Live Badges */}
      <div className="hidden xl:flex items-center space-x-4 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-medium">Kết nối:</span>
          <span className="text-emerald-400 font-semibold">Ổn định</span>
        </div>

        <div className="h-3 w-px bg-slate-700"></div>

        <div className="flex items-center space-x-1.5 text-slate-300">
          <span>Suất ăn Ctool:</span>
          <span className="text-cyan-400 font-bold">{servedMeals}/{ctoolMeals.length} đã nhận</span>
        </div>

        {canSyncCtool && (
          <>
            <div className="h-3 w-px bg-slate-700"></div>
            <button
              onClick={syncWithCtool}
              className="text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition"
              title="Đồng bộ API Ctool & Máy chấm công thời gian thực"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Đồng bộ 09:30</span>
            </button>
          </>
        )}
      </div>

      {/* Logged in User Profile & Logout */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-300 uppercase">
            {currentUser?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                {currentUser?.full_name}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleConfig.badge}`}>
                {roleConfig.name}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {currentUser?.department || 'Trường CTECH'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 border border-slate-700 hover:border-rose-600/60 text-slate-300 hover:text-rose-200 transition text-xs font-semibold shadow group"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition" />
          <span className="hidden sm:inline font-medium">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
