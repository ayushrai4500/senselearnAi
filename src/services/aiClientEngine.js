/**
 * SenseLearn AI - Client-side AI Engine
 * Mirrors the server AI engine for immediate client reactivity and offline resilience.
 */

export function analyzeClassroomQuizClient(quiz, responses, students) {
  if (!quiz || !responses || responses.length === 0) {
    return {
      classUnderstanding: "Unknown",
      averageAccuracy: 0,
      totalSubmissions: 0,
      misconceptions: [],
      topicMastery: 0,
      studentsNeedingSupport: [],
      questionBreakdown: [],
      recommendedActions: []
    };
  }

  const totalStudents = responses.length;

  // 1. Question-by-question breakdown
  const questionBreakdown = quiz.questions.map(question => {
    const questionId = question.id;
    let correctCount = 0;
    const optionCounts = {};
    const taggedMisconceptionsInQ = {};

    question.options.forEach(opt => {
      optionCounts[opt.id] = {
        optionId: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect,
        count: 0,
        misconceptionTag: opt.misconceptionTag || null
      };
    });

    responses.forEach(resp => {
      const chosenOptionId = resp.answers[questionId];
      if (optionCounts[chosenOptionId]) {
        optionCounts[chosenOptionId].count += 1;
        if (optionCounts[chosenOptionId].isCorrect) {
          correctCount += 1;
        } else if (optionCounts[chosenOptionId].misconceptionTag) {
          const tag = optionCounts[chosenOptionId].misconceptionTag;
          taggedMisconceptionsInQ[tag] = (taggedMisconceptionsInQ[tag] || 0) + 1;
        }
      }
    });

    const accuracy = totalStudents > 0 ? Math.round((correctCount / totalStudents) * 100) : 0;

    return {
      questionId: question.id,
      prompt: question.prompt,
      correctCount,
      totalSubmissions: totalStudents,
      accuracy,
      options: Object.values(optionCounts),
      misconceptionDistribution: taggedMisconceptionsInQ
    };
  });

  // 2. Misconceptions tracker
  const misconceptionTracker = {};

  responses.forEach(resp => {
    const studentInfo = students.find(s => s.id === resp.studentId);
    const studentName = studentInfo ? studentInfo.name : "Student";

    quiz.questions.forEach(q => {
      const chosenOptId = resp.answers[q.id];
      const chosenOpt = q.options.find(o => o.id === chosenOptId);

      if (chosenOpt && !chosenOpt.isCorrect && chosenOpt.misconceptionTag) {
        const tag = chosenOpt.misconceptionTag;
        if (!misconceptionTracker[tag]) {
          misconceptionTracker[tag] = {
            title: tag,
            affectedStudentIds: new Set(),
            affectedStudentNames: new Set(),
            occurrences: 0,
            questionPrompts: new Set(),
            evidenceQuotes: []
          };
        }
        misconceptionTracker[tag].affectedStudentIds.add(resp.studentId);
        misconceptionTracker[tag].affectedStudentNames.add(studentName);
        misconceptionTracker[tag].occurrences += 1;
        misconceptionTracker[tag].questionPrompts.add(q.prompt);
        misconceptionTracker[tag].evidenceQuotes.push({
          questionPrompt: q.prompt,
          selectedText: chosenOpt.text
        });
      }
    });
  });

  const detectedMisconceptions = Object.keys(misconceptionTracker).map(tag => {
    const data = misconceptionTracker[tag];
    const affectedCount = data.affectedStudentIds.size;
    const percentage = Math.round((affectedCount / totalStudents) * 100);

    let recommendedAction = "Review this sub-concept with visual models and guided practice.";
    let severity = "moderate";

    if (tag.toLowerCase().includes("difference")) {
      recommendedAction = "Re-explain ratios using a worked example comparing quantities multiplicatively rather than subtractively.";
      severity = "high";
    } else if (tag.toLowerCase().includes("additive")) {
      recommendedAction = "Demonstrate table scaling and contrast additive patterns vs multiplicative constant factors.";
      severity = "moderate";
    } else if (tag.toLowerCase().includes("inverted")) {
      recommendedAction = "Highlight matching terms in problem order (e.g., 'dogs to cats' means dogs is the first term).";
      severity = "low";
    } else if (tag.toLowerCase().includes("part-to-whole")) {
      recommendedAction = "Contrast part-to-part ratios (e.g. 6 apples to 3 oranges) with fractions representing part-to-whole (6 out of 9 fruits).";
      severity = "moderate";
    }

    return {
      id: `misc-${tag.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      title: tag,
      affectedCount,
      affectedPercentage: percentage,
      severity,
      affectedStudentIds: Array.from(data.affectedStudentIds),
      affectedStudentNames: Array.from(data.affectedStudentNames),
      questionsInvolved: Array.from(data.questionPrompts),
      evidence: `${affectedCount} of ${totalStudents} students (${percentage}%) selected distractor options explicitly indicating this misconception.`,
      recommendedAction,
      sampleDistractor: data.evidenceQuotes[0]?.selectedText || ""
    };
  }).sort((a, b) => b.affectedCount - a.affectedCount);

  const avgAccuracy = Math.round(
    responses.reduce((acc, r) => acc + (r.accuracy || 0), 0) / (totalStudents || 1)
  );

  let classUnderstanding = "Moderate";
  if (avgAccuracy >= 80) classUnderstanding = "High";
  else if (avgAccuracy < 55) classUnderstanding = "Needs Attention";

  const studentsNeedingSupport = responses
    .filter(r => r.accuracy <= 50)
    .map(r => {
      const student = students.find(s => s.id === r.studentId) || { id: r.studentId, name: "Student" };
      return {
        studentId: student.id,
        name: student.name,
        accuracy: r.accuracy,
        score: `${r.score}/${quiz.questions.length}`,
        primaryGaps: detectedMisconceptions
          .filter(m => m.affectedStudentIds.includes(student.id))
          .map(m => m.title)
      };
    });

  const recommendedActions = [
    {
      id: "act-1",
      priority: avgAccuracy < 60 ? "Immediate (Next 5 Mins)" : "Suggested",
      action: "Conduct 3-minute whiteboard contrast: 'Ratio vs Difference'",
      rationale: "Addresses the 50%+ students treating ratios as subtraction.",
      icon: "Presentation"
    },
    {
      id: "act-2",
      priority: "Suggested",
      action: "Assign auto-generated targeted remediation practice to 5 students",
      rationale: "Reinforces multiplicative scaling before advancing to proportional equations.",
      icon: "Users"
    },
    {
      id: "act-3",
      priority: "Upcoming",
      action: "Review part-to-part vs part-to-whole visual models next class",
      rationale: "Prevents fractional denominator carryover confusion.",
      icon: "BookOpen"
    }
  ];

  return {
    classUnderstanding,
    averageAccuracy: avgAccuracy,
    totalSubmissions: totalStudents,
    misconceptions: detectedMisconceptions,
    topicMastery: avgAccuracy,
    studentsNeedingSupport,
    questionBreakdown,
    recommendedActions
  };
}

export function generateStudentPersonalizationClient(student, quiz, response) {
  if (!response || !quiz) {
    return {
      studentId: student?.id || "stu-1",
      overallMastery: 70,
      weakTopics: ["Ratios"],
      strongTopics: ["Fractions"],
      diagnosticExplanation: "Complete the active quiz to receive personalized diagnostic analysis.",
      practiceQuestions: []
    };
  }

  const studentMisconceptions = [];
  quiz.questions.forEach(q => {
    const chosenOptId = response.answers[q.id];
    const chosenOpt = q.options.find(o => o.id === chosenOptId);
    if (chosenOpt && !chosenOpt.isCorrect && chosenOpt.misconceptionTag) {
      studentMisconceptions.push(chosenOpt.misconceptionTag);
    }
  });

  const hasDifferenceMisconception = studentMisconceptions.some(m =>
    m.toLowerCase().includes("difference")
  );
  const hasAdditiveMisconception = studentMisconceptions.some(m =>
    m.toLowerCase().includes("additive")
  );

  let diagnosticExplanation = "";
  if (response.accuracy === 100) {
    diagnosticExplanation = "Outstanding mastery! You clearly grasp that ratios express multiplicative comparisons between quantities. Ready for multi-step proportions and rate problems!";
  } else if (hasDifferenceMisconception) {
    diagnosticExplanation = "A ratio compares two quantities through division or multiplication. It does not represent subtraction. For example, the ratio of 6 apples to 3 oranges is 6:3 (which simplifies to 2:1), NOT 6 - 3 = 3.";
  } else if (hasAdditiveMisconception) {
    diagnosticExplanation = "When scaling equivalent ratios, always multiply or divide both terms by the same factor. Adding the same amount to both sides changes the proportional balance!";
  } else {
    diagnosticExplanation = "Pay close attention to the order of terms in the question and simplify fractions by finding greatest common divisors.";
  }

  const practiceQuestions = [
    {
      id: "pq-1",
      topic: "Ratios",
      question: "A car travels 120 miles using 4 gallons of fuel. What is the simplified ratio of miles to gallons?",
      options: [
        { id: "pq1-a", text: "116:1 (120 - 4 = 116)", isCorrect: false },
        { id: "pq1-b", text: "30:1", isCorrect: true },
        { id: "pq1-c", text: "1:30", isCorrect: false },
        { id: "pq1-d", text: "4:120", isCorrect: false }
      ],
      correctAnswer: "30:1",
      explanation: "Divide miles by gallons: 120 ÷ 4 = 30 miles per 1 gallon (30:1). Remember, ratios compare by dividing, not subtracting!"
    },
    {
      id: "pq-2",
      topic: "Ratios",
      question: "In a school library, there are 15 fiction books and 10 non-fiction books. What is the ratio of fiction to non-fiction books in simplest form?",
      options: [
        { id: "pq2-a", text: "5:1 (15 - 10 = 5)", isCorrect: false },
        { id: "pq2-b", text: "2:3", isCorrect: false },
        { id: "pq2-c", text: "3:2", isCorrect: true },
        { id: "pq2-d", text: "15:25", isCorrect: false }
      ],
      correctAnswer: "3:2",
      explanation: "Fiction to non-fiction is 15:10. Dividing both terms by their greatest common factor (5) gives 3:2."
    },
    {
      id: "pq-3",
      topic: "Ratios",
      question: "A paint mixture uses 3 parts yellow for every 2 parts blue. If an artist uses 6 parts blue, how many parts yellow are needed?",
      options: [
        { id: "pq3-a", text: "7 parts (2 + 4 blue, so 3 + 4 yellow)", isCorrect: false },
        { id: "pq3-b", text: "9 parts (2 × 3 = 6 blue, so 3 × 3 = 9 yellow)", isCorrect: true },
        { id: "pq3-c", text: "4 parts", isCorrect: false },
        { id: "pq3-d", text: "12 parts", isCorrect: false }
      ],
      correctAnswer: "9 parts (2 × 3 = 6 blue, so 3 × 3 = 9 yellow)",
      explanation: "The blue paint was scaled by a factor of 3 (2 × 3 = 6). To maintain the exact shade, multiply yellow by 3 as well (3 × 3 = 9 parts)."
    }
  ];

  return {
    studentId: student?.id,
    studentName: student?.name,
    quizId: quiz.id,
    accuracy: response.accuracy,
    score: `${response.score}/${quiz.questions.length}`,
    detectedMisconceptions: studentMisconceptions,
    diagnosticExplanation,
    practiceQuestions,
    weakTopics: response.accuracy < 70 ? ["Ratios"] : [],
    strongTopics: response.accuracy >= 70 ? ["Ratios", "Fractions"] : ["Fractions"]
  };
}

