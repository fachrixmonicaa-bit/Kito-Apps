import React, { useState, useMemo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Database, List, Calculator, Settings, LogOut, Menu, X, ChevronDown, Rocket, Users, Newspaper, Wallet, Home, Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { offers = [] } = useProperty();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pendingFinanceCount = useMemo(() => {
    if (user?.role !== 'admin') return 0;
    return offers.filter(o => o.status === 'Accepted' && o.financeStatus !== 'Approved').length;
  }, [offers, user]);

  const allNavItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <Home size={18} />,
      isDropdown: false,
      roles: ['admin', 'agent']
    },
    {
      id: 'monitor',
      title: 'Monitor Agen',
      path: '/admin/monitor',
      icon: <Users size={18} />,
      isDropdown: false,
      roles: ['admin'] // Only admin
    },
    {
      id: 'goals',
      title: 'Goals & Target',
      path: '/admin/goals',
      icon: <Target size={18} />,
      isDropdown: false,
      roles: ['admin'] // Only admin
    },
    {
      id: 'database',
      title: 'Database',
      icon: <Database size={18} />,
      isDropdown: true,
      roles: ['admin'], // Hidden from agent
      items: [
        { path: '/admin/properties/add', label: 'Input Property' },
        { path: '/admin/properties', label: 'Cari Data Property' }
      ]
    },
    {
      id: 'listing',
      title: 'Listing',
      icon: <List size={18} />,
      isDropdown: true,
      roles: ['admin', 'agent'], // Visible to agents too
      items: [
        { path: '/admin/listings/add', label: 'Input Listing' },
        { path: '/admin/listings/manage', label: 'Kelola Listing' }
      ]
    },
    {
      id: 'leads',
      title: 'Leads',
      icon: <Users size={18} />,
      isDropdown: true,
      roles: ['admin', 'agent'], // Both can access CRM
      items: [
        { path: '/admin/crm', label: '📊 Pipeline Klien (CRM)' },
        { path: '/admin/reports/leads', label: 'Laporan Leads' }
      ]
    },
    {
      id: 'valuasi',
      title: 'Valuasi',
      icon: <Calculator size={18} />,
      isDropdown: true,
      roles: ['admin', 'agent'], // Both can access Calculator
      items: [
        { path: '/admin/valuation', label: 'Kalkulator Valuasi' },
        { path: '/admin/transaction', label: 'Kalkulasi Transaksi' },
        { path: '/admin/reports/valuation', label: 'Laporan Valuasi' }
      ]
    },
    {
      id: 'keuangan',
      title: 'Keuangan',
      path: '/admin/finance',
      icon: <Wallet size={18} />,
      isDropdown: false,
      roles: ['admin'], // Only admin
      badge: pendingFinanceCount > 0 ? pendingFinanceCount : null
    },
    {
      id: 'news',
      title: 'KitoNews',
      icon: <Newspaper size={18} />,
      isDropdown: true,
      roles: ['admin'], // Only Admin
      items: [
        { path: '/admin/news/write', label: 'Tulis Artikel' },
        { path: '/admin/news/manage', label: 'Manage Artikel' }
      ]
    },
    {
      id: 'pengaturan',
      title: 'Pengaturan',
      icon: <Settings size={18} />,
      isDropdown: true,
      roles: ['admin', 'agent'], // Both
      items: [
        { path: '/admin/settings', label: 'Pengaturan Akun' }
      ]
    }
  ];

  const userRole = user?.role || 'agent';
  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AK';

  return (
    <div className="min-h-screen bg-slate-900 font-counting text-slate-100 relative overflow-hidden flex flex-col">

      {/* Full Screen Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-primary/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Transparent Top Navigation */}
      <header className="sticky top-0 z-50 w-full bg-slate-900/60 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="w-full 2xl:max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/admin" className="flex items-center text-xl font-extrabold text-white tracking-tight">
                <img src="/logo.png" alt="Kito Logo" className="h-8 w-auto object-contain rounded" />
                <div className="transform translate-y-[3px]">
                  <span className="font-light tracking-wide opacity-90 text-[19px] ml-[2px]">{user?.role === 'admin' ? 'Owner' : 'Agent'}</span><span className="text-primary">.</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => (
                <div
                  key={item.id || item.path}
                  className="relative group shrink-0"
                  onMouseEnter={() => item.isDropdown && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {/* Tooltip Bubble for Non-Dropdowns */}
                  {!item.isDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-slate-800 text-white text-[11px] font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10">
                      {item.title}
                    </div>
                  )}

                  {item.isDropdown ? (
                    <button
                      className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200
                        ${activeDropdown === item.id || item.items.some(i => i.path === location.pathname)
                          ? 'bg-white/10 text-white shadow-inner'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {item.icon}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200
                        ${item.highlight
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                          : location.pathname === item.path
                            ? 'bg-white/10 text-white shadow-inner'
                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {item.icon}
                      {item.badge && (
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900 animate-bounce">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.isDropdown && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 transition-all duration-200 transform origin-top ${activeDropdown === item.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'} z-50`}>
                      <div className="px-4 py-1.5 mb-1 border-b border-white/10">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.title}</span>
                      </div>
                      {item.items.map(subItem => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setActiveDropdown(null)}
                          className={`block px-4 py-2.5 text-sm transition-colors ${location.pathname === subItem.path
                              ? 'bg-primary/20 text-primary font-semibold border-l-2 border-primary'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white border-l-2 border-transparent'
                            }`}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Profile & Logout */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                {user?.photo ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-slate-700">
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg text-slate-900 ${user?.role === 'admin' ? 'bg-gradient-to-tr from-primary to-yellow-600' : 'bg-gradient-to-tr from-blue-400 to-indigo-500 text-white'}`}>
                    {userInitials}
                  </div>
                )}
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <button
                onClick={handleLogout}
                className="p-2 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-colors"
                title="Keluar"
              >
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center gap-4 shrink-0">
              {user?.photo ? (
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-700">
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-slate-900 font-bold text-xs">
                  {userInitials}
                </div>
              )}
              <button
                className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-3xl border-b border-white/10 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-6 space-y-6">
              {navItems.map((item) => (
                <div key={item.id || item.path}>
                  {item.isDropdown ? (
                    <div>
                      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                        {item.icon} {item.title}
                      </div>
                      <div className="space-y-1 pl-6 border-l border-white/10">
                        {item.items.map(subItem => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-3 px-2 text-sm rounded-lg ${location.pathname === subItem.path ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-300 hover:bg-white/5'}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 py-2 px-3 rounded-xl text-sm font-bold uppercase tracking-wider ${location.pathname === item.path ? 'bg-white/10 text-primary' : 'text-white hover:bg-white/5'}`}
                    >
                      {item.icon} {item.title}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-rose-400 font-medium w-full py-3 px-3 rounded-xl hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut size={18} /> Keluar Sistem
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full 2xl:max-w-[1600px] mx-auto p-4 lg:p-8 pt-8 lg:pt-12">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
