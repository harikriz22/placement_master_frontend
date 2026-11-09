import React from 'react';
import Navbar from '../components/common/Navbar';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, section, description }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
          <Construction className="w-8 h-8" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-2">
          {section}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-slate-600 max-w-md mb-6 text-sm">
          {description}
        </p>
        <Link 
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </main>
    </div>
  );
}
