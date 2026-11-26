import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  QrCode,
  Banknote,
  Receipt,
  CheckCircle2,
  Printer,
  Sparkles,
  ShoppingBag,
  UserCheck,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';

export default function CashierPOSView() {
  const { products, categories, completeOrder, currentUser } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [customerType, setCustomerType] = useState('STUDENT'); // STUDENT | STAFF_CTOOL
  
  // Ctool Staff Autocomplete Search state
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffSearchResults, setStaffSearchResults] = useState([]);
  const [isSearchingStaff, setIsSearchingStaff] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const searchDropdownRef = useRef(null);

  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // CASH | VIETQR | CTOOL_VOUCHER
  const [cashGiven, setCashGiven] = useState(50000);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'ALL' || p.category_id === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Handle click outside to close staff dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowStaffDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search Ctool staff when typing in search input
  useEffect(() => {
    if (customerType !== 'STAFF_CTOOL' || selectedStaff) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingStaff(true);
        const results = await apiClient.searchCtoolStaff(staffSearchQuery);
        setStaffSearchResults(results || []);
      } catch (err) {
        console.error("Lỗi tra cứu CBNV:", err);
      } finally {
        setIsSearchingStaff(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [staffSearchQuery, customerType, selectedStaff]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const isCtoolMeal = customerType === 'STAFF_CTOOL';
  const ctoolDiscount = isCtoolMeal ? Math.min(subtotal, 35000) : 0;
  const totalAmount = Math.max(0, subtotal - ctoolDiscount);

  const handleOpenPayment = () => {
    if (cart.length === 0) return;
    if (isCtoolMeal && (!selectedStaff || selectedStaff.is_served)) return;
    setPaymentMethod(isCtoolMeal ? 'CTOOL_VOUCHER' : 'CASH');
    setCashGiven(totalAmount > 0 ? (Math.ceil(totalAmount / 50000) * 50000 || 50000) : 0);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (isCtoolMeal && (!selectedStaff || selectedStaff.is_served)) {
      return;
    }
    const customerDisplayName = isCtoolMeal && selectedStaff
      ? `${selectedStaff.staff_name} (${selectedStaff.staff_code} - ${selectedStaff.department})`
      : 'HSSV / Khách lẻ';

    const orderData = {
      customer_type: customerType,
      customer_name: customerDisplayName,
      ctool_meal_id: isCtoolMeal && selectedStaff ? selectedStaff.id : null,
      items: cart.map(i => ({
        id: i.id,
        name: i.name,
        code: i.code,
        price: i.price,
        quantity: i.quantity
      })),
      subtotal,
      discount: ctoolDiscount,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      cashier_name: currentUser?.full_name || 'Đặng Thùy Linh'
    };

    try {
      const order = await completeOrder(orderData);
      setCompletedOrder({
        ...order,
        subtotal,
        discount: ctoolDiscount,
        cashGiven: paymentMethod === 'CASH' ? cashGiven : totalAmount,
        changeDue: paymentMethod === 'CASH' ? Math.max(0, cashGiven - totalAmount) : 0
      });
      setShowPaymentModal(false);
      clearCart();
      setSelectedStaff(null);
      setStaffSearchQuery('');
    } catch (err) {
      // Notification handled in context
    }
  };

  return (
    <div className="p-4 lg:p-6 h-[calc(100vh-65px)] flex flex-col lg:flex-row gap-5">
      {/* Left: Product Catalog (65%) */}
      <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Tìm món ăn, đồ uống (gõ tên hoặc mã COM01)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
              <button
                onClick={() => {
                  setCustomerType('STUDENT');
                  setSelectedStaff(null);
                  setStaffSearchQuery('');
                  setShowStaffDropdown(false);
                }}
                className={`px-3 py-1.5 rounded-lg transition ${
                  customerType === 'STUDENT' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                HSSV / Khách lẻ
              </button>
              <button
                onClick={() => {
                  setCustomerType('STAFF_CTOOL');
                  setShowStaffDropdown(true);
                  if (staffSearchResults.length === 0) {
                    apiClient.searchCtoolStaff('').then(res => setStaffSearchResults(res || [])).catch(() => {});
                  }
                }}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1 transition ${
                  customerType === 'STAFF_CTOOL' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Suất ăn CBNV Ctool
              </button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-medium ${
                selectedCategory === 'ALL' ? 'bg-slate-700 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
              }`}
            >
              Tất cả món
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition font-medium ${
                  selectedCategory === cat.id ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 content-start auto-rows-max">
          {filteredProducts.map(prod => (
            <div
              key={prod.id}
              onClick={() => addToCart(prod)}
              className="bg-slate-950/70 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] shadow-md group relative h-44"
            >
              {prod.is_meal_eligible && (
                <span className="absolute top-2 right-2 text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-medium">
                  Ctool
                </span>
              )}

              <div>
                <div className="text-3xl mb-2 text-center group-hover:scale-110 transition-transform">
                  {prod.image}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2">{prod.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{prod.code}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">
                  {prod.price.toLocaleString()} đ
                </span>
                <span className="p-1 rounded-lg bg-blue-600/20 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Cart & Checkout (35%) */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Giỏ Hàng POS</h3>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Xóa
            </button>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12">
              <ShoppingBag className="w-10 h-10 mb-2 opacity-30" />
              <span>Chưa có món nào được chọn</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="font-semibold text-white truncate">{item.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-medium">{item.price.toLocaleString()} đ</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-rose-400"><Minus className="w-3 h-3" /></button>
                    <span className="px-2 font-mono font-bold text-white text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-emerald-400"><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="font-mono font-bold text-white text-xs w-16 text-right">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2 text-xs">
          {isCtoolMeal && (
            <div className="mb-3 space-y-1.5 relative">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  Cán bộ nhân viên Ctool:
                </span>
                {!selectedStaff && (
                  <span className="text-[10px] text-amber-400 font-normal">
                    * Bắt buộc chọn từ danh sách
                  </span>
                )}
              </div>

              {selectedStaff ? (
                /* Card showing chosen staff */
                <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-between text-xs animate-fadeIn shadow-md">
                  <div className="flex items-center space-x-2.5 min-w-0 pr-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white flex items-center gap-1.5 truncate">
                        <span className="truncate">{selectedStaff.staff_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono shrink-0">
                          {selectedStaff.staff_code}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {selectedStaff.department} • {selectedStaff.meal_type_name}
                      </div>
                      {selectedStaff.is_served ? (
                        <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1 mt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" /> Đã nhận suất lúc {selectedStaff.serve_time} (Hết lượt)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 shrink-0" /> Hợp lệ nhận suất ăn hôm nay
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaff(null);
                      setStaffSearchQuery('');
                      setShowStaffDropdown(true);
                      apiClient.searchCtoolStaff('').then(res => setStaffSearchResults(res || [])).catch(() => {});
                    }}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition shrink-0 ml-1"
                    title="Đổi cán bộ khác"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Search input with autocomplete selection dropdown */
                <div className="relative" ref={searchDropdownRef}>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      {isSearchingStaff ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                      ) : (
                        <Search className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Gõ tên hoặc mã CB (vd: Hằng, Đạt, 0102)..."
                      value={staffSearchQuery}
                      onChange={e => {
                        setStaffSearchQuery(e.target.value);
                        setShowStaffDropdown(true);
                      }}
                      onFocus={() => {
                        setShowStaffDropdown(true);
                        if (staffSearchResults.length === 0) {
                          apiClient.searchCtoolStaff(staffSearchQuery).then(res => setStaffSearchResults(res || [])).catch(() => {});
                        }
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
                    />
                  </div>

                  {/* Dropdown Selection Box */}
                  {showStaffDropdown && (
                    <div className="absolute left-0 right-0 mt-1 max-h-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-y-auto z-50 divide-y divide-slate-800 text-xs">
                      {isSearchingStaff ? (
                        <div className="p-3 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                          <span>Đang tra cứu danh sách Ctool...</span>
                        </div>
                      ) : staffSearchResults.length === 0 ? (
                        <div className="p-3 text-center text-slate-500 text-xs">
                          Không tìm thấy cán bộ nào khớp với "{staffSearchQuery}"
                        </div>
                      ) : (
                        staffSearchResults.map(staff => (
                          <button
                            key={staff.id}
                            type="button"
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowStaffDropdown(false);
                            }}
                            className={`w-full text-left p-2.5 hover:bg-slate-800/80 flex items-center justify-between transition group ${
                              staff.is_served ? 'opacity-60 bg-slate-950/40' : ''
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-semibold text-white group-hover:text-emerald-300 flex items-center gap-1.5 truncate">
                                <span className="truncate">{staff.staff_name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-400 shrink-0">
                                  {staff.staff_code}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{staff.department}</div>
                            </div>
                            {staff.is_served ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800 shrink-0">
                                Đã nhận ({staff.serve_time})
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800 shrink-0">
                                Chưa nhận
                              </span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between text-slate-400">
            <span>Tạm tính:</span>
            <span className="text-white font-mono">{subtotal.toLocaleString()} đ</span>
          </div>

          {ctoolDiscount > 0 && (
            <div className="flex justify-between text-emerald-400 font-medium">
              <span>Trợ cấp Suất ăn Ctool:</span>
              <span className="font-mono">-{ctoolDiscount.toLocaleString()} đ</span>
            </div>
          )}

          <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
            <span>Khách thanh toán:</span>
            <span className="text-emerald-400 font-mono text-lg">{totalAmount.toLocaleString()} đ</span>
          </div>

          <button
            disabled={cart.length === 0 || (isCtoolMeal && (!selectedStaff || selectedStaff.is_served))}
            onClick={handleOpenPayment}
            className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
          >
            <Banknote className="w-4 h-4" />
            <span>
              {cart.length === 0
                ? 'Giỏ hàng đang trống'
                : isCtoolMeal && !selectedStaff
                ? 'Vui lòng chọn CBNV Ctool'
                : isCtoolMeal && selectedStaff?.is_served
                ? 'CBNV này đã nhận suất hôm nay'
                : `Thanh Toán (${totalAmount.toLocaleString()} đ)`}
            </span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Chọn Phương Thức Thanh Toán
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white text-xs">✕ Đóng</button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'CASH' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Tiền mặt</span>
              </button>
              <button
                onClick={() => setPaymentMethod('VIETQR')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'VIETQR' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>VietQR Bank</span>
              </button>
              <button
                onClick={() => setPaymentMethod('CTOOL_VOUCHER')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'CTOOL_VOUCHER' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>Voucher Ctool</span>
              </button>
            </div>

            {paymentMethod === 'CASH' && (
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tiền cần thu:</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{totalAmount.toLocaleString()} đ</span>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Khách đưa (VNĐ):</label>
                  <input
                    type="number"
                    step="5000"
                    value={cashGiven}
                    onChange={e => setCashGiven(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                  <span className="text-slate-300">Tiền thừa trả khách:</span>
                  <span className="text-amber-400 font-mono text-sm">{Math.max(0, cashGiven - totalAmount).toLocaleString()} đ</span>
                </div>
              </div>
            )}

            {paymentMethod === 'VIETQR' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-300 font-semibold">Quét mã VietQR thanh toán (MB / VCB / TCB)</p>
                <div className="w-40 h-40 bg-white mx-auto rounded-xl p-2 flex flex-col items-center justify-center shadow">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <span className="text-[10px] font-bold text-emerald-700 font-mono">{totalAmount.toLocaleString()} đ</span>
                </div>
              </div>
            )}

            {paymentMethod === 'CTOOL_VOUCHER' && (
              <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-800 text-xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận Suất Ăn CBNV Trường CTECH</span>
                </div>
                {selectedStaff ? (
                  <div className="p-2.5 bg-slate-900/80 rounded-lg border border-emerald-900 text-slate-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{selectedStaff.staff_name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded">
                        {selectedStaff.staff_code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{selectedStaff.department}</p>
                    <p className="text-[10px] text-emerald-400 font-medium">✓ Chế độ phúc lợi: 35,000 đ/suất • Đã đối soát hệ thống</p>
                  </div>
                ) : (
                  <p className="text-slate-300">Suất ăn trưa nằm trong chế độ phúc lợi nhà trường đã đối soát Ctool.</p>
                )}
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận & Hoàn Tất Đơn Hàng</span>
            </button>
          </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {completedOrder && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="text-center border-b pb-3">
              <h3 className="font-bold text-base tracking-wide">CĂNG TIN TRƯỜNG CAO ĐẲNG CTECH</h3>
              <p className="text-[11px] text-slate-500">Tòa nhà Dịch vụ Căn tin</p>
              <p className="text-[11px] font-mono font-bold mt-1 text-slate-700">HÓA ĐƠN #{completedOrder.id}</p>
              {completedOrder.customer_name && (
                <p className="text-[10px] text-slate-600 font-medium mt-0.5">Khách: {completedOrder.customer_name}</p>
              )}
              <p className="text-[10px] text-slate-400">{completedOrder.time}</p>
            </div>

            <div className="text-xs space-y-1.5 border-b pb-3 font-mono">
              <div className="flex justify-between font-bold text-slate-600 text-[11px]">
                <span>Tên món</span>
                <span>SL x Đơn giá</span>
              </div>
              {completedOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.name || it.product_name}</span>
                  <span>{it.quantity} x {it.price.toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Tổng tiền:</span>
                <span>{(completedOrder.subtotal || completedOrder.total_amount).toLocaleString()} đ</span>
              </div>
              {completedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Trợ cấp Ctool:</span>
                  <span>-{completedOrder.discount.toLocaleString()} đ</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm pt-1 border-t text-slate-900">
                <span>Khách trả:</span>
                <span>{completedOrder.total_amount.toLocaleString()} đ</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400 border-t">
              <p className="text-emerald-600 font-semibold">✓ Giao dịch thành công • Đã tự động cập nhật trừ kho</p>
            </div>

            <div className="flex space-x-2 pt-2">
              <button onClick={() => window.print()} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                <Printer className="w-3.5 h-3.5" /> In Bill
              </button>
              <button onClick={() => setCompletedOrder(null)} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition">
                Đóng & Bán tiếp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
