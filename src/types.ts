export interface RoutineTask {
  id: string;
  title: string;
  time: string;
  done: boolean;
  category?: 'study' | 'routine' | 'training' | 'recovery';
  enabled?: boolean; // When false, task is skipped / exempt from today's victory
}

export type UrgeStatus = 'clean' | 'relapsed' | 'unanswered';

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  masturbation: UrgeStatus;
  allTasksDone: boolean;
  tasksCompleted: number;
  totalTasks: number;
  note?: string;
  timestamp?: number;
}

export type TabType = 'routine' | 'records' | 'codex';
