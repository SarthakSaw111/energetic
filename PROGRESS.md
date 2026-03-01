# ENERGETIC — Build Progress & Continuation Guide

## Status: FULLY DEPLOYED & WORKING — v2.0.0 🔥

**Last Updated:** Session 3 (Final)  
**App Status:** All features working with Supabase backend  
**Live URL:** https://SarthakSaw111.github.io/energetic/  
**GitHub Repo:** https://github.com/SarthakSaw111/energetic  
**Supabase Project:** https://xhcmldbpbnaacdkhfgsh.supabase.co  
**Dev Server:** `npm run dev` → http://localhost:5173/energetic/

---

## Session 3 — Supabase Migration & Deployment (COMPLETE)

### What Was Done

1. **Supabase project created** — URL: `https://xhcmldbpbnaacdkhfgsh.supabase.co` (Mumbai/ap-south-1)
2. **@supabase/supabase-js** installed (v2.98.0)
3. **.env** updated with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. **SQL schema designed** — `supabase/schema.sql` (6 tables, RLS, storage bucket, indexes, triggers)
5. **Supabase client service** — `src/services/supabase.js` (auth functions: signUp, signIn, signInWithGitHub, signOut)
6. **Database storage layer** — `src/store/db.js` (async Supabase versions of all storage.js functions)
7. **Auth page** — `src/pages/AuthPage.jsx` (email/password + GitHub OAuth login/signup)
8. **App.jsx rewritten** — Auth state management, async profile loading, session-based routing
9. **All 6 pages migrated** — Every `import { ... } from '../store/storage'` → `import { ... } from '../store/db'`, all sync calls → async/await
10. **Photo storage migrated** — base64 in localStorage → Supabase Storage bucket `progress-photos`
11. **HashRouter** — Changed from BrowserRouter for GitHub Pages compatibility
12. **Deployment config** — `vite.config.js` base path, `gh-pages` package, deploy scripts in package.json
13. **Logout button** — Added to ProfilePage
14. **Version bumped** — v2.0.0 with Supabase sync

### Completed Setup Steps

- ✅ SQL schema run in Supabase SQL Editor
- ✅ Email provider enabled, email confirmation disabled
- ✅ GitHub repo created and code pushed
- ✅ GitHub Pages deployment via `gh-pages` (Published)
- ✅ Supabase redirect URLs configured
- ✅ End-to-end tested: signup → onboarding → dashboard → logout → login (data persists!)
- ✅ Cross-device verified: same data on localhost AND production site

### Known Issue: India DNS Block

Supabase is experiencing an ongoing ISP-level DNS issue in India. If you get `ERR_CONNECTION_TIMED_OUT`, change DNS to:
- **Cloudflare**: 1.1.1.1
- **Google**: 8.8.8.8
- Or use a VPN

See: https://status.supabase.com/incidents/xmgq69x4brfk

