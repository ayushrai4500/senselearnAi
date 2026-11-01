import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  ChevronRight,
  Radio,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, students, loginAsStudent, showToast } = useAuth();

  const [studentId, setStudentId] = useState(searchParams.get('id') || user?.id || 'stu-1');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Practice questions interactive state
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [showPracticeResults, setShowPracticeResults] = useState({});

  useEffect(() => {
    const targetId = searchParams.get('id') || user?.id || 'stu-1';
    setStudentId(targetId);
    loadStudentData(targetId);
  }, [searchParams, user]);

  const loadStudentData = async (id) => {
    setLoading(true);
    try {
      const res = await api.getStudentAnalytics(id);
      setData(res);
    } catch (err) {
      console.error('Failed to load student analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchStudent = (newId) => {
    loginAsStudent(newId);
    setStudentId(newId);
    navigate(`/student?id=${newId}`);
  };

  const handleSelectPracticeOption = (qId, optId) => {
    setPracticeAnswers({
      ...practiceAnswers,
      [qId]: optId
    });
  };

  const handleCheckPracticeAnswer = (qId) => {
    setShowPracticeResults({
      ...showPracticeResults,
      [qId]: true
    });
  };

  const student = data?.student || students.find((s) => s.id === studentId) || students[0];
  const personalization = data?.personalization;
  const latestResponse = data?.latestResponse;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header & Student Chooser Pill */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Personalized Learning Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="text-xs text-slate-500 font-medium">{student.grade} Mathematics</span>
            </div>
            <div className="flex items-center space-x-3 mt-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                student.status === 'Excelling'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : student.status === 'Needs Support'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {student.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Student ID: <span className="font-mono">{student.id}</span> • {student.email}
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-slate-400 pl-2">Switch Learner:</span>
            <select
              value={studentId}
              onChange={(e) => handleSwitchStudent(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <optgroup label="Struggling with Concept Check">
                <option value="stu-1">Alex Rivera (0% - Ratio as difference)</option>
                <option value="stu-5">Ethan Washington (0% - Difference trap)</option>
                <option value="stu-7">Noah Kim (50% - Partial trap)</option>
                <option value="stu-3">Liam Patel (50% - Additive scaling)</option>
              </optgroup>
              <optgroup label="Excelling / Mastered">
                <option value="stu-2">Maya Chen (100% - Mastery)</option>
                <option value="stu-6">Zoe Nakamura (100% - Mastery)</option>
                <option value="stu-9">Lucas Silva (100% - Mastery)</option>
              </optgroup>
              <optgroup label="Moderate">
                <option value="stu-8">Emma Watson (75% - Minor slip)</option>
                <option value="stu-4">Sophia Rodriguez (50% - Moderate)</option>
                <option value="stu-10">Aria Vance (50% - Moderate)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* 3 Metric Cards for the Student */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Accuracy</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">{student.overallScore}%</span>
              <span className={`text-xs font-semibold ${
                student.overallScore >= 75 ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {student.overallScore >= 75 ? 'Proficient' : 'Developing'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Across 4 evaluated concepts</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Topic: Ratios Mastery</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-rose-600">
                {latestResponse ? `${latestResponse.accuracy}%` : '48%'}
              </span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Needs Attention
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Formative check benchmark: 70%</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quiz History</span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900">1 Completed</span>
              <span className="text-xs font-semibold text-indigo-600">Latest: Today</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Score: {latestResponse ? `${latestResponse.score}/4` : '2/4'}</p>
          </div>

        </div>

        {/* Strong Topics & Weak Topics Badges (Requirement 10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-soft-sm flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Strong Topics</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                  Fractions (85%)
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                  Percentages (75%)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-soft-sm flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Weak Topics (Focus Area)</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                <span className="px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold border border-rose-200">
                  Ratios & Proportions (48%)
                </span>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200">
                  Decimals (64%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONALIZED AI EXPLANATION CARD (Requirement 10) */}
        <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-purple-300 border border-purple-400/30">
                <Sparkles className="w-4 h-4 text-purple-300" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Personalized AI Diagnostic Feedback
              </span>
            </div>

            <div>
              <span className="text-xs uppercase text-slate-400 font-semibold">Focus Concept</span>
              <h2 className="text-2xl font-bold text-white mt-0.5">Topic: Ratios & Multiplicative Comparisons</h2>
            </div>

            {/* AI Explanation Box */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <p className="text-base sm:text-lg font-semibold text-purple-100 leading-relaxed italic">
                "{personalization?.diagnosticExplanation || 'A ratio compares two quantities. It does not represent subtraction. For example, the ratio of 6 apples to 3 oranges is 6:3 or 2:1.'}"
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-300">
                Solve the 3 targeted practice questions below to clear this misconception.
              </span>

              <button
                onClick={() => navigate('/live')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Full Concept Quiz</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 TARGETED ADAPTIVE PRACTICE QUESTIONS (Requirement 10) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recommended Remediation Practice (3 Questions)
              </h2>
              <p className="text-xs text-slate-500">
                Tailored exercises to build solid multiplicative intuition and replace subtraction habits.
              </p>
            </div>
          </div>

          {personalization?.practiceQuestions?.map((pq, idx) => {
            const isAnswered = Boolean(practiceAnswers[pq.id]);
            const isChecked = Boolean(showPracticeResults[pq.id]);
            const selectedOpt = pq.options.find((o) => o.id === practiceAnswers[pq.id]);
            const isCorrect = selectedOpt?.isCorrect;

            return (
              <div
                key={pq.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      P{idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
                        {pq.topic} Practice
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                        {pq.question}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* 4 Practice Options */}
                <div className="space-y-2 pt-2">
                  {pq.options.map((opt, optIdx) => {
                    const isSelected = practiceAnswers[pq.id] === opt.id;
                    let style = 'border-slate-200 hover:bg-slate-50';

                    if (isChecked) {
                      if (opt.isCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'border-rose-400 bg-rose-50 text-rose-950';
                      }
                    } else if (isSelected) {
                      style = 'border-purple-600 bg-purple-50 text-purple-950 font-semibold ring-1 ring-purple-600';
                    }

                    return (
                      <button
                        key={opt.id}
                        disabled={isChecked}
                        onClick={() => handleSelectPracticeOption(pq.id, opt.id)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center space-x-3 transition-all ${style}`}
                      >
                        <span className="font-bold text-slate-400 w-5">
                          {String.fromCharCode(65 + optIdx)}:
                        </span>
                        <span className="flex-1 font-medium">{opt.text}</span>
                        {isChecked && opt.isCorrect && (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Correct
                          </span>
                        )}
                        {isChecked && isSelected && !opt.isCorrect && (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            Incorrect (Trap)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Check Answer Button & Explanation */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {!isChecked ? (
                    <button
                      onClick={() => handleCheckPracticeAnswer(pq.id)}
                      disabled={!isAnswered}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all self-start"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 w-full space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>Step-by-step Solution:</span>
                      </div>
                      <p className="leading-relaxed font-medium">
                        {pq.explanation}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Retry Quiz CTA Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ready to test your upgraded understanding?</h4>
              <p className="text-xs text-slate-500">
                Retake the concept check to update your mastery score and help your teacher track improvement.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/live')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-2 shrink-0"
          >
            <span>Retake Live Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

