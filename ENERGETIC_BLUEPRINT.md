# 🔥 ENERGETIC — AI-Powered Personal Transformation System

## Complete Blueprint v2.0 (AI-Native Architecture)

---

## ⚡ The Core Difference: This Is NOT a Fitness App

Traditional fitness apps are **static checklists**. You ignore them after 2 weeks.

**Energetic is different.** It has a brain. An AI coach that:

- **Talks to you** like a real coach (conversational, not buttons)
- **Adapts in real-time** — if you're struggling, it gets easier. If you're crushing, it levels up.
- **Detects when you're about to quit** and intervenes before you do
- **Learns YOUR patterns** — what motivates you, when you skip, what foods you actually eat
- **Generates everything dynamically** — workouts, meal plans, motivation, progress reports

The AI (Gemini) is not a feature. **It IS the app.**

---

## 🧠 The Intelligence Layer — How Gemini Powers Everything

### 1. Adaptive Workout Brain

Instead of static "Day 1: 5 squats, Day 2: 10 squats", the AI:

- **Generates today's workout** based on:
  - Your current phase/fitness level
  - How consistent you've been (missed 3 days? Lighter restart workout)
  - What muscles need rest (tracks recovery)
  - Your mood (asked in daily check-in)
  - Available time ("I only have 5 minutes" → gives 5-min routine)
  - Weather/energy level
- **Progressively overloads intelligently** — knows when to add reps, sets, or weight
- **Remembers what you enjoy** — if you hate pushups but love curls, it adjusts
- **Creates variety** — never the same boring routine twice

**Example AI Workout Generation:**

```
System Prompt: "User is Day 12 of their fitness journey. Phase 1 (micro-habits).
Has dumbbells (5kg, 10kg) and a bench. Completed last 4 days straight.
Mood today: 'okay'. Available time: 15 min. Last workout was lower body."

Gemini Response:
"Great 4-day streak! Today's an upper body day. Here's your 12-min session:
1. Dumbbell Bench Press — 2 sets × 8 reps (5kg) [Chest]
2. Dumbbell Rows — 2 sets × 8 reps (5kg) [Back]
3. Bicep Curls — 2 sets × 10 reps (5kg) [Arms]
4. Overhead Press — 2 sets × 6 reps (5kg) [Shoulders]

Rest 60 sec between sets. You're building real strength now."
```

### 2. Smart Meal Coach (Natural Language)

Instead of manually searching a food database and logging calories:

- **You just type what you ate**: "Had 2 rotis with paneer and some rice"
- **AI estimates everything**: ~650 cal, 22g protein, 85g carbs
- **AI responds**: "Good start! You've had 1,200 cal so far. You need 1,600 more. Try having a banana shake with peanut butter (500 cal) and eggs for dinner."
- **Tracks your patterns**: "I notice you skip lunch on weekdays. Can we set a reminder at 1 PM?"
- **Suggests calorie-dense meals** that are easy/realistic for you

**Example Conversation:**

```
You: "bro I just had maggi and tea"
AI: "That's about 350 cal. You've had 800 total today and it's already 4 PM.
     You need 2,000 more calories. Here's what I'd suggest:
     → 5 PM: Banana shake with milk + peanut butter (500 cal)
     → 7 PM: 3 eggs + 2 rotis + sabzi (600 cal)
     → 9 PM: Rice + dal + curd (500 cal)
     → Before bed: Glass of milk + 2 biscuits (250 cal)
     That gets you to 2,650. Not perfect, but solid. Can you do this?"
```

### 3. Behavioral Pattern Detection (Anti-Quit System)

The AI analyzes your data and **predicts when you're about to give up**:

**Quit Signals It Watches For:**

- Logging less frequently
- Skipping multiple meals
- Using emergency protocol too often
- Workout times getting later in the day
- Shorter workouts / fewer reps logged
- Not opening the app for 2+ days

**Intervention Responses:**

```
Signal: "User hasn't opened app in 2 days after 18-day streak"
AI: "Hey, I noticed you've been quiet for 2 days. That's completely normal —
     Day 18-21 is when most people hit a wall. You've already done more than
     90% of people who start. Your streak is paused, not broken.
     One set of 10 squats right now and we're back. What do you say?"
```

### 4. Conversational Daily Check-in

Every morning (or whenever you open the app), the AI talks to you:

