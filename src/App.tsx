/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { DailyRecord, RoutineTask, TabType } from './types';
import { ayanokojiQuotes, defaultSchedule } from './data/quotes';
import {
  getTodayKey,
  loadSchedule,
  saveSchedule,
  loadRecords,
  saveRecords,
  STORAGE_KEYS,
} from './utils/storage';
import {
  playClickSound,
  playSuccessChime,
  playAlertBeep,
  startAlarmLoop,
  stopAlarmLoop,
} from './utils/audio';

import { Header } from './components/Header';
import { ScreenTimerCard } from './components/ScreenTimerCard';
import { RoutineList } from './components/RoutineList';
import { UrgeTrackerCard } from './components/UrgeTrackerCard';
import { CalendarRecords } from './components/CalendarRecords';
import { AlarmModal } from './components/AlarmModal';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { WhiteRoomCodexModal } from './components/WhiteRoomCodexModal';
import { CheckSquare, Calendar, Shield } from 'lucide-react';

const DEFAULT_AVATAR_PATH = '/src/assets/images/ayanokoji_portrait_1793011131224.jpg';
const BACKDROP_PATH = '/src/assets/images/whiteroom_backdrop_1793011131262.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('routine');

  // Operational State
  const [schedule, setSchedule] = useState<RoutineTask[]>(() => loadSchedule());
  const [records, setRecords] = useState<Record<string, DailyRecord>>(() => loadRecords());
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.AVATAR) || DEFAULT_AVATAR_PATH;
  });

  // Sound & Voice
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false';
  });

  // Dynamic Ayanokoji Quotes
  const [activeQuote, setActiveQuote] = useState<string>(
    "All people are nothing but tools. It doesn't matter what is sacrificed. As long as I win in the end, that's all that matters."
  );

  // Screen Time Budget Timer
  const [budgetMinutes, setBudgetMinutes] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMER_BUDGET);
    return saved ? parseInt(saved, 10) : 60;
  });
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMER_SECONDS);
    return saved !== null ? parseInt(saved, 10) : 3600;
  });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isAlarmActive, setIsAlarmActive] = useState<boolean>(false);

  // Modals
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);

  // Timer Ref
  const timerIntervalRef = useRef<number | null>(null);

  // Pick random quote helper
  const triggerQuote = (quotesList: string[]) => {
    const picked = quotesList[Math.floor(Math.random() * quotesList.length)];
    setActiveQuote(picked);
  };

  // Sync today's record whenever schedule or date changes
  useEffect(() => {
    const today = getTodayKey();
    const allDone = schedule.length > 0 && schedule.every((t) => t.done);
    const completedCount = schedule.filter((t) => t.done).length;

    setRecords((prev) => {
      const existing = prev[today] || {
        date: today,
        masturbation: 'unanswered',
        allTasksDone: false,
        tasksCompleted: 0,
        totalTasks: schedule.length,
      };

      const updated = {
        ...existing,
        allTasksDone: allDone,
        tasksCompleted: completedCount,
        totalTasks: schedule.length,
        timestamp: Date.now(),
      };

      const nextRecords = { ...prev, [today]: updated };
      saveRecords(nextRecords);
      return nextRecords;
    });
  }, [schedule]);

  // Screen Timer Tick Effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            setIsAlarmActive(true);
            triggerQuote(ayanokojiQuotes.alarmTrigger);
            startAlarmLoop(soundEnabled, "The mobile time is over. Put your phone down immediately.");
            localStorage.setItem(STORAGE_KEYS.TIMER_SECONDS, '0');
            return 0;
          }
          const next = prev - 1;
          localStorage.setItem(STORAGE_KEYS.TIMER_SECONDS, String(next));
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, soundEnabled]);

  // Timer Controls
  const startTimer = () => {
    playClickSound(soundEnabled);
    if (secondsRemaining === 0) {
      // If expired, reset to budget before running
      setSecondsRemaining(budgetMinutes * 60);
      localStorage.setItem(STORAGE_KEYS.TIMER_SECONDS, String(budgetMinutes * 60));
    }
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    playClickSound(soundEnabled);
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    playClickSound(soundEnabled);
    setIsTimerRunning(false);
    stopAlarmLoop();
    setIsAlarmActive(false);
    const freshSeconds = budgetMinutes * 60;
    setSecondsRemaining(freshSeconds);
    localStorage.setItem(STORAGE_KEYS.TIMER_SECONDS, String(freshSeconds));
  };

  const handleBudgetChange = (newMinutes: number) => {
    playClickSound(soundEnabled);
    setBudgetMinutes(newMinutes);
    localStorage.setItem(STORAGE_KEYS.TIMER_BUDGET, String(newMinutes));
    const newSeconds = newMinutes * 60;
    setSecondsRemaining(newSeconds);
    localStorage.setItem(STORAGE_KEYS.TIMER_SECONDS, String(newSeconds));
    setIsTimerRunning(false);
  };

  const dismissAlarm = () => {
    stopAlarmLoop();
    setIsAlarmActive(false);
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(next));
    if (next) {
      playClickSound(true);
    }
  };

  // Task Handlers
  const handleToggleTask = (index: number) => {
    playClickSound(soundEnabled);
    setSchedule((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], done: !copy[index].done };
      saveSchedule(copy);

      const allDone = copy.every((t) => t.done);
      if (allDone) {
        playSuccessChime(soundEnabled);
        triggerQuote(ayanokojiQuotes.allTasksDone);
      } else if (copy[index].done) {
        triggerQuote(ayanokojiQuotes.taskDone);
      }

      return copy;
    });
  };

  const handleAddTask = (newTask: Omit<RoutineTask, 'id'>) => {
    playClickSound(soundEnabled);
    setSchedule((prev) => {
      const task: RoutineTask = {
        ...newTask,
        id: String(Date.now()),
      };
      const updated = [...prev, task];
      saveSchedule(updated);
      return updated;
    });
  };

  const handleEditTask = (id: string, updated: Partial<RoutineTask>) => {
    playClickSound(soundEnabled);
    setSchedule((prev) => {
      const copy = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      saveSchedule(copy);
      return copy;
    });
  };

  const handleDeleteTask = (id: string) => {
    playClickSound(soundEnabled);
    setSchedule((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      saveSchedule(filtered);
      return filtered;
    });
  };

  const handleResetTasks = () => {
    playClickSound(soundEnabled);
    setSchedule((prev) => {
      const reset = prev.map((t) => ({ ...t, done: false }));
      saveSchedule(reset);
      return reset;
    });
  };

  const handleRestoreDefaults = () => {
    playClickSound(soundEnabled);
    setSchedule(defaultSchedule);
    saveSchedule(defaultSchedule);
  };

  const handleClearAllTasks = () => {
    playClickSound(soundEnabled);
    setSchedule([]);
    saveSchedule([]);
  };

  // Urge / Masturbation Handler
  const handleSetUrgeStatus = (status: 'clean' | 'relapsed') => {
    const today = getTodayKey();
    if (status === 'clean') {
      playSuccessChime(soundEnabled);
      triggerQuote(ayanokojiQuotes.cleanChoice);
    } else {
      playAlertBeep(soundEnabled);
      triggerQuote(ayanokojiQuotes.relapseChoice);
    }

    setRecords((prev) => {
      const existing = prev[today] || {
        date: today,
        masturbation: 'unanswered',
        allTasksDone: schedule.every((t) => t.done),
        tasksCompleted: schedule.filter((t) => t.done).length,
        totalTasks: schedule.length,
      };

      const updated: DailyRecord = {
        ...existing,
        masturbation: status,
        timestamp: Date.now(),
      };

      const next = { ...prev, [today]: updated };
      saveRecords(next);
      return next;
    });
  };

  // Manual Update Day Record (from Calendar Inspector)
  const handleUpdateDayRecord = (dateKey: string, updates: Partial<DailyRecord>) => {
    playClickSound(soundEnabled);
    setRecords((prev) => {
      const existing = prev[dateKey] || {
        date: dateKey,
        masturbation: 'unanswered',
        allTasksDone: false,
        tasksCompleted: 0,
        totalTasks: schedule.length,
      };

      const next = {
        ...prev,
        [dateKey]: {
          ...existing,
          ...updates,
          timestamp: Date.now(),
        },
      };
      saveRecords(next);
      return next;
    });
  };

  // Avatar Selection
  const handleSelectAvatar = (url: string) => {
    setAvatarUrl(url);
    localStorage.setItem(STORAGE_KEYS.AVATAR, url);
  };

  // Data Reset to Defaults
  const handleDataReset = () => {
    localStorage.clear();
    setSchedule(defaultSchedule);
    setRecords({});
    setAvatarUrl(DEFAULT_AVATAR_PATH);
    setSecondsRemaining(3600);
    setBudgetMinutes(60);
    setIsTimerRunning(false);
    stopAlarmLoop();
    setActiveQuote(ayanokojiQuotes.default[0]);
  };

  // Reload on Data Import
  const handleDataImported = () => {
    setSchedule(loadSchedule());
    setRecords(loadRecords());
    const savedAvatar = localStorage.getItem(STORAGE_KEYS.AVATAR);
    if (savedAvatar) setAvatarUrl(savedAvatar);
  };

  const todayKey = getTodayKey();
  const todayRecord = records[todayKey];
  const todayUrgeStatus = todayRecord?.masturbation || 'unanswered';
  const todayAllTasksDone = schedule.length > 0 && schedule.every((t) => t.done);

  return (
    <div className="min-h-screen bg-[#07080c] text-[#eaeaea] relative flex flex-col justify-between selection:bg-[#ff2a4b] selection:text-white">
      {/* Ambient background architectural atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.07] bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKDROP_PATH})` }}
      />
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#07080c]/80 to-[#07080c]" />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 pt-3 pb-28">
        <Header
          avatarUrl={avatarUrl}
          onAvatarClick={() => setIsAvatarModalOpen(true)}
          activeQuote={activeQuote}
          onRefreshQuote={() => triggerQuote(ayanokojiQuotes.default)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenCodex={() => setIsCodexOpen(true)}
        />

        {/* Tab 1: Routine & Screen Time HUD */}
        {activeTab === 'routine' && (
          <div className="space-y-4">
            {/* Screen Time Timer */}
            <ScreenTimerCard
              secondsRemaining={secondsRemaining}
              totalBudgetSeconds={budgetMinutes * 60}
              isRunning={isTimerRunning}
              onStartTimer={startTimer}
              onPauseTimer={pauseTimer}
              onResetTimer={resetTimer}
              onChangeBudget={handleBudgetChange}
            />

            {/* Daily Schedule Directives */}
            <RoutineList
              tasks={schedule}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onResetTasks={handleResetTasks}
              onRestoreDefaults={handleRestoreDefaults}
              onClearAll={handleClearAllTasks}
            />

            {/* Urge & Self-Sovereignty Tracker */}
            <UrgeTrackerCard
              currentStatus={todayUrgeStatus}
              allTasksDone={todayAllTasksDone}
              onSetStatus={handleSetUrgeStatus}
            />
          </div>
        )}

        {/* Tab 2: Records & White Room Calendar */}
        {activeTab === 'records' && (
          <div>
            <CalendarRecords
              records={records}
              onUpdateDayRecord={handleUpdateDayRecord}
            />
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090b12]/95 backdrop-blur-md border-t border-[#1e2230]">
        <div className="max-w-lg mx-auto grid grid-cols-2 h-16">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('routine');
            }}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'routine'
                ? 'text-[#ff2a4b] bg-[#ff2a4b]/5 border-t-2 border-[#ff2a4b]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare size={19} />
            <span className="text-[11px] font-extrabold uppercase tracking-widest mt-1">
              Routine
            </span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setActiveTab('records');
            }}
            className={`flex flex-col items-center justify-center transition-all ${
              activeTab === 'records'
                ? 'text-[#ff2a4b] bg-[#ff2a4b]/5 border-t-2 border-[#ff2a4b]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar size={19} />
            <span className="text-[11px] font-extrabold uppercase tracking-widest mt-1">
              Records
            </span>
          </button>
        </div>
      </nav>

      {/* Fullscreen Alarm Modal on Time Expiry */}
      <AlarmModal isOpen={isAlarmActive} onDismiss={dismissAlarm} />

      {/* Avatar Changer Modal */}
      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        currentAvatar={avatarUrl}
        defaultAvatarUrl={DEFAULT_AVATAR_PATH}
        onSelectAvatar={handleSelectAvatar}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* White Room Codex & Data Sovereignty Modal */}
      <WhiteRoomCodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        onDataReset={handleDataReset}
        onDataImported={handleDataImported}
      />
    </div>
  );
}
