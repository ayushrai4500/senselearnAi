// Initial preloaded classroom state for SenseLearn AI demo
export const initialStudents = [
  { id: "stu-1", name: "Alex Rivera", avatar: "AR", grade: "8th Grade", email: "alex.r@school.edu", overallScore: 45, status: "Needs Support" },
  { id: "stu-2", name: "Maya Chen", avatar: "MC", grade: "8th Grade", email: "maya.c@school.edu", overallScore: 92, status: "Excelling" },
  { id: "stu-3", name: "Liam Patel", avatar: "LP", grade: "8th Grade", email: "liam.p@school.edu", overallScore: 68, status: "Moderate" },
  { id: "stu-4", name: "Sophia Rodriguez", avatar: "SR", grade: "8th Grade", email: "sophia.r@school.edu", overallScore: 65, status: "Moderate" },
  { id: "stu-5", name: "Ethan Washington", avatar: "EW", grade: "8th Grade", email: "ethan.w@school.edu", overallScore: 40, status: "Needs Support" },
  { id: "stu-6", name: "Zoe Nakamura", avatar: "ZN", grade: "8th Grade", email: "zoe.n@school.edu", overallScore: 95, status: "Excelling" },
  { id: "stu-7", name: "Noah Kim", avatar: "NK", grade: "8th Grade", email: "noah.k@school.edu", overallScore: 50, status: "Needs Support" },
  { id: "stu-8", name: "Emma Watson", avatar: "EW", grade: "8th Grade", email: "emma.w@school.edu", overallScore: 72, status: "Moderate" },
  { id: "stu-9", name: "Lucas Silva", avatar: "LS", grade: "8th Grade", email: "lucas.s@school.edu", overallScore: 88, status: "Excelling" },
  { id: "stu-10", name: "Aria Vance", avatar: "AV", grade: "8th Grade", email: "aria.v@school.edu", overallScore: 60, status: "Moderate" }
];

