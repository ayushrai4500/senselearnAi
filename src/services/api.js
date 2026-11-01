import {
  initialStudents,
  initialQuizzes,
  initialResponses,
  initialTopicMastery,
  initialActiveSession
} from './mockData.js';
import {
  analyzeClassroomQuizClient,
  generateStudentPersonalizationClient
} from './aiClientEngine.js';

// Local storage keys for resilient fallback
const STORAGE_KEYS = {
  STUDENTS: 'sl_students',
  QUIZZES: 'sl_quizzes',
  RESPONSES: 'sl_responses',
  TOPIC_MASTERY: 'sl_topic_mastery',
  ACTIVE_SESSION: 'sl_active_session'
};

function getStorage(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

// Initialize local storage if empty
export function initDemoStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    setStorage(STORAGE_KEYS.STUDENTS, initialStudents);
    setStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    setStorage(STORAGE_KEYS.RESPONSES, initialResponses);
    setStorage(STORAGE_KEYS.TOPIC_MASTERY, initialTopicMastery);
    setStorage(STORAGE_KEYS.ACTIVE_SESSION, initialActiveSession);
  }
}

// Reset local storage
export function resetDemoStorage() {
  setStorage(STORAGE_KEYS.STUDENTS, initialStudents);
  setStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
  setStorage(STORAGE_KEYS.RESPONSES, initialResponses);
  setStorage(STORAGE_KEYS.TOPIC_MASTERY, initialTopicMastery);
  setStorage(STORAGE_KEYS.ACTIVE_SESSION, initialActiveSession);
}

// Base fetch helper with automatic local fallback
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return null; // Signals to fallback to local state
  }
}

