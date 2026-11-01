import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialStudents,
  initialQuizzes,
  initialResponses,
  initialTopicMastery,
  initialActiveSession
} from './sampleData.js';
import {
  analyzeClassroomQuiz,
  generateStudentPersonalization
} from './aiEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory state
let state = {
  students: JSON.parse(JSON.stringify(initialStudents)),
  quizzes: JSON.parse(JSON.stringify(initialQuizzes)),
  responses: JSON.parse(JSON.stringify(initialResponses)),
  topicMastery: JSON.parse(JSON.stringify(initialTopicMastery)),
  activeSession: JSON.parse(JSON.stringify(initialActiveSession))
};

// Persistence helpers
function loadPersistedState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      state = { ...state, ...data };
      console.log('✅ Loaded persisted data from db.json');
    }
  } catch (err) {
    console.error('Error loading persisted db.json:', err.message);
  }
}

function saveState() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json:', err.message);
  }
}

loadPersistedState();

// ----------------- ROUTES -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SenseLearn AI Backend',
    timestamp: new Date().toISOString()
  });
});

// Reset Demo Data
app.post('/api/demo/reset', (req, res) => {
  state = {
    students: JSON.parse(JSON.stringify(initialStudents)),
    quizzes: JSON.parse(JSON.stringify(initialQuizzes)),
    responses: JSON.parse(JSON.stringify(initialResponses)),
    topicMastery: JSON.parse(JSON.stringify(initialTopicMastery)),
    activeSession: JSON.parse(JSON.stringify(initialActiveSession))
  };
  saveState();
  res.json({
    success: true,
    message: 'Demo dataset successfully reset to default baseline (10 students, sample Ratios quiz).'
  });
});

// Get Students Roster
app.get('/api/students', (req, res) => {
  res.json(state.students);
});

// Get Quizzes
app.get('/api/quizzes', (req, res) => {
  res.json(state.quizzes);
});

// Get Specific Quiz
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = state.quizzes.find(q => q.id === req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  res.json(quiz);
});

// Create New Quiz
app.post('/api/quizzes', (req, res) => {
  const { title, topic, gradeLevel, durationMinutes, questions } = req.body;

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Title and questions array are required' });
  }

  const newQuiz = {
    id: `quiz-${Date.now()}`,
    title: title.trim(),
    topic: topic ? topic.trim() : 'General',
    gradeLevel: gradeLevel || '8th Grade Math',
    durationMinutes: Number(durationMinutes) || 5,
    createdAt: new Date().toISOString(),
    published: true,
    questions: questions.map((q, idx) => ({
      id: q.id || `q-${idx + 1}-${Date.now()}`,
      prompt: q.prompt,
      options: q.options.map((opt, optIdx) => ({
        id: opt.id || `opt-${optIdx + 1}-${Date.now()}`,
        text: opt.text,
        isCorrect: Boolean(opt.isCorrect),
        misconceptionTag: opt.misconceptionTag || (opt.isCorrect ? null : 'Uncategorized conceptual error')
      })),
      explanation: q.explanation || 'Review the core definitions of this topic.'
    }))
  };

  state.quizzes.unshift(newQuiz);
  saveState();

  res.status(201).json({
    success: true,
    quiz: newQuiz
  });
});

// Get Active Live Session
app.get('/api/sessions/active', (req, res) => {
  res.json(state.activeSession);
});

// Start Live Quiz Session
app.post('/api/sessions/start', (req, res) => {
  const { quizId } = req.body;
  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found to launch session' });
  }

  const sessionCode = `SL-${Math.floor(1000 + Math.random() * 9000)}`;

  state.activeSession = {
    id: `sess-${Date.now()}`,
    code: sessionCode,
    quizId: quiz.id,
    quizTitle: quiz.title,
    topic: quiz.topic,
    status: 'active',
    startedAt: new Date().toISOString(),
    connectedStudentIds: state.students.map(s => s.id),
    submissionsCount: 0
  };

  saveState();
  res.json({
    success: true,
    session: state.activeSession
  });
});

