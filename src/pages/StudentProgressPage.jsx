import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentProgressPage() {
  const navigate = useNavigate();
  const { students, loginAsStudent, isTeacher } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredStudents = students.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          st.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || st.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleInspect = (studentId) => {
    loginAsStudent(studentId);
    navigate(`/student?id=${studentId}`);
  };

  const excellingCount = students.filter((s) => s.status === 'Excelling').length;
  const needsSupportCount = students.filter((s) => s.status === 'Needs Support').length;
  const moderateCount = students.filter((s) => s.status === 'Moderate').length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <button
              onClick={() => navigate(isTeacher ? '/teacher' : '/student')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Classroom Progress & Learning Gaps Roster
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Complete student cohort tracking, concept mastery percentages, and detected reasoning patterns.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/teacher"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-soft-sm transition-all"
            >
              Teacher Dashboard
            </Link>
            <Link
              to="/insights"
              className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition-all"
            >
              View AI Insights
            </Link>
          </div>
        </div>

        {/* 3 Status Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setFilterStatus(filterStatus === 'Needs Support' ? 'ALL' : 'Needs Support')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStatus === 'Needs Support'
                ? 'border-rose-400 bg-rose-50/80 ring-2 ring-rose-400'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-700 uppercase">Needs Targeted Support</span>
              <span className="text-xl font-extrabold text-rose-700">{needsSupportCount}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Score &le; 50% • Active cognitive gaps</p>
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'Moderate' ? 'ALL' : 'Moderate')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStatus === 'Moderate'
                ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-400'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase">Developing / Moderate</span>
              <span className="text-xl font-extrabold text-amber-700">{moderateCount}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Score 60-75% • Minor slips or reversals</p>
          </button>

          <button
            onClick={() => setFilterStatus(filterStatus === 'Excelling' ? 'ALL' : 'Excelling')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              filterStatus === 'Excelling'
                ? 'border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-400'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase">Excelling / Mastered</span>
              <span className="text-xl font-extrabold text-emerald-700">{excellingCount}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Score 80-100% • Concept fully grasped</p>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name or email..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-400">Showing {filteredStudents.length} of {students.length} students</span>
            {filterStatus !== 'ALL' && (
              <button
                onClick={() => setFilterStatus('ALL')}
                className="text-xs text-indigo-600 font-semibold hover:underline ml-2"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-200/50">
                      {st.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{st.name}</h3>
                      <p className="text-xs text-slate-400">{st.grade} • {st.email}</p>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    st.status === 'Excelling'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : st.status === 'Needs Support'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {st.status}
                  </span>
                </div>

                {/* Score Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-500">Overall Mastery</span>
                    <span className="text-slate-900 font-bold">{st.overallScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        st.overallScore >= 80
                          ? 'bg-emerald-500'
                          : st.overallScore >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${st.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Cognitive Diagnosis Snippet */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Primary Identified Concept Gap:</span>
                  {st.status === 'Needs Support' ? (
                    <span className="text-rose-700 font-semibold">
                      Ratio treated as a difference (Subtracted instead of scaled)
                    </span>
                  ) : st.status === 'Moderate' ? (
                    <span className="text-amber-700 font-semibold">
                      Occasional additive scaling or inverted order
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      Full conceptual mastery demonstrated across checks
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {st.status === 'Excelling' ? '3 advanced questions assigned' : '3 remediation questions prepared'}
                </span>

                <button
                  onClick={() => handleInspect(st.id)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Inspect Student View</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

