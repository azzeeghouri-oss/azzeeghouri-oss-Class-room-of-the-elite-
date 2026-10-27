import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, X, Check } from 'lucide-react';

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatar: string;
  defaultAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
  onClose: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  currentAvatar,
  defaultAvatarUrl,
  onSelectAvatar,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onSelectAvatar(result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-sm w-full bg-[#10121a] border border-[#1e2230] rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1e2230]">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide uppercase">
              Operative Identity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Select or upload your tactical avatar</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="my-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#ff2a4b] to-[#1e2230] shadow-[0_0_24px_rgba(255,42,75,0.4)] mb-4">
            <img
              src={currentAvatar || defaultAvatarUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover rounded-full bg-slate-900"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">Current Active Identity</span>
        </div>

        <div className="space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl bg-[#ff2a4b]/15 border border-[#ff2a4b]/40 text-[#ff2a4b] hover:bg-[#ff2a4b]/25 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Camera size={16} />
            Upload Photo From Gallery
          </button>

          <button
            onClick={() => {
              onSelectAvatar(defaultAvatarUrl);
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#151822] border border-[#1e2230] text-slate-300 hover:text-white hover:bg-[#1a1e2b] transition-all text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ImageIcon size={16} />
            Restore Kiyotaka Ayanokoji Visual
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-[#1e2230] text-center">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-300 uppercase tracking-widest font-bold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