// End Live Quiz Session
app.post('/api/sessions/end', (req, res) => {
  if (state.activeSession) {
    state.activeSession.status = 'ended';
    saveState();
  }
  res.json({ success: true, message: 'Session ended' });
});

// Submit Quiz Responses
app.post('/api/responses/submit', (req, res) => {
  const { studentId, quizId, answers } = req.body;

  if (!studentId || !quizId || !answers) {
    return res.status(400).json({ error: 'studentId, quizId, and answers object required' });
  }

  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  // Calculate score
  let correctCount = 0;
  quiz.questions.forEach(q => {
    const chosenOptionId = answers[q.id];
    const correctOpt = q.options.find(o => o.isCorrect);
    if (correctOpt && correctOpt.id === chosenOptionId) {
      correctCount += 1;
    }
  });

  const accuracy = Math.round((correctCount / quiz.questions.length) * 100);

  // Remove previous response for this student and quiz if retaking
  state.responses = state.responses.filter(
    r => !(r.studentId === studentId && r.quizId === quizId)
  );

  const newResponse = {
    id: `resp-${Date.now()}`,
    studentId,
    quizId,
    submittedAt: new Date().toISOString(),
    answers,
    score: correctCount,
    totalQuestions: quiz.questions.length,
    accuracy
  };

  state.responses.push(newResponse);

  // Update student overall score average
  const student = state.students.find(s => s.id === studentId);
  if (student) {
    const studentResponses = state.responses.filter(r => r.studentId === studentId);
    const avgScore = Math.round(
      studentResponses.reduce((acc, r) => acc + r.accuracy, 0) / studentResponses.length
    );
    student.overallScore = avgScore;
    if (avgScore >= 80) student.status = 'Excelling';
    else if (avgScore >= 60) student.status = 'Moderate';
    else student.status = 'Needs Support';
  }

  // Update active session count if matching
  if (state.activeSession && state.activeSession.quizId === quizId) {
    const quizResponsesCount = state.responses.filter(r => r.quizId === quizId).length;
    state.activeSession.submissionsCount = quizResponsesCount;
  }

  saveState();

  // Return immediate student diagnostic personalization
  const personalization = generateStudentPersonalization(
    student || { id: studentId, name: 'Student' },
    quiz,
    newResponse
  );

  res.json({
    success: true,
    response: newResponse,
    personalization
  });
});

// Classroom Analytics Endpoint
app.get('/api/analytics/classroom', (req, res) => {
  const quizId = req.query.quizId || (state.activeSession ? state.activeSession.quizId : 'quiz-ratios-1');
  const quiz = state.quizzes.find(q => q.id === quizId) || state.quizzes[0];

  const quizResponses = state.responses.filter(r => r.quizId === quiz.id);

  const analysis = analyzeClassroomQuiz(quiz, quizResponses, state.students);

  // Dynamic topic mastery update
  const topicMasteryList = state.topicMastery.map(tm => {
    if (quiz && tm.topic.toLowerCase() === quiz.topic.toLowerCase() && quizResponses.length > 0) {
      return {
        ...tm,
        mastery: analysis.topicMastery,
        status: analysis.topicMastery >= 75 ? 'Mastered' : analysis.topicMastery >= 60 ? 'Developing' : 'Critical Attention'
      };
    }
    return tm;
  });

  res.json({
    quiz: {
      id: quiz.id,
      title: quiz.title,
      topic: quiz.topic
    },
    activeSession: state.activeSession,
    totalStudents: state.students.length,
    topicMastery: topicMasteryList,
    analysis
  });
});

// Student Personalized Analytics Endpoint
app.get('/api/analytics/student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = state.students.find(s => s.id === studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Find latest response
  const studentResponses = state.responses
    .filter(r => r.studentId === studentId)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const latestResponse = studentResponses[0] || null;
  const quiz = latestResponse
    ? state.quizzes.find(q => q.id === latestResponse.quizId)
    : state.quizzes[0];

  const personalization = generateStudentPersonalization(student, quiz, latestResponse);

  res.json({
    student,
    latestResponse,
    quiz,
    allResponses: studentResponses,
    personalization
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 SenseLearn AI Backend running on port ${PORT}`);
});

