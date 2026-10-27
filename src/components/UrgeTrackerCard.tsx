import React, { useState } from 'react';
import { UrgeStatus } from '../types';
import { ShieldCheck, ShieldAlert, Zap, X, Timer } from 'lucide-react';

interface UrgeTrackerCardProps {
  currentStatus: UrgeStatus;
  allTasksDone: boolean;
  onSetStatus: (status: 'clean' | 'relapsed') => void;
}

export const UrgeTrackerCard: React.FC<UrgeTrackerCardProps> = ({
  currentStatus,
  allTasksDone,
  onSetStatus,
}) => {
  const [showIntervention, setShowIntervention] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startEmergencyTimer = () => {
    setCountdown(60);
    const interval = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getStatusText = () => {
    if (currentStatus === 'clean') {
      if (allTasksDone) {
        return {
          label: 'STATUS: WHITE ROOM VICTORY (All Tasks Done + Clean) ✓',
          className: 'text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]',
        };
      }
      return {
        label: 'STATUS: CLEAN (Finish all tasks to complete White Room Victory)',
        className: 'text-emerald-400 font-bold',
      };
    }
    if (currentStatus === 'relapsed') {
      return {
        label: 'STATUS: RELAPSED (Protocol Failure Recorded) ✕',
        className: 'text-[#ff2a4b] font-bold',
      };
    }
    return {
      label: 'STATUS: Awaiting today’s confirmation',
      className: 'text-slate-500 font-medium',
    };
  };

  const statusInfo = getStatusText();

  return (
    <div className="bg-[#140d11] border border-[#451520] rounded-xl p-4 sm:p-5 text-center relative overflow-hidden shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs sm:text-sm font-black text-[#ffccd4] uppercase tracking-wider text-left">
          Self-Sovereignty Audit
        </h4>
        <button
          onClick={() => setShowIntervention(true)}
          className="text-[10px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-amber-950/40 border border-amber-800/40 py-1 px-2 rounded-md transition-colors"
        >
          <Zap size={11} />
          Urge Emergency Protocol
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-4 text-left leading-relaxed">
        Did you engage in masturbation today? Answer truthfully. No excuses in the White Room.
      </p>

      {/* Decision Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => onSetStatus('clean')}
          className={`py-3 px-3 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            currentStatus === 'clean'
              ? 'bg-[#064e3b] text-[#a7f3d0] border-2 border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-[1.02]'
              : 'bg-[#092921] hover:bg-[#064e3b] text-[#6ee7b7] border border-[#047857]'
          }`}
        >
          <ShieldCheck size={16} />
          NO (Clean)
        </button>

        <button
          onClick={() => onSetStatus('relapsed')}
          className={`py-3 px-3 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
            currentStatus === 'relapsed'
              ? 'bg-[#4c0519] text-[#fecdd3] border-2 border-[#ff2a4b] shadow-[0_0_15px_rgba(255,42,75,0.4)] scale-[1.02]'
              : 'bg-[#26050e] hover:bg-[#4c0519] text-[#fda4af] border border-[#9f1239]'
          }`}
        >
          <ShieldAlert size={16} />
          YES (Relapsed)
        </button>
      </div>

      {/* Status Output */}
      <div className="pt-2 border-t border-[#2a131b]">
        <span className={`text-[11px] tracking-wide block ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Emergency Intervention Modal */}
      {showIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative max-w-sm w-full bg-[#10121a] border border-[#ff2a4b]/50 rounded-2xl p-5 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2230]">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Urge Suppression Protocol
                </h3>
              </div>
              <button
                onClick={() => setShowIntervention(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X size={16} />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs text-slate-300">
              <div className="bg-[#170e12] border-l-2 border-[#ff2a4b] p-2.5 rounded text-[11px] italic text-[#ffb4c0]">
                &ldquo;You are contemplating surrendering your intellectual dominance for a 5-second dopamine surge. That is the calculation of an amateur.&rdquo;
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Mandatory Execution Steps:
                </span>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 text-[11px]">
                  <li>Stand up immediately and place both hands under freezing cold tap water.</li>
                  <li>Drop to the floor and execute 25 explosive push-ups to flood oxygen to muscle tissue.</li>
                  <li>Inhale for 4s, hold for 4s, exhale for 6s. Dismantle the craving as nothing more than chemical noise.</li>
                </ol>
              </div>

              {countdown !== null ? (
                <div className="p-3 bg-[#0d0f17] rounded-xl border border-[#23283a] text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    60-Second Neural Reset Timer
                  </span>
                  <div className="text-3xl font-mono font-black text-amber-400 mt-1">
                    {countdown}s
                  </div>
                  {countdown === 0 && (
                    <span className="text-xs text-emerald-400 font-bold block mt-1">
                      Reset Complete. Mind Sovereignty Restored.
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={startEmergencyTimer}
                  className="w-full py-2.5 rounded-lg bg-[#8b0000] hover:bg-[#a60b0b] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Timer size={14} />
                  Initiate 60s Breathing Countdown
                </button>
              )}
            </div>

            <button
              onClick={() => setShowIntervention(false)}
              className="w-full py-2 rounded-lg bg-[#181c28] hover:bg-[#202538] text-slate-300 text-xs font-bold uppercase tracking-wider"
            >
              Close Protocol
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
