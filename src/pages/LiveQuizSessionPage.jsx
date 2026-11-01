import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  BrainCircuit,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LiveQuizSessionPage() {
  const navigate = useNavigate();
  const { user, isTeacher, isStudent, students, showToast } = useAuth();

  const [activeSession, setActiveSession] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Student quiz taking state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  // Timer countdown
  const [timeLeft, setTimeLeft] = useState(295);

  useEffect(() => {
    loadSessionAndQuiz();
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadSessionAndQuiz = async () => {
    setLoading(true);
    try {
      const sess = await api.getActiveSession();
      setActiveSession(sess);

      if (sess && sess.quizId) {
        const q = await api.getQuizById(sess.quizId);
        setQuiz(q);
      } else {
        const quizzes = await api.getQuizzes();
        setQuiz(quizzes[0]);
      }
    } catch (err) {
      console.error('Failed to load live quiz session', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    if (activeSession?.code) {
      navigator.clipboard.writeText(activeSession.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(`Session code ${activeSession.code} copied!`, 'info');
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const handleSubmitStudentQuiz = async () => {
    if (!quiz) return;

    // Check if all questions answered
    const unanswered = quiz.questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      showToast(`Please answer all ${quiz.questions.length} questions before submitting.`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const studentId = user?.id || 'stu-1';
      const result = await api.submitQuizResponse(studentId, quiz.id, selectedAnswers);
      setSubmittedResult(result);

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('Quiz submitted successfully! Analyzing conceptual gaps...', 'success');
    } catch (err) {
      showToast('Submission error: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    if (confirm('End this live quiz session and review classroom insights?')) {
      await api.endLiveSession();
      showToast('Live session concluded. Moving to AI Learning Insights...', 'success');
      navigate('/insights');
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-600 font-semibold text-sm">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing live session...</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STUDENT SUBMITTED RESULT VIEW
  // -------------------------------------------------------------
  if (isStudent && submittedResult) {
    const accuracy = submittedResult.response?.accuracy ?? 50;
    const score = submittedResult.response?.score ?? 2;
    const total = submittedResult.response?.totalQuestions ?? 4;
    const personalization = submittedResult.personalization;

    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-soft-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Response Submitted</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Quiz Completed!</h1>
            <p className="text-sm text-slate-500 mt-1">
              {quiz?.title || 'Understanding Ratios & Proportions'}
            </p>
          </div>

          {/* Score Badge */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto">
            <span className="text-xs font-semibold text-slate-400 uppercase">Your Performance</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-1">
              {score} / {total}
            </div>
            <p className={`text-xs font-bold mt-1 ${accuracy >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {accuracy}% Accuracy • {accuracy >= 75 ? 'Concept Mastered' : 'Learning Gap Detected'}
            </p>
          </div>

          {/* AI Immediate Explanation Preview */}
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-left space-y-2">
            <div className="flex items-center space-x-2 text-purple-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Targeted AI Feedback</span>
            </div>
            <p className="text-sm text-slate-800 font-medium leading-relaxed">
              "{personalization?.diagnosticExplanation}"
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-700">
              3 adaptive practice questions have been prepared for you.
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/student')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>View Personalized Dashboard & Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedResult(null);
                setSelectedAnswers({});
                setCurrentQuestionIdx(0);
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STUDENT QUIZ TAKING VIEW
  // -------------------------------------------------------------
  if (isStudent && quiz) {
    const currentQ = quiz.questions[currentQuestionIdx];
    const totalQ = quiz.questions.length;
    const hasAnsweredCurrent = Boolean(selectedAnswers[currentQ?.id]);
    const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id]);

    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Top Session & Timer Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-soft-sm flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Live Session PIN</span>
                <p className="font-mono font-bold text-slate-800 text-xs">{activeSession?.code || 'RATIO-2026'}</p>
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Progress</span>
              <p className="text-xs font-bold text-slate-800">
                Question {currentQuestionIdx + 1} of {totalQ}
              </p>
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono">{formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-sm space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Question {currentQuestionIdx + 1} of {totalQ} • {quiz.topic}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {currentQ?.prompt}
              </h2>
            </div>

            {/* 4 Options */}
            <div className="space-y-3 pt-2">
              {currentQ?.options?.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQ.id, opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-4 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-600 text-indigo-950'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-sm font-semibold flex-1 leading-snug">
                      {opt.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submit Bar */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIdx === 0}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>

              <div className="flex items-center space-x-2">
                {currentQuestionIdx < totalQ - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((prev) => Math.min(totalQ - 1, prev + 1))}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-soft-sm transition-all"
                  >
                    Next Question &rarr;
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitStudentQuiz}
                    disabled={submitting || !allAnswered}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Analyzing Responses...' : 'Submit Answers'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Switch to Teacher View Reminder */}
          <div className="text-center text-xs text-slate-500">
            Testing as Student: <strong className="text-slate-800">{user?.name}</strong> • Switch to Teacher in the top-right menu to view live classroom telemetry.
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // TEACHER LIVE MONITOR VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Live Classroom Session Active</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Live Session Telemetry & Responses
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {quiz?.title || 'Concept Check: Understanding Ratios & Proportions'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleEndSession}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all"
            >
              End Session & View AI Insights
            </button>
          </div>
        </div>

        {/* Live Session Room Code & Telemetry Hero */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            {/* PIN Code Box */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block">
                Classroom Room PIN
              </span>
              <div className="flex items-center space-x-3 mt-1">
                <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-white">
                  {activeSession?.code || 'RATIO-2026'}
                </span>
                <button
                  onClick={copyCode}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Copy PIN"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Students enter this code to join check-in</p>
            </div>

            {/* Submissions Counter */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block">
                Responses Received
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">10</span>
                <span className="text-sm font-semibold text-slate-300">/ 10 Students (100%)</span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium mt-1">All responses collected & analyzed</p>
            </div>

            {/* Time Elapsed */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block">
                Live Status
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-2xl font-bold text-white">Ready to Adapt</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">AI misconception clustering completed</p>
            </div>

          </div>
        </div>

        {/* Live Question-By-Question Response Telemetry */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Live Question Breakdown & Distractor Telemetry</h2>
            <p className="text-xs text-slate-500">
              Visual proof of student responses grouped by cognitive misconception tags.
            </p>
          </div>

          {quiz?.questions?.map((q, idx) => {
            // Sample simulated distribution for the 10 students
            // Q1: 5 students picked 3:1 (difference), 5 picked 2:1 (correct)
            let distribution = [
              { label: '3:1 (Difference trap: 6 - 3 = 3)', count: idx === 0 ? 5 : idx === 3 ? 4 : 2, isCorrect: false, tag: 'Ratio treated as difference' },
              { label: idx === 0 ? '2:1' : idx === 1 ? '4 cups' : idx === 2 ? 'For every 1 red, 4 blue' : '3:2', count: idx === 0 ? 5 : 5, isCorrect: true, tag: null },
              { label: 'Alternative distractor', count: 0, isCorrect: false, tag: 'Inverted' },
              { label: 'Other distractor', count: 0, isCorrect: false, tag: 'Part-to-whole' },
            ];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {q.prompt}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Correct Answer Explanation: {q.explanation}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                    50% Correct
                  </span>
                </div>

                {/* Option Distribution Bars */}
                <div className="space-y-2.5 pt-2">
                  {q.options.map((opt, optIdx) => {
                    // Calculate visual mock count for the 10 preloaded students
                    const count = opt.isCorrect ? 5 : opt.misconceptionTag?.includes('difference') ? 4 : 1;
                    const pct = count * 10;

                    return (
                      <div key={opt.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-400">{String.fromCharCode(65 + optIdx)}:</span>
                            <span className={opt.isCorrect ? 'text-emerald-700 font-bold' : 'text-slate-700'}>
                              {opt.text}
                            </span>
                            {opt.isCorrect && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                                Correct
                              </span>
                            )}
                            {opt.misconceptionTag && (
                              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-semibold">
                                Trap: {opt.misconceptionTag}
                              </span>
                            )}
                          </div>
                          <span className="text-slate-500">{count} students ({pct}%)</span>
                        </div>

                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              opt.isCorrect
                                ? 'bg-emerald-500'
                                : opt.misconceptionTag?.includes('difference')
                                ? 'bg-rose-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Bottom Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ready to Review Comprehensive AI Insights?</h4>
              <p className="text-xs text-slate-500">
                AI has identified the primary cognitive misconception and formatted actionable whiteboard examples.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/insights')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-2 shrink-0"
          >
            <span>Proceed to AI Insights</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

