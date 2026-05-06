# DESIGN.md

# Design Direction

The product should feel:
- calm
- safe
- playful
- child-friendly
- ADHD-friendly

The UI must reduce overwhelm and feel rewarding to use.

---

# Design Inspiration

Inspired by:
- Duolingo
- Headspace

---

# Primary Color

PRIMARY: Purple (#7C3AED / violet-600)
Use purple as the dominant brand color throughout.

Supporting colors:
- Warm yellow (#FEF3C7) — morning routine section background
- Light lavender (#EDE9FE) — evening routine section background, page backgrounds
- Soft blue (#DBEAFE) — study section
- White — cards, modals, bottom nav

Avoid:
- harsh black (use slate-700 max for text)
- aggressive red
- neon saturation

---

# Typography

Primary font: Nunito (Google Fonts) — rounded, friendly, highly readable
Punjabi font: Noto Sans Punjabi (Google Fonts) — for Gurmukhi script

Typography requirements:
- large readable text (base 16px, headings 20px+)
- rounded font appearance
- high readability on mobile

---

# Exact Color Tokens (add to Tailwind config)

primary: #7C3AED
primary-light: #EDE9FE
morning-bg: #FEF9C3
evening-bg: #EDE9FE
study-bg: #DBEAFE
checkbox-checked: #7C3AED
text-main: #1E1B4B
text-sub: #6B7280

---

# UI Style

Requirements:
- rounded corners (rounded-2xl minimum on cards)
- soft box shadows (shadow-sm to shadow-md)
- large cards with generous padding
- spacious layouts
- minimal clutter
- white card backgrounds on lavender page background

---

# Screen Layouts

## Dashboard Screen
- Fixed header: avatar circle + greeting + child name + star + notification bell
- Motivational banner card (yellow, with mountain/rainbow illustration area)
- Stats row: circular progress ring + stars today + streak days + rewards button
- Scrollable routine sections (Morning, Evening, Study)
- Each section: colored header row + task list
- Task row: emoji icon circle + task name text + large checkbox
- Fixed bottom navigation bar (5 tabs)

## Login Screen
- Soft lavender gradient background (#F5F3FF to #EDE9FE)
- App icon (rounded square, white bg, purple calendar-star icon)
- Headline + subtitle in Punjabi
- Large illustrated image (mother + child cartoon — use placeholder)
- White login card (rounded-3xl, bottom portion):
  - Email/mobile input with envelope icon
  - Password input with lock icon + eye toggle
  - Forgot password link (right-aligned, purple)
  - Full-width purple login button
  - "Or" divider
  - White Google button (outlined)
  - Sign up link
- Feature icons row at very bottom (3 icons)

## Add Task Modal (Bottom Sheet)
- Slides up from bottom, drag handle at top, X button top right
- Step 1: Task name input (pencil icon, 0/40 counter)
- Step 2: Emoji picker grid (6 cols x 2 rows, paginated, selected = purple border)
- Step 3: Category cards (Morning/Evening/Study — large horizontal cards with emoji + time range, selected = purple checkmark)
- Step 4: Reminder toggle (optional)
- Step 5: Notes textarea (optional, 0/80)
- Fixed purple "Add Task" button at bottom

---

# Bottom Navigation Bar

5 tabs, fixed at bottom, white background, top shadow:
1. Home (house icon)
2. Routine (calendar icon)
3. Add Task (large floating purple circle, + icon, raised above bar)
4. Rewards (star icon)
5. More (... icon)

Active tab highlighted in purple. Center add button is always purple.

---

# Components Style

## Task Rows
- Left: 40x40 rounded-xl emoji icon (colored bg matching section)
- Middle: task name (Nunito medium, slate-700)
- Right: 32x32 checkbox (rounded-lg, purple fill + white checkmark when checked)

## Checkboxes
- Size: 32x32px minimum
- Checked: purple fill, white checkmark with Framer Motion bounce animation
- Unchecked: white fill, gray-300 border

## Buttons
- Primary: full width, rounded-full, purple bg, white text, 52px height
- Secondary: full width, rounded-full, white bg, purple border, purple text
- Touch target minimum: 48px height

## Stats Row Cards
- White background, rounded-2xl, shadow-sm
- Progress ring: SVG circle, purple stroke, fraction text inside
- Star/streak: emoji + number + label

---

# Interaction Design

## Task Completion
Must feel rewarding.
- Checkbox: spring animation on check (scale bounce)
- Checked state: strikethrough text + opacity reduction
- Stars earned: brief sparkle/scale animation

## Modal
- Slides up from bottom with spring easing
- Background overlay: black/30 backdrop

## Page Transitions
- Fade + slide with Framer Motion AnimatePresence

---

# Animations

Use Framer Motion throughout.

Animation goals:
- smooth
- calm
- responsive to touch

Key animations:
- Checkbox check: scale(0.8) -> scale(1.1) -> scale(1) spring
- Modal open: y: "100%" -> y: 0, spring stiffness 300
- Card entrance: opacity 0 -> 1, y: 20 -> 0, staggered
- Page transition: opacity fade

---

# Accessibility

- All tap targets minimum 48px
- Color contrast ratio 4.5:1 minimum
- Large font sizes throughout
- Simple navigation structure
- No time pressure UI elements
