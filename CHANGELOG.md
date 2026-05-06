# Changelog — ADHD Kids Routine App

## v0.1.0 — 2026-05-07 (Initial Release)

---

### ✨ New Features

- **Dashboard**: Full child-facing dashboard with motivational banner, progress ring, stars and streak stats, and scrollable Morning / Study / Evening routine sections
- **Task Completion**: Oversized animated checkboxes — tap to complete a task with a satisfying spring animation
- **Add Task**: Bottom-sheet modal with 5 steps — task name (40 char), emoji picker (24 emojis, 2 pages), category selector (Morning / Study / Evening with times), optional reminder toggle, and optional notes
- **Routine Builder**: Edit and delete tasks per category from a dedicated routine management page
- **Rewards Page**: Stars total, streak counter, and badge grid showing earned and upcoming achievements
- **Login Page**: Email + password login with Google sign-in option, lavender gradient background
- **Sign Up Page**: Parent name, child name, email, and password registration flow
- **Landing Page**: Hero section with app overview, feature highlights, and login / sign-up CTAs

---

### 🎨 Design System

- **Purple theme**: Primary color `#7C3AED` (violet) throughout all interactive elements
- **Pastel section backgrounds**: Warm yellow for Morning, lavender for Evening, soft blue for Study
- **Nunito font** with Noto Sans Gurmukhi support for Punjabi text rendering
- **Rounded corners everywhere**: `rounded-2xl` minimum on all cards, inputs, buttons, and checkboxes
- **Mobile-first layout**: Optimized for 375px width — large touch targets (52px+ buttons, 32px checkboxes)

---

### 🧩 Components Built

- **Button** — primary / secondary / ghost / Google variants with tap feedback
- **Checkbox** — 32×32px animated with spring bounce and path-draw checkmark
- **Card** — white background, soft shadow, rounded-2xl
- **Input** — icon slots left and right, focus ring, rounded
- **ProgressRing** — SVG circular progress indicator
- **StatsCard** — icon, value, label display
- **Header** — avatar, greeting, child name, notification bell
- **BottomNav** — 5 tabs with floating purple + center button for adding tasks
- **TaskCard** — emoji icon, task name, oversized checkbox
- **TaskList** — staggered entrance animation
- **TaskCategorySection** — collapsible section with remaining tasks badge
- **EmojiPicker** — 6-column paginated emoji grid
- **AddTaskModal** — 5-step bottom sheet, slides up with spring animation
- **EditTaskModal** — edit task name, emoji, and category

---

### 🔧 Technical

- Next.js 16 with App Router and TypeScript
- Tailwind CSS v4 with custom color tokens
- Framer Motion for all animations (no CSS transitions for interactions)
- Firebase config stub ready for environment variable wiring
- GPS logo branding in landing page header and footer
- Clean production build — all 8 routes pre-rendered as static content