### Optional: GitHub OAuth

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. App name: `Energetic`
3. Homepage URL: `https://SarthakSaw111.github.io/energetic`
4. Callback URL: `https://xhcmldbpbnaacdkhfgsh.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret
6. In Supabase Dashboard → **Authentication** → **Providers** → **GitHub**
7. Enable it, paste Client ID and Client Secret, Save

### Test Account

- **Email:** sarthak.test@gmail.com
- **Password:** Test@12345
- **Profile:** Sarthak, 173cm, 49kg, Goal 65kg, Bro Coach

---

## What's Built & Working

### Core Infrastructure (100% Complete)

- **Vite 7 + React 19** project with all dependencies installed
- **TailwindCSS v3** with custom dark theme, brand colors, animations
- **Google Gemini AI** integration (text + vision) with rate limiting + offline fallback
- **localStorage** persistence layer with full CRUD
- **React Router v6** with 5 routes + bottom tab navigation

### Pages (100% Complete — All 6 pages functional)

| Page       | File                           | Status     | Key Features                                                                                         |
| ---------- | ------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------- |
| Onboarding | `src/pages/OnboardingPage.jsx` | ✅ Working | 8-step wizard: welcome → stats → goal → equipment → schedule → api key → coach → ready               |
| Dashboard  | `src/pages/DashboardPage.jsx`  | ✅ Working | AI greeting, mood picker, today's mission cards, calorie/protein stats, daily quote                  |
| Workout    | `src/pages/WorkoutPage.jsx`    | ✅ Working | AI-generated workouts, exercise cards with set tracking, rest timer, emergency mode, XP rewards      |
| Meals      | `src/pages/MealsPage.jsx`      | ✅ Working | Natural language meal input (AI parses), calorie ring, macro bars, quick add from DB, AI suggestions |
| Progress   | `src/pages/ProgressPage.jsx`   | ✅ Working | Weight chart, calorie chart, consistency calendar, photo gallery with AI analysis, weight logging    |
| Profile    | `src/pages/ProfilePage.jsx`    | ✅ Working | Stats editing, coach personality switcher, API key management, data export/clear                     |

### Data Layer (100% Complete)

| File                             | Purpose                                                           |
| -------------------------------- | ----------------------------------------------------------------- |
| `src/utils/constants.js`         | Storage keys, Gemini models, phases, moods, XP rewards, nav items |
| `src/utils/calculations.js`      | BMI, TDEE, calorie/protein targets, phase calculation, volume     |
| `src/utils/dateUtils.js`         | Date formatting, journey day, month helpers, time greeting        |
| `src/data/exerciseLibrary.js`    | 40+ exercises (bodyweight + dumbbell) with muscle groups          |
| `src/data/foodDatabase.js`       | 50+ Indian foods with full macros                                 |
| `src/data/levels.js`             | 16 levels from "Couch Potato" to "Legendary" with XP thresholds   |
| `src/data/achievements.js`       | 35 achievements across 6 categories                               |
| `src/data/phases.js`             | 4 workout phases (Seed/Sprout/Growth/Tree)                        |
| `src/data/coachPersonalities.js` | 4 AI coach presets with personality prompts                       |
| `src/data/quotes.js`             | 30 motivational quotes                                            |

### AI Services (100% Complete)

| File                        | Purpose                                                                        |
| --------------------------- | ------------------------------------------------------------------------------ |
| `src/services/gemini.js`    | Gemini API client: init, prompt, chat, structured (JSON), vision, rate limiter |
| `src/services/aiPrompts.js` | All system prompts: workout, meal parsing, chat, weekly report, photo analysis |
| `src/services/aiCoach.js`   | AI orchestration with full offline fallback for every function                 |

### Layout & Styling (100% Complete)

| File                               | Purpose                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `src/App.jsx`                      | Main app: AppContext, routing, profile loading, Gemini init                |
| `src/index.css`                    | Custom Tailwind: glass-card, buttons, XP bar, chat bubbles, fire animation |
| `src/components/layout/Navbar.jsx` | Bottom tab navigation with active animation                                |
| `src/components/layout/Header.jsx` | Sticky header with level badge, XP bar                                     |

### Store (100% Complete — Dual Layer)

| File                           | Purpose                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `src/store/db.js`              | **NEW** Supabase-backed async storage: all CRUD ops, photo upload, data export    |
| `src/store/storage.js`         | **LEGACY** localStorage wrapper (kept for reference, no longer imported anywhere) |
| `src/hooks/useLocalStorage.js` | React hook for persistent state                                                   |

### Auth & Supabase (NEW — Session 3)

| File                       | Purpose                                                               |
| -------------------------- | --------------------------------------------------------------------- |
| `src/services/supabase.js` | Supabase client init, auth functions (signUp, signIn, OAuth, signOut) |
| `src/store/db.js`          | All DB operations: profiles, logs, streak, XP, gallery, conversations |
| `src/pages/AuthPage.jsx`   | Login/Signup page with email + GitHub OAuth                           |
| `supabase/schema.sql`      | Complete SQL schema (6 tables, RLS policies, storage bucket, indexes) |
| `.env`                     | VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, google_free_api_key        |
| `.env.example`             | Template for required environment variables                           |

---

## What's NOT Built Yet (Enhancement Phase)

### High Priority

1. **Achievement System UI** — achievements are defined in data but no popup/notification when earned
2. **AI Chat Component** — standalone chat interface with the AI coach (services exist, UI doesn't)
3. **Streak tracking improvement** — streak logic in WorkoutPage needs edge cases (missed days reset)
4. **PWA manifest + service worker** — offline support, install prompt
5. **Notification system** — meal reminders, workout reminders based on schedule

### Medium Priority

6. **Workout verification via photo** — upload selfie after workout, AI verifies (analyzeProgressPhoto exists)
7. **Weekly report generation** — generateWeeklyReport exists in aiCoach, needs UI trigger
8. **Weight prediction chart** — `predictWeight` function exists, needs chart integration
9. **Deload week detection** — in Phase 4, every 4th week should reduce intensity
10. **Exercise history tracking** — track sets/reps/weight per exercise over time

### Low Priority (Polish)

11. **Page transition animations** — smoother route transitions
12. **Skeleton loading states** — skeleton class exists in CSS, needs to be used more
13. **Error boundary** — React error boundary for graceful crash recovery
14. **Data import from JSON** — matching the existing export functionality
15. **Sound/haptics** — timer sounds, completion haptics
16. **Responsive desktop layout** — currently mobile-first, could add wider layouts

---

## File Structure

```
energetic/
├── .env                          # Supabase + Google API keys
├── .env.example                  # Template for env vars
├── .gitignore                    # Excludes .env, node_modules, dist
├── package.json                  # React 19, Vite 7, Supabase, deploy scripts
├── vite.config.js                # base: '/energetic/' for GitHub Pages
├── tailwind.config.js            # Custom colors, animations
├── postcss.config.js
├── index.html
├── ENERGETIC_BLUEPRINT.md        # Full architecture document
├── PROGRESS.md                   # THIS FILE
├── supabase/
│   └── schema.sql                # Database schema (run in Supabase SQL Editor)
└── src/
    ├── main.jsx                  # React entry point
    ├── index.css                 # Custom Tailwind styles
    ├── App.jsx                   # Auth state, AppContext, HashRouter, profile loading
    ├── hooks/
    │   └── useLocalStorage.js
    ├── store/
    │   ├── db.js                 # Supabase storage layer (async)
    │   └── storage.js            # Legacy localStorage (no longer used)
    ├── utils/
    │   ├── constants.js
    │   ├── calculations.js
    │   └── dateUtils.js
    ├── data/
    │   ├── exerciseLibrary.js
    │   ├── foodDatabase.js
    │   ├── levels.js
    │   ├── achievements.js
    │   ├── phases.js
    │   ├── coachPersonalities.js
    │   └── quotes.js
    ├── services/
    │   ├── gemini.js
    │   ├── aiPrompts.js
    │   ├── aiCoach.js
    │   └── supabase.js           # Supabase client + auth helpers
    ├── components/
    │   └── layout/
    │       ├── Navbar.jsx
    │       └── Header.jsx
    └── pages/
        ├── AuthPage.jsx          # Login/Signup (email + GitHub)
        ├── OnboardingPage.jsx
        ├── DashboardPage.jsx
        ├── WorkoutPage.jsx
        ├── MealsPage.jsx
        ├── ProgressPage.jsx
        └── ProfilePage.jsx
