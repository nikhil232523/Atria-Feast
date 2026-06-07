import React from 'react';
import { Utensils, ShoppingBag, LogIn, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { User } from '../types';

interface HeaderProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export default function Header({
  currentUser,
  activeTab,
  setActiveTab,
  cartCount,
  isDark,
  onToggleTheme,
  onLogout
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-3 bg-emerald-600 dark:bg-emerald-500 rounded-xl text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              {/* Using native SVG or simple UI icon */}
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-sans font-bold text-gray-900 dark:text-white tracking-tight">
                Atria <span className="text-emerald-600 dark:text-emerald-400">Feasty</span>
              </span>
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 -mt-1 font-semibold">
                Bengaluru Est. 2026
              </div>
            </div>
          </div>

          {/* Navigational Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' 
                  : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeTab === 'menu' 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' 
                  : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              Menu Card
            </button>
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeTab === 'booking' 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' 
                  : 'text-gray-600 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              Bookings
            </button>

            {currentUser && currentUser.role !== 'CUSTOMER' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20' 
                    : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-neutral-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                {currentUser.role} Control
              </button>
            )}

            <button
              onClick={() => setActiveTab('java-sdk')}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 transition cursor-pointer`}
            >
              Java Spring SDK
            </button>
          </nav>

          {/* Action buttons panel */}
          <div className="flex items-center gap-4">
            
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

            {/* Shopping Cart button */}
            <button
              onClick={() => setActiveTab('cart')}
              className="relative p-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5.5 h-5.5 text-gray-700 dark:text-neutral-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile section */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-semibold text-gray-800 dark:text-neutral-200">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">
                    Level: {currentUser.membershipLevel}
                  </div>
                </div>
                <div 
                  onClick={() => setActiveTab('profile')}
                  className="p-1 px-3 border border-gray-100 dark:border-neutral-800 rounded-xl bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 text-xs font-mono flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  {currentUser.role}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 rounded-full transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('auth')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Access App
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
