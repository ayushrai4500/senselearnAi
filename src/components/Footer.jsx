import React from 'react';
import { BrainCircuit, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                SenseLearn<span className="text-indigo-400">.AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Real-time classroom personalization layer. Detecting learning gaps during live instruction, clustering misconceptions, and generating adaptive remediation without disrupting classroom flow.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy-First Safeguard: Anonymized Response Engine & Transparent Diagnostics</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/teacher" className="hover:text-white transition-colors">Teacher Dashboard</Link>
              </li>
              <li>
                <Link to="/student" className="hover:text-white transition-colors">Personalized Student View</Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-white transition-colors">Live Quiz Session</Link>
              </li>
              <li>
                <Link to="/insights" className="hover:text-white transition-colors">AI Learning Insights</Link>
              </li>
              <li>
                <Link to="/create-quiz" className="hover:text-white transition-colors">Create Concept Check</Link>
              </li>
            </ul>
          </div>

          {/* Safeguards & Hackathon Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Ethics & Safeguards</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Detected gaps are flagged as <em>possible learning gaps</em> with verifiable distractor evidence. Human educators retain full agency and control.
            </p>
            <div className="inline-block px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-[11px] text-slate-300">
              <span className="font-semibold text-indigo-400">Hackathon Working Prototype</span> • Built with React, Tailwind & Node.js
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 SenseLearn AI. Every Student Learns Differently. Every Classroom Should Adapt.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Designed for Next-Generation Classrooms</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

