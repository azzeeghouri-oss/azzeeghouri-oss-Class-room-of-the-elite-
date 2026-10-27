import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Clock, Settings2 } from 'lucide-react';

interface ScreenTimerCardProps {
  secondsRemaining: number;
  totalBudgetSeconds: number;
  isRunning: boolean;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onChangeBudget: (minutes: number) => void;
}

export const ScreenTimerCard: React.FC<ScreenTimerCardProps> = ({
  secondsRemaining,
  totalBudgetSeconds,
  isRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onChangeBudget,
}) => {
  const [showConfig, setShowConfig] = useState(false);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / totalBudgetSeconds) * 100));
  const isLow = secondsRemaining <= 300 && secondsRemaining > 0;
  const isDepleted = secondsRemaining === 0;
  const isPartiallyElapsed = secondsRemaining < totalBudgetSeconds && secondsRemaining > 0;

  const budgetOptions = [15, 30, 45, 60, 90];

  return (
    <div className="bg-gradient-to-br from-[#170f14] to-[#0e1017] border border-[#3d141e] rounded-xl p-4 sm:p-5 mb-5 shadow-lg relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff2a4b]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[#ff2a4b]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Screen Time Budget ({Math.round(totalBudgetSeconds / 60)}m Limit)
          </span>
        </div>

        <button
          onClick={() => setShowConfig(!showConfig)}
          title="Adjust time limit"
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Settings2 size={14} />
        </button>
      </div>

      {/* Preset budget selection */}
      {showConfig && (
        <div className="mb-3.5 p-2.5 bg-[#12141f] rounded-lg border border-[#1e2230]">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
            Select Daily Screen Quota:
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {budgetOptions.map((m) => (
              <button
                key={m}
                onClick={() => {
                  onChangeBudget(m);
                  setShowConfig(false);
                }}
                className={`py-1 text-xs font-mono font-bold rounded border transition-all ${
                  Math.round(totalBudgetSeconds / 60) === m
                    ? 'bg-[#8b0000] border-[#ff2a4b] text-white'
                    : 'bg-[#181a26] border-[#222736] text-slate-400 hover:text-white'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Digital HUD */}
      <div className="text-center my-3">
        <div
          onClick={isRunning ? onPauseTimer : onStartTimer}
          title={isRunning ? "Click to Pause" : "Click to Start"}
          className={`font-mono-numbers text-4xl sm:text-5xl font-black tracking-widest cursor-pointer select-none transition-transform active:scale-95 ${
            isDepleted
              ? 'text-[#ff2a4b] animate-pulse'
              : isLow
              ? 'text-amber-400'
              : 'text-white'
          }`}
        >
          {timeFormatted}
        </div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
          {isDepleted
            ? 'QUOTA EXCEEDED // CEASE USAGE'
            : isRunning
            ? 'ACTIVE COUNTDOWN // RUNS IN BACKGROUND & LOCK SCREEN'
            : isPartiallyElapsed
            ? 'PAUSED // TAP START TO RESUME'
            : 'READY TO INITIATE'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#151822] h-1.5 rounded-full overflow-hidden mb-4 border border-[#222738]">
        <div
          className={`h-full transition-all duration-500 ${
            isDepleted
              ? 'bg-[#ff2a4b]'
              : isLow
              ? 'bg-amber-400'
              : 'bg-gradient-to-r from-[#8b0000] to-[#ff2a4b]'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Buttons: Explicit Start, Pause, Reset */}
      <div className="grid grid-cols-3 gap-2">
        {/* START / RESUME BUTTON */}
        <button
          onClick={onStartTimer}
          disabled={isRunning || isDepleted}
          className={`min-h-[44px] py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
            !isRunning && !isDepleted
              ? 'bg-[#8b0000] hover:bg-[#b00d0d] text-white shadow-[0_0_15px_rgba(139,0,0,0.5)] border border-[#ff2a4b]'
              : 'bg-[#141620] text-slate-500 border border-[#1e2230] cursor-not-allowed opacity-50'
          }`}
        >
          <Play size={15} className={!isRunning && !isDepleted ? 'fill-white text-white' : ''} />
          {isPartiallyElapsed ? 'Resume' : 'Start'}
        </button>

        {/* PAUSE BUTTON (پوز کریں) */}
        <button
          onClick={onPauseTimer}
          disabled={!isRunning}
          className={`min-h-[44px] py-2.5 px-3 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
            isRunning
              ? 'bg-[#b45309] hover:bg-[#d97706] text-white shadow-[0_0_15px_rgba(217,119,6,0.6)] border border-amber-400 animate-pulse'
              : 'bg-[#141620] text-slate-500 border border-[#1e2230] cursor-not-allowed opacity-50'
          }`}
          title="Pause timer (ٹائمر روکیں)"
        >
          <Pause size={15} className={isRunning ? 'fill-white text-white' : ''} />
          Pause
        </button>

        {/* RESET BUTTON */}
        <button
          onClick={onResetTimer}
          title="Reset timer to full quota"
          className="min-h-[44px] py-2.5 px-3 rounded-lg bg-[#181c28] hover:bg-[#222738] text-slate-300 hover:text-white border border-[#272d40] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>
    </div>
  );
};
