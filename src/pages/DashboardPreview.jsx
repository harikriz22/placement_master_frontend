import React from 'react';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { listStudents } from '../services/studentService';
import { getDashboardCounts } from '../utils/dashboardCounts';
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
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    listStudents()
      .then(students => setCounts(getDashboardCounts(students)))
      .catch(() =>
        setError('Failed to fetch student data. Please try again later.')
      );
  }, []);

  const metrics = [
    {
      key: 'totalEnrolled',
      title: 'Total Enrolled',
      desc: 'Students registered across all batches',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badge: 'All Active Batches',
    },
    {
      key: 'eligible',
      title: 'Placement Eligible',
      desc: 'Students meeting placement eligibility criteria',
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      badge: 'All Eligible Students',
    },
    {
      key: 'notEligible',
      title: 'Not Eligible',
      desc: 'Students who have not met eligibility requirements',
      icon: UserX,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      badge: 'All non-eligible Students',
    },
    {
      key: 'dropped',
      title: 'Discontinued',
      desc: 'Students who discontinued their training',
      icon: UserMinus,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      badge: 'Dropped Students',
    },
    {
      key: 'batchSwitch',
      title: 'Batch Transfers',
      desc: 'Students who transferred between batches',
      icon: ArrowRightLeft,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      badge: 'Batch Switch Students ',
    },
    {
      key: 'rejoined',
      title: 'Rejoined Students',
      desc: 'Students who resumed training',
      icon: RotateCcw,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      badge: 'Resumed',
    },
    {
      key: 'placed',
      title: 'Successfully Placed',
      desc: 'Students who secured placement offers',
      icon: Award,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
      badge: 'Offers Secured',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-tr from-indigo-950 via-slate-950 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
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
              <p className="mt-1 text-sm text-orange-300 max-w-2xl">
                Placement Tracker MVP portal. Manage student eligibility,
                monitor batch movements, and track placement progress from a
                centralized dashboard.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 sm:text-right">
              <p className="text-lime-400">Signed in as:</p>
              <p className="font-semibold text-lime-100 truncate">
                {user?.email}
              </p>
              <p className="text-[11px] text-lime-300 mt-1 flex items-center sm:justify-end gap-1">
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
            <p className="text-xs text-slate-500 mt-0.5 text-black-500">
              Monitor student enrollment, eligibility, batch movements, and
              placement outcomes at a glance.
            </p>
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-red-50 group-hover:text-red-700 transition">
                    {m.badge}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg ${m.iconBg} ${m.iconColor} flex items-center justify-center group-hover:scale-110 transition`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                  {counts ? counts[m.key] : '–'}
                </div>
                <div className="text-sm font-semibold text-slate-800 mb-1 color-blue">
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
