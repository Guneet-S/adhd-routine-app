# CONVENTIONS.md

# Coding Conventions

---

# Components

- Use reusable components
- Keep components small and focused
- Do not place large UI logic into a single file

---

# Naming

## Components
- PascalCase
- Example: TaskCard.tsx

## Variables and Functions
- camelCase
- Example: createTask

## Folders
- lowercase
- readable naming (no abbreviations)

---

# Styling

- Tailwind CSS only
- Avoid inline styles unless necessary

---

# State Management

- Keep state local where possible
- Avoid overengineering global state

---

# Animations

- Use Framer Motion only
- Keep animations smooth and minimal
- No aggressive bouncing or flashy effects

---

# Organization Rules

## Keep Components Small
Do not create massive component files.

## Separate UI and Logic
Avoid mixing in one file:
- Firebase logic
- UI rendering
- animations
- business logic

---

# MVP Component List

Planned components:
- Navbar
- TaskCard
- TaskList
- TaskCategorySection
- AddTaskModal
- EditTaskModal
- Button
- Input
- Card
- EmojiPicker

---

# Firestore Schema

## Collection Structure

```
users/
  └── userId/
        ├── profile/
        └── tasks/
```

## Task Document Structure

```json
{
  "title": "Brush Teeth",
  "emoji": "🪥",
  "completed": false,
  "category": "morning",
  "order": 1
}
```

---

# Strict Rules

## UI Rules

- Mobile-first always
- Large buttons and touch targets
- Minimal clutter
- Large readable text
- Calm pastel UI only

## ADHD UX Rules

- Reduce overwhelm
- Avoid dense layouts
- One primary action per screen
- Use visual cues like emoji/icons
- Never punish missed tasks

## Development Rules

- Do not add unplanned features
- Do not introduce unnecessary libraries
- Do not create complex architecture early
- Keep Firebase schema simple
- Avoid premature optimization

---

# MVP Scope Rules

Do NOT add:
- AI features
- voice assistant
- analytics system
- social features
- therapist dashboard
- wearable integrations
- advanced gamification

These belong to later phases only.
