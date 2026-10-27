import React, { useState } from 'react';
import { DailyRecord } from '../types';
import { ChevronLeft, ChevronRight, Trophy, Flame, CheckCircle, XCircle, Calendar as CalendarIcon, X } from 'lucide-react';
import { calculateCurrentStreak, calculateLifetimeStats, getTodayKey } from '../utils/storage';

interface CalendarRecordsProps {
  records: Record<string, DailyRecord>;
  onUpdateDayRecord: (dateKey: string, updates: Partial<DailyRecord>) => void;
}

export const CalendarRecords: React.FC<CalendarRecordsProps> = ({
  records,
  onUpdateDayRecord,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const streak = calculateCurrentStreak(records);
  const stats = calculateLifetimeStats(records);
  const todayKey = getTodayKey();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar day calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sun, 1 is Mon...
  // Convert so Monday is 0, Sunday is 6
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToday = () => {
    setCurrentDate(new Date());
  };

  const selectedRecord = selectedDayKey ? records[selectedDayKey] : null;

  return (
    <div className="space-y-4 mb-6">
      {/* Streak Hero Banner */}
      <div className="bg-[#10121a] border border-[#1e2230] rounded-xl p-5 text-center relative overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff2a4b] to-transparent" />
        
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
          <Flame size={15} className="text-[#ff2a4b]" />
          White Room Victory Streak
        </div>

        <div className="text-4xl sm:text-5xl font-black text-[#ff2a4b] tracking-wider my-2 font-mono-numbers">
          {streak} {streak === 1 ? 'DAY' : 'DAYS'}
        </div>

        <p className="text-[11px] text-slate-400 tracking-wide font-medium">
          White [✓] = All Tasks Completed + Clean Urge Discipline
        </p>

        {/* 4-Stat Overview */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#1a1e2b]">
          <div className="bg-[#0b0d14] p-2 rounded-lg border border-[#181c28]">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Victories</span>
            <span className="text-base font-bold text-white font-mono">{stats.victories}</span>
          </div>

          <div className="bg-[#0b0d14] p-2 rounded-lg border border-[#181c28]">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Win Rate</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{stats.winRate}%</span>
          </div>

          <div className="bg-[#0b0d14] p-2 rounded-lg border border-[#181c28]">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Best Run</span>
            <span className="text-base font-bold text-[#ff4d6a] font-mono">{stats.maxStreak}d</span>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="bg-[#10121a] border border-[#1e2230] rounded-xl p-4 sm:p-5 shadow-lg">
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e2230]">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#ff2a4b]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleJumpToday}
              className="text-[10px] py-1 px-2 rounded bg-[#181c28] hover:bg-[#222738] text-slate-300 font-bold uppercase tracking-wider transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded bg-[#181c28] hover:bg-[#222738] text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded bg-[#181c28] hover:bg-[#222738] text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-white rounded-sm shadow-[0_0_6px_#fff]" />
            <span>White [✓] Victory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#7f1d1d] border border-[#dc2626] rounded-sm" />
            <span>Red [✕] Relapse</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#0f281e] border border-[#10b981] rounded-sm" />
            <span>Clean (Tasks in progress)</span>
          </div>
        </div>

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty spacer blocks for start offset */}
          {Array.from({ length: startOffset }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square rounded-md bg-[#0a0c12]/40" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateKey = `${year}-${monthStr}-${dayStr}`;

            const rec = records[dateKey];
            const isToday = dateKey === todayKey;

            const isVictory = rec && rec.masturbation === 'clean' && rec.allTasksDone;
            const isRelapsed = rec && rec.masturbation === 'relapsed';
            const isCleanPending = rec && rec.masturbation === 'clean' && !rec.allTasksDone;

            let tileClasses = 'bg-[#151822] text-slate-400 hover:border-[#3a415a]';
            let markText = null;

            if (isVictory) {
              tileClasses = 'bg-white text-black font-black shadow-[0_0_12px_rgba(255,255,255,0.7)] border border-white scale-[1.02]';
              markText = '✓';
            } else if (isRelapsed) {
              tileClasses = 'bg-[#7f1d1d] text-white font-bold border border-[#dc2626]';
              markText = '✕';
            } else if (isCleanPending) {
              tileClasses = 'bg-[#0b2419] text-[#a7f3d0] border border-[#059669]/60';
              markText = '•';
            }

            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDayKey(dateKey)}
                className={`aspect-square rounded-md flex flex-col items-center justify-center p-1 text-xs transition-all cursor-pointer relative border ${
                  isToday ? 'ring-2 ring-[#ff2a4b] ring-offset-1 ring-offset-[#07080c]' : 'border-[#1b1f2b]'
                } ${tileClasses}`}
                title={`Audit record for ${dateKey}`}
              >
                <span className="text-[11px] font-mono leading-none">{dayNum}</span>
                {markText && (
                  <span className={`text-[10px] font-black leading-none mt-0.5 ${isVictory ? 'text-black' : ''}`}>
                    {markText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Inspector Modal */}
      {selectedDayKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-sm w-full bg-[#10121a] border border-[#1e2230] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  Audit Entry: {selectedDayKey}
                </h4>
                <p className="text-[11px] text-slate-400">Review or adjust tactical logging</p>
              </div>
              <button
                onClick={() => setSelectedDayKey(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              {/* Masturbation Audit Toggle */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Self-Sovereignty (Urge Status):
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onUpdateDayRecord(selectedDayKey, { masturbation: 'clean' })}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold uppercase transition-all ${
                      selectedRecord?.masturbation === 'clean'
                        ? 'bg-[#064e3b] text-[#a7f3d0] border border-[#10b981]'
                        : 'bg-[#151822] text-slate-400 border border-[#23283a]'
                    }`}
                  >
                    Clean [✓]
                  </button>
                  <button
                    onClick={() => onUpdateDayRecord(selectedDayKey, { masturbation: 'relapsed' })}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold uppercase transition-all ${
                      selectedRecord?.masturbation === 'relapsed'
                        ? 'bg-[#4c0519] text-[#fecdd3] border border-[#ff2a4b]'
                        : 'bg-[#151822] text-slate-400 border border-[#23283a]'
                    }`}
                  >
                    Relapse [✕]
                  </button>
                  <button
                    onClick={() => onUpdateDayRecord(selectedDayKey, { masturbation: 'unanswered' })}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold uppercase transition-all ${
                      !selectedRecord?.masturbation || selectedRecord?.masturbation === 'unanswered'
                        ? 'bg-[#2a2f42] text-white border border-slate-500'
                        : 'bg-[#151822] text-slate-400 border border-[#23283a]'
                    }`}
                  >
                    Unset
                  </button>
                </div>
              </div>

              {/* Tasks Done Status */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Daily Tasks Execution:
                </label>
                <button
                  onClick={() =>
                    onUpdateDayRecord(selectedDayKey, {
                      allTasksDone: !selectedRecord?.allTasksDone,
                    })
                  }
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-between border transition-all ${
                    selectedRecord?.allTasksDone
                      ? 'bg-white text-black border-white'
                      : 'bg-[#151822] text-slate-300 border-[#23283a]'
                  }`}
                >
                  <span>All Tasks Executed</span>
                  <span>{selectedRecord?.allTasksDone ? 'YES ✓' : 'NO'}</span>
                </button>
              </div>

              {/* Status Outcome */}
              <div className="p-3 bg-[#0a0c12] rounded-lg border border-[#1e2230] text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Evaluated Result
                </span>
                {selectedRecord?.masturbation === 'clean' && selectedRecord?.allTasksDone ? (
                  <span className="text-xs font-black text-white tracking-wider">
                    WHITE ROOM VICTORY ACHIEVED ✓
                  </span>
                ) : selectedRecord?.masturbation === 'relapsed' ? (
                  <span className="text-xs font-black text-[#ff2a4b] tracking-wider">
                    PROTOCOL FAILURE RECORDED ✕
                  </span>
                ) : selectedRecord?.masturbation === 'clean' ? (
                  <span className="text-xs font-bold text-emerald-400 tracking-wider">
                    CLEAN DISCIPLINE (Incomplete Tasks)
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">
                    No verified outcome
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedDayKey(null)}
              className="w-full py-2.5 rounded-xl bg-[#8b0000] hover:bg-[#a60b0b] text-white text-xs font-bold uppercase tracking-wider shadow"
            >
              Confirm & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
