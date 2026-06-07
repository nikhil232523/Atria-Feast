import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import MenuSection from './components/MenuSection';
import CartSection from './components/CartSection';
import BookingSection from './components/BookingSection';
import AuthSection from './components/AuthSection';
import DashboardSection from './components/DashboardSection';
import JavaExportSection from './components/JavaExportSection';

import { INITIAL_FOOD_ITEMS } from './data/menu';
import { User, FoodItem, CartItem, Order, TableBooking, BuffetBooking, InventoryItem, Review } from './types';

// =========================================================
// INITIAL DATABASE STATES ON FIRST LOAD
// =========================================================

const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    fullName: 'Shrishti',
    email: 'shrishti@atriafeasty.com',
    phone: '+91 99999 88811',
    address: 'Hebbal, Bengaluru',
    username: 'shrishti_owner',
    role: 'OWNER',
    isApproved: true,
    ordersCount: 42,
    membershipLevel: 'Platinum'
  },
  {
    id: 'usr-2',
    fullName: 'Krish',
    email: 'krish@atriafeasty.com',
    phone: '+91 99999 88822',
    address: 'Hebbal, Bengaluru',
    username: 'krish_owner',
    role: 'OWNER',
    isApproved: true,
    ordersCount: 42,
    membershipLevel: 'Platinum'
  },
  {
    id: 'usr-3',
    fullName: 'Nikhil',
    email: 'nikhil@atriafeasty.com',
    phone: '+91 99999 88833',
    address: 'Hebbal, Bengaluru',
    username: 'nikhil_owner',
    role: 'OWNER',
    isApproved: true,
    ordersCount: 42,
    membershipLevel: 'Platinum'
  },
  {
    id: 'usr-4',
    fullName: 'Rahul Chef',
    email: 'rahul@atriafeasty.com',
    phone: '+91 88888 77766',
    address: 'RT Nagar, Bangalore',
    username: 'rahul_staff',
    role: 'STAFF',
    isApproved: true,
    ordersCount: 0,
    membershipLevel: 'Bronze'
  },
  {
    id: 'usr-5',
    fullName: 'Pooja Waitress',
    email: 'pooja@atriafeasty.com',
    phone: '+91 88888 77755',
    address: 'Yeshwantpur, Bangalore',
    username: 'pooja_staff',
    role: 'STAFF',
    isApproved: false, // Pending Owner Approval
    ordersCount: 0,
    membershipLevel: 'Bronze'
  },
  {
    id: 'usr-6',
    fullName: 'Shanti Admin',
    email: 'shanti@atriafeasty.com',
    phone: '+91 88888 77744',
    address: 'Sanjay Nagar, Bangalore',
    username: 'shanti_admin',
    role: 'ADMIN',
    isApproved: false, // Pending Owner Approval
    ordersCount: 0,
    membershipLevel: 'Bronze'
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'INV-748291',
    username: 'siddharth_p',
    customerName: 'Siddharth Patel',
    items: [
      { foodId: 'ind-1', foodName: 'Paneer Butter Masala', price: 280, quantity: 2 },
      { foodId: 'ind-8', foodName: 'Butter Naan', price: 60, quantity: 4 }
    ],
    subtotal: 800,
    discount: 0,
    tax: 144, // 18% GST
    total: 944,
    status: 'Delivered',
    paymentMethod: 'Instant UPI (Scan)',
    paymentStatus: 'Paid',
    timestamp: '06/06/2026, 12:15 PM'
  },
  {
    id: 'INV-183025',
    username: 'priya_k',
    customerName: 'Priya Krishnan',
    items: [
      { foodId: 'ita-1', foodName: 'Margherita Pizza', price: 320, quantity: 1 },
      { foodId: 'des-3', foodName: 'Chocolate Lava Cake', price: 150, quantity: 1 }
    ],
    subtotal: 470,
    discount: 0,
    tax: 85,
    total: 555,
    status: 'Preparing',
    paymentMethod: 'Google Pay',
    paymentStatus: 'Paid',
    timestamp: '06/06/2026, 01:45 PM'
  }
];

const INITIAL_TABLE_BOOKINGS: TableBooking[] = [
  {
    id: 'RES-8930',
    customerName: 'Siddharth Patel',
    phone: '+91 98888 12345',
    date: '2026-06-10',
    time: '20:00',
    guests: 4,
    tableNumber: 3,
    status: 'Approved'
  }
];

