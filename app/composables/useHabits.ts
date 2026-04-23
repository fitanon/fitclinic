import { isSameDay, parseISO, differenceInDays, format, compareAsc, subDays } from 'date-fns';

interface GuestHabit {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  completeDays: string[];
  createdAt: Date;
  habitView: boolean;
}

const STORAGE_KEY = 'habit-tracker-guest-habits';

const today = format(new Date(), 'yyyy-MM-dd');

const getDefaultHabits = (): GuestHabit[] => {
  const now = new Date();
  return [
    {
      id: 1,
      userId: 0,
      title: 'Morning Exercise',
      description: '**Daily** 30 minutes of exercise to stay fit and energized.',
      completeDays: [
        format(subDays(now, 5), 'yyyy-MM-dd'),
        format(subDays(now, 4), 'yyyy-MM-dd'),
        format(subDays(now, 3), 'yyyy-MM-dd'),
        format(subDays(now, 1), 'yyyy-MM-dd'),
      ],
      createdAt: subDays(now, 10),
      habitView: true,
    },
    {
      id: 2,
      userId: 0,
      title: 'Read 20 Pages',
      description: 'Read *at least* 20 pages every day. Currently reading "Atomic Habits".',
      completeDays: [
        format(subDays(now, 6), 'yyyy-MM-dd'),
        format(subDays(now, 5), 'yyyy-MM-dd'),
        format(subDays(now, 4), 'yyyy-MM-dd'),
        format(subDays(now, 3), 'yyyy-MM-dd'),
        format(subDays(now, 2), 'yyyy-MM-dd'),
        format(subDays(now, 1), 'yyyy-MM-dd'),
        today,
      ],
      createdAt: subDays(now, 14),
      habitView: true,
    },
    {
      id: 3,
      userId: 0,
      title: 'Drink 8 Glasses of Water',
      description: 'Stay hydrated throughout the day. Track water intake.',
      completeDays: [],
      createdAt: now,
      habitView: false,
    },
  ];
};

const loadHabits = (): GuestHabit[] => {
  if (typeof window === 'undefined') return getDefaultHabits();

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return getDefaultHabits();

  try {
    const parsed = JSON.parse(stored);
    return parsed.map((h: any) => ({
      ...h,
      createdAt: new Date(h.createdAt),
    }));
  } catch {
    return getDefaultHabits();
  }
};

const saveHabits = (habits: GuestHabit[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

const habits = ref<GuestHabit[]>(loadHabits());

const resetIfStreakBroken = (habit: GuestHabit): void => {
  if (habit.completeDays.length === 0) return;

  const sortedDays = habit.completeDays.slice().sort((a, b) => compareAsc(parseISO(a), parseISO(b)));
  const hasGap = sortedDays.some((day, index) => index > 0 && differenceInDays(parseISO(day), parseISO(sortedDays[index - 1])) > 1);

  const lastCompletedDate = parseISO(sortedDays[sortedDays.length - 1]);
  const diffToToday = differenceInDays(parseISO(today), lastCompletedDate);

  if (hasGap || diffToToday > 1) habit.completeDays = [];
};

const checkAllHabitsForStreak = (): void => habits.value.forEach(resetIfStreakBroken);

const addHabit = (title: string, description: string, habitView: boolean = false): void => {
  if (!title.trim()) return;

  habits.value.push({
    id: Date.now(),
    userId: 0,
    title,
    description: description || null,
    completeDays: [],
    createdAt: new Date(),
    habitView,
  });
  saveHabits(habits.value);
};

const deleteHabit = (id: number): void => {
  habits.value = habits.value.filter(habit => habit.id !== id);
  saveHabits(habits.value);
};

const editHabit = (id: number, updates: Partial<Pick<GuestHabit, 'title' | 'description' | 'habitView'>>): void => {
  const habit = habits.value.find(h => h.id === id);
  if (habit) {
    if (updates.title !== undefined) habit.title = updates.title;
    if (updates.description !== undefined) habit.description = updates.description;
    if (updates.habitView !== undefined) habit.habitView = updates.habitView;
    saveHabits(habits.value);
  }
};

const toggleTodayCompletion = (habit: GuestHabit): boolean => {
  const isCompletedToday = habit.completeDays.some(day => isSameDay(parseISO(day), parseISO(today)));

  if (isCompletedToday) {
    habit.completeDays = habit.completeDays.filter(day => !isSameDay(parseISO(day), parseISO(today)));
  } else {
    habit.completeDays.push(today);
  }
  saveHabits(habits.value);
  return !isCompletedToday;
};

const isTodayCompleted = (habit: GuestHabit): boolean => habit.completeDays.some(day => isSameDay(parseISO(day), parseISO(today)));

const getCompletionRate = (habit: GuestHabit): number => Math.round((habit.completeDays.length / 40) * 100);

const resetToDefaults = (): void => {
  habits.value = getDefaultHabits();
  saveHabits(habits.value);
};

checkAllHabitsForStreak();

export function useHabits() {
  return {
    habits,
    addHabit,
    deleteHabit,
    editHabit,
    toggleTodayCompletion,
    isTodayCompleted,
    getCompletionRate,
    resetToDefaults,
  };
}