```

---

## Key Technical Details

### Gemini API

- **Models:** `gemini-2.5-flash-lite` (text), `gemini-2.5-flash` (vision)
- **Rate Limits:** 14 req/min, 1400 req/day (enforced in gemini.js)
- **API Key:** Stored in user profile (localStorage) AND .env for development
- **Fallback:** Every AI function has offline fallback that generates reasonable results

### AppContext Shape

```js
{
  profile,        // User profile object (from Supabase)
  session,        // Supabase auth session
  today,          // "YYYY-MM-DD" string
  journeyDay,     // Number (days since start)
  phase,          // 1-4 (Seed/Sprout/Growth/Tree)
  levelInfo,      // { level, title, icon, totalXP, progress, xpNeeded, ... }
  bmi,            // Number
  xpData,         // { totalXP, achievements[] }
  refresh(),      // Force re-read from Supabase
  updateProfile(),// Save profile to state + Supabase
  updateXP(),     // Save XP to state + Supabase
}
```

### Daily Log Shape (per date in STORAGE_KEYS.DAILY_LOGS)

```js
{
  checkedIn: boolean,
  mood: 1-5,
  weight: number,
  workoutDone: boolean,
  workout: { name, duration, exercises[], ... },
  meals: [{ name, calories, protein, carbs, fats, items[], source, time }],
  calorieXPAwarded: boolean,
  allMealsXPAwarded: boolean,
  weightXPAwarded: boolean,
}
```

---

## How to Continue Development

1. **Run the app:** `cd energetic && npm run dev`
2. **Read this file** for context on what's built
3. **Read ENERGETIC_BLUEPRINT.md** for the full architecture vision
4. **Pick items from "What's NOT Built Yet"** section above
5. **The empty `src/components/` subdirectories** (chat/, dashboard/, workout/, meals/, progress/, calendar/, gamification/, onboarding/, gallery/, shared/) are ready for extracted components

### Quick Wins to Start With

- Extract workout exercise cards into `src/components/workout/ExerciseCard.jsx`
- Add achievement popup component
- Create AI chat drawer component
- Add PWA manifest.json
