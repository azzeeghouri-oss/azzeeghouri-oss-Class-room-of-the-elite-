import React, { useRef, useState } from 'react';
import { ayanokojiQuotes } from '../data/quotes';
import { X, Download, Upload, AlertTriangle, ShieldCheck, BookOpen } from 'lucide-react';
import { exportAllData, importAllData } from '../utils/storage';

interface WhiteRoomCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
  onDataImported: () => void;
}

export const WhiteRoomCodexModal: React.FC<WhiteRoomCodexModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
  onDataImported,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = importAllData(text);
          if (success) {
            setImportStatus('Data backup successfully restored.');
            onDataImported();
            setTimeout(() => {
              setImportStatus(null);
              onClose();
            }, 1200);
          } else {
            setImportStatus('Failed to parse backup JSON.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative max-w-lg w-full bg-[#10121a] border border-[#1e2230] rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1e2230]">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#ff2a4b]" />
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-widest uppercase text-white">
                White Room Codex
              </h3>
              <p className="text-[11px] text-slate-400">Tactical Directives & Data Sovereignty</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Doctrines Section */}
        <div className="my-5 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff8093] block">
            Core Operating Principles
          </span>

          <div className="space-y-3">
            {ayanokojiQuotes.codexPhilosophy.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#0d0f17] border border-[#1b1f2c] rounded-xl text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-[#ff2a4b] font-bold">
                    0{idx + 1}.
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management Section */}
        <div className="pt-4 border-t border-[#1e2230] space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Data Storage & Backup
          </span>

          {importStatus && (
            <div className="p-2.5 bg-[#064e3b] text-[#a7f3d0] rounded-lg text-xs font-bold text-center">
              {importStatus}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={exportAllData}
              className="py-2.5 px-3 rounded-lg bg-[#151822] hover:bg-[#1d2232] border border-[#242a3e] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download size={14} />
              Export Backup
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 rounded-lg bg-[#151822] hover:bg-[#1d2232] border border-[#242a3e] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Upload size={14} />
              Import Backup
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {/* Reset option */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2 text-[11px] text-slate-500 hover:text-[#ff2a4b] font-semibold uppercase tracking-wider transition-colors"
            >
              Reset Protocol To Factory Defaults
            </button>
          ) : (
            <div className="p-3 bg-[#26050e] border border-[#ff2a4b] rounded-xl text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#ffccd4]">
                <AlertTriangle size={15} className="text-[#ff2a4b]" />
                Purge All Records & Schedule?
              </div>
              <p className="text-[11px] text-slate-400">
                This will erase all recorded calendar victories and restore default routine tasks.
              </p>
              <div className="flex gap-2 justify-center pt-1">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDataReset();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-[#ff2a4b] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Confirm Purge
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close */}
        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#8b0000] hover:bg-[#a60b0b] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow"
          >
            Return to Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
