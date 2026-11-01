import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useState } from 'react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/menu', label: 'Menu Items', icon: '🍰' },
  { to: '/admin/qr', label: 'QR Code', icon: '📱' },
  { to: '/admin/chatbot', label: 'Chatbot Questions', icon: '💬' },
  { to: '/admin/settings', label: 'Restaurant Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const NavContent = () => (
    <>
      <div className="px-5 py-5 border-b border-orange-100">
        <p className="font-display font-bold text-lg text-brand-700">🍰 Bakery Admin</p>
        <p className="text-xs text-gray-500 mt-0.5">{admin?.email}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-orange-100'
              }`
            }
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-orange-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
        >
          🚪 Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-orange-100 px-4 py-3">
        <p className="font-display font-bold text-brand-700">🍰 Bakery Admin</p>
        <button onClick={() => setMobileOpen(true)} className="text-2xl">
          ☰
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-orange-100 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col shadow-xl">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
