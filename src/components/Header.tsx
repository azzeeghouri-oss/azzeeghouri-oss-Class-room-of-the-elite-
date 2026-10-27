import React from 'react';
import { Volume2, VolumeX, BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  avatarUrl: string;
  onAvatarClick: () => void;
  activeQuote: string;
  onRefreshQuote: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCodex: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  avatarUrl,
  onAvatarClick,
  activeQuote,
  onRefreshQuote,
  soundEnabled,
  onToggleSound,
  onOpenCodex,
}) => {
  return (
    <header className="pt-2 pb-4 border-b border-[#1e2230] mb-5">
      {/* Top Utility Bar */}
      <div className="flex items-center justify-between px-1 mb-3 text-xs text-slate-400">
        <span className="font-mono-numbers tracking-widest uppercase text-[11px] text-slate-500">
          SEC // 04-WR
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mute audio cues" : "Enable tactical sound"}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#151822] transition-colors"
          >
            {soundEnabled ? <Volume2 size={16} className="text-[#ff2a4b]" /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={onOpenCodex}
            title="Open White Room Doctrines & Data"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#151822] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <BookOpen size={16} />
            <span className="hidden sm:inline">Codex</span>
          </button>
        </div>
      </div>

      {/* Avatar Section */}
      <div className="text-center">
        <div
          onClick={onAvatarClick}
          className="relative group w-24 h-24 mx-auto mb-2.5 rounded-full p-[3px] bg-gradient-to-tr from-[#ff2a4b] via-[#8b0000] to-[#1e2230] shadow-[0_0_24px_rgba(255,42,75,0.4)] cursor-pointer transition-transform active:scale-95"
          title="Tap to change portrait or upload photo"
        >
          <img
            src={avatarUrl}
            alt="Kiyotaka Ayanokoji"
            className="w-full h-full rounded-full object-cover object-top bg-[#10121a] group-hover:opacity-90 transition-opacity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full border border-[#ff2a4b]/30 pointer-events-none" />
        </div>

        <button
          onClick={onAvatarClick}
          className="text-[11px] text-slate-500 hover:text-[#ff2a4b] transition-colors tracking-wide font-medium"
        >
          Tap portrait to change
        </button>

        <h1 className="text-xl sm:text-2xl font-black text-white tracking-[0.2em] uppercase mt-2">
          Ayanokoji System
        </h1>
        <p className="text-xs font-bold text-[#ff2a4b] tracking-[0.18em] uppercase mt-0.5">
          White Room Protocol
        </p>
      </div>

      {/* Dynamic Dialogue Box */}
      <div className="mt-4 relative bg-[#8b0000]/12 border-l-4 border-[#ff2a4b] rounded-r-lg p-3 sm:p-3.5 text-xs sm:text-[13px] text-[#ffc5ce] leading-relaxed flex items-start justify-between gap-3 shadow-inner">
        <p className="italic font-normal">
          &ldquo;{activeQuote}&rdquo;
        </p>
        <button
          onClick={onRefreshQuote}
          title="Cycle calculation quote"
          className="shrink-0 p-1 rounded hover:bg-[#ff2a4b]/20 text-[#ff8093] hover:text-white transition-colors"
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  );
};