```
AI: "Morning! Day 15 🔥. How are you feeling today? (1-5 energy level)"
You: "3, tired honestly"
AI: "Got it. I'll keep today light. Here's the plan:
     - Workout: 10-min easy dumbbell session (upper body, lighter weights)
     - Meals: I've prepped 4 meal suggestions that are easy to make
     - Goal: Just log 2,500 cal and do the workout. That's a win today.
     Sound good?"
You: "yeah"
AI: "Let's go. Workout is ready whenever you are. Tap 'Start' when ready."
```

### 5. AI-Generated Weekly Progress Reports

Every Sunday, the AI writes you a personalized progress report:

```
"📊 Week 3 Report — Sarthak's Transformation Journey

This week: 5/7 workouts completed, 4/7 days hit calorie target
Weight: 50.2 kg → 50.8 kg (+0.6 kg this week!)

What went well:
✅ You hit a 12-day streak — your longest ever
✅ Average daily calories: 2,640 (target: 2,850) — getting closer!
✅ Bench press went from 5kg × 8 to 5kg × 12 — ready to go heavier?

What to improve:
⚠️ You skipped breakfast 3 times this week — this is 600 cal lost each time
⚠️ Wednesday and Saturday had no workout — both were late nights

My take:
You're gaining weight. 0.6 kg in a week is EXCELLENT for someone starting at 49 kg.
At this pace, you'll hit 55 kg by May. But only if you stop skipping breakfast.
I'm adding a breakfast reminder at 9 AM. Deal?

Next week's focus: Hit breakfast every day + try 7.5kg on curls."
```

### 6. Smart Motivation Engine

The AI doesn't just show random quotes. It:

- **Knows what motivates you** (tracks which messages correlate with you actually working out)
- **Adapts its tone** — if you respond to humor, it's funny. If you respond to discipline, it's strict.
- **Uses your OWN data** — "You've already gained 1.5kg. You literally proved your body CAN grow."
- **References your goals** — if you mentioned wanting to look good, it references that

---

## 🏗️ Complete Architecture

### Tech Stack

| Technology                        | Purpose                                        |
| --------------------------------- | ---------------------------------------------- |
| **React 18 + Vite**               | Frontend framework                             |
| **TailwindCSS**                   | Styling                                        |
| **Google Gemini API** (free tier) | AI brain — workout gen, meal parsing, coaching |
| **Recharts**                      | Progress visualization                         |
| **Framer Motion**                 | Animations                                     |
| **localStorage + IndexedDB**      | Data persistence (no backend needed)           |
| **date-fns**                      | Date manipulation                              |
| **react-router-dom**              | Page routing                                   |
| **PWA**                           | Installable on phone, offline support          |
| **Web Notifications API**         | Meal/workout reminders                         |

### API Design — How We Use Gemini

```javascript
// All AI calls go through a single service
// Uses Gemini 2.0 Flash (free tier: 15 requests/min, 1500/day)

const AI_CONTEXTS = {
  WORKOUT_GENERATION: {
    // System prompt with user stats, equipment, phase, history
    // Returns structured JSON with exercises
  },
  MEAL_PARSING: {
    // System prompt: "Parse this food description into calories/protein/carbs"
    // Input: Natural language food description
    // Returns: { calories, protein, carbs, fats, items: [...] }
  },
  DAILY_CHECKIN: {
    // System prompt: Conversational coach with full user context
    // Multi-turn conversation support
  },
  WEEKLY_REPORT: {
    // System prompt: Analyze 7 days of data, generate narrative report
  },
  MOTIVATION: {
    // System prompt: Generate personalized motivation based on user patterns
  },
  MEAL_SUGGESTION: {
    // System prompt: Suggest meals to hit remaining calorie target
    // Knows Indian food, budget-friendly, easy to make
  },
};

// Rate limiting: We cache AI responses and only call when needed
// Workout: 1 call/day (morning generation)
// Meals: ~4-6 calls/day (parsing + suggestions)
// Check-in: 2-3 calls/day
// Weekly report: 1 call/week
// Total: ~10-15 calls/day (well within free tier)
```

### Data Models (localStorage)

