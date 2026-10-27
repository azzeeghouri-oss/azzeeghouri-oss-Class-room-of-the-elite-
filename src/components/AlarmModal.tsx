import React from 'react';
import { AlertOctagon, VolumeX } from 'lucide-react';

interface AlarmModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({ isOpen, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alarm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-alarm-flash text-center"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#0d0f17] border-2 border-[#ff2a4b] rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,42,75,0.6)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-[#ff2a4b]/20 border border-[#ff2a4b] flex items-center justify-center mb-4 text-[#ff2a4b] animate-bounce">
          <AlertOctagon size={36} />
        </div>

        <h2 id="alarm-title" className="text-2xl font-black tracking-widest text-[#ff2a4b] uppercase mb-2">
          Protocol Breach: Time Expired
        </h2>

        <p className="text-sm font-medium text-slate-300 italic mb-6 leading-relaxed">
          &ldquo;The mobile time budget is completely exhausted. Put your phone down immediately and return to your objective.&rdquo;
        </p>

        <div className="w-full space-y-3">
          <button
            onClick={onDismiss}
            className="w-full py-3.5 px-6 rounded-xl bg-white text-black font-extrabold text-sm uppercase tracking-wider hover:bg-slate-200 transition-transform active:scale-[0.98] shadow-lg shadow-white/10 flex items-center justify-center gap-2"
          >
            <VolumeX size={18} />
            Acknowledge & Stop Alarm
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-4 tracking-wider uppercase font-semibold">
          White Room Protocol Enforcement
        </p>
      </div>
    </div>
  );
};
