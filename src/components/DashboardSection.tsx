import React, { useState } from 'react';
import { 
  DollarSign, ShoppingCart, Calendar, Users, Briefcase, Trash2, ArrowRight, Check, X, Bell, 
  AlertTriangle, Printer, Layers, RefreshCw, BarChart2, Star, Plus 
} from 'lucide-react';
import { User, Order, TableBooking, BuffetBooking, InventoryItem, FoodItem } from '../types';

interface DashboardProps {
  currentUser: User;
  usersList: User[];
  ordersList: Order[];
  tableBookings: TableBooking[];
  buffetBookings: BuffetBooking[];
  inventoryList: InventoryItem[];
  foodItems: FoodItem[];
  onApproveUser: (id: string) => void;
  onRejectUser: (id: string) => void;
  onUpdateOrderStatus: (id: string, nextStatus: any) => void;
  onRestockInventory: (id: string, qtyToAdd: number) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function DashboardSection({
  currentUser,
  usersList,
  ordersList,
  tableBookings,
  buffetBookings,
  inventoryList,
  foodItems,
  onApproveUser,
  onRejectUser,
  onUpdateOrderStatus,
  onRestockInventory,
  onAddInventoryItem,
  onShowToast
}: DashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'orders' | 'bookings' | 'inventory' | 'approvals'>('stats');

  // Inventory forms states
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState<number>(100);
  const [ingUnit, setIngUnit] = useState('kg');
  const [ingRate, setIngRate] = useState<number>(5);
  const [ingExpiry, setIngExpiry] = useState('25-12-2026');

  // Report Modal / Simulation status
  const [simulatedReport, setSimulatedReport] = useState<string | null>(null);

  // Stats calculation
  const totalOrdersCount = ordersList.length;
  const pendingOrdersCount = ordersList.filter(o => o.status === 'Pending').length;
  const activeBookingsCount = tableBookings.length + buffetBookings.length;
  
  // Calculate revenue
  const totalRevenue = ordersList.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const dailyProj = Math.round(totalRevenue * 0.15 || 15400);
  const weeklyProj = Math.round(totalRevenue * 1.1 || 124600);
  const monthlyProj = Math.round(totalRevenue * 4.5 || 540000);

  // Locate users for action approval (Admins and Staffs that aren't approved)
  const pendingApprovals = usersList.filter(u => !u.isApproved);

  // Restock calculation
  const lowStockCount = inventoryList.filter(i => i.stockQuantity < i.consumptionRate * 3).length;

  const handleCreateIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingName || ingQty <= 0) return;

    onAddInventoryItem({
      id: 'ing-' + Math.floor(Math.random()*1000),
      ingredient: ingName,
      stockQuantity: Number(ingQty),
      unit: ingUnit,
      consumptionRate: Number(ingRate),
      expiryDate: ingExpiry
    });