```javascript
// User Profile
{
  name: "Sarthak",
  height: 173,       // cm
  weight: 49,        // starting weight kg
  age: 22,
  gender: "male",
  goalWeight: 65,    // kg
  equipment: ["dumbbells_5kg", "dumbbells_10kg", "bench"],
  dailyCalorieTarget: 2850,
  protein Target: 120, // grams
  wakeTime: "08:00",
  sleepTime: "00:00",
  mealTimes: ["09:00", "13:00", "17:00", "21:00"],
  createdAt: "2026-03-01",
  currentPhase: 1,           // 1-4 progressive phases
  currentDay: 1,             // Day of the journey
  preferences: {
    coachTone: "friendly",   // AI learns this: friendly/strict/humorous
    favoriteExercises: [],
    hatedExercises: [],
    aiModelUsed: "gemini-2.0-flash"
  }
}

// Daily Log (one per day)
{
  date: "2026-03-01",
  workout: {
    completed: true,
    exercises: [
      { name: "Squats", sets: [{ reps: 10, weight: 0 }, { reps: 10, weight: 0 }] },
      { name: "Pushups", sets: [{ reps: 8, weight: 0 }] }
    ],
    duration: 8,             // minutes
    wasEmergencyMinimum: false,
    aiGenerated: true,
    phase: 1
  },
  meals: [
    { slot: "breakfast", description: "2 eggs + toast", calories: 350, protein: 22, time: "09:30", aiParsed: true },
    { slot: "lunch", description: "rice dal sabzi", calories: 550, protein: 15, time: "13:15", aiParsed: true },
    { slot: "snack", description: "banana shake with PB", calories: 450, protein: 18, time: "17:00", aiParsed: true },
    { slot: "dinner", description: "3 rotis chicken curry", calories: 700, protein: 35, time: "21:30", aiParsed: true }
  ],
  totalCalories: 2050,
  totalProtein: 90,
  weight: 49.5,             // if logged
  mood: 3,                  // 1-5
  energyLevel: 3,           // 1-5
  sleepHours: 7,
  checkinDone: true,
  xpEarned: 85,
  notes: ""                 // free text
}

// Streak Data
{
  currentStreak: 14,
  longestStreak: 14,
  totalDaysActive: 18,
  totalDaysSinceStart: 22,
  consistencyScore: 81.8,   // percentage
  skipDaysUsed: 1,          // out of 2 this month
  skipDaysRemaining: 1
}

// XP & Gamification
{
  totalXP: 1250,
  currentLevel: 8,
  levelTitle: "Rising",
  xpToNextLevel: 250,
  achievements: [
    { id: "first_step", unlockedAt: "2026-03-01", title: "First Step" },
    { id: "iron_will", unlockedAt: "2026-03-07", title: "Iron Will (7 days)" },
    { id: "fed_machine", unlockedAt: "2026-03-05", title: "Fed the Machine" }
  ]
}

// AI Conversation History (for context continuity)
{
  conversations: [
    { date: "2026-03-01", role: "assistant", content: "Welcome! Let's start..." },
    { date: "2026-03-01", role: "user", content: "Had maggi and tea" },
    { date: "2026-03-01", role: "assistant", content: "That's about 350 cal..." }
  ],
  lastWeeklyReport: "2026-02-23",
  coachPersonality: {
    // Learned through interactions
    humor: 0.6,
    strictness: 0.3,
    encouragement: 0.8,
    dataFocus: 0.5
  }
}
```

---

## 📱 Complete File Structure

