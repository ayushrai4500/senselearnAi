import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
  Presentation,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  BookOpen,
  HelpCircle,
  FileText,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import MisconceptionCard from '../components/MisconceptionCard';
import TopicMasteryChart from '../components/TopicMasteryChart';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AILearningInsightsPage() {
  const navigate = useNavigate();
  const { students, showToast } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const data = await api.getClassroomAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load AI insights', err);
    } finally {
      setLoading(false);
    }
  };

  const misconceptions = analytics?.analysis?.misconceptions || [
    {
      id: 'misc-difference',
      title: 'Ratio treated as a difference',
      affectedCount: 5,
      affectedPercentage: 50,
      severity: 'high',
      affectedStudentNames: ['Alex Rivera', 'Ethan Washington', 'Noah Kim', 'Sophia Rodriguez', 'Aria Vance'],
      questionsInvolved: [
        'In a fruit basket, there are 6 apples and 3 oranges. What is the simplified ratio of apples to oranges?',
        'The ratio of blue marbles to red marbles in a jar is 4:1. Which statement is mathematically TRUE?'
      ],
      evidence: '5 of 10 students (50%) selected distractor options explicitly indicating this misconception (e.g. 6 - 3 = 3).',
      recommendedAction: 'Re-explain ratios using a worked example comparing quantities multiplicatively rather than subtractively.'
    },
    {
      id: 'misc-additive',
      title: 'Additive reasoning instead of scaling',
      affectedCount: 3,
      affectedPercentage: 30,
      severity: 'moderate',
      affectedStudentNames: ['Liam Patel', 'Alex Rivera', 'Aria Vance'],
      questionsInvolved: [
        'A recipe uses 2 cups of sugar for every 5 cups of flour. If a baker uses 10 cups of flour, how much sugar is needed?'
      ],
      evidence: '3 of 10 students added the difference (+5) rather than multiplying by the scaling factor (×2).',
      recommendedAction: 'Demonstrate table scaling and contrast additive patterns vs multiplicative constant factors.'
    },
    {
      id: 'misc-inversion',
      title: 'Order inverted (cats to dogs instead of dogs to cats)',
      affectedCount: 2,
      affectedPercentage: 20,
      severity: 'low',
      affectedStudentNames: ['Liam Patel', 'Sophia Rodriguez'],
      questionsInvolved: [
        'There are 8 cats and 12 dogs at an animal shelter. What is the simplified ratio of dogs to cats?'
      ],
      evidence: 'Students reversed terms (2:3 instead of 3:2), failing to align problem sequence.',
      recommendedAction: 'Highlight matching terms in problem order (e.g., "dogs to cats" means dogs is the first term).'
    }
  ];

  const studentsNeedingSupport = analytics?.analysis?.studentsNeedingSupport || [
    { studentId: 'stu-1', name: 'Alex Rivera', score: '0/4', accuracy: 0, primaryGaps: ['Ratio treated as a difference', 'Additive reasoning'] },
    { studentId: 'stu-5', name: 'Ethan Washington', score: '0/4', accuracy: 0, primaryGaps: ['Ratio treated as a difference'] },
    { studentId: 'stu-7', name: 'Noah Kim', score: '2/4', accuracy: 50, primaryGaps: ['Ratio treated as a difference'] },
    { studentId: 'stu-3', name: 'Liam Patel', score: '2/4', accuracy: 50, primaryGaps: ['Additive reasoning', 'Order inverted'] },
    { studentId: 'stu-4', name: 'Sophia Rodriguez', score: '2/4', accuracy: 50, primaryGaps: ['Ratio treated as a difference'] },
    { studentId: 'stu-10', name: 'Aria Vance', score: '2/4', accuracy: 50, primaryGaps: ['Ratio treated as a difference'] }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <button
              onClick={() => navigate('/teacher')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Teacher Dashboard</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Cognitive Diagnostic Layer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500 font-medium">Concept Check Analysis</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              AI Learning Gap Diagnostics & Insights
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Topic: Ratios & Proportions • 10 Submissions Evaluated
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/teacher"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-soft-sm transition-all"
            >
              Teacher Overview
            </Link>
            <Link
              to="/live"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all"
            >
              Active Session Room
            </Link>
          </div>
        </div>

        {/* Safeguard & Diagnostic Transparency Notice (Requirement 11 & 14) */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex items-start space-x-3.5 text-xs">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-bold text-amber-950 block">
              Ethical AI Safeguard: Possible Learning Gaps (Not Diagnoses)
            </strong>
            All identified cognitive gaps are transparently derived from student distractor selections and labeled as <em>possible learning gaps</em>. Educators remain in complete pedagogical control over classroom pacing and decisions.
          </div>
        </div>

        {/* 3 Summary Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Understanding Level</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-amber-600">Moderate</span>
              <span className="text-xs font-semibold text-slate-500">(48% Topic Accuracy)</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              5 of 10 students scored below the 70% proficiency threshold on multiplicative comparison questions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Primary Cognitive Misconception</span>
            <div className="mt-2 text-xl font-bold text-slate-900">
              Ratio treated as difference
            </div>
            <p className="text-xs text-rose-600 font-semibold mt-1">
              Affects 50% of the class (5 students)
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Students subtracted quantities rather than dividing/scaling.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Recommended Next Step</span>
            <div className="mt-2 text-sm font-bold text-indigo-700 leading-snug">
              "Re-explain ratios using a worked example."
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              3-minute whiteboard intervention contrasting 6:3 = 2:1 against subtraction (6 - 3 = 3).
            </p>
          </div>

        </div>

        {/* Detailed Misconception Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Detected Conceptual Misconceptions ({misconceptions.length})</h2>
              <p className="text-xs text-slate-500">
                Grouped by pattern with student evidence and recommended teaching adaptations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {misconceptions.map((misc) => (
              <MisconceptionCard key={misc.id} misconception={misc} />
            ))}
          </div>
        </div>

        {/* Students Needing Additional Support Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Students Needing Targeted Support ({studentsNeedingSupport.length})</h3>
              <p className="text-xs text-slate-500">Students who scored ≤ 50% on this formative check</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Remediation Dispatched
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentsNeedingSupport.map((st) => (
              <div
                key={st.studentId}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{st.name}</span>
                    <span className="text-xs font-extrabold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded">
                      {st.score} ({st.accuracy}%)
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase block">Identified Gap:</span>
                    <span className="text-xs font-semibold text-rose-700">
                      {st.primaryGaps?.[0] || 'Ratio treated as a difference'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80">
                  <Link
                    to={`/student?id=${st.studentId}`}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-between"
                  >
                    <span>View Student Diagnostic & Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Action Plan Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 sm:p-8 text-white shadow-soft-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Actionable Next Step for Teacher
              </span>
              <h3 className="text-2xl font-bold text-white">
                Ready for the 3-Minute Whiteboard Intervention?
              </h3>
              <p className="text-sm text-indigo-200 leading-relaxed">
                Draw two baskets on the board: Basket A with 6 apples and 3 oranges. Show that grouping them into pairs yields 2 apples for every 1 orange (2:1). Contrast this visually with subtraction (6 - 3 = 3).
              </p>
            </div>

            <Link
              to="/teacher"
              className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-md transition-all shrink-0 text-center"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