export const api = {
  // Reset all demo data
  async resetDemo() {
    const remote = await safeFetch('/api/demo/reset', { method: 'POST' });
    resetDemoStorage();
    if (remote) return remote;
    return { success: true, message: 'Local demo data reset.' };
  },

  // Students roster
  async getStudents() {
    const remote = await safeFetch('/api/students');
    if (remote && Array.isArray(remote)) {
      setStorage(STORAGE_KEYS.STUDENTS, remote);
      return remote;
    }
    return getStorage(STORAGE_KEYS.STUDENTS, initialStudents);
  },

  // Quizzes list
  async getQuizzes() {
    const remote = await safeFetch('/api/quizzes');
    if (remote && Array.isArray(remote)) {
      setStorage(STORAGE_KEYS.QUIZZES, remote);
      return remote;
    }
    return getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
  },

  // Single Quiz
  async getQuizById(id) {
    const remote = await safeFetch(`/api/quizzes/${id}`);
    if (remote) return remote;
    const quizzes = getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    return quizzes.find(q => q.id === id) || quizzes[0];
  },

  // Create Quiz
  async createQuiz(quizData) {
    const remote = await safeFetch('/api/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData)
    });

    const quizzes = getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    const newQuiz = remote?.quiz || {
      id: `quiz-${Date.now()}`,
      ...quizData,
      createdAt: new Date().toISOString(),
      published: true
    };

    quizzes.unshift(newQuiz);
    setStorage(STORAGE_KEYS.QUIZZES, quizzes);
    return newQuiz;
  },

  // Active Session
  async getActiveSession() {
    const remote = await safeFetch('/api/sessions/active');
    if (remote) {
      setStorage(STORAGE_KEYS.ACTIVE_SESSION, remote);
      return remote;
    }
    return getStorage(STORAGE_KEYS.ACTIVE_SESSION, initialActiveSession);
  },

  // Start Live Session
  async startLiveSession(quizId) {
    const remote = await safeFetch('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ quizId })
    });

    if (remote && remote.session) {
      setStorage(STORAGE_KEYS.ACTIVE_SESSION, remote.session);
      return remote.session;
    }

    const quizzes = getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    const quiz = quizzes.find(q => q.id === quizId) || quizzes[0];
    const session = {
      id: `sess-${Date.now()}`,
      code: `SL-${Math.floor(1000 + Math.random() * 9000)}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      topic: quiz.topic,
      status: 'active',
      startedAt: new Date().toISOString(),
      connectedStudentIds: getStorage(STORAGE_KEYS.STUDENTS, initialStudents).map(s => s.id),
      submissionsCount: 0
    };
    setStorage(STORAGE_KEYS.ACTIVE_SESSION, session);
    return session;
  },

  // End Live Session
  async endLiveSession() {
    await safeFetch('/api/sessions/end', { method: 'POST' });
    const session = getStorage(STORAGE_KEYS.ACTIVE_SESSION, initialActiveSession);
    if (session) {
      session.status = 'ended';
      setStorage(STORAGE_KEYS.ACTIVE_SESSION, session);
    }
    return { success: true };
  },

  // Submit Response
  async submitQuizResponse(studentId, quizId, answers) {
    const remote = await safeFetch('/api/responses/submit', {
      method: 'POST',
      body: JSON.stringify({ studentId, quizId, answers })
    });

    if (remote) return remote;

    // Local fallback computation
    const quizzes = getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    const quiz = quizzes.find(q => q.id === quizId) || quizzes[0];
    const students = getStorage(STORAGE_KEYS.STUDENTS, initialStudents);
    const student = students.find(s => s.id === studentId) || { id: studentId, name: 'Student' };

    let correctCount = 0;
    quiz.questions.forEach(q => {
      const chosen = answers[q.id];
      const correctOpt = q.options.find(o => o.isCorrect);
      if (correctOpt && correctOpt.id === chosen) correctCount += 1;
    });

    const accuracy = Math.round((correctCount / quiz.questions.length) * 100);
    const newResp = {
      id: `resp-${Date.now()}`,
      studentId,
      quizId,
      submittedAt: new Date().toISOString(),
      answers,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      accuracy
    };

    let responses = getStorage(STORAGE_KEYS.RESPONSES, initialResponses);
    responses = responses.filter(r => !(r.studentId === studentId && r.quizId === quizId));
    responses.push(newResp);
    setStorage(STORAGE_KEYS.RESPONSES, responses);

    const personalization = generateStudentPersonalizationClient(student, quiz, newResp);
    return { success: true, response: newResp, personalization };
  },

  // Classroom Analytics
  async getClassroomAnalytics(quizId) {
    const remote = await safeFetch(`/api/analytics/classroom${quizId ? `?quizId=${quizId}` : ''}`);
    if (remote) return remote;

    const quizzes = getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    const quiz = quizzes.find(q => q.id === quizId) || quizzes[0];
    const responses = getStorage(STORAGE_KEYS.RESPONSES, initialResponses).filter(r => r.quizId === quiz.id);
    const students = getStorage(STORAGE_KEYS.STUDENTS, initialStudents);
    const activeSession = getStorage(STORAGE_KEYS.ACTIVE_SESSION, initialActiveSession);
    const topicMastery = getStorage(STORAGE_KEYS.TOPIC_MASTERY, initialTopicMastery);

    const analysis = analyzeClassroomQuizClient(quiz, responses, students);

    const updatedTopicMastery = topicMastery.map(tm => {
      if (quiz && tm.topic.toLowerCase() === quiz.topic.toLowerCase() && responses.length > 0) {
        return {
          ...tm,
          mastery: analysis.topicMastery,
          status: analysis.topicMastery >= 75 ? 'Mastered' : analysis.topicMastery >= 60 ? 'Developing' : 'Critical Attention'
        };
      }
      return tm;
    });

    return {
      quiz: { id: quiz.id, title: quiz.title, topic: quiz.topic },
      activeSession,
      totalStudents: students.length,
      topicMastery: updatedTopicMastery,
      analysis
    };
  },

  // Student Personalized Analytics
  async getStudentAnalytics(studentId) {
    const remote = await safeFetch(`/api/analytics/student/${studentId}`);
    if (remote) return remote;

    const students = getStorage(STORAGE_KEYS.STUDENTS, initialStudents);
    const student = students.find(s => s.id === studentId) || students[0];
    const responses = getStorage(STORAGE_KEYS.RESPONSES, initialResponses)
      .filter(r => r.studentId === studentId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const quizzes = getStorage(STORAGE_KEYS.QUIZZES, initialQuizzes);
    const latestResponse = responses[0] || null;
    const quiz = latestResponse ? quizzes.find(q => q.id === latestResponse.quizId) : quizzes[0];

    const personalization = generateStudentPersonalizationClient(student, quiz, latestResponse);

    return {
      student,
      latestResponse,
      quiz,
      allResponses: responses,
      personalization
    };
  }
};