export const initialQuizzes = [
  {
    id: "quiz-ratios-1",
    title: "Concept Check: Understanding Ratios & Proportions",
    topic: "Ratios",
    gradeLevel: "8th Grade Math",
    durationMinutes: 5,
    createdAt: "2026-11-01T10:00:00Z",
    published: true,
    questions: [
      {
        id: "q1",
        prompt: "In a fruit basket, there are 6 apples and 3 oranges. What is the simplified ratio of apples to oranges?",
        options: [
          { id: "opt-1a", text: "3:1 (because 6 - 3 = 3)", isCorrect: false, misconceptionTag: "Ratio treated as a difference" },
          { id: "opt-1b", text: "2:1", isCorrect: true, misconceptionTag: null },
          { id: "opt-1c", text: "1:2", isCorrect: false, misconceptionTag: "Order inverted (oranges to apples)" },
          { id: "opt-1d", text: "6:9", isCorrect: false, misconceptionTag: "Part-to-whole confusion" }
        ],
        explanation: "A ratio compares the quantity of apples (6) to oranges (3), which simplifies by dividing by 3 to 2:1. Ratios represent multiplicative relationships, not differences."
      },
      {
        id: "q2",
        prompt: "A recipe uses 2 cups of sugar for every 5 cups of flour. If a baker uses 10 cups of flour, how much sugar is needed?",
        options: [
          { id: "opt-2a", text: "7 cups (5 + 5 flour, so 2 + 5 sugar)", isCorrect: false, misconceptionTag: "Additive reasoning instead of scaling" },
          { id: "opt-2b", text: "4 cups", isCorrect: true, misconceptionTag: null },
          { id: "opt-2c", text: "3 cups (10 - 7)", isCorrect: false, misconceptionTag: "Ratio treated as a difference" },
          { id: "opt-2d", text: "20 cups", isCorrect: false, misconceptionTag: "Indiscriminate cross-multiplication" }
        ],
        explanation: "The amount of flour was multiplied by 2 (5 × 2 = 10). To keep the ratio constant, sugar must also be multiplied by 2 (2 × 2 = 4 cups)."
      },
      {
        id: "q3",
        prompt: "The ratio of blue marbles to red marbles in a jar is 4:1. Which statement is mathematically TRUE?",
        options: [
          { id: "opt-3a", text: "There are exactly 3 more blue marbles than red marbles", isCorrect: false, misconceptionTag: "Ratio treated as a difference" },
          { id: "opt-3b", text: "For every 1 red marble, there are 4 blue marbles", isCorrect: true, misconceptionTag: null },
          { id: "opt-3c", text: "1/4 of all marbles in the jar are blue", isCorrect: false, misconceptionTag: "Part-to-part confused with part-to-whole" },
          { id: "opt-3d", text: "There are always exactly 4 blue marbles total", isCorrect: false, misconceptionTag: "Ratio confused with static counts" }
        ],
        explanation: "A ratio of 4:1 means blue marbles are 4 times as numerous as red marbles. It does not mean the difference is 3 (e.g. 8:2 has difference 6)."
      },
      {
        id: "q4",
        prompt: "There are 8 cats and 12 dogs at an animal shelter. What is the simplified ratio of dogs to cats?",
        options: [
          { id: "opt-4a", text: "4:1 (12 - 8 = 4)", isCorrect: false, misconceptionTag: "Ratio treated as a difference" },
          { id: "opt-4b", text: "2:3", isCorrect: false, misconceptionTag: "Order inverted (cats to dogs)" },
          { id: "opt-4c", text: "3:2", isCorrect: true, misconceptionTag: null },
          { id: "opt-4d", text: "12:20", isCorrect: false, misconceptionTag: "Part-to-whole confusion" }
        ],
        explanation: "The question specifies dogs to cats (12 to 8). Dividing both numbers by their greatest common factor (4) produces 3:2."
      }
    ]
  },
  {
    id: "quiz-fractions-1",
    title: "Check-in: Adding & Multiplying Fractions",
    topic: "Fractions",
    gradeLevel: "8th Grade Math",
    durationMinutes: 5,
    createdAt: "2026-10-28T09:00:00Z",
    published: true,
    questions: [
      {
        id: "fq1",
        prompt: "Calculate: 1/3 + 1/6",
        options: [
          { id: "fopt-1a", text: "2/9 (adding numerators and denominators)", isCorrect: false, misconceptionTag: "Across-the-board addition" },
          { id: "fopt-1b", text: "1/2", isCorrect: true, misconceptionTag: null },
          { id: "fopt-1c", text: "2/6", isCorrect: false, misconceptionTag: "Incomplete common denominator" },
          { id: "fopt-1d", text: "3/6", isCorrect: false, misconceptionTag: "Unsimplified form" }
        ],
        explanation: "Find common denominator 6: 2/6 + 1/6 = 3/6 = 1/2."
      }
    ]
  }
];

