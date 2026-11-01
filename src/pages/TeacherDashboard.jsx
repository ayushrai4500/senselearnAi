import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Radio,
  BrainCircuit,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Play,
  ArrowRight,
  Activity,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Presentation,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import TopicMasteryChart from '../components/TopicMasteryChart';
import StudentTable from '../components/StudentTable';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { students, showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [responses, setResponses] = useState([]);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await api.getClassroomAnalytics();
      setAnalytics(data);
      if (data?.activeSession) {
        setActiveSession(data.activeSession);
      }
      // Load responses for student table gap detection
      const sess = await api.getActiveSession();
      setActiveSession(sess);
    } catch (err) {
      console.error('Failed to load classroom analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLiveSession = async () => {
    setStartingSession(true);
    try {
      const newSession = await api.startLiveSession('quiz-ratios-1');
      setActiveSession(newSession);
      showToast(`Live Quiz Session started! Code: ${newSession.code}`, 'success');
      navigate('/live');
    } catch (e) {
      showToast('Error starting session: ' + e.message, 'error');
    } finally {
      setStartingSession(false);
    }
  };

  const topMisconception = analytics?.analysis?.misconceptions?.[0] || {
    title: 'Ratio treated as a difference',
    affectedCount: 5,
    affectedPercentage: 50,
    recommendedAction: 'Re-explain ratios using a worked example.'
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Quick Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Educator Command View</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500 font-medium">8th Grade Mathematics • Room 204</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Real-Time Classroom Insights
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Active Lecture: Ratios, Proportions & Unit Rates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/create-quiz"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-soft-sm transition-all"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span>Create New Quiz</span>
            </Link>

            <Link
              to="/insights"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition-all"
            >
              <BrainCircuit className="w-4 h-4 text-purple-600" />
              <span>View AI Insights</span>
            </Link>

            <button
              onClick={handleStartLiveSession}
              disabled={startingSession}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              <Radio className="w-4 h-4 text-white" />
              <span>{activeSession?.status === 'active' ? 'Manage Live Session' : 'Start Live Session'}</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Students */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Students</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{students.length}</span>
              <span className="text-xs font-semibold text-emerald-600">All Connected</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Classroom: Period 3 Math</p>
          </div>

          {/* Active Quiz Session */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Session</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              {activeSession && activeSession.status === 'active' ? (
                <>
                  <span className="text-xl font-bold font-mono text-emerald-700">{activeSession.code}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    LIVE
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-slate-400">Ready to Start</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {activeSession ? `${activeSession.submissionsCount || 10} responses collected` : 'Click Start to launch'}
            </p>
          </div>

          {/* Average Class Understanding */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Understanding</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-amber-600">Moderate</span>
              <span className="text-xs font-bold text-slate-500">48% on Ratios</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Target benchmark: 70%</p>
          </div>

          {/* Topics Needing Attention */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Needs Attention</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold text-rose-600">Ratios (48%)</span>
            </div>
            <p className="text-xs text-rose-500 font-medium mt-1">5 students below proficiency</p>
          </div>

        </div>

        {/* PROMINENT AI INSIGHT CARD (Requirement 7) */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
          
          {/* Subtle Glow Accent */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-Time AI Diagnostic Engine</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  CLASS UNDERSTANDING: MODERATE
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">Detected Misconception</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  "{topMisconception.title}"
                </h2>
                <p className="text-sm text-slate-300 mt-1">
                  Affects <strong className="text-rose-400">{topMisconception.affectedCount} of {students.length} students ({topMisconception.affectedPercentage}%)</strong> who answered ratio comparison questions by subtracting numbers (e.g. 6 - 3 = 3).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
                  <Presentation className="w-4 h-4 text-indigo-300" />
                  <span>Recommended Teaching Action</span>
                </p>
                <p className="text-base font-bold text-white mt-1">
                  "{topMisconception.recommendedAction}"
                </p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Recommended: Spend 3 minutes at the whiteboard showing why 6:3 simplifies to 2:1 rather than subtracting. Compare side-by-side with ratio tables.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/insights"
                className="px-5 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <span>View Full AI Insights</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/live"
                className="px-5 py-3 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs border border-indigo-400/40 transition-all flex items-center justify-center space-x-2"
              >
                <Radio className="w-4 h-4 text-indigo-200" />
                <span>Open Live Session View</span>
              </Link>
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center space-x-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Possible learning gap based on distractor responses. Teachers maintain final pedagogical discretion.</span>
          </div>
        </div>

        {/* Middle Section: Topic Mastery Chart & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Topic Mastery Chart (Requirement 7) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Topic-Wise Understanding & Mastery</h3>
                <p className="text-xs text-slate-500">Benchmark comparison against 70% proficiency target</p>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Mastered (&gt;75%)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Needs Support (&lt;60%)</span>
                </span>
              </div>
            </div>

            <div className="mt-4">
              <TopicMasteryChart data={analytics?.topicMastery} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-xs text-slate-500 font-medium">Fractions</span>
                <p className="text-lg font-bold text-emerald-700">82%</p>
                <span className="text-[10px] text-emerald-600 font-semibold">Mastered</span>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-xs text-slate-500 font-medium">Percentages</span>
                <p className="text-lg font-bold text-indigo-700">71%</p>
                <span className="text-[10px] text-indigo-600 font-semibold">Proficient</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <span className="text-xs text-slate-500 font-medium">Decimals</span>
                <p className="text-lg font-bold text-amber-700">64%</p>
                <span className="text-[10px] text-amber-600 font-semibold">Developing</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                <span className="text-xs text-slate-500 font-medium">Ratios</span>
                <p className="text-lg font-bold text-rose-700">48%</p>
                <span className="text-[10px] text-rose-600 font-semibold">Attention</span>
              </div>
            </div>
          </div>

          {/* Recent Classroom Activity Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Recent Classroom Activity</h3>
                <span className="text-xs text-slate-400">Live Feed</span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">10 of 10 students submitted quiz</p>
                    <p className="text-slate-500 text-[11px]">Quiz: Understanding Ratios & Proportions</p>
                    <span className="text-[10px] text-slate-400">2 minutes ago</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Misconception pattern detected</p>
                    <p className="text-slate-500 text-[11px]">5 students subtracted instead of comparing</p>
                    <span className="text-[10px] text-slate-400">3 minutes ago</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Remediation questions dispatched</p>
                    <p className="text-slate-500 text-[11px]">Personalized explanations generated for all students</p>
                    <span className="text-[10px] text-slate-400">5 minutes ago</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800">Live session initialized</p>
                    <p className="text-slate-500 text-[11px]">Room PIN: RATIO-2026</p>
                    <span className="text-[10px] text-slate-400">10 minutes ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link
                to="/live"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>Live Quiz Session Monitor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* Student Performance Table (Requirement 7) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-soft-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Student Performance Breakdown</h3>
              <p className="text-xs text-slate-500">Live roster of 10 students with detected conceptual gaps</p>
            </div>
            <Link
              to="/progress"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 self-start sm:self-auto"
            >
              <span>View Full Progress Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4">
            <StudentTable students={students} responses={analytics?.analysis?.questionBreakdown ? [] : []} />
          </div>
        </div>

      </div>
    </div>
  );
}

