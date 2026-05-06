# CLAUDE.md

## Project Name
ADHD Kids Routine App

---

# Developer Profile

You are a professional full-stack web developer with deep expertise in:
- Frontend: React, Next.js, Tailwind CSS, Framer Motion, TypeScript
- Backend: Firebase (Auth, Firestore, Storage), Node.js
- UI/UX: mobile-first design, component architecture, accessibility
- Deployment: Vercel, Firebase Hosting

You have access to all global Claude Code skills and tools. Use them freely as needed.

Build this project to production-quality standards — clean code, proper TypeScript types, responsive layouts, accessible components.

---

# Project Description

Mobile-first ADHD routine management app for children, managed by parents.

The app is child-facing on the dashboard — children see their own routines and complete tasks.
Parents manage and create routines in the background.

UI language: Punjabi (Gurmukhi script). Use Noto Sans Punjabi font for Gurmukhi text.

The system focuses on:
- reducing overwhelm for ADHD children
- simple visual task execution
- gamification (stars, streaks, rewards) to motivate consistency
- distraction-free UX
- ADHD-friendly interaction patterns

The initial MVP allows:
- parents to log in, create and manage routines
- children to view their dashboard and complete tasks
- gamification: earn stars per task, track streaks, view rewards

The product is intentionally minimal for Phase 1.

---

# Tech Stack

## Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Backend
- Firebase

## Firebase Services
- Firebase Authentication (Google + Email/Password)
- Firestore Database

## Deployment
- Vercel

---

# Project Principles

This project is:
- mobile-first (375px base width)
- ADHD-friendly
- child-facing dashboard
- gamified (stars, streaks, rewards)
- low-friction

The interface must prioritize:
- clarity
- large touch targets (min 48px)
- low cognitive load
- minimal distractions
- Punjabi language throughout

---

# Folder Structure

src/
 ├── app/
 │     ├── page.tsx              (landing)
 │     ├── login/page.tsx
 │     ├── signup/page.tsx
 │     ├── dashboard/page.tsx    (child dashboard)
 │     ├── routine/page.tsx      (routine builder)
 │     └── rewards/page.tsx
 │
 ├── components/
 │     ├── layout/
 │     │     ├── BottomNav.tsx
 │     │     └── Header.tsx
 │     ├── tasks/
 │     │     ├── TaskCard.tsx
 │     │     ├── RoutineSection.tsx
 │     │     └── TaskCheckbox.tsx
 │     ├── modals/
 │     │     └── AddTaskModal.tsx
 │     └── ui/
 │           ├── Button.tsx
 │           ├── Card.tsx
 │           ├── Input.tsx
 │           ├── StatsRow.tsx
 │           └── ProgressRing.tsx
 │
 ├── firebase/
 │     └── config/
 │           └── index.ts
 │
 ├── hooks/
 ├── lib/
 └── styles/
