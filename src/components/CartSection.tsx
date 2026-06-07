import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Tag, CreditCard, Check, Receipt, Printer } from 'lucide-react';
import { CartItem, User, Order } from '../types';

interface CartSectionProps {
  cartItems: CartItem[];
  currentUser: User | null;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
}

const PAYMENT_METHODS = [
  { id: 'upi', name: 'Instant UPI (Scan)' },
  { id: 'gpay', name: 'Google Pay' },
  { id: 'phonepe', name: 'PhonePe' },
  { id: 'paytm', name: 'Paytm Wallet' },
  { id: 'card_credit', name: 'Credit Card' },
  { id: 'card_debit', name: 'Debit / ATM Card' },
  { id: 'cash', name: 'Cash on Delivery (COD)' }
];

export default function CartSection({
  cartItems,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearCart
}: CartSectionProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [activeCoupon, setActiveCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Completed Invoice State
  const [lastPlacedInvoice, setLastPlacedInvoice] = useState<Order | null>(null);

  // Financial stats
  const subtotal = cartItems.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST standard in India
  const discountAmount = Math.round(subtotal * (appliedDiscount / 100));
  const finalTotal = subtotal + tax - discountAmount;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.toUpperCase().trim();

    if (code === 'SILVER20') {
      if (currentUser && currentUser.ordersCount < 5) {
        setCouponError('SILVER20 requires at least 5 completed orders on your account!');
        return;
      }
      setAppliedDiscount(20);
      setActiveCoupon('SILVER20');
    } else if (code === 'GOLD25') {
      if (currentUser && currentUser.ordersCount < 15) {
        setCouponError('GOLD25 requires at least 15 completed orders on your account!');
        return;
      }
      setAppliedDiscount(25);
      setActiveCoupon('GOLD25');
    } else if (code === 'PLATINUM30') {
      if (currentUser && currentUser.ordersCount < 30) {
        setCouponError('PLATINUM30 requires at least 30 completed orders on your account!');
        return;
      }
      setAppliedDiscount(30);
      setActiveCoupon('PLATINUM30');
    } else {
      setCouponError('Invalid coupon code. Try entering SILVER20, GOLD25, or PLATINUM30.');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const selectedPayMethod = PAYMENT_METHODS.find(p => p.id === paymentMethod)?.name || 'UPI';

    const newOrder: Order = {
      id: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      username: currentUser ? currentUser.username : 'Guest User',
      customerName: currentUser ? currentUser.fullName : 'Guest Diner',
      items: cartItems.map(item => ({
        foodId: item.foodItem.id,
        foodName: item.foodItem.name,
        price: item.foodItem.price,
        quantity: item.quantity
      })),
      subtotal,
      discount: discountAmount,
      tax,
      total: finalTotal,
      couponCodeUsed: activeCoupon || undefined,
      status: 'Pending',
      paymentMethod: selectedPayMethod,
      paymentStatus: paymentMethod === 'cash' ? 'Unpaid' : 'Paid',
      timestamp: new Date().toLocaleString()
    };

    onPlaceOrder(newOrder);
    setLastPlacedInvoice(newOrder);
    onClearCart();
    setAppliedDiscount(0);
    setActiveCoupon('');
    setCouponCode('');
  };

  const triggerPrint = () => {
    window.print();
  };

  // Render Printable Invoice Overlay
  if (lastPlacedInvoice) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-3">
          <Check className="w-6 h-6 shrink-0 bg-emerald-600 text-white rounded-full p-0.5" />
          <div>
            <div className="font-bold text-sm">Gourmet Feast Placed Successfully!</div>
            <div className="text-xs mt-0.5">Your kitchen ticket #{lastPlacedInvoice.id} is active on cooking grids.</div>
          </div>
        </div>

        {/* PRINTABLE REAL PHYSICAL BILL INVOICE CARD */}
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6 print:border-none print:shadow-none" id="invoice">
          
          {/* Bill Heading */}
          <div className="text-center pb-6 border-b border-gray-100 dark:border-neutral-800">
            <h2 className="text-xl font-sans font-black uppercase text-gray-950 dark:text-white tracking-widest">Atria Feasty Restaurant</h2>
            <p className="text-xs text-gray-500 mt-1">Outer Ring Road, Hebbal, Bengaluru, KA</p>
            <p className="text-[10px] font-mono text-gray-405 mt-0.5">Proprietors: Shrishti, Krish, Nikhil</p>
            <div className="mt-4 inline-block font-mono text-xs bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-sm text-gray-700 dark:text-neutral-300">
              Tax Invoice - Bill Receipt
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-600 dark:text-neutral-400">
            <div>
              <span className="block text-gray-400">Bill ID/Ticket:</span>
              <span className="font-bold text-gray-900 dark:text-white">{lastPlacedInvoice.id}</span>
            </div>
            <div className="text-right">
              <span className="block text-gray-400">Transaction Time:</span>
              <span className="font-bold text-gray-900 dark:text-white">{lastPlacedInvoice.timestamp}</span>
            </div>
            <div>
              <span className="block text-gray-400">Diner Name:</span>
              <span className="font-bold text-gray-900 dark:text-white">{lastPlacedInvoice.customerName}</span>
            </div>
            <div className="text-right">
              <span className="block text-gray-400">Pay Gateway:</span>
              <span className="font-bold text-gray-900 dark:text-white">{lastPlacedInvoice.paymentMethod}</span>
            </div>
          </div>

          {/* List of items ordered */}
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-800 text-gray-400 text-left">
                <th className="py-2">Item Detail</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Amnt</th>
              </tr>
            </thead>
            <tbody>
              {lastPlacedInvoice.items.map((it, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-neutral-805 text-gray-700 dark:text-neutral-350">
                  <td className="py-2.5 font-semibold text-gray-900 dark:text-white">{it.foodName}</td>
                  <td className="py-2.5 text-center">{it.quantity}</td>
                  <td className="py-2.5 text-right">₹{it.price}</td>
                  <td className="py-2.5 text-right font-bold">₹{it.price * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary pricing */}
          <div className="space-y-1.5 border-t border-gray-200 dark:border-neutral-800 pt-4 text-xs font-mono text-right">
            <div className="flex justify-between">
              <span className="text-gray-450 text-left">Internal Subtotal:</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{lastPlacedInvoice.subtotal}</span>
            </div>
            {lastPlacedInvoice.discount > 0 && (
              <div className="flex justify-between text-rose-500">
                <span className="text-left">Rewards Discount ({lastPlacedInvoice.couponCodeUsed}):</span>
                <span>-₹{lastPlacedInvoice.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-450 text-left">Symmetric GST Tax (18%):</span>
              <span className="font-semibold text-gray-900 dark:text-white">₹{lastPlacedInvoice.tax}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-emerald-600 dark:text-emerald-400 border-t border-dashed border-gray-200 dark:border-neutral-850 pt-2.5">
              <span className="text-left font-sans">Final Net Amount Paid:</span>
              <span className="font-mono">₹{lastPlacedInvoice.total}</span>
            </div>
          </div>

          {/* Cash payments caveat */}
          <div className="text-[10px] text-center text-gray-400 pt-6 border-t border-gray-100 dark:border-neutral-800 leading-relaxed font-sans">
            Terms & Parameters: Thank you for dining with Atria Feasty. Complete hygiene indices inspected constantly. Please show this invoice ticket to our staff counter upon entry. Enjoy your feast!
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setLastPlacedInvoice(null)}
            className="flex-1 py-3 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-750 text-gray-700 dark:text-neutral-300 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer text-center"
          >
            ← Cook Another Feast
          </button>
          <button
            onClick={triggerPrint}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print Bill Invoice
          </button>
        </div>
      </div>
    );
  }

  // Regular Cart Section rendering
  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active Selections</span>
        <h2 className="text-3xl font-sans font-bold text-gray-900 dark:text-white mt-1 tracking-tight">Your Culinary Cart</h2>
        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">Review the dishes you configured below for cooking routing.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-neutral-800 mb-4" />
          <p className="text-gray-500 dark:text-neutral-400 max-w-sm mx-auto">
            Your cart is currently empty. Visit the Menu section to configure mouthwatering gourmet selections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: CART ITEMS LIST */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-805/90 rounded-3xl p-6 lg:p-8 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-neutral-805">
              <span className="text-sm font-bold text-gray-700 dark:text-neutral-200">Basket Content ({cartItems.length} items)</span>
              <button
                onClick={onClearCart}
                className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-neutral-805">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-4 flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-55/65 shrink-0">
                    <img referrerPolicy="no-referrer" src={item.foodItem.image} alt={item.foodItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-mono font-semibold text-gray-400 uppercase">{item.foodItem.category}</span>
                    <h4 className="text-sm font-bold text-gray-950 dark:text-white leading-tight -mt-0.5">{item.foodItem.name}</h4>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold mt-1 inline-block">₹{item.foodItem.price} each</span>
                  </div>

                  {/* Quantity manager */}
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-850 p-1.5 rounded-xl border border-gray-100 dark:border-neutral-800">
                    <button
                      onClick={() => onUpdateQuantity(item.foodItem.id, item.quantity - 1)}
                      className="p-1 text-gray-500 hover:text-gray-900 hover:bg-white dark:hover:bg-neutral-800 transition rounded-md font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold text-gray-800 dark:text-neutral-200 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.foodItem.id, item.quantity + 1)}
                      className="p-1 text-gray-500 hover:text-gray-900 hover:bg-white dark:hover:bg-neutral-800 transition rounded-md font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-950 dark:text-white font-mono">₹{item.foodItem.price * item.quantity}</div>
                    <button
                      onClick={() => onRemoveItem(item.foodItem.id)}
                      className="text-red-500 hover:text-red-600 mt-1 pointer cursor-pointer"
                      title="Remove food"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: CHECKOUT SUMMARY */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-805/95 rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <h3 className="text-lg font-sans font-bold text-gray-900 dark:text-white">Checkout Hub</h3>
              
              {/* Rewards Loyalty coupon application */}
              <div className="p-4 bg-gray-50 dark:bg-neutral-850 rounded-2xl border border-gray-100 dark:border-neutral-805/80 space-y-2">
                <div className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Loyalty Reward Passcode</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="SILVER20, GOLD25, etc..."
                    className="flex-1 text-xs border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-xl px-3 text-gray-700 dark:text-neutral-200 uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl px-4 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (<div className="text-[10px] text-red-500 leading-tight">{couponError}</div>)}
                {activeCoupon && (<div className="text-[10px] text-emerald-650 dark:text-emerald-400 leading-tight">✓ Approved! {appliedDiscount}% Discount on entire bill.</div>)}
              </div>

              {/* Secure Payment details selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase font-bold tracking-wider">Gateway Payment Gateway</label>
                <div className="grid grid-cols-1 gap-2">
                  {PAYMENT_METHODS.map(pay => (
                    <label
                      key={pay.id}
                      className={`flex items-center justify-between p-3 border rounded-xl text-xs cursor-pointer transition ${
                        paymentMethod === pay.id 
                          ? 'border-emerald-500 bg-emerald-50/20 text-emerald-850 dark:bg-emerald-950/20 dark:text-emerald-400 font-semibold' 
                          : 'border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-350'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5" />
                        {pay.name}
                      </span>
                      <input
                        type="radio"
                        name="pay_gateway"
                        value={pay.id}
                        checked={paymentMethod === pay.id}
                        onChange={() => setPaymentMethod(pay.id)}
                        className="accent-emerald-600"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white font-bold">₹{subtotal}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-rose-500">
                    <span className="font-semibold">{activeCoupon} Code:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">GST Taxes (18%):</span>
                  <span className="text-gray-900 dark:text-white font-bold">₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-gray-200 dark:border-neutral-800">
                  <span className="font-sans">Receipt Total:</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md block mt-6 cursor-pointer"
            >
              Confirm & Place Order <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
