import React, { useState } from 'react';
import {
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Users,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MisconceptionCard({ misconception, onActionClick }) {
  const [expanded, setExpanded] = useState(false);

  if (!misconception) return null;

  const severityColor =
    misconception.severity === 'high'
      ? 'bg-rose-50 border-rose-200 text-rose-800'
      : misconception.severity === 'moderate'
      ? 'bg-amber-50 border-amber-200 text-amber-800'
      : 'bg-blue-50 border-blue-200 text-blue-800';

  const badgeColor =
    misconception.severity === 'high'
      ? 'bg-rose-100 text-rose-700'
      : misconception.severity === 'moderate'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-blue-100 text-blue-700';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-soft-sm hover:shadow-soft-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Detected Misconception
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${badgeColor}`}>
                {misconception.severity} Priority
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              "{misconception.title}"
            </h3>
          </div>
        </div>

        {/* Affected Students Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold self-start shrink-0">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>{misconception.affectedCount} Students ({misconception.affectedPercentage}%)</span>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="mt-4 p-3.5 bg-gradient-to-r from-indigo-50/70 to-purple-50/50 rounded-xl border border-indigo-100/80">
        <div className="flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-800">
              Recommended Teaching Action
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
              {misconception.recommendedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence & Diagnosis */}
      <div className="mt-3.5 text-xs text-slate-600 flex items-start space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <strong className="text-slate-900 shrink-0">Evidence:</strong>
        <p className="text-slate-600 italic">
          "{misconception.evidence}"
        </p>
      </div>

      {/* Expand/Collapse Evidence Details */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <span>{expanded ? 'Hide Evidence & Student List' : 'View Affected Students & Questions'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <Link
          to="/insights"
          className="text-xs font-semibold text-slate-700 hover:text-indigo-600 flex items-center space-x-1"
        >
          <span>Detailed AI Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Collapsible Student & Question List */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-fade-in text-xs">
          <div>
            <span className="font-semibold text-slate-700 block mb-1">Affected Students:</span>
            <div className="flex flex-wrap gap-1.5">
              {misconception.affectedStudentNames?.map((name, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-medium border border-rose-100"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {misconception.questionsInvolved?.length > 0 && (
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Related Questions:</span>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {misconception.questionsInvolved.map((q, idx) => (
                  <li key={idx} className="line-clamp-2">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

