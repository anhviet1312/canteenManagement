import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  Database,
  Server,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'CASHIER',
    roleName: 'Thu ngân / Bán hàng',
    name: 'Đặng Thùy Linh',
    username: 'linh.pos',
    password: 'pos123',
    department: 'Tổ Thu ngân Căn tin',
    badge: 'bg-indigo-900/60 text-indigo-300 border-indigo-700 hover:border-indigo-500',
    iconColor: 'text-indigo-400',
    description: 'Bán hàng POS, in hóa đơn, quét voucher Ctool'
  },
  {
    role: 'CHEF',
    roleName: 'Bếp trưởng',
    name: 'Nguyễn Văn Đạt',
    username: 'chefnvd',
    password: 'chef123',
    department: 'Tổ Bếp Căn tin',
    badge: 'bg-emerald-900/60 text-emerald-300 border-emerald-700 hover:border-emerald-500',
    iconColor: 'text-emerald-400',
    description: 'Định mức BOM, DSS dự báo, lập đề xuất PR'
  },
  {
    role: 'TCHC',
    roleName: 'Trưởng phòng TCHC',
    name: 'Trần Thị Mai',
    username: 'mai.tchc',
    password: 'tchc123',
    department: 'Phòng Tổ chức - Hành chính',
    badge: 'bg-blue-900/60 text-blue-300 border-blue-700 hover:border-blue-500',
    iconColor: 'text-blue-400',
    description: 'Duyệt nhu cầu Cấp 2, giám sát suất ăn Ctool'
  },
  {
    role: 'ACCOUNTANT',
    roleName: 'Kế toán trưởng',
    name: 'Lê Hoàng Long',
    username: 'long.kt',
    password: 'kt123',
    department: 'Phòng Kế toán - Tài chính',
    badge: 'bg-amber-900/60 text-amber-300 border-amber-700 hover:border-amber-500',
    iconColor: 'text-amber-400',
    description: 'Thẩm định giá Cấp 3, báo giá NCC, báo cáo tài chính'
  },
  {
    role: 'CHAIRMAN',
    roleName: 'Chủ tịch Hội đồng trường',
    name: 'TS. Phạm Minh Tuấn',
    username: 'tuan.chutich',
    password: 'ct123',
    department: 'Hội đồng trường CTECH',
    badge: 'bg-rose-900/60 text-rose-300 border-rose-700 hover:border-rose-500',
    iconColor: 'text-rose-400',
    description: 'Executive Dashboard, Ký duyệt chi Cấp 4 (Ban hành PO)'
  },
  {
    role: 'STOREKEEPER',
    roleName: 'Thủ kho',
    name: 'Bùi Đức Thắng',
    username: 'thang.kho',
    password: 'kho123',
    department: 'Bộ phận Kho thực phẩm',
    badge: 'bg-cyan-900/60 text-cyan-300 border-cyan-700 hover:border-cyan-500',
    iconColor: 'text-cyan-400',
    description: 'Tiếp nhận PO đã duyệt, kiểm kê, quản lý Lô & HSD (FEFO)'
  },
  {
    role: 'ADMIN',
    roleName: 'Quản trị viên HTTT',
    name: 'Ban Quản trị HTTT',
    username: 'admin',
    password: 'admin123',
    department: 'Trung tâm CNTT',
    badge: 'bg-purple-900/60 text-purple-300 border-purple-700 hover:border-purple-500',
    iconColor: 'text-purple-400',
    description: 'Toàn quyền cấu hình, tài khoản RBAC, Audit Logs'
  }
];

export default function LoginView() {
  const { login, loading } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    setError('');
    const result = await login(username.trim(), password.trim());
    if (!result.success) {
      setError(result.message || 'Đăng nhập không thành công');
    }
  };

  const handleQuickLogin = async (acc) => {
    setUsername(acc.username);
    setPassword(acc.password);
    setError('');
    await login(acc.username, acc.password);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-lg">
            CT
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">TRƯỜNG CAO ĐẲNG CTECH</h1>
            <p className="text-[11px] text-slate-400">Hệ thống thông tin Quản lý Căng tin (Cao học MIS)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ Thống Trực Tuyến
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 lg:p-12 gap-10 max-w-7xl mx-auto w-full z-10">
        
        {/* Left Side: Login Form Card */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Đăng Nhập Hệ Thống</h2>
            <p className="text-xs text-slate-400 mt-1.5">
              Xác thực định danh người dùng và kích hoạt phân quyền RBAC
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs flex items-center space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tên đăng nhập (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: chefnvd, linh.pos, admin..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition transform active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Vào Hệ Thống</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-500">
              Chỉ các tài khoản được cấp quyền bởi ban quản trị mới có thể truy cập hệ thống.
            </p>
          </div>
        </div>

        {/* Right Side: Demo Quick-Login Accounts */}
        <div className="w-full max-w-xl">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Chọn nhanh vai trò đăng nhập (Dành cho Hội đồng / Demo):</span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Bấm trực tiếp vào từng tài khoản dưới đây để đăng nhập ngay mà không cần gõ mật khẩu:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                onClick={() => handleQuickLogin(acc)}
                disabled={loading}
                className={`p-3.5 rounded-2xl border text-left transition transform hover:-translate-y-0.5 hover:shadow-xl flex flex-col justify-between ${acc.badge}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{acc.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-300">{acc.roleName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{acc.description}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>user: <strong className="text-slate-200">{acc.username}</strong></span>
                  <span>pass: <strong className="text-slate-200">{acc.password}</strong></span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 bg-slate-950/90 text-center text-xs text-slate-500">
        Đề tài: Xây dựng Hệ thống thông tin Quản lý Căng tin Trường Cao đẳng CTECH • Học phần: Quản trị HTTT Nâng cao
      </footer>
    </div>
  );
}
