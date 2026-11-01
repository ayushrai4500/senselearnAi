import React from 'react';
import { ArrowUpRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function StudentTable({ students = [], responses = [] }) {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuth();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Excelling':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
            Excelling
          </span>
        );
      case 'Needs Support':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 mr-1 text-rose-500" />
            Needs Support
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1 text-amber-500" />
            Moderate
          </span>
        );
    }
  };

  const getStudentPrimaryGap = (studentId) => {
    const studentResp = responses.find(r => r.studentId === studentId);
    if (!studentResp) return 'None detected';
    if (studentResp.accuracy === 100) return 'No gaps detected (Full Mastery)';
    if (studentResp.answers) {
      if (studentResp.answers.q1 === 'opt-1a' || studentResp.answers.q3 === 'opt-3a' || studentResp.answers.q4 === 'opt-4a') {
        return 'Ratio treated as a difference';
      }
      if (studentResp.answers.q2 === 'opt-2a') {
        return 'Additive scaling confusion';
      }
      if (studentResp.answers.q4 === 'opt-4b') {
        return 'Inverted ratio order';
      }
    }
    return 'General concept reinforcement';
  };

  const handleInspectStudent = (studentId) => {
    loginAsStudent(studentId);
    navigate(`/student`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50/70">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Student
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Score & Accuracy
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Primary Learning Gap
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {students.map((st) => {
            const gap = getStudentPrimaryGap(st.id);
            const score = st.overallScore;

            return (
              <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200/50">
                      {st.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{st.name}</div>
                      <div className="text-xs text-slate-400">{st.grade} • {st.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-800 w-9">{score}%</span>
                    <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap">
                  {getStatusBadge(st.status)}
                </td>

                <td className="px-4 py-3.5 text-xs text-slate-600">
                  {gap === 'Ratio treated as a difference' ? (
                    <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {gap}
                    </span>
                  ) : gap.includes('Full Mastery') ? (
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {gap}
                    </span>
                  ) : (
                    <span className="text-slate-600">{gap}</span>
                  )}
                </td>

                <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs">
                  <button
                    onClick={() => handleInspectStudent(st.id)}
                    className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-900 font-semibold hover:underline"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