```
energetic/
├── ENERGETIC_BLUEPRINT.md              # This document
├── index.html                          # Entry HTML
├── package.json                        # Dependencies
├── vite.config.js                      # Vite config
├── tailwind.config.js                  # Tailwind config
├── postcss.config.js                   # PostCSS
│
├── public/
│   ├── manifest.json                   # PWA manifest
│   ├── sw.js                           # Service worker for offline + notifications
│   ├── icon-192.png                    # App icon
│   └── icon-512.png                    # App icon large
│
├── src/
│   ├── main.jsx                        # React root
│   ├── App.jsx                         # Router + global state
│   ├── index.css                       # Tailwind imports + custom CSS
│   │
│   ├── services/
│   │   ├── gemini.js                   # 🧠 Gemini API client + rate limiter
│   │   ├── aiCoach.js                  # 🧠 AI Coach logic — workout gen, meal parse, motivation
│   │   ├── aiPrompts.js               # 🧠 All system prompts for different AI contexts
│   │   └── notifications.js           # Push notification scheduling
│   │
│   ├── store/
│   │   ├── storage.js                  # localStorage/IndexedDB wrapper
│   │   ├── userStore.js               # User profile state
│   │   ├── dailyLogStore.js           # Daily logging state
│   │   ├── streakStore.js             # Streak calculations
│   │   ├── xpStore.js                 # XP & gamification state
│   │   └── conversationStore.js       # AI chat history
│   │
│   ├── pages/
│   │   ├── OnboardingPage.jsx          # First-time setup wizard
│   │   ├── DashboardPage.jsx           # Daily hub — AI-powered
│   │   ├── ChatPage.jsx                # 🧠 AI Coach chat interface
│   │   ├── WorkoutPage.jsx             # AI-generated workout player
│   │   ├── MealsPage.jsx              # AI meal logging & suggestions
│   │   ├── ProgressPage.jsx           # Charts, stats, AI reports
│   │   ├── CalendarPage.jsx           # Streak calendar
│   │   └── ProfilePage.jsx            # Settings, API key, preferences
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx              # Bottom tab navigation
│   │   │   ├── Header.jsx             # XP bar + level at top
│   │   │   └── PageTransition.jsx     # Smooth page transitions
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatBubble.jsx          # 🧠 Individual message bubble
│   │   │   ├── ChatInput.jsx           # 🧠 Message input with suggestions
│   │   │   ├── QuickReplies.jsx        # 🧠 Suggested quick responses
│   │   │   └── TypingIndicator.jsx     # 🧠 AI thinking animation
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AIGreeting.jsx          # 🧠 AI-generated daily greeting
│   │   │   ├── TodayMission.jsx        # 🧠 AI-generated mission card
│   │   │   ├── StreakFire.jsx          # Streak counter with fire animation
│   │   │   ├── QuickMealLog.jsx        # Quick meal status buttons
│   │   │   ├── WeightMiniGraph.jsx     # Sparkline weight trend
│   │   │   └── AIInsight.jsx           # 🧠 Daily AI observation
│   │   │
│   │   ├── workout/
│   │   │   ├── WorkoutPlayer.jsx       # Step-by-step guided workout
│   │   │   ├── ExerciseDemo.jsx        # Exercise description + tips
│   │   │   ├── SetTracker.jsx          # Log reps × weight per set
│   │   │   ├── RestTimer.jsx           # Countdown timer between sets
│   │   │   ├── WorkoutSummary.jsx      # 🧠 AI post-workout analysis
│   │   │   └── EmergencyMode.jsx       # "I can't today" → minimum workout
│   │   │
│   │   ├── meals/
│   │   │   ├── MealChat.jsx            # 🧠 "Tell me what you ate" chat
│   │   │   ├── MealCard.jsx            # Parsed meal display
│   │   │   ├── CalorieProgress.jsx     # Daily calorie circular progress
│   │   │   ├── MealSuggestions.jsx     # 🧠 AI meal suggestions
│   │   │   └── NutritionSummary.jsx    # Daily macro breakdown
│   │   │
│   │   ├── progress/
│   │   │   ├── WeightChart.jsx         # Full weight trend + prediction
│   │   │   ├── CalorieChart.jsx        # Daily calorie history
│   │   │   ├── WorkoutVolumeChart.jsx  # Volume progression
│   │   │   ├── ConsistencyHeatmap.jsx  # GitHub-style contribution heatmap
│   │   │   └── AIWeeklyReport.jsx      # 🧠 AI narrative report
│   │   │
│   │   ├── calendar/
│   │   │   ├── StreakCalendar.jsx       # Month view calendar
│   │   │   └── DayDetail.jsx           # Click-to-expand day details
│   │   │
│   │   ├── gamification/
│   │   │   ├── XPBar.jsx               # Animated XP progress
│   │   │   ├── LevelBadge.jsx          # Current level display
│   │   │   ├── LevelUpCelebration.jsx  # Full-screen level up animation
│   │   │   ├── AchievementCard.jsx     # Individual achievement
│   │   │   ├── AchievementUnlock.jsx   # Achievement unlock animation
│   │   │   └── AchievementGrid.jsx     # All achievements view
│   │   │
│   │   ├── onboarding/
│   │   │   ├── WelcomeScreen.jsx       # Initial welcome
│   │   │   ├── StatsForm.jsx           # Height, weight, age input
│   │   │   ├── GoalSetting.jsx         # 🧠 AI helps set realistic goals
│   │   │   ├── EquipmentSelect.jsx     # What equipment you have
│   │   │   ├── ScheduleSetup.jsx       # When you wake/sleep/eat
│   │   │   ├── APIKeySetup.jsx         # Enter Gemini API key
│   │   │   └── PersonalitySelect.jsx   # 🧠 Choose coach personality
│   │   │
│   │   └── shared/
│   │       ├── LoadingSpinner.jsx       # Loading states
│   │       ├── Modal.jsx               # Reusable modal
│   │       ├── ProgressRing.jsx        # Circular progress indicator
│   │       ├── AnimatedNumber.jsx      # Count-up number animation
│   │       └── Toast.jsx              # Notification toasts
│   │
│   ├── data/
│   │   ├── exerciseLibrary.js          # All exercises with descriptions
│   │   ├── foodDatabase.js            # Common Indian foods (AI fallback)
│   │   ├── levels.js                  # Level titles and XP thresholds
│   │   ├── achievements.js            # Achievement definitions
│   │   ├── quotes.js                  # Fallback motivational quotes
│   │   ├── phases.js                  # Workout phase definitions
│   │   └── coachPersonalities.js      # 🧠 Preset coach personalities
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js          # Persistent state
│   │   ├── useUserProfile.js           # User data management
│   │   ├── useAICoach.js              # 🧠 AI interaction hook
│   │   ├── useWorkout.js              # Workout state management
│   │   ├── useMeals.js               # Meal tracking state
│   │   ├── useStreak.js              # Streak calculations
│   │   ├── useXP.js                  # XP & level management
│   │   ├── useAchievements.js        # Achievement detection
│   │   └── useNotifications.js       # Notification management
│   │
│   └── utils/
│       ├── calculations.js            # BMI, TDEE, calorie math
│       ├── dateUtils.js               # Date helpers
│       └── constants.js               # App-wide constants
```

