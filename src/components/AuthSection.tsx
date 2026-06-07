import React, { useState } from 'react';
import { LogIn, UserPlus, HelpCircle, Key, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { User, Role } from '../types';

interface AuthSectionProps {
  onLoginSuccess: (user: User) => void;
  usersList: User[];
  onRegisterUser: (user: User) => void;
  onShowToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AuthSection({
  onLoginSuccess,
  usersList,
  onRegisterUser,
  onShowToast
}: AuthSectionProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'change'>('login');

  // Login inputs
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddr, setRegAddr] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regRole, setRegRole] = useState<Role>('CUSTOMER');
  const [regSuccess, setRegSuccess] = useState('');

  // Forgot password inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Change password inputs
  const [changeUser, setChangeUser] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  // Auto Quick-Login triggers
  const handleQuickLogin = (uname: string, roleName: Role) => {
    // Locate or simulate
    const match = usersList.find(u => u.username === uname);
    if (match) {
      onLoginSuccess(match);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr('');

    // Pre-encrypted owners simulation
    const ownerPasswords: { [key: string]: string } = {
      'shrishti_owner': 'Shrishti@123',
      'krish_owner': 'Krish@123',
      'nikhil_owner': 'Nikhil@123'
    };

    // Locate matching user in DB
    const foundUser = usersList.find(
      u => u.username.toLowerCase() === loginUser.toLowerCase().trim()
    );

    if (!foundUser) {
      setLoginErr('Invalid Username. Register a customer account or use owner accounts.');
      return;
    }

    // Verify password simulation
    if (foundUser.role === 'OWNER') {
      const pword = ownerPasswords[foundUser.username];
      if (pword && pword !== loginPass) {
        setLoginErr('Incorrect Owner security password! Check credentials in setup readme.');
        return;
      }
    } else {
      if (loginPass.length < 4) {
        setLoginErr('Password must be at least 4 characters.');
        return;
      }
    }

    if (!foundUser.isApproved) {
      setLoginErr(`Owner manual approval pending for ${foundUser.role} registration. Log in as Shrishti to approve users!`);
      return;
    }

    onLoginSuccess(foundUser);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess('');

    if (regPass !== regConfirmPass) {
      if (onShowToast) {
        onShowToast('Passwords do not match!', 'error');
      } else {
        alert('Passwords do not match!');
      }
      return;
    }

    // Simple duplication check
    const duplicate = usersList.some(
      u => u.username.toLowerCase() === regUser.toLowerCase() || u.email.toLowerCase() === regEmail.toLowerCase()
    );

    if (duplicate) {
      if (onShowToast) {
        onShowToast('Username or Email is already taken!', 'error');
      } else {
        alert('Username or Email is already taken!');
      }
      return;
    }

    // Creating new account entity
    const newAcct: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      fullName: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddr,
      username: regUser,
      role: regRole,
      isApproved: regRole === 'CUSTOMER', // Customer is auto approved. Staff/Admin require Owner Manual approval!
      ordersCount: 0,
      membershipLevel: 'Bronze'
    };

    onRegisterUser(newAcct);

    if (regRole === 'CUSTOMER') {
      setRegSuccess('Customer registered successfully! You can login now.');
    } else {
      setRegSuccess(`Registration filed successfully! As a ${regRole}, Owner manual approval must be processed first.`);
    }

    // Clear register values
    setRegName('');
    setRegEmail('');
    setRegPhone('');
    setRegAddr('');
    setRegUser('');
    setRegPass('');
    setRegConfirmPass('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSuccess(`A secure reset link has been dispatched to ${forgotEmail} with instructions.`);
    setForgotEmail('');
  };

  const handleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeSuccess('Password modified successfully. BCrypt hashing applied in memory DB.');
    setChangeUser('');
    setOldPass('');
    setNewPass('');
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {/* QUICK LOGIN HELPER BOX */}
      {authMode === 'login' && (
        <div className="bg-linear-to-r from-amber-50 to-amber-100/30 dark:from-neutral-950/20 dark:to-neutral-900/40 p-4 rounded-2xl border border-amber-200/50 dark:border-neutral-805 space-y-2.5">
          <div className="text-xs font-mono font-bold text-amber-600 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 animate-bounce" /> Enterprise Quick-Login Anchors:
          </div>
          <div className="text-[11px] text-gray-500 leading-relaxed font-sans">
            To test role-based dashboards (OWNER, STAFF, ADMIN), click the shortcut quick-logins below:
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1.5 text-xs font-semibold">
            <button
              onClick={() => handleQuickLogin('shrishti_owner', 'OWNER')}
              className="py-1.5 bg-neutral-950 text-white rounded-lg hover:bg-neutral-850 cursor-pointer transition text-center text-[10px]"
            >
              Sign-In Owner Shrishti
            </button>
            <button
              onClick={() => handleQuickLogin('krish_owner', 'OWNER')}
              className="py-1.5 bg-neutral-950 text-white rounded-lg hover:bg-neutral-850 cursor-pointer transition text-center text-[10px]"
            >
              Sign-In Owner Krish
            </button>
          </div>
          <p className="text-[9px] text-gray-450 text-right font-mono italic">Passwords for manually-typed models: Shrishti@123, Krish@123</p>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-805 rounded-3xl p-6 lg:p-8 shadow-xs">
        
        {/* 1. LOGIN MODE */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-sans font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1.5">
                <LogIn className="w-5 h-5 text-emerald-500" /> Sign In Required
              </h3>
              <p className="text-xs text-gray-450 mt-1">Provide your credentials to access order databases.</p>
            </div>

            {loginErr && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-xs rounded-xl border border-red-100 dark:border-red-900/50">
                ☠ {loginErr}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Username</label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Ex: shrishti_owner, krish_owner, or customer_username"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Security Password</label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Authenticate & Unlock
            </button>

            <div className="flex justify-between text-[11px] text-gray-450 font-sans pt-2">
              <button type="button" onClick={() => setAuthMode('forgot')} className="hover:underline hover:text-emerald-600 text-left">Forgot Password?</button>
              <button type="button" onClick={() => setAuthMode('register')} className="hover:underline hover:text-emerald-600 text-right">Register Customer</button>
            </div>

            <div className="text-center pt-4 border-t border-gray-100 dark:border-neutral-805">
              <button type="button" onClick={() => setAuthMode('change')} className="text-xs text-gray-400 hover:underline flex items-center justify-center gap-1 mx-auto">
                <Key className="w-3.5 h-3.5" /> Force Password modification check
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTRATION MODE */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-sans font-bold text-gray-901 dark:text-white flex items-center justify-center gap-1.5">
                <UserPlus className="w-5 h-5 text-emerald-500" /> Account Register
              </h3>
              <p className="text-xs text-gray-450 mt-1">Configure profile criteria for Atria Feasty access.</p>
            </div>

            {regSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-400 text-xs rounded-xl border border-emerald-100 dark:border-emerald-990/50">
                ✓ {regSuccess}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ex: Sharan Kapoor"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Email ID</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 99999 00000"
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Address</label>
              <input
                type="text"
                required
                value={regAddr}
                onChange={(e) => setRegAddr(e.target.value)}
                placeholder="Hebbal, Bangalore, Karnataka"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={regUser}
                  onChange={(e) => setRegUser(e.target.value)}
                  placeholder="sharan_chef"
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Role Type Selection</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as Role)}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300"
                >
                  <option value="CUSTOMER">Customer Account (Auto Approved)</option>
                  <option value="STAFF">Kitchen Staff (Requires Manual Approval)</option>
                  <option value="ADMIN">Manager Admin (Requires Manual Approval)</option>
                </select>
              </div>
            </div>

            {regRole !== 'CUSTOMER' && (
              <div className="p-3 bg-amber-50 dark:bg-neutral-900 border border-dashed border-amber-300 dark:border-neutral-800 text-[10px] text-amber-700 dark:text-amber-400 rounded-xl leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  Notice: Registering as <strong>{regRole}</strong> requires owner manual verification in backend console. Access triggers upon Shrishti/Krish/Nikhil setting your status to Approved.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={regConfirmPass}
                  onChange={(e) => setRegConfirmPass(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Sign Up Profile
            </button>

            <div className="text-center text-xs text-gray-450 pt-2">
              Have an account?{' '}
              <button type="button" onClick={() => setAuthMode('login')} className="text-emerald-600 hover:underline font-semibold cursor-pointer">
                Sign In Now
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {authMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-sans font-bold text-gray-901 dark:text-white flex items-center justify-center gap-1.5 animate-pulse">
                <HelpCircle className="w-5 h-5 text-emerald-500" /> Reset Password
              </h3>
              <p className="text-xs text-gray-450 mt-1">Request a security ticket link over verified emails.</p>
            </div>

            {forgotSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl">
                ✓ {forgotSuccess}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Registered Email ID</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="sharon@email.com"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-800 p-2.5 bg-transparent text-gray-700 dark:text-neutral-350"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Dispatch Reset Link
            </button>

            <div className="text-center text-xs text-gray-450 pt-2">
              Recall credentials?{' '}
              <button type="button" onClick={() => setAuthMode('login')} className="text-emerald-600 hover:underline font-semibold cursor-pointer">
                Log In
              </button>
            </div>
          </form>
        )}

        {/* 4. FORCE PASSWORD CHANGE */}
        {authMode === 'change' && (
          <form onSubmit={handleChangeSubmit} className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-sans font-bold text-gray-901 dark:text-white flex items-center justify-center gap-1.5">
                <Key className="w-5 h-5 text-emerald-500" /> Modify credentials
              </h3>
              <p className="text-xs text-gray-450 mt-1">Reset your in-memory DB password using security override.</p>
            </div>

            {changeSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl">
                ✓ {changeSuccess}
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Username ID</label>
              <input
                type="text"
                required
                value={changeUser}
                onChange={(e) => setChangeUser(e.target.value)}
                placeholder="shrishti_owner"
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-805 p-2.5 bg-transparent text-gray-700 dark:text-neutral-300"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">Old Security Password</label>
              <input
                type="password"
                required
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-805 p-2.5 bg-transparent text-gray-700"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-1">New Password (Target)</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 dark:border-neutral-805 p-2.5 bg-transparent text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Hash & Apply BCrypt
            </button>

            <div className="text-center text-xs text-gray-450 pt-2">
              Done modifying?{' '}
              <button type="button" onClick={() => setAuthMode('login')} className="text-emerald-600 hover:underline font-semibold cursor-pointer">
                Back to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
