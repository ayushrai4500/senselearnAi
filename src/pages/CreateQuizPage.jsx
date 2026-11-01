import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  Save,
  Radio,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [quizMeta, setQuizMeta] = useState({
    title: 'Unit Rate & Proportion Quick Check',
    topic: 'Ratios',
    gradeLevel: '8th Grade Math',
    durationMinutes: 5
  });

  const [questions, setQuestions] = useState([
    {
      id: 'q-custom-1',
      prompt: 'If a runner covers 15 kilometers in 3 hours, what is their average speed (ratio of km to hours)?',
      explanation: 'Divide the total distance (15 km) by time (3 hours) to find the unit rate: 15 ÷ 3 = 5 km/hr.',
      options: [
        { id: 'opt-c1-a', text: '12 km/hr (15 - 3 = 12)', isCorrect: false, misconceptionTag: 'Ratio treated as a difference' },
        { id: 'opt-c1-b', text: '5 km/hr', isCorrect: true, misconceptionTag: null },
        { id: 'opt-c1-c', text: '45 km/hr (15 × 3)', isCorrect: false, misconceptionTag: 'Indiscriminate multiplication' },
        { id: 'opt-c1-d', text: '0.2 km/hr (3 ÷ 15)', isCorrect: false, misconceptionTag: 'Inverted ratio order' }
      ]
    },
    {
      id: 'q-custom-2',
      prompt: 'A lemonade recipe calls for 3 lemons for every 4 cups of water. How many lemons are needed for 12 cups of water?',
      explanation: 'Water increased by a factor of 3 (4 × 3 = 12). Lemons must also multiply by 3: 3 × 3 = 9 lemons.',
      options: [
        { id: 'opt-c2-a', text: '11 lemons (4 + 8 water, so 3 + 8 lemons)', isCorrect: false, misconceptionTag: 'Additive reasoning instead of scaling' },
        { id: 'opt-c2-b', text: '9 lemons', isCorrect: true, misconceptionTag: null },
        { id: 'opt-c2-c', text: '1 lemon (12 - 11)', isCorrect: false, misconceptionTag: 'Ratio treated as a difference' },
        { id: 'opt-c2-d', text: '16 lemons', isCorrect: false, misconceptionTag: 'Uncorrelated proportion' }
      ]
    }
  ]);

  const handleAddQuestion = () => {
    const qNum = questions.length + 1;
    const newQ = {
      id: `q-custom-${Date.now()}`,
      prompt: `New Concept Question #${qNum}`,
      explanation: 'Provide the correct mathematical reasoning for this question.',
      options: [
        { id: `opt-${Date.now()}-1`, text: 'Option A (Correct Answer)', isCorrect: true, misconceptionTag: null },
        { id: `opt-${Date.now()}-2`, text: 'Option B (Common distractor)', isCorrect: false, misconceptionTag: 'Ratio treated as a difference' },
        { id: `opt-${Date.now()}-3`, text: 'Option C', isCorrect: false, misconceptionTag: 'Additive reasoning instead of scaling' },
        { id: `opt-${Date.now()}-4`, text: 'Option D', isCorrect: false, misconceptionTag: 'Inverted ratio order' }
      ]
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      showToast('A quiz must contain at least one question.', 'error');
      return;
    }
    const updated = [...questions];
    updated.splice(idx, 1);
    setQuestions(updated);
  };

  const handlePromptChange = (qIdx, text) => {
    const updated = [...questions];
    updated[qIdx].prompt = text;
    setQuestions(updated);
  };

  const handleExplanationChange = (qIdx, text) => {
    const updated = [...questions];
    updated[qIdx].explanation = text;
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx].text = text;
    setQuestions(updated);
  };

  const handleOptionTagChange = (qIdx, optIdx, tag) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx].misconceptionTag = tag;
    setQuestions(updated);
  };

  const handleMarkCorrect = (qIdx, optIdx) => {
    const updated = [...questions];
    updated[qIdx].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optIdx;
      if (opt.isCorrect) opt.misconceptionTag = null;
    });
    setQuestions(updated);
  };

  const handlePublish = async () => {
    if (!quizMeta.title.trim()) {
      showToast('Please enter a quiz title.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const created = await api.createQuiz({
        ...quizMeta,
        questions
      });

      showToast(`Quiz "${created.title}" published successfully!`, 'success');

      // Auto start live session with newly created quiz
      const sess = await api.startLiveSession(created.id);
      showToast(`Live session launched with code ${sess.code}`, 'success');
      navigate('/live');
    } catch (err) {
      showToast('Failed to publish quiz: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <button
              onClick={() => navigate('/teacher')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Teacher Dashboard</span>
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Concept-Check Quiz
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Design formative assessment questions with misconception-tagged distractors for real-time AI gap detection.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePublish}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-2"
            >
              <Radio className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish & Start Live Session'}</span>
            </button>
          </div>
        </div>

        {/* Quiz Metadata Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            1. Quiz Details & Subject Topic
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                value={quizMeta.title}
                onChange={(e) => setQuizMeta({ ...quizMeta, title: e.target.value })}
                placeholder="e.g. Concept Check: Understanding Ratios & Proportions"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mathematical Topic
              </label>
              <select
                value={quizMeta.topic}
                onChange={(e) => setQuizMeta({ ...quizMeta, topic: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Ratios">Ratios</option>
                <option value="Fractions">Fractions</option>
                <option value="Decimals">Decimals</option>
                <option value="Percentages">Percentages</option>
                <option value="Algebraic Equations">Algebraic Equations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Grade Level
              </label>
              <input
                type="text"
                value={quizMeta.gradeLevel}
                onChange={(e) => setQuizMeta({ ...quizMeta, gradeLevel: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={quizMeta.durationMinutes}
                onChange={(e) => setQuizMeta({ ...quizMeta, durationMinutes: Number(e.target.value) })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Questions Builder Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                2. Concept-Check Questions ({questions.length})
              </h2>
              <p className="text-xs text-slate-500">
                Tag distractor options with misconceptions so the AI can diagnose student reasoning errors.
              </p>
            </div>

            <button
              onClick={handleAddQuestion}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                  Q{qIdx + 1}
                </span>

                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Prompt
                  </label>
                  <textarea
                    rows={2}
                    value={q.prompt}
                    onChange={(e) => handlePromptChange(qIdx, e.target.value)}
                    placeholder="Enter question prompt..."
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={() => handleRemoveQuestion(qIdx)}
                  title="Remove question"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Answer Options (Select radio button for the correct answer)
                </label>

                {q.options.map((opt, optIdx) => (
                  <div
                    key={opt.id}
                    className={`p-3 rounded-xl border transition-all ${
                      opt.isCorrect
                        ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-300'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name={`correct-radio-${qIdx}`}
                        checked={opt.isCorrect}
                        onChange={() => handleMarkCorrect(qIdx, optIdx)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />

                      <span className="text-xs font-bold text-slate-400 w-5">
                        {String.fromCharCode(65 + optIdx)}:
                      </span>

                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-white"
                      />

                      {opt.isCorrect ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                          Correct Answer
                        </span>
                      ) : (
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">AI Tag:</span>
                          <input
                            type="text"
                            value={opt.misconceptionTag || ''}
                            onChange={(e) => handleOptionTagChange(qIdx, optIdx, e.target.value)}
                            placeholder="e.g. Ratio treated as difference"
                            className="text-[11px] px-2 py-1 rounded border border-amber-200 bg-amber-50/40 text-amber-900 w-44"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanation Field */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Correct Answer Explanation (Displayed to students in personalized remediation)</span>
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                  placeholder="Explain why the correct answer is right and why distractors are traps..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                />
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Publish Bar */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => navigate('/teacher')}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>

          <button
            onClick={handlePublish}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center space-x-2"
          >
            <Radio className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Publish & Start Live Session'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

