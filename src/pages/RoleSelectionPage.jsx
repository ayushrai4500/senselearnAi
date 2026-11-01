import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Presentation,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleSelectionPage() {
  const { students, loginAsTeacher, loginAsStudent, resetAllDemoData, showToast } = useAuth();
  const navigate = useNavigate();
  const [selectedStudentId, setSelectedStudentId] = useState('stu-1');
  const [resetting, setResetting] = useState(false);

  const handleTeacherLogin = () => {
    loginAsTeacher();
    navigate('/teacher');
  };

  const handleStudentLogin = (stuId) => {
    const targetId = stuId || selectedStudentId;
    loginAsStudent(targetId);
    navigate('/student');
  };

  const handleReset = async () => {
    setResetting(true);
    await resetAllDemoData();
    setResetting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Demo Environment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Select Your Role to Enter SenseLearn AI
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
            Experience both perspectives of the real-time classroom feedback loop. No passwords required for this demo.
          </p>
        </div>

        {/* Dual Role Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Teacher Card */}
          <div className="bg-white rounded-2xl border-2 border-indigo-200/80 p-6 sm:p-8 shadow-soft-md hover:border-indigo-500 hover:shadow-soft-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-600/30">
                <Presentation className="w-7 h-7" />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Educator Portal</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  Full Analytics Access
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">Continue as Teacher</h2>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                Dr. Evelyn Foster <span className="font-normal text-slate-500">• 8th Grade Math Lead</span>
              </p>

              <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                Inspect live classroom understanding metrics, launch active quiz sessions, review AI-detected cognitive misconceptions (e.g. "Ratio treated as difference"), and trigger pedagogical interventions.
              </p>

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time class understanding overview</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Topic mastery charts (Fractions 82%, Ratios 48%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI evidence & recommended teaching actions</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={handleTeacherLogin}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter as Teacher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Card */}
          <div className="bg-white rounded-2xl border-2 border-purple-200/80 p-6 sm:p-8 shadow-soft-md hover:border-purple-500 hover:shadow-soft-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-md shadow-purple-600/30">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Student Portal</span>
                <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                  Personalized Learner View
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-1">Continue as Student</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Take live concept-check quizzes, see instant feedback, and receive personalized AI diagnostic explanations and targeted remediation practice.
              </p>

              {/* Student Profile Quick Chooser */}
              <div className="mt-4 bg-purple-50/50 p-3.5 rounded-xl border border-purple-100">
                <label className="block text-xs font-bold text-purple-900 mb-1.5">
                  Select Demo Student Profile:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-purple-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <optgroup label="Struggling with Misconception (Score 0-50%)">
                    <option value="stu-1">Alex Rivera (0% - Ratio treated as difference)</option>
                    <option value="stu-5">Ethan Washington (0% - Multiple differences)</option>
                    <option value="stu-7">Noah Kim (50% - Partial difference trap)</option>
                    <option value="stu-3">Liam Patel (50% - Additive scaling error)</option>
                  </optgroup>
                  <optgroup label="Excelling / Mastered (Score 90-100%)">
                    <option value="stu-2">Maya Chen (100% - Full concept mastery)</option>
                    <option value="stu-6">Zoe Nakamura (100% - Full concept mastery)</option>
                    <option value="stu-9">Lucas Silva (100% - Full concept mastery)</option>
                  </optgroup>
                  <optgroup label="Moderate (Score 60-75%)">
                    <option value="stu-8">Emma Watson (75% - Minor slip)</option>
                    <option value="stu-4">Sophia Rodriguez (50% - Inverted terms)</option>
                    <option value="stu-10">Aria Vance (50% - Moderate)</option>
                  </optgroup>
                </select>
                <p className="text-[11px] text-purple-700 mt-1.5">
                  Tip: Alex Rivera will demonstrate targeted remediation for the "Ratio as difference" misconception.
                </p>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Targeted AI cognitive explanation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>3 interactive remediation practice questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Retry quiz capability to demonstrate learning growth</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => handleStudentLogin(selectedStudentId)}
                className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Enter as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Demo Reset Card */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Reset Demo Classroom State</h4>
              <p className="text-xs text-slate-500">
                Restore the preloaded 10 students, default Ratios responses, and classroom analytics baseline.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition-colors shrink-0 flex items-center space-x-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </div>
    </div>
  );
}

