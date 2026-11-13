import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  ArrowRightLeft,
  LogOut,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? '  bg-gradient-to-tr  from-fuchsia-600 to-orange-500 text-white shadow-sm'
        : 'text-slate-200 hover:bg-gradient-to-tr from-fuchsia-500 to-orange-400 hover:text-white'
    }`;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shadow-xl shadow-blue-500/25 ring-4 ring-blue-500/20 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src="https://lscdn.azureedge.net/biz-live/img/photos-11122501-16318942603657166.jpeg"
                  alt="Techmindz Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white leading-none">
                    Techmindz
                  </span>

                  <span className="text-xs text-slate-300 tracking-tight leading-none mt-1">
                    Embrace the future
                  </span>
                </div>

                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-orange-900/60 text-orange-300 rounded border border-orange-700/50">
                  Cell Portal
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navLinkClass}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/students" className={navLinkClass}>
              <Users className="w-4 h-4" />
              <span>Students</span>
            </NavLink>

            <NavLink to="/batches" className={navLinkClass}>
              <FolderGit2 className="w-4 h-4" />
              <span>Batches</span>
            </NavLink>

            <NavLink to="/batch-switch" className={navLinkClass}>
              <ArrowRightLeft className="w-4 h-4" />
              <span>Batch switch</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-700/60 border border-slate-700/80 px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-amber-600/30 text-lime-400 border border-blue-500/40 flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-lime-200 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-lime-400 text-[10px] truncate max-w-[120px]">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 hover:text-rose-100 transition shadow-sm"
              title="Logout (ends your current session)"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-slate-800 px-4 py-2 flex items-center justify-around bg-slate-900/95">
        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-xs">Dashboard</span>
        </NavLink>
        <NavLink to="/students" className={navLinkClass}>
          <Users className="w-4 h-4" />
          <span className="text-xs">Students</span>
        </NavLink>
        <NavLink to="/batches" className={navLinkClass}>
          <FolderGit2 className="w-4 h-4" />
          <span className="text-xs">Batches</span>
        </NavLink>
        <NavLink to="/batch-switch" className={navLinkClass}>
          <ArrowRightLeft className="w-4 h-4" />
          <span className="text-xs">Switch</span>
        </NavLink>
      </div>
    </header>
  );
}
