import { DailyRecord, RoutineTask } from '../types';
import { defaultSchedule } from '../data/quotes';

export const STORAGE_KEYS = {
  SCHEDULE: 'ak_schedule_v3',
  RECORDS: 'ak_records_v3',
  AVATAR: 'ak_custom_avatar_v3',
  TIMER_SECONDS: 'ak_timer_seconds_v3',
  TIMER_BUDGET: 'ak_timer_budget_v3',
  TIMER_TARGET_END: 'ak_timer_target_end_v3',
  TIMER_IS_RUNNING: 'ak_timer_is_running_v3',
  SOUND_ENABLED: 'ak_sound_enabled_v3',
  LAST_LOGIN_DATE: 'ak_last_login_date',
};

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function loadSchedule(): RoutineTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (!raw) {
      // Check legacy key
      const legacy = localStorage.getItem('ak_schedule');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        return Array.isArray(parsed) ? parsed : defaultSchedule;
      }
      return defaultSchedule;
    }
    return JSON.parse(raw);
  } catch {
    return defaultSchedule;
  }
}

export function saveSchedule(schedule: RoutineTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  } catch (err) {
    console.error('Failed to save schedule to localStorage', err);
  }
}

export function loadRecords(): Record<string, DailyRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) {
      // Check legacy key
      const legacy = localStorage.getItem('ak_records_v2');
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const upgraded: Record<string, DailyRecord> = {};
        for (const [key, val] of Object.entries(parsed)) {
          const v = val as { masturbation?: 'clean' | 'relapsed'; allTasksDone?: boolean };
          upgraded[key] = {
            date: key,
            masturbation: v.masturbation || 'unanswered',
            allTasksDone: !!v.allTasksDone,
            tasksCompleted: v.allTasksDone ? 6 : 0,
            totalTasks: 6,
          };
        }
        return upgraded;
      }
      return {};
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveRecords(records: Record<string, DailyRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save records to localStorage', err);
  }
}

/**
 * Calculates current consecutive streak of White Room Victories:
 * A White Room Victory requires BOTH:
 * 1. Urge status === 'clean'
 * 2. allTasksDone === true
 */
export function calculateCurrentStreak(records: Record<string, DailyRecord>): number {
  let streak = 0;
  const cursor = new Date();
  const todayKey = getTodayKey();
  
  // If today is victory, count it. If not finished yet, don't break streak if yesterday was victory.
  const todayRecord = records[todayKey];
  const todayIsVictory = todayRecord && todayRecord.masturbation === 'clean' && todayRecord.allTasksDone;

  if (todayIsVictory) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  } else {
    // If today is relapsed, streak is 0
    if (todayRecord && todayRecord.masturbation === 'relapsed') {
      return 0;
    }
    // Check starting from yesterday
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = formatDateKey(cursor);
    const rec = records[key];
    if (rec && rec.masturbation === 'clean' && rec.allTasksDone) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Total statistics
 */
export function calculateLifetimeStats(records: Record<string, DailyRecord>) {
  const entries = Object.values(records);
  if (entries.length === 0) {
    return { totalDays: 0, victories: 0, relapses: 0, winRate: 0, maxStreak: 0 };
  }

  let victories = 0;
  let relapses = 0;

  for (const r of entries) {
    if (r.masturbation === 'clean' && r.allTasksDone) {
      victories++;
    } else if (r.masturbation === 'relapsed') {
      relapses++;
    }
  }

  // Calculate maximum streak across all recorded history
  const sortedDates = Object.keys(records).sort();
  let maxStreak = 0;
  let running = 0;

  for (let i = 0; i < sortedDates.length; i++) {
    const rec = records[sortedDates[i]];
    if (rec.masturbation === 'clean' && rec.allTasksDone) {
      running++;
      if (running > maxStreak) maxStreak = running;
    } else {
      running = 0;
    }
  }

  const winRate = entries.length > 0 ? Math.round((victories / entries.length) * 100) : 0;

  return {
    totalDays: entries.length,
    victories,
    relapses,
    winRate,
    maxStreak,
  };
}

export function exportAllData() {
  const data = {
    schedule: loadSchedule(),
    records: loadRecords(),
    avatar: localStorage.getItem(STORAGE_KEYS.AVATAR) || '',
    timerBudget: localStorage.getItem(STORAGE_KEYS.TIMER_BUDGET) || '60',
    soundEnabled: localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false',
    exportedAt: new Date().toISOString(),
    version: 'ayanokoji-system-v3',
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ayanokoji_protocol_backup_${getTodayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.schedule && Array.isArray(data.schedule)) {
      saveSchedule(data.schedule);
    }
    if (data.records && typeof data.records === 'object') {
      saveRecords(data.records);
    }
    if (data.avatar) {
      localStorage.setItem(STORAGE_KEYS.AVATAR, data.avatar);
    }
    if (data.timerBudget) {
      localStorage.setItem(STORAGE_KEYS.TIMER_BUDGET, data.timerBudget);
    }
    return true;
  } catch (err) {
    console.error('Failed to import backup data', err);
    return false;
  }
}
