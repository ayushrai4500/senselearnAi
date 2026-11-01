# 🎓 SenseLearn AI — Real-Time Classroom Personalization Layer

> **"Every Student Learns Differently. Every Classroom Should Adapt."**

**SenseLearn AI** is a hackathon-ready, full-stack educational web application designed to bridge the gap between lecture delivery and student comprehension. Instead of discovering gaps days later after a summative test, SenseLearn AI captures live concept-check quiz responses during lecture, groups cognitive misconceptions (e.g. *treating ratios as subtraction*), and equips teachers with immediate whiteboard interventions while delivering personalized remediation to students.

---

## 🌟 Key Features

1. **Dual-Role Command Center**:
   - **Teacher Dashboard (Dr. Evelyn Foster)**: Real-time telemetry, average classroom understanding, topic mastery distribution, active live session management, and cognitive misconception cards with verifiable evidence.
   - **Personalized Student Learning Studio (Alex Rivera, Maya Chen, etc.)**: Individual mastery percentages, diagnostic AI feedback, and 3 adaptive practice questions with step-by-step reasoning.
2. **AI Learning Gap Detection Engine**:
   - Identifies cognitive patterns behind incorrect answers (e.g., subtracting numbers in ratios: $6 - 3 = 3$ instead of simplifying $6:3 = 2:1$).
   - Calculates topic-wise mastery scores against a 70% proficiency target.
   - Categorizes misconceptions into severity levels (High, Moderate, Low) with affected student counts and distractor quotes.
3. **Interactive Live Quiz Session**:
   - Room PIN (`RATIO-2026`) with copy functionality.
   - Live question navigation, countdown timer, radio selection, and celebratory confetti upon submission.
   - Real-time telemetry updating classroom analytics immediately.
4. **Quiz Creator Studio**:
   - Design custom formative quizzes with 4 answer options.
   - Misconception tagger on distractors so the AI can diagnose student reasoning errors.
   - One-click publishing directly to the live session room.
5. **Ethics & Privacy Safeguards**:
   - Anonymized student identifiers during cognitive clustering.
   - Transparent rule-based analysis engine fallback (zero black-box illusions).
   - Clear labeling of detected misconceptions as *possible learning gaps*, preserving educator control.
   - One-click **Reset Demo Data** button to quickly restore the preloaded 10-student benchmark at any time.

---

## 🏗️ Technology Stack

- **Frontend**:
  - React.js with Vite
  - Tailwind CSS with custom SaaS styling (slate/navy typography, purple/indigo gradients)
  - React Router v6
  - Recharts for responsive topic mastery charts
  - Lucide React for consistent icons
  - Canvas Confetti for quiz submission feedback
- **Backend**:
  - Node.js & Express.js REST APIs
  - JSON local persistence layer (`server/db.json`)
  - Modular AI analysis engine (`server/aiEngine.js`) with rule-based heuristics and optional LLM hook
  - Resilient client fallback (`src/services/api.js`) ensuring seamless offline demo continuity

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or newer recommended, tested on v24)
- npm (v9 or newer)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full-Stack Application
```bash
npm run dev
```
This runs both the Express backend API (Port `5000`) and the Vite React frontend (Port `5173`) concurrently.

Open your browser at:
```
http://localhost:5173
```

---

## 📋 Recommended Hackathon Demonstration Workflow

Follow these steps to evaluate the end-to-end feedback loop:

1. **Landing Page (`/`)**:
   - Review the problem statement, 4-step live loop, and dual dashboard previews.
   - Click **"Explore Teacher Demo"** or **"Get Started"**.
2. **Teacher Dashboard (`/teacher`)**:
   - Note the **Average Class Understanding** (Moderate, 48% on Ratios).
   - Inspect the **Topic Mastery Chart** (Fractions 82%, Percentages 71%, Decimals 64%, Ratios 48%).
   - Review the prominent **AI Insight Card**:
     - *Detected Misconception*: `"Ratio treated as a difference"`
     - *Recommended Action*: `"Re-explain ratios using a worked example."`
3. **AI Learning Insights (`/insights`)**:
   - Examine the evidence: 5 of 10 students subtracted quantities ($6 - 3 = 3$).
   - Review the 3-minute whiteboard intervention guidance for the teacher.
4. **Student Experience (`/student`)**:
   - Use the learner switcher to inspect **Alex Rivera** (Score: 0% / 45% overall).
   - Read the personalized AI explanation:
     > *"A ratio compares two quantities through division or multiplication. It does not represent subtraction. For example, the ratio of 6 apples to 3 oranges is 6:3 (which simplifies to 2:1), NOT 6 - 3 = 3."*
   - Test the **3 Targeted Adaptive Practice Questions**: click options and check immediate step-by-step solutions.
   - Switch to **Maya Chen** to observe how the AI recognizes full concept mastery (100%).
5. **Live Quiz Session (`/live`)**:
   - As a student, navigate questions, select answers, and click **Submit Answers** to view instant feedback.
   - As a teacher, view live response telemetry and answer distribution.
6. **Quiz Creation (`/create-quiz`)**:
   - Build a custom quiz, tag distractors with conceptual traps, and publish directly to live sessions.
7. **Reset Demo Data**:
   - Click the **"Reset Demo"** button in the navigation bar at any point to restore the benchmark classroom state.

---

## 📊 Preloaded Benchmark Students (Cohort of 10)

| Student Name | Initial Status | Mastery Score | Primary Cognitive Gap |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | Needs Support | 0% | Ratio treated as a difference |
| **Ethan Washington** | Needs Support | 0% | Ratio treated as a difference |
| **Noah Kim** | Needs Support | 50% | Partial difference trap |
| **Liam Patel** | Moderate | 50% | Additive scaling & term inversion |
| **Sophia Rodriguez**| Moderate | 50% | Ratio treated as a difference |
| **Aria Vance** | Moderate | 50% | Difference & additive confusion |
| **Emma Watson** | Moderate | 75% | Minor distractor slip |
| **Maya Chen** | Excelling | 100% | Full concept mastery |
| **Zoe Nakamura** | Excelling | 100% | Full concept mastery |
| **Lucas Silva** | Excelling | 100% | Full concept mastery |

---

## 🛡️ Privacy & Safeguards

- **Anonymized Processing**: Student identities are masked before analysis.
- **Explainable Evidence**: Every flagged gap displays the exact distractor chosen and percentage of affected peers.
- **Teacher Agency**: Recommendations are explicitly framed as actionable suggestions, never autonomous grading decisions.

---

Built with ❤️ for real-time educational personalization.