---

## 🔄 Complete User Flows

### Flow 1: First Time Opening (Onboarding)

```
1. Welcome Screen → "I'm Energetic, your AI fitness coach. Let's get started."
2. Stats Form → Enter: Name, Height (173), Weight (49), Age (22)
   → AI calculates: BMI: 16.4, Daily Calories: 2,850, Protein: 120g
3. Goal Setting → AI suggests: "A realistic first target is 55kg in 3 months.
   Long-term, 65kg in 12-18 months. Sound good?"
4. Equipment → Select: Dumbbells ✓, Bench ✓
5. Schedule → Wake: 8AM, Sleep: 12AM, Meal times: 9AM, 1PM, 5PM, 9PM
6. API Key → Enter Gemini API key (with instructions on how to get one)
7. Coach Personality → Choose:
   - "Bro Coach" (casual, encouraging, bro-talk)
   - "Drill Sergeant" (strict, no excuses)
   - "Science Nerd" (data-driven, explains why)
   - "Chill Friend" (relaxed, no pressure)
8. AI generates first day plan → Dashboard
```

### Flow 2: Daily Morning Check-in

```
1. Open app → AI Greeting: "Day 15! 🔥 How's the energy today?"
2. Quick mood tap: 😴 → 😐 → 🙂 → 😊 → 🔥
3. AI generates today's plan:
   "Low energy day? No worries. Here's a lighter plan:
   - Workout: 10-min easy dumbbell session (generated)
   - Calorie target: Same 2,850 but I'll suggest easy meals
   - Minimum to keep streak: Log any 2 meals + 5 min workout"
4. Dashboard shows: Mission card, streak, quick-log buttons
```

### Flow 3: Doing a Workout

```
1. Tap "Start Workout" on dashboard
2. AI-generated workout loads with exercises
3. Each exercise shows:
   - Name + description + tips
   - Sets × Reps target
   - Input: Actual reps done + weight used
   - Rest timer starts automatically between sets
4. After last exercise → Workout Summary
   - Duration, total volume, XP earned
   - AI comment: "Nice! You did 12 reps on curls last time, today you hit 15.
     Next time let's try 7.5kg."
5. +50 XP → Achievement check → Back to dashboard
```

### Flow 4: Logging a Meal

```
1. Open Meals page → Chat interface
2. Type: "had 3 rotis with egg curry and some curd"
3. AI parses → Shows:
   ┌─────────────────────────────────┐
   │ 🍽️ Lunch                        │
   │ 3 rotis + egg curry + curd     │
   │ 🔥 720 cal  🥩 32g protein      │
   │ ✅ Looks right?  ✏️ Edit        │
   └─────────────────────────────────┘
4. Tap ✅ → Added to today
5. AI says: "Great! You've hit 1,800 cal. 1,050 more to go.
   For dinner I'd suggest: rice + chicken/paneer + dal (600 cal)
   + a shake before bed (450 cal). You got this."
6. Calorie progress ring updates in real-time
```