const INITIAL_BUFFET_BOOKINGS: BuffetBooking[] = [
  {
    id: 'BUFA-1205',
    customerName: 'Megha Sharma',
    phone: '+91 97777 24680',
    buffetType: 'Premium',
    price: 3996, // 4 * 999
    seatsCount: 4,
    date: '2026-06-11',
    timeSlot: '12:00 PM - 03:00 PM (Royal Lunch)',
    status: 'Approved'
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'ing-1',
    ingredient: 'Amul Cheese Block',
    stockQuantity: 4.5, // low limit: 4.5 * 3 = 13.5 -> TRIGGERS WARNING
    unit: 'kg',
    consumptionRate: 3.0,
    expiryDate: '2026-07-20'
  },
  {
    id: 'ing-2',
    ingredient: 'Aromatic Basmati Rice',
    stockQuantity: 12.0, // low limit: 8 * 3 = 24 -> TRIGGERS WARNING
    unit: 'kg',
    consumptionRate: 8.0,
    expiryDate: '2026-12-15'
  },
  {
    id: 'ing-3',
    ingredient: 'Kashmiri Red saffron threads',
    stockQuantity: 200,
    unit: 'grams',
    consumptionRate: 20,
    expiryDate: '2026-10-10'
  },
  {
    id: 'ing-4',
    ingredient: 'Tandoori Paneer Block',
    stockQuantity: 25.0,
    unit: 'kg',
    consumptionRate: 5.0,
    expiryDate: '2026-06-25'
  },
  {
    id: 'ing-5',
    ingredient: 'Refined Olive Oil',
    stockQuantity: 65,
    unit: 'litres',
    consumptionRate: 10,
    expiryDate: '2026-09-01'
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'Ananth Bhat',
    foodName: 'Paneer Butter Masala',
    rating: 5,
    comment: 'The gravies at Atria Feasty are absolutely authentic! Clean and creamy, butter naan is amazingly fluffy. Exceptional job by Shrishti and culinary crew.',
    timestamp: '06/06/2026, 11:30 AM'
  },
  {
    id: 'rev-2',
    customerName: 'Sanjana Roy',
    foodName: 'Chicken Shawarma',
    rating: 5,
    comment: 'Middle-eastern Arabic shawarma wrapped with accurate spicy touches and garlic toum. Truly premium and clean setup. Must visit Hebbal coordinates.',
    timestamp: '06/06/2026, 01:10 PM'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);

  // Core Entity states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [ordersList, setOrdersList] = useState<Order[]>(INITIAL_ORDERS);
  const [tableBookings, setTableBookings] = useState<TableBooking[]>(INITIAL_TABLE_BOOKINGS);
  const [buffetBookings, setBuffetBookings] = useState<BuffetBooking[]>(INITIAL_BUFFET_BOOKINGS);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [reviewsList, setReviewsList] = useState<Review[]>(INITIAL_REVIEWS);

  // Beautiful Toast Notifications State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Auto configure dark element document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle addition to Cart
  const handleAddToCart = (food: FoodItem) => {
    const existing = cartItems.find(item => item.foodItem.id === food.id);
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.foodItem.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { foodItem: food, quantity: 1 }]);
    }
    triggerToast(`"${food.name}" added to your culinary cart. Ready for checkout!`, 'success');
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.foodItem.id === id ? { ...item, quantity: qty } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.foodItem.id !== id));
  };

  // Logins coordination
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'OWNER' || user.role === 'ADMIN' || user.role === 'STAFF') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setActiveTab('home');
  };

  // Orders creation
  const handlePlaceOrder = (newOrder: Order) => {
    setOrdersList([...ordersList, newOrder]);
    
    // Check if the user is registered - if so, increment order metrics to check for Gold/Platinum coupon code privileges!
    if (currentUser) {
      const updatedUsers = usersList.map(u => {
        if (u.id === currentUser.id) {
          const nextCount = u.ordersCount + 1;
          let nextLevel = u.membershipLevel;
          if (nextCount >= 30) {
            nextLevel = 'Platinum';
          } else if (nextCount >= 15) {
            nextLevel = 'Gold';
          } else if (nextCount >= 5) {
            nextLevel = 'Silver';
          }
          const up = { ...u, ordersCount: nextCount, membershipLevel: nextLevel };
          // Sync current loggedin state
          setCurrentUser(up);
          return up;
        }
        return u;
      });
      setUsersList(updatedUsers);
    }
  };

  // Manual waitstaff approvals by Owners
  const handleApproveUser = (id: string) => {
    const match = usersList.find(u => u.id === id);
    setUsersList(usersList.map(u => u.id === id ? { ...u, isApproved: true } : u));
    triggerToast(`Personnel user "${match?.fullName}" successfully approved for service entry!`, 'success');
  };

  const handleRejectUser = (id: string) => {
    const match = usersList.find(u => u.id === id);
    setUsersList(usersList.filter(u => u.id !== id));
    triggerToast(`Registration candidate "${match?.fullName}" deleted.`, 'info');
  };

  const handleUpdateOrderStatus = (id: string, nextStatus: any) => {
    setOrdersList(ordersList.map(o => o.id === id ? { ...o, status: nextStatus } : o));
  };

  const handleRestockInventory = (id: string, qtyToAdd: number) => {
    setInventoryList(inventoryList.map(item => 
      item.id === id ? { ...item, stockQuantity: item.stockQuantity + qtyToAdd } : item
    ));
  };

  const handleAddInventoryItem = (item: InventoryItem) => {
    setInventoryList([item, ...inventoryList]);
  };

  const handleAddReview = (review: Omit<Review, 'id' | 'timestamp'>) => {
    const newRev: Review = {
      ...review,
      id: 'rev-' + Math.floor(Math.random()*1000),
      timestamp: new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setReviewsList([newRev, ...reviewsList]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans flex flex-col justify-between transition-colors duration-300">
      
      {/* HEADER CONTROLLER */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onLogout={handleLogout}
      />

      {/* CORE SECTOR WRAPPERS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {activeTab === 'home' && (
          <HomeSection
            foodItems={foodItems}
            reviews={reviewsList}
            onAddReview={handleAddReview}
            onBookClick={() => setActiveTab('booking')}
            onOrderClick={() => setActiveTab('menu')}
          />
        )}

        {activeTab === 'menu' && (
          <MenuSection
            foodItems={foodItems}
            currentUser={currentUser}
            onAddToCart={handleAddToCart}
            onUpdateMenu={(upd) => setFoodItems(upd)}
          />
        )}

        {activeTab === 'cart' && (
          <CartSection
            cartItems={cartItems}
            currentUser={currentUser}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onPlaceOrder={handlePlaceOrder}
            onClearCart={() => setCartItems([])}
          />
        )}

        {activeTab === 'booking' && (
          <BookingSection
            currentUser={currentUser}
            tableBookings={tableBookings}
            buffetBookings={buffetBookings}
            onAddTableBooking={(tb) => setTableBookings([...tableBookings, tb])}
            onAddBuffetBooking={(buf) => setBuffetBookings([...buffetBookings, buf])}
          />
        )}

        {activeTab === 'auth' && (
          <AuthSection
            onLoginSuccess={handleLoginSuccess}
            usersList={usersList}
            onRegisterUser={(usr) => setUsersList([...usersList, usr])}
            onShowToast={triggerToast}
          />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <DashboardSection
            currentUser={currentUser}
            usersList={usersList}
            ordersList={ordersList}
            tableBookings={tableBookings}
            buffetBookings={buffetBookings}
            inventoryList={inventoryList}
            foodItems={foodItems}
            onApproveUser={handleApproveUser}
            onRejectUser={handleRejectUser}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRestockInventory={handleRestockInventory}
            onAddInventoryItem={handleAddInventoryItem}
            onShowToast={triggerToast}
          />
        )}

        {activeTab === 'java-sdk' && (
          <JavaExportSection />
        )}

        {/* Dynamic Fallback Account Info Block inside settings profile page */}
        {activeTab === 'profile' && currentUser && (
          <div className="max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-805 p-6 lg:p-8 shadow-xs space-y-6">
            <div className="text-center pb-4 border-b border-gray-100 dark:border-neutral-800">
              <div className="w-16 h-16 bg-emerald-650 text-white font-black text-2xl rounded-full flex items-center justify-center mx-auto mb-3">
                {currentUser.fullName.charAt(0)}
              </div>
              <h3 className="text-xl font-bold dark:text-white">{currentUser.fullName} profile</h3>
              <p className="text-xs text-gray-400 mt-0.5">Role Authorization Privilege: <strong>{currentUser.role}</strong></p>
            </div>

            <div className="space-y-3 file text-xs font-mono">
              <div className="flex justify-between border-b pb-1.5 dark:border-neutral-800">
                <span className="text-gray-400">Username handle:</span>
                <span className="font-bold dark:text-white">{currentUser.username}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 dark:border-neutral-800">
                <span className="text-gray-400">Secure Email:</span>
                <span className="font-bold dark:text-white">{currentUser.email}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 dark:border-neutral-800">
                <span className="text-gray-400">Loyalty level:</span>
                <span className="text-amber-500 font-bold uppercase">{currentUser.membershipLevel}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 dark:border-neutral-800">
                <span className="text-gray-400">Total orders completed:</span>
                <span className="font-bold dark:text-white">{currentUser.ordersCount}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 dark:border-neutral-805">
                <span className="text-gray-400">Address Anchor:</span>
                <span className="font-bold dark:text-white">{currentUser.address}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition cursor-pointer text-center"
            >
              Sign-Out Session safely
            </button>
          </div>
        )}

      </main>

      {/* FOOTER CONTROLLER */}
      <Footer />

      {/* Dynamic Custom Float Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 right-6 z-[9999] max-w-sm bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-slide-up"
        >
          <div className={`p-1.5 rounded-xl shrink-0 ${
            toastType === 'success' ? 'bg-emerald-600' :
            toastType === 'error' ? 'bg-red-600' : 'bg-blue-600'
          }`}>
            {toastType === 'success' && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toastType === 'error' && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toastType === 'info' && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-150 leading-relaxed">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-gray-400 hover:text-white p-1 hover:bg-neutral-800 rounded-lg transition shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}