// Preloaded realistic student responses for quiz-ratios-1
// This produces:
// Alex Rivera (stu-1): 1/4 (25%) -> chooses difference options
// Ethan Washington (stu-5): 1/4 (25%) -> chooses difference options
// Noah Kim (stu-7): 2/4 (50%) -> chooses difference options on Q1 & Q3
// Liam Patel (stu-3): 2/4 (50%) -> additive error & inverted error
// Sophia Rodriguez (stu-4): 2/4 (50%) -> difference error
// Aria Vance (stu-10): 2/4 (50%) -> difference error
// Emma Watson (stu-8): 3/4 (75%) -> minor slip
// Maya Chen (stu-2): 4/4 (100%) -> all correct
// Zoe Nakamura (stu-6): 4/4 (100%) -> all correct
// Lucas Silva (stu-9): 4/4 (100%) -> all correct
export const initialResponses = [
  {
    id: "resp-1",
    studentId: "stu-1",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:15:20Z",
    answers: {
      q1: "opt-1a", // difference: 6-3=3
      q2: "opt-2a", // additive: +5
      q3: "opt-3a", // difference: 3 more
      q4: "opt-4a"  // difference: 12-8=4
    },
    score: 0,
    totalQuestions: 4,
    accuracy: 0
  },
  {
    id: "resp-2",
    studentId: "stu-2",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:12:10Z",
    answers: {
      q1: "opt-1b", // correct
      q2: "opt-2b", // correct
      q3: "opt-3b", // correct
      q4: "opt-4c"  // correct
    },
    score: 4,
    totalQuestions: 4,
    accuracy: 100
  },
  {
    id: "resp-3",
    studentId: "stu-3",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:16:45Z",
    answers: {
      q1: "opt-1b", // correct
      q2: "opt-2a", // additive
      q3: "opt-3b", // correct
      q4: "opt-4b"  // inverted order
    },
    score: 2,
    totalQuestions: 4,
    accuracy: 50
  },
  {
    id: "resp-4",
    studentId: "stu-4",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:14:30Z",
    answers: {
      q1: "opt-1a", // difference: 6-3=3
      q2: "opt-2b", // correct
      q3: "opt-3a", // difference
      q4: "opt-4c"  // correct
    },
    score: 2,
    totalQuestions: 4,
    accuracy: 50
  },
  {
    id: "resp-5",
    studentId: "stu-5",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:17:15Z",
    answers: {
      q1: "opt-1a", // difference
      q2: "opt-2c", // difference
      q3: "opt-3a", // difference
      q4: "opt-4a"  // difference
    },
    score: 0,
    totalQuestions: 4,
    accuracy: 0
  },
  {
    id: "resp-6",
    studentId: "stu-6",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:11:05Z",
    answers: {
      q1: "opt-1b", // correct
      q2: "opt-2b", // correct
      q3: "opt-3b", // correct
      q4: "opt-4c"  // correct
    },
    score: 4,
    totalQuestions: 4,
    accuracy: 100
  },
  {
    id: "resp-7",
    studentId: "stu-7",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:18:00Z",
    answers: {
      q1: "opt-1a", // difference
      q2: "opt-2b", // correct
      q3: "opt-3a", // difference
      q4: "opt-4c"  // correct
    },
    score: 2,
    totalQuestions: 4,
    accuracy: 50
  },
  {
    id: "resp-8",
    studentId: "stu-8",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:15:50Z",
    answers: {
      q1: "opt-1b", // correct
      q2: "opt-2b", // correct
      q3: "opt-3c", // part-whole confusion
      q4: "opt-4c"  // correct
    },
    score: 3,
    totalQuestions: 4,
    accuracy: 75
  },
  {
    id: "resp-9",
    studentId: "stu-9",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:13:25Z",
    answers: {
      q1: "opt-1b", // correct
      q2: "opt-2b", // correct
      q3: "opt-3b", // correct
      q4: "opt-4c"  // correct
    },
    score: 4,
    totalQuestions: 4,
    accuracy: 100
  },
  {
    id: "resp-10",
    studentId: "stu-10",
    quizId: "quiz-ratios-1",
    submittedAt: "2026-11-01T10:16:10Z",
    answers: {
      q1: "opt-1a", // difference
      q2: "opt-2a", // additive
      q3: "opt-3b", // correct
      q4: "opt-4c"  // correct
    },
    score: 2,
    totalQuestions: 4,
    accuracy: 50
  }
];

// Benchmark classroom historical mastery metrics
export const initialTopicMastery = [
  { topic: "Fractions", mastery: 82, benchmark: 75, status: "Mastered" },
  { topic: "Percentages", mastery: 71, benchmark: 70, status: "Proficient" },
  { topic: "Decimals", mastery: 64, benchmark: 70, status: "Developing" },
  { topic: "Ratios", mastery: 48, benchmark: 70, status: "Critical Attention" }
];

export const initialActiveSession = {
  id: "sess-live-01",
  code: "RATIO-2026",
  quizId: "quiz-ratios-1",
  quizTitle: "Concept Check: Understanding Ratios & Proportions",
  status: "active", // "active", "ended"
  startedAt: "2026-11-01T10:10:00Z",
  connectedStudentIds: ["stu-1", "stu-2", "stu-3", "stu-4", "stu-5", "stu-6", "stu-7", "stu-8", "stu-9", "stu-10"],
  submissionsCount: 10
};

