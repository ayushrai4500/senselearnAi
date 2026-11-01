import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Presentation,
  BarChart3,
  Zap,
  Target,
  RefreshCw,
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { loginAsTeacher, loginAsStudent } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-100/40 via-purple-100/40 to-blue-50/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-soft-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>AI-Powered Real-Time Classroom Personalization Layer</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Every Student Learns Differently.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600">
              Every Classroom Should Adapt.
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            SenseLearn AI captures live student concept-check responses during lecture, pinpoints cognitive misconceptions in real time, and arms teachers with immediate intervention strategies before learning gaps solidify.
          </p>

          {/* Call-to-actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/teacher"
              onClick={loginAsTeacher}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-soft-sm hover:shadow-soft-md transition-all flex items-center justify-center space-x-2"
            >
              <Presentation className="w-4 h-4 text-indigo-600" />
              <span>Explore Teacher Demo</span>
            </Link>

            <Link
              to="/student"
              onClick={() => loginAsStudent('stu-1')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-base border border-purple-200 transition-all flex items-center justify-center space-x-2"
            >
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Explore Student Demo</span>
            </Link>
          </div>

          {/* Live Benchmark Teaser Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-soft-lg p-5 sm:p-7 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Preloaded Live Session • 8th Grade Math (10 Students Connected)
                </span>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200 self-start sm:self-auto">
                Class Understanding: Moderate (48% Ratios)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-xs font-semibold text-slate-400 uppercase">Top Detected Misconception</span>
                <p className="text-base font-bold text-slate-900 mt-1">Ratio treated as a difference</p>
                <p className="text-xs text-rose-600 font-medium mt-1">Affects 5 of 10 students (50%)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-xs font-semibold text-slate-400 uppercase">Teacher Action In-Lecture</span>
                <p className="text-sm font-semibold text-slate-800 mt-1">"Re-explain ratios using a worked example."</p>
                <p className="text-xs text-indigo-600 font-medium mt-1">3-minute whiteboard intervention</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="text-xs font-semibold text-indigo-700 uppercase">Personalized Student Feedback</span>
                <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                  "A ratio compares quantities multiplicatively, not by subtracting..."
                </p>
                <p className="text-xs font-bold text-indigo-700 mt-1">3 adaptive practice questions ready</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Transforming Formative Assessment
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              Closing the loop between teaching and comprehension
            </p>
            <p className="text-slate-600 text-sm mt-3">
              Standard quizzes tell you what students got wrong after the test is over. SenseLearn AI reveals <em>why</em> they got it wrong while you are still teaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-md shadow-indigo-600/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Instant Concept Checks</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Launch interactive 2-to-4 question checks in seconds. Students join instantly from laptops, tablets, or phones without complex logins.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-md shadow-purple-600/20">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cognitive Misconception Clustering</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Our analysis engine clusters distractor selections to detect specific thinking traps (like additive vs multiplicative reasoning) instead of just scoring right/wrong.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-soft-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-5 shadow-md shadow-emerald-600/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Adaptive Remediation</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Every student immediately receives tailored diagnostic explanations and targeted practice questions matched to their detected cognitive gap.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The 4-Step Live Loop</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">How SenseLearn AI Works</h2>
            <p className="text-sm text-slate-600 mt-2">
              Designed to take less than 4 minutes of class time while radically improving retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-base">Teacher Launches Check</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Teacher triggers a 3-question formative check on Ratios midway through lecture.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-base">Students Answer</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Students enter PIN and submit their answers on their personal devices in under 2 minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-base">AI Pinpoints Gaps</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                The engine clusters incorrect options: 5 students subtracted (6 - 3 = 3) instead of dividing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft-sm relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-base">Instant Micro-Adaptation</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Teacher pivots to a 2-minute worked example; affected students receive targeted remediation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dual Dashboard Preview Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Dual Perspectives</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Tailored Dashboards for Teachers & Students</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Teacher View Preview */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Presentation className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-slate-900">Teacher Command Center</span>
                </div>
                <Link
                  to="/teacher"
                  onClick={loginAsTeacher}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Average Class Understanding</span>
                    <span className="font-bold text-amber-600">Moderate (48% Ratios)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200/80">
                  <span className="text-xs font-bold text-rose-600 uppercase">Top Insight</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">Misconception: Ratio treated as a difference</p>
                  <p className="text-xs text-slate-500 mt-1">Recommended: "Re-explain ratios using a worked example."</p>
                </div>
              </div>
            </div>

            {/* Student View Preview */}
            <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 shadow-soft-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span className="font-bold text-slate-900">Student Learning Studio</span>
                </div>
                <Link
                  to="/student"
                  onClick={() => loginAsStudent('stu-1')}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center space-x-1"
                >
                  <span>Launch Student View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-purple-100">
                  <span className="text-xs font-bold text-purple-700 uppercase">Targeted AI Explanation</span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    "A ratio compares two quantities through division, not subtraction. 6 apples to 3 oranges simplifies to 2:1, not 3:1."
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500">Remediation Practice</span>
                    <p className="text-sm font-bold text-slate-800">3 Interactive Practice Questions</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold">
                    Ready
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience real-time classroom adaptation?
          </h2>
          <p className="mt-4 text-indigo-200 text-base max-w-2xl mx-auto">
            Test the live interactive simulation with 10 preloaded students, real-time live sessions, and verifiable AI misconception analysis.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/teacher"
              onClick={loginAsTeacher}
              className="px-8 py-3.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 shadow-lg transition-all"
            >
              Start as Teacher (Dr. Evelyn Foster)
            </Link>
            <Link
              to="/student"
              onClick={() => loginAsStudent('stu-1')}
              className="px-8 py-3.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold border border-indigo-500 transition-all"
            >
              Start as Student (Alex Rivera)
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