### Flow 5: "I Can't Today" Emergency

```
1. Hit "I Can't Today" button
2. AI response: "That's okay. Everyone has off days.
   Here's the minimum to keep your 14-day streak alive:
   → 10 bodyweight squats (takes 30 seconds)
   → OR just log what you ate today
   → Choose one and your streak lives."
3. Do minimum → AI: "See? You showed up. That's what separates
   people who transform from people who don't.
   Tomorrow's a new day. +25 XP (reduced but earned)"
```

### Flow 6: Weekly AI Report (Every Sunday)

```
1. Sunday notification: "Your weekly report is ready 📊"
2. Open → Full AI narrative:
   - Weight change, calorie averages, workout stats
   - What went well, what to improve
   - Pattern observations
   - Predictions: "At this rate, you'll hit 55kg by May 20"
   - Next week's focus area
3. Beautiful charts accompany the narrative
```

---

## ⚙️ Gemini API Strategy

### Rate Limits (Free Tier)

- **15 requests per minute** (plenty for a single user)
- **1,500 requests per day** (we'll use ~15-25/day max)
- **Model**: gemini-2.0-flash-lite (fast, free, good enough)

### Smart Caching Strategy

To stay well within limits:

```
Morning workout generation  → Cache for the day        (1 call)
Meal parsing               → Per meal, ~4/day          (4 calls)
Meal suggestions           → After each meal log        (4 calls)
Daily check-in             → Morning + evening          (2 calls)
Motivational message       → If pattern detected        (0-2 calls)
Weekly report              → Once per week              (1 call/week)
─────────────────────────────────────────────────────────
TOTAL: ~12-15 calls/day (well under 1,500 limit)
```

### Fallback System

If API fails or rate-limited:

- **Workout**: Falls back to pre-built static workout plans
- **Meal parsing**: Falls back to local food database with keyword matching
- **Motivation**: Falls back to curated quotes list
- **Everything still works** — AI just makes it smarter

### Prompt Engineering Strategy

Each AI context has a carefully crafted system prompt:

1. **User context injection**: Stats, current phase, recent history
2. **Structured output format**: JSON for workout/meal parsing, markdown for reports
3. **Personality layer**: Matches selected coach personality
4. **Memory injection**: Recent conversation history for continuity
5. **Safety**: Includes health disclaimers, doesn't replace medical advice

---

## 🎮 Gamification Deep Dive

### XP System

```
Action                          XP Reward
─────────────────────────────────────────
Complete full workout           +50
Complete emergency minimum      +25
Log all 4 meals                 +30
Hit calorie target (80%+)       +20
Hit calorie target (100%+)      +30
Log weight                      +10
Daily check-in                  +5
7-day streak bonus              +100
14-day streak bonus             +200
30-day streak bonus             +500
60-day streak bonus             +1000
─────────────────────────────────────────
Potential daily max: ~145 XP
```

### Level Progression

```
Level  Title                XP Required   Cumulative
─────────────────────────────────────────────────────
1      Couch Potato         0             0
2      Beginner             100           100
3      Getting Moving       250           350
4      Showing Up           450           800
5      Consistent           700           1,500
6      Building Momentum    1,000         2,500
7      Dedicated            1,500         4,000
8      Rising               2,000         6,000
9      Strong-Willed        2,500         8,500
10     Fighter              3,000         11,500
12     Warrior              4,000         19,500
15     Disciplined          5,000         34,500
18     Powerful             6,000         52,500
20     Unstoppable          7,000         66,500
25     Beast                10,000        116,500
30     Legendary            15,000        191,500
```

### Achievements (35 Total)

```
BEGINNER ACHIEVEMENTS:
  "First Step"       — Complete first workout
  "Fed the Machine"  — Hit calorie target 3 days in row
  "Weigh-In"         — Log weight for first time
  "Day One"          — Complete full day (workout + all meals)

CONSISTENCY ACHIEVEMENTS:
  "Iron Will"        — 7-day streak
  "Two Weeks Strong" — 14-day streak
  "Monthly Monster"  — 30-day streak
  "Unbreakable"      — 60-day streak
  "Habit Formed"     — 66 consecutive days (science-backed)
  "Centurion"        — 100-day streak

PROGRESS ACHIEVEMENTS:
  "First Kilo"       — Gain 1kg from starting weight
  "5kg Club"         — Gain 5kg
  "10kg Club"        — Gain 10kg
  "Halfway There"    — Reach halfway to goal weight
  "Goal Reached"     — Hit goal weight

WORKOUT ACHIEVEMENTS:
  "Rep Master"       — Complete 1,000 total reps
  "Iron Pumper"      — Lift 10,000 kg total volume
  "Phase 2"          — Advance to Phase 2 workouts
  "Phase 3"          — Advance to Phase 3
  "Phase 4"          — Reach final phase
  "Hour Warrior"     — Complete a 45+ min workout

MEAL ACHIEVEMENTS:
  "Breakfast Club"   — Eat breakfast 7 days straight
  "Calorie King"     — Hit 3,000+ cal in a day
  "Protein Hero"     — Hit 120g+ protein in a day
  "Meal Streak"      — Log all 4 meals for 14 days

SPECIAL ACHIEVEMENTS:
  "Night Owl"        — Complete workout after 10 PM
  "Early Bird"       — Complete workout before 8 AM
  "Comeback Kid"     — Return after 3+ day break
  "Emergency Wins"   — Use emergency protocol 3 times (still showed up!)
  "Chatterbox"       — Chat with AI coach 50 times
  "Data Nerd"        — Log weight 30 days
  "Photograph"       — Add progress photo (future feature)
  "Social Proof"     — Share a milestone (future feature)
  "One Year"         — Active for 365 days
```

---

## 🎨 UI/UX Design Direction

### Visual Style

- **Dark mode primary** (easier on eyes, modern, feels like a game)
- **Accent color**: Electric orange (#FF6B35) — energy, fire, warmth
- **Secondary**: Deep purple (#6C35DE) — achievement, premium feel
- **Font**: Inter (clean, modern, great readability)
- **Cards**: Rounded, subtle glassmorphism with blur backgrounds
- **Animations**: Smooth transitions, satisfying micro-interactions

### Mobile-First Layout

- Bottom tab navigation (thumb-friendly)
- Card-based content sections
- Swipe gestures for day navigation
- Pull-to-refresh for new AI content

### Key Screens (Wireframe Descriptions)

```
┌─ DASHBOARD ──────────────────┐
│ [XP BAR: Level 8 • Rising]   │
│                               │
│ ┌─ AI GREETING ──────────┐   │
│ │ "Day 15 🔥 Energy: ☀️☀️☀️" │   │
│ │ "Upper body day. 12 min"│   │
│ └─────────────────────────┘   │
│                               │
│ ┌─ TODAY'S MISSION ──────┐   │
│ │ 💪 Workout   ○ Not done │   │
│ │ 🍽️ Meals     2/4 logged │   │
│ │ 🔥 Calories  1,200/2,850│   │
│ │                         │   │
│ │ [START WORKOUT]         │   │
│ │ [I Can't Today]         │   │
│ └─────────────────────────┘   │
│                               │
│ ┌─ STREAK: 🔥 14 days ───┐   │
│ │ Best: 14 | Month: 18/22 │   │
│ └─────────────────────────┘   │
│                               │
│ ┌─ WEIGHT TREND ─────────┐   │
│ │ ▁▂▂▃▃▄▄▅ 50.8 kg       │   │
│ │ +1.8 kg since start     │   │
│ └─────────────────────────┘   │
│                               │
│ [🏠] [💪] [🍽️] [📊] [👤]     │
└───────────────────────────────┘
```

---

## 📋 Build Order (Exact Steps)

### Phase A: Project Setup (Steps 1-3)

```
Step 1: Initialize Project
  - Create Vite + React project
  - Install all dependencies
  - Configure Tailwind CSS
  - Set up file structure

Step 2: Core Infrastructure
  - localStorage wrapper with versioning
  - Gemini API client with rate limiting
  - AI prompt templates
  - Utility functions (BMI, TDEE, dates)

Step 3: Data Layer
  - Exercise library (50+ exercises with descriptions)
  - Food database (100+ Indian foods with macros)
  - Level & achievement definitions
  - Workout phase definitions
  - Coach personality presets
```

### Phase B: Onboarding (Step 4)

```
Step 4: Onboarding Flow
  - Welcome screen with app intro
  - Stats input form (height, weight, age)
  - AI-powered goal setting
  - Equipment selection
  - Schedule setup
  - Gemini API key input
  - Coach personality selection
  - Calculate all derived values (TDEE, targets)
  - Save to localStorage
```

### Phase C: Core Features (Steps 5-9)

```
Step 5: Layout + Navigation
  - Bottom navbar component
  - Header with XP bar
  - Page router setup
  - Page transition animations

Step 6: Dashboard
  - AI greeting component (calls Gemini)
  - Today's mission card
  - Streak fire counter
  - Quick meal log buttons
  - Weight mini sparkline
  - AI daily insight card

Step 7: AI Chat Interface
  - Chat page with message bubbles
  - Message input with send
  - AI typing indicator
  - Quick reply suggestions
  - Conversation history persistence
  - Multi-context AI (can discuss workouts, meals, motivation)

Step 8: Workout System
  - AI workout generation (Gemini call)
  - Workout player with exercise cards
  - Set/rep/weight logging per exercise
  - Rest timer between sets
  - Workout completion summary with AI analysis
  - Emergency minimum mode
  - Phase progression logic

Step 9: Meal System
  - Natural language meal input
  - AI parsing to structured nutrition data
  - Meal slot cards with edit/delete
  - Calorie progress ring (circular)
  - AI meal suggestions for remaining calories
  - Daily nutrition summary
```

### Phase D: Tracking & Gamification (Steps 10-12)

```
Step 10: Streak Calendar
  - Month grid view
  - Color-coded days (green/yellow/red/gray)
  - Streak counter + longest streak
  - Day detail popup on click
  - Skip day tracking

Step 11: Progress & Charts
  - Weight trend line chart (Recharts)
  - Calorie history bar chart
  - Workout volume chart
  - Consistency heatmap (GitHub-style)
  - AI weekly report display
  - Predicted weight projection

Step 12: XP & Achievements
  - XP calculation on every action
  - Animated XP bar in header
  - Level-up full-screen celebration
  - Achievement grid page
  - Achievement unlock toast notifications
  - Level badge display
```

### Phase E: Polish (Steps 13-15)

```
Step 13: Profile & Settings
  - View/edit profile stats
  - Change coach personality
  - Update API key
  - Reset progress option
  - Export data as JSON

Step 14: PWA + Notifications
  - manifest.json for installability
  - Service worker for offline
  - Notification permission request
  - Scheduled meal reminders
  - Workout reminder if not done by evening

Step 15: Polish & Testing
  - Smooth animations throughout
  - Loading states for AI calls
  - Error handling for API failures
  - Fallback modes when offline
  - Full flow testing
  - Performance optimization
```

---

## 🔑 What You Need to Get Started

1. **Gemini API Key** (free):
   - Go to https://aistudio.google.com/apikey
   - Click "Create API Key"
   - Copy the key — you'll enter it in the app during onboarding

2. **Node.js** installed on your machine (you likely have this)

3. **That's it.** No backend, no database, no deployment needed.

---

## 💡 Why This Will ACTUALLY Work For You

| Problem                                 | How Energetic Solves It                                        |
| --------------------------------------- | -------------------------------------------------------------- |
| "I start too big and quit"              | Phase 1 is literally 5 squats. You cannot fail.                |
| "I don't see progress"                  | AI shows you data + predictions. Weight is tracked daily.      |
| "I forget to eat"                       | AI reminders + natural language logging makes it frictionless  |
| "Nothing motivates me"                  | Gamification creates internal motivation. XP is addictive.     |
| "I quit after 2-3 weeks"                | AI detects quit signals and intervenes before you do           |
| "Gym is intimidating"                   | Home workouts only. Dumbbells + bench. Your room.              |
| "I don't know what to eat"              | AI tells you exactly what to eat next to hit your target       |
| "Plans don't adapt to me"               | Every single thing is AI-generated for YOUR specific situation |
| "I'm a developer, not a fitness person" | This is a GAME, not a fitness app. You level up. You unlock.   |

---

## 🚀 Ready?

This is the complete blueprint. Every feature, every file, every flow, every data model.

When you say go, I start building. Step by step. File by file. Working application.

---

_"The best time to plant a tree was 20 years ago. The second best time is now."_
_But we're not planting a tree. We're building a machine that plants the tree for you._
