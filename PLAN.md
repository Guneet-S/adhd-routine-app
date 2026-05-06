# PLAN.md

# Project Goal

Build a mobile-first ADHD routine management app for children, managed by parents.

The child sees their own dashboard with daily routines and completes tasks.
The parent creates and manages routines in the background.

The system should help:
- reduce overwhelm for ADHD children
- simplify and structure daily routines
- improve consistency through gamification
- create a calm, rewarding visual experience

---

# Target Users

## Primary Users
Children with ADHD — they use the dashboard daily to complete tasks.

## Secondary Users
Parents — they set up and manage routines.

---

# MVP Goals

Children should be able to:
- see their daily routines on the dashboard
- complete tasks by tapping checkboxes
- earn stars and track streaks
- view rewards

Parents should be able to:
- log in
- create routines with tasks
- edit and delete tasks
- organize tasks by category

---

# Gamification System

Each task completion earns 1 star.
Stars are tracked daily.
Streaks count consecutive days with at least one routine completed.
Rewards page shows earned badges or milestones.

Stats shown on dashboard:
- Circular progress ring: X/Y tasks done today
- Stars today: total stars earned today
- Streak: consecutive days active
- Rewards button: links to rewards page

---

# Core Features

## Authentication
- Google Login
- Email + Password

Using Firebase Authentication.

---

# Dashboard (Child-Facing)

Header:
- Child avatar (cartoon)
- Greeting in Punjabi
- Child name + star emoji
- Notification bell

Motivational Banner:
- Encouraging message in Punjabi
- Illustrated graphic (mountain/rainbow)

Stats Row:
- Progress ring (tasks done / total)
- Stars earned today
- Current streak (days)
- Rewards button

Routine Sections (scrollable):
- Morning Routine (sun emoji, yellow background)
- Evening Routine (moon emoji, lavender background)
- Study Time (book emoji, blue background)

Each section shows:
- Section title + task count + remaining count
- Task list: emoji icon + task name + large checkbox
- Completed tasks visually distinct

Bottom Navigation:
- Home, Routine, Add Task (+), Rewards, More

---

# Task System

Each task contains:
- title (Punjabi text)
- emoji icon
- completion state (boolean)
- category (Morning / Evening / Study)
- order (for sorting within category)
- reminder time (optional)
- notes (optional)

---

# Add/Edit Task Modal (5-step form)

Step 1: Task name (text input, max 40 chars)
Step 2: Choose emoji (grid picker, 2 pages of 12 emojis each)
Step 3: Choose category (Morning / Evening / Study — card selector with time ranges)
Step 4: Set reminder (optional time toggle)
Step 5: Notes (optional textarea, max 80 chars)

---

# Task Categories

- Morning Routine (6:30 - 8:30)
- Evening Routine (6:00 - 8:30)
- Study Time (3:30 - 5:00)

---

# Planned Pages

## Public Pages
1. Landing / Login Page (combined)
2. Sign Up Page

## Authenticated Pages
3. Child Dashboard (home)
4. Routine Builder / Task List
5. Rewards Page
6. Add/Edit Task Modal (overlay)

---

# Mobile-First Requirements

Base design width: 375px (iPhone SE)
All layouts must work on 375px - 430px screens.

Requirements:
- vertical scrolling only
- large touch targets (48px minimum)
- readable typography (16px base)
- simplified navigation (bottom nav bar)
- minimal distractions

---

# Language

UI language: Punjabi (Gurmukhi script)
Font: Noto Sans Punjabi for Gurmukhi, Nunito for Latin characters

---

# Phase 1 Scope

Included:
- auth (Google + email/password)
- child dashboard with routines
- gamification (stars, streak, rewards page)
- task CRUD
- 3 categories (Morning, Evening, Study)
- Add Task 5-step modal
- bottom navigation
- Firebase Auth + Firestore
- Punjabi UI text

Excluded:
- AI
- voice guidance
- therapist dashboards
- multi-child profiles
- social systems
- push notifications (just UI toggle for now)

---

# Milestones

## Milestone 1
Planning and structure setup. (Done)

## Milestone 2
Design system: Tailwind config, color tokens, Nunito + Noto Sans Punjabi fonts, base components.

## Milestone 3
Next.js project setup with all dependencies installed.

## Milestone 4
Authentication flow: login page, signup page, Firebase Auth wiring.

## Milestone 5
Child dashboard UI with mock data: header, banner, stats row, routine sections, task rows, bottom nav.

## Milestone 6
Add Task modal: 5-step form, emoji picker, category selector.

## Milestone 7
Connect Firestore: real task CRUD, completion state persistence, star/streak tracking.

## Milestone 8
Framer Motion animations: checkboxes, modal, page transitions, card entrances.

## Milestone 9
Responsive testing, Punjabi text review, accessibility check, clean build.