    setIngName('');
    setIngQty(100);
    setIngRate(5);
    if (onShowToast) {
      onShowToast('Restock ingredient successfully registered!', 'success');
    } else {
      alert('Restock ingredient successfully registered!');
    }
  };

  // Simulated Report Generator
  const generateSalesReport = (reportType: string) => {
    let reportModel = `
--- ATRIA FEASTY DATA REPORT ---
TYPE: ${reportType.toUpperCase()}
DATE GENERATED: ${new Date().toLocaleDateString()}
AUTHOR: ${currentUser.fullName} (${currentUser.role})
=======================================
Total Income Audited: ₹${totalRevenue}
Order count processed: ${ordersList.length} items
Active Table Reservations: ${tableBookings.length} bookings
Active Buffet Passports: ${buffetBookings.length} seats registered

ITEMIZED POPULATED TURNOVER:
- Paneer Butter Masala: 42 orders
- Butter Chicken: 31 orders
- Shoyu Ramen: 18 orders
- Spanish Paella: 14 orders

INVENTORY ALERTS DETECTED: ${lowStockCount} low stocks
MANAGEMENT VERDICT: Operations running at peak capacity parameters.
Report certified by Shrishti, Krish, Nikhil.
=======================================`;

    setSimulatedReport(reportModel);
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION HEADER CONTROL PANEL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-neutral-900 to-neutral-950 p-6 rounded-2xl text-white shadow-md">
        <div>
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Atria Feasty Control Center</span>
          <h2 className="text-2xl font-sans font-bold tracking-tight mt-0.5">{currentUser.role} Control Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Hello, <span className="font-bold text-white">{currentUser.fullName}</span>. Manage systems, approve registrations & view revenues.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase">
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === 'stats' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            📊 Analytics & Revenue
          </button>
          
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer relative ${
              activeSubTab === 'orders' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            🕒 Orders Queue
            {pendingOrdersCount > 0 && (
              <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white text-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer ${
              activeSubTab === 'bookings' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            📅 Bookings log
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer relative ${
              activeSubTab === 'inventory' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700'
            }`}
          >
            🗃 Stocks
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 bg-red-500 rounded-full animate-ping border border-neutral-900" />
            )}
          </button>

          {currentUser.role === 'OWNER' && (
            <button
              onClick={() => setActiveSubTab('approvals')}
              className={`px-4 py-2 rounded-xl transition cursor-pointer relative ${
                activeSubTab === 'approvals' ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            >
              🔒 Security Approvals
              {pendingApprovals.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 py-0.2 text-[9px] font-bold border border-neutral-900 animate-pulse">
                  {pendingApprovals.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* OVERVIEW KEY CARDS GRID */}
      {activeSubTab === 'stats' && (
        <div className="space-y-8">
          
          {/* STATS TILES */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-805/90 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase">Live Revenue Turnover</span>
                  <div className="text-2xl font-black font-mono text-gray-950 dark:text-white mt-1">₹{totalRevenue}</div>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Total calculated audit</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5 font-bold" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-805/90 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase">Total Orders Logged</span>
                  <div className="text-2xl font-black font-mono text-gray-950 dark:text-white mt-1">{totalOrdersCount}</div>
                  <p className="text-[10px] text-gray-500 dark:text-neutral-500 mt-1">Active tickets on kitchen grids</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-neutral-950/20 text-blue-650 rounded-xl">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-805/90 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase">Interactive Bookings</span>
                  <div className="text-2xl font-black font-mono text-gray-950 dark:text-white mt-1">{activeBookingsCount}</div>
                  <p className="text-[10px] text-emerald-650 mt-1">Tables & weekend buffet slots</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-neutral-950/20 text-amber-550 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-805/90 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-gray-400 uppercase">Registered Users DB</span>
                  <div className="text-2xl font-black font-mono text-gray-950 dark:text-white mt-1">{usersList.length}</div>
                  <p className="text-[10px] text-red-500 font-semibold mt-1">{lowStockCount} inventory flags active</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-neutral-950/20 text-purple-650 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC SALES GRAPHS & BEST SELLING FOODS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visual CSS Analytics Bar Charts */}
            <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-sans font-bold text-gray-901 dark:text-white">Revenue Projection Audit Pools</h3>
                  <p className="text-xs text-gray-500">Auto aggregated billing turnovers.</p>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-50 dark:bg-neutral-800 p-1 px-2.5 rounded-sm">INR Currency (₹)</span>
              </div>

              {/* Bar charts layout */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-700 dark:text-neutral-300 font-bold mb-1.5">
                    <span>Daily Revenue Turnover (Calculated)</span>
                    <span className="text-emerald-600">₹{dailyProj}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '45%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-700 dark:text-neutral-300 font-bold mb-1.5">
                    <span>Weekly Billing Turnover (Audited)</span>
                    <span className="text-amber-500">₹{weeklyProj}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: '65%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-gray-700 dark:text-neutral-300 font-bold mb-1.5">
                    <span>Monthly Corporate Projection</span>
                    <span className="text-purple-600">₹{monthlyProj}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 h-3.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full transition-all" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              {/* PDF Reports Generator widgets */}
              <div className="pt-6 border-t border-gray-100 dark:border-neutral-805">
                <div className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase tracking-widest mb-3">Certified PDF Report Suite</div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => generateSalesReport('Daily Sales Summary')} className="px-4 py-2 border border-gray-150 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Daily Sales Ledger</button>
                  <button onClick={() => generateSalesReport('Weekly Performance Metrics')} className="px-4 py-2 border border-gray-150 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Weekly Performance</button>
                  <button onClick={() => generateSalesReport('Corporate Inventory resting values')} className="px-4 py-2 border border-gray-150 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-850 text-xs font-bold rounded-xl cursor-pointer">Stock Audit</button>
                </div>
                
                {simulatedReport && (
                  <div className="mt-4 p-4 bg-neutral-950 text-emerald-400 font-mono text-[10px] rounded-2xl relative border border-emerald-950/50">
                    <button onClick={() => setSimulatedReport(null)} className="absolute top-2 right-3 text-red-500 font-bold hover:underline">Clear</button>
                    <pre className="whitespace-pre-wrap leading-relaxed">{simulatedReport}</pre>
                    <button onClick={() => window.print()} className="mt-4 px-3 py-1 bg-emerald-600 text-neutral-950 font-bold rounded-md hover:bg-emerald-500 cursor-pointer flex items-center gap-1">
                      <Printer className="w-3.5 h-3.5" /> PDF Download / Print
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Side column: Best-selling items */}
            <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-901 dark:text-white">Best-Selling Dishes</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1.5 border-b border-gray-50 dark:border-neutral-805">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-emerald-600">01</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Paneer Butter Masala</h4>
                      <p className="text-[9px] text-gray-400">Indian Foods</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700 dark:text-neutral-300">42 orders</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-gray-50 dark:border-neutral-805">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-emerald-600">02</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Butter Chicken</h4>
                      <p className="text-[9px] text-gray-400">Indian Foods</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700 dark:text-neutral-300">31 orders</span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-gray-50 dark:border-neutral-805">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-emerald-600">03</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Shoyu Ramen bowl</h4>
                      <p className="text-[9px] text-gray-400">Japanese Foods</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700 dark:text-neutral-300">18 orders</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-emerald-600">04</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Margherita Pizza</h4>
                      <p className="text-[9px] text-gray-400">Italian Foods</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-700 dark:text-neutral-300">15 orders</span>
                </div>
              </div>

              {/* Customer summary */}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Top Dining Customers</h4>
                <div className="flex gap-2.5 items-center">
                  <div className="bg-emerald-50 text-emerald-600 p-2 text-xs font-bold rounded-lg">SP</div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">Siddharth Patel</div>
                    <div className="text-[9px] text-emerald-600 font-mono">Completed: 34 orders / Platinum Member</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ORDERS QUEUE SUBTAB */}
      {activeSubTab === 'orders' && (
        <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-neutral-805">
            <h3 className="text-base font-bold text-gray-901 dark:text-white">Active Order Dispatching Grid</h3>
            <span className="text-xs text-gray-400">Total processed: {ordersList.length}</span>
          </div>

          {ordersList.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              No orders placed yet. Customer orders appear in real-time.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-805 max-h-[500px] overflow-y-auto pr-1">
              {[...ordersList].reverse().map(order => (
                <div key={order.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-sm dark:text-neutral-300">{order.id}</span>
                      <span className="text-xs text-gray-500 dark:text-neutral-400">{order.timestamp}</span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1.5">For: {order.customerName} ({order.username})</h4>
                    
                    {/* Item list ordered */}
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-50 text-emerald-800 dark:bg-neutral-800 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-semibold">
                          {it.foodName} x {it.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                    <div className="text-sm font-bold text-gray-950 dark:text-white font-mono">₹{order.total}</div>
                    
                    {/* Status updater select box */}
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-xs rounded-lg border p-1 bg-white text-gray-800 font-bold ${
                          order.status === 'Delivered' ? 'border-emerald-500 text-emerald-650' : 
                          order.status === 'Pending' ? 'border-amber-500 text-amber-550' : 'border-gray-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Served">Served</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS SUBTAB LOG */}
      {activeSubTab === 'bookings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Table Bookings */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-sans font-bold text-gray-900 dark:text-white">Active Spot Reservation tickets</h3>
            
            {tableBookings.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No Table Bookings recorded.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {tableBookings.map(tBooking => (
                  <div key={tBooking.id} className="p-4 border border-gray-150 dark:border-neutral-805 rounded-2xl bg-gray-50/20 text-xs">
                    <div className="flex justify-between font-bold dark:text-white">
                      <span>Ticket: {tBooking.id}</span>
                      <span className="text-emerald-600 font-mono uppercase">Table Number: {tBooking.tableNumber}</span>
                    </div>
                    <div className="mt-1 text-gray-700 dark:text-neutral-300">Diner: <strong className="text-gray-900 dark:text-white">{tBooking.customerName}</strong> ({tBooking.phone})</div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">Date: {tBooking.date} | Arrival Time: {tBooking.time} | Pax: {tBooking.guests} Guests</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buffet Bookings */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-sans font-bold text-gray-900 dark:text-white">Grand Buffet Registration list</h3>
            
            {buffetBookings.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No Buffet Registrations recorded.</p>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {buffetBookings.map(bBooking => (
                  <div key={bBooking.id} className="p-4 border border-gray-150 dark:border-neutral-850 rounded-2xl bg-gray-50/20 text-xs text-gray-700 dark:text-neutral-350">
                    <div className="flex justify-between font-bold text-gray-900 dark:text-white">
                      <span>Ref Code: {bBooking.id}</span>
                      <span className="text-amber-500 font-mono uppercase font-bold">{bBooking.buffetType} Buffet</span>
                    </div>
                    <div className="mt-1">Diner: <strong className="text-gray-900 dark:text-white">{bBooking.customerName}</strong> ({bBooking.phone})</div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">Date: {bBooking.date} | Slot: {bBooking.timeSlot} | Seats: {bBooking.seatsCount} Passes</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVENTORY STOCKS MANAGEMENT SUBTAB */}
      {activeSubTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RESTOCK INGREDIENTS LIST */}
          <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-sans font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" /> Stock Ingredient Restock tracker
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-neutral-800 text-gray-400 uppercase">
                    <th className="py-2.5">Ingredient Name</th>
                    <th className="py-2.5 text-center">In-Stock Quantity</th>
                    <th className="py-2.5 text-center">Daily Burn Rate</th>
                    <th className="py-2.5 text-center">Low limit Alert</th>
                    <th className="py-2.5 text-right">Stock action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryList.map(item => {
                    const isLow = item.stockQuantity < item.consumptionRate * 3;

                    return (
                      <tr key={item.id} className="border-b border-gray-100 dark:border-neutral-805/90 text-gray-700 dark:text-neutral-300">
                        <td className="py-3 font-semibold text-gray-900 dark:text-white text-sm">{item.ingredient}</td>
                        <td className={`py-3 text-center font-bold font-mono ${isLow ? 'text-rose-500' : 'text-emerald-600'}`}>{item.stockQuantity} {item.unit}</td>
                        <td className="py-3 text-center">{item.consumptionRate} {item.unit}/day</td>
                        <td className="py-3 text-center">
                          {isLow ? (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center justify-center gap-0.5 max-w-[90px] mx-auto animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-red-500" /> Restock
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">Optimal</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => onRestockInventory(item.id, 50)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[10px] font-bold px-3 py-1.5 rounded-md cursor-pointer transition flex items-center gap-1 ml-auto"
                          >
                            <RefreshCw className="w-3 h-3" /> +50 Units
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CREATE NEW INVENTORY ITEM BOX */}
          <div className="lg:col-span-4 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-850 rounded-3xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="font-sans font-bold text-gray-900 dark:text-white">Register Ingredients</h3>
              <p className="text-[11px] text-gray-400">Add dynamic raw materials for cooking metrics tracking.</p>
            </div>

            <form onSubmit={handleCreateIngredient} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Ingredient Name *</label>
                <input
                  type="text"
                  required
                  value={ingName}
                  onChange={(e) => setIngName(e.target.value)}
                  placeholder="Ex: Amul Butter Cubes"
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Stock quantity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={ingQty}
                    onChange={(e) => setIngQty(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Stock Unit</label>
                  <select
                    value={ingUnit}
                    onChange={(e) => setIngUnit(e.target.value)}
                    className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-750 dark:text-neutral-350"
                  >
                    <option value="kg">kg (weight)</option>
                    <option value="litres">litres (volume)</option>
                    <option value="units">units (count)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Daily consumption rate</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={ingRate}
                  onChange={(e) => setIngRate(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Track ingredient Stock
              </button>
            </form>
          </div>

        </div>
      )}

      {/* OWNERS ONLY MANUAL SECURITY APPROVALS SUBTAB */}
      {activeSubTab === 'approvals' && (
        <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-gray-100 dark:border-neutral-805">
            <h3 className="text-base font-bold text-gray-901 dark:text-white flex items-center gap-1.5">
              <SecurityIcon className="w-5 h-5 text-emerald-500 animate-pulse" /> Manual Registry security Approvals
            </h3>
            <p className="text-xs text-gray-400 mt-1">Under strict Atria Feasty guidelines, incoming managers (ADMINs) and waitstaff (STAFFs) require Owner check-in activation.</p>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              ✓ Excellent. No pending security registrations awaiting approval.
            </div>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {pendingApprovals.map(pUser => (
                <div key={pUser.id} className="p-5 border border-gray-150 dark:border-neutral-850 rounded-2xl bg-gray-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-purple-50 text-purple-750 px-2.5 py-0.5 rounded-full uppercase">{pUser.role}</span>
                      <span className="text-xs text-gray-400 font-mono">Profile Code: {pUser.id}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-2">Diner Full Name: {pUser.fullName}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Username: <strong className="text-gray-900 dark:text-neutral-300">{pUser.username}</strong> | Email ID: {pUser.email} | Contact: {pUser.phone}</p>
                    <p className="text-[11px] text-gray-400 italic">Address: {pUser.address || 'Address unfiled'}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onRejectUser(pUser.id)}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 rounded-xl transition cursor-pointer"
                      title="Decline registry"
                    >
                      <X className="w-4 h-4 inline" /> Reject
                    </button>
                    <button
                      onClick={() => onApproveUser(pUser.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl tracking-wider transition cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Approve Activation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Inlined icon helper to prevent imports errors
function SecurityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}
