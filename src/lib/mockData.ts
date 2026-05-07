export interface Task {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
  category: 'morning' | 'evening' | 'study';
  order: number;
  reminderTime?: string; // 'HH:MM'
  notes?: string;
}

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Make Bed', emoji: '🛏️', completed: true, category: 'morning', order: 1 },
  { id: '2', title: 'Drink Water', emoji: '💧', completed: true, category: 'morning', order: 2 },
  { id: '3', title: 'Brush Teeth', emoji: '🪥', completed: false, category: 'morning', order: 3 },
  { id: '4', title: 'Get Dressed', emoji: '👕', completed: false, category: 'morning', order: 4 },
  { id: '5', title: 'Eat Breakfast', emoji: '🥣', completed: false, category: 'morning', order: 5 },
  { id: '6', title: 'Pack Bag', emoji: '🎒', completed: false, category: 'morning', order: 6 },
  { id: '7', title: 'Do Homework', emoji: '📚', completed: false, category: 'study', order: 1 },
  { id: '8', title: 'Read Chapter', emoji: '📖', completed: false, category: 'study', order: 2 },
  { id: '9', title: 'Math Practice', emoji: '✏️', completed: false, category: 'study', order: 3 },
  { id: '10', title: 'Take Bath', emoji: '🛁', completed: false, category: 'evening', order: 1 },
  { id: '11', title: 'Read Book', emoji: '📗', completed: false, category: 'evening', order: 2 },
  { id: '12', title: 'Sleep on Time', emoji: '😴', completed: false, category: 'evening', order: 3 },
];

export const EMOJI_OPTIONS = [
  '⭐', '🪥', '💧', '📚', '🎒', '🛏️',
  '🏀', '🥗', '🛁', '✏️', '🌱', '❤️',
  '🎵', '🖍️', '🧩', '🍎', '🧸', '🌈',
  '🚿', '👟', '🎨', '📝', '🥣', '👕',
];

export const CATEGORY_CONFIG = {
  morning: {
    label: 'Morning Routine',
    emoji: '☀️',
    time: '6:30 - 8:30',
    bg: 'bg-morning',
    accent: 'bg-morning-accent',
    iconBg: 'bg-amber-200',
  },
  study: {
    label: 'Afternoon Routine',
    emoji: '⛅',
    time: '3:30 - 5:00',
    bg: 'bg-study',
    accent: 'bg-study-accent',
    iconBg: 'bg-blue-200',
  },
  evening: {
    label: 'Evening Routine',
    emoji: '🌙',
    time: '6:00 - 8:30',
    bg: 'bg-evening',
    accent: 'bg-evening-accent',
    iconBg: 'bg-violet-200',
  },
};
