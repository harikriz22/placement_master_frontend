import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  ArrowRightLeft,
  LogOut,
  GraduationCap,
  UserCheck,
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
        ? 'bg-blue-700 text-white shadow-sm'
        : 'text-slate-200 hover:bg-blue-800/60 hover:text-white'
    }`;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Placement Tracker
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-900/60 text-blue-300 rounded border border-blue-700/50">
                Cell Portal
              </span>
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
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-full">
                <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-slate-400 text-[10px] truncate max-w-[120px]">
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
