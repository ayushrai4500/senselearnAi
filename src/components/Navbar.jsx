import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Radio,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Layers,
  BarChart3,
  PlusCircle,
  BrainCircuit,
  BookOpenCheck,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar() {
  const { user, students, isTeacher, isStudent, loginAsTeacher, loginAsStudent, resetAllDemoData, showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    api.getActiveSession().then(sess => {
      if (sess && sess.status === 'active') {
        setActiveSession(sess);
      } else {
        setActiveSession(null);
      }
    });
  }, [location.pathname]);

  const handleReset = async () => {
    if (confirm('Reset demo data to default baseline? This will restore 10 sample students, benchmark Ratios responses, and default quiz results.')) {
      setResetting(true);
      await resetAllDemoData();
      setResetting(false);
      navigate(isTeacher ? '/teacher' : '/student');
    }
  };

  const navLinks = isTeacher
    ? [
        { path: '/teacher', label: 'Dashboard', icon: Layers },
        { path: '/live', label: 'Live Session', icon: Radio, badge: activeSession ? 'ACTIVE' : null },
        { path: '/insights', label: 'AI Insights', icon: BrainCircuit, highlight: true },
        { path: '/create-quiz', label: 'Create Quiz', icon: PlusCircle },
        { path: '/progress', label: 'Student Progress', icon: Users },
      ]
    : [
        { path: '/student', label: 'My Dashboard', icon: Layers },
        { path: '/live', label: 'Live Quiz Session', icon: Radio, badge: activeSession ? 'JOIN' : null },
        { path: '/progress', label: 'Class Standings', icon: BarChart3 },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    SenseLearn<span className="text-indigo-600">.AI</span>
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200/60">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Classroom Personalization Layer
                </p>
              </div>
            </Link>

            {/* Active Session Pill */}
            {activeSession && (
              <Link
                to="/live"
                className="hidden md:inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold hover:bg-emerald-100 transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Session Live: <strong className="font-mono">{activeSession.code}</strong></span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : item.highlight
                      ? 'text-purple-700 hover:bg-purple-50 hover:text-purple-800 font-medium'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : item.highlight ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Role Switcher & Reset Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Reset Demo Data Button */}
            <button
              onClick={handleReset}
              disabled={resetting}
              title="Reset all students, answers, and quizzes to default sample state"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-indigo-600' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs shadow-soft-sm"
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-white text-[11px] ${
                  isTeacher ? 'bg-indigo-600' : 'bg-purple-600'
                }`}>
                  {user?.avatar || (isTeacher ? 'EF' : 'ST')}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-slate-900 flex items-center space-x-1">
                    <span>{user?.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                      isTeacher ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Switch Active Role</p>
                  </div>

                  {/* Teacher Option */}
                  <button
                    onClick={() => {
                      loginAsTeacher();
                      setRoleMenuOpen(false);
                      navigate('/teacher');
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center space-x-3 hover:bg-slate-50 transition-colors ${
                      isTeacher ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      EF
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Dr. Evelyn Foster</p>
                      <p className="text-xs text-slate-500">Teacher • Lead Math Educator</p>
                    </div>
                  </button>

                  <div className="px-3 pt-3 pb-1 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Student Profile ({students.length} demo students)
                    </p>
                  </div>

                  {/* Student Options */}
                  <div className="max-h-56 overflow-y-auto">
                    {students.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          loginAsStudent(st.id);
                          setRoleMenuOpen(false);
                          navigate('/student');
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          user?.id === st.id ? 'bg-purple-50/70 border-l-4 border-purple-600' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-md bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                            {st.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{st.name}</p>
                            <p className="text-[10px] text-slate-400">Score: {st.overallScore}%</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          st.status === 'Excelling'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : st.status === 'Needs Support'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {st.status}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 px-3">
                    <Link
                      to="/login"
                      onClick={() => setRoleMenuOpen(false)}
                      className="block text-center text-xs font-medium text-indigo-600 hover:text-indigo-800 py-1"
                    >
                      View Role Selection Screen &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Nav Links Row */}
        <div className="lg:hidden flex items-center space-x-1 py-2 overflow-x-auto border-t border-slate-100">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </header>
  );
}

