import React from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  ArrowRightLeft,
  RotateCcw,
  Award,
  CheckCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function DashboardPreview() {
  const { user } = useAuth();

  const metrics = [
    {
      title: 'Total Enrolled',
      count: 148,
      desc: 'Students registered across all batches',
      icon: Users,
      color: 'blue',
      badge: 'All Active Batches',
    },
    {
      title: 'Placement Eligible',
      count: 92,
      desc: 'Students meeting placement eligibility criteria',
      icon: UserCheck,
      color: 'emerald',
      badge: 'All Eligible Students',
    },
    {
      title: 'Not Eligible',
      count: 56,
      desc: 'Students who have not met eligibility requirements',
      icon: UserX,
      color: 'amber',
      badge: 'All non-eligible Students',
    },
    {
      title: 'Discontinued',
      count: 12,
      desc: 'Students who discontinued their training',
      icon: UserMinus,
      color: 'rose',
      badge: 'Dropped Students',
    },
    {
      title: 'Batch Transfers',
      count: 19,
      desc: 'Students who transferred between batches',
      icon: ArrowRightLeft,
      color: 'purple',
      badge: 'Batch Switch Students ',
    },
    {
      title: 'Rejoined Students',
      count: 7,
      desc: 'Students who resumed training',
      icon: RotateCcw,
      color: 'cyan',
      badge: 'Resumed',
    },
    {
      title: 'Successfully Placed',
      count: 64,
      desc: 'Students who secured placement offers',
      icon: Award,
      color: 'teal',
      badge: 'Offers Secured',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Authenticated Session Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || 'Cell Member'}!
              </h1>
              <p className="mt-1 text-sm text-slate-300 max-w-2xl">
                Placement Tracker MVP portal. Manage student eligibility,
                monitor batch movements, and track placement progress from a
                centralized dashboard.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 sm:text-right">
              <p className="text-slate-400">Signed in as:</p>
              <p className="font-semibold text-white truncate">{user?.email}</p>
              <p className="text-[11px] text-blue-300 mt-1 flex items-center sm:justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Placement Cell Member</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Student Overview </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor student enrollment, eligibility, batch movements, and
              placement outcomes at a glance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition">
                    {m.badge}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                  {m.count}
                </div>
                <div className="text-sm font-semibold text-slate-800 mb-1">
                  {m.title}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
