import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CreateQuizPage from './pages/CreateQuizPage';
import LiveQuizSessionPage from './pages/LiveQuizSessionPage';
import AILearningInsightsPage from './pages/AILearningInsightsPage';
import StudentProgressPage from './pages/StudentProgressPage';
import { useAuth } from './context/AuthContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const { notification, setNotification } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : 'bg-indigo-950/90 border-indigo-500/40 text-indigo-200'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-indigo-400 shrink-0" />}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:opacity-75 rounded transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<RoleSelectionPage />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/live" element={<LiveQuizSessionPage />} />
          <Route path="/insights" element={<AILearningInsightsPage />} />
          <Route path="/progress" element={<StudentProgressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

