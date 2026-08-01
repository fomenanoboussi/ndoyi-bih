import React, { useState } from 'react';
import { Smartphone, Monitor, Share2, Check } from 'lucide-react';

interface PhoneMockupProps {
  children: React.ReactNode;
  onOpenCustomizer?: () => void;
  siteUrl?: string;
  recipientName: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  onOpenCustomizer,
  siteUrl = 'racedigitals.my.canva.site',
  recipientName,
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#2c221e] text-[#4a3b32] flex flex-col items-center justify-between p-2 sm:p-4 select-none font-sans overflow-x-hidden">
      {/* Top Header Bar for App Controls */}
      <header className="w-full max-w-4xl flex items-center justify-between px-3 py-2 bg-[#3a2d28]/80 backdrop-blur-md border border-[#58443b] rounded-2xl shadow-lg text-white text-xs sm:text-sm z-30 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#e8a3a3] flex items-center justify-center text-[#2c221e] font-serif font-bold text-sm shadow">
            💌
          </div>
          <div>
            <h1 className="font-semibold text-xs sm:text-sm text-[#f6ece2] tracking-wide">
              Lettre pour {recipientName || 'ma copine'}
            </h1>
            <p className="text-[10px] text-[#cbb8aa]">Carte & Enveloppe Interactive</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher: Phone Mockup vs Full Screen */}
          <div className="hidden sm:flex items-center bg-[#251d19] p-1 rounded-xl border border-[#483730]">
            <button
              onClick={() => setIsPhoneFrame(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs ${
                isPhoneFrame ? 'bg-[#e8a3a3] text-[#2c221e] font-semibold shadow' : 'text-[#a08f83] hover:text-white'
              }`}
              title="Vue Téléphone (Style Vidéo TikTok)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Format Mobile</span>
            </button>
            <button
              onClick={() => setIsPhoneFrame(false)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs ${
                !isPhoneFrame ? 'bg-[#e8a3a3] text-[#2c221e] font-semibold shadow' : 'text-[#a08f83] hover:text-white'
              }`}
              title="Vue Plein Écran"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Plein Écran</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="w-full flex-1 flex items-center justify-center relative py-2">
        {isPhoneFrame ? (
          /* Realistic Smartphone Outer Shell */
          <div className="relative w-full max-w-[390px] h-[780px] max-h-[85vh] bg-[#1a1512] rounded-[48px] p-3 shadow-2xl border-[5px] border-[#4a3a32] flex flex-col justify-between overflow-hidden ring-1 ring-black/40">
            {/* Phone Notch / Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-end px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0d2818] ring-1 ring-[#164e2a]" />
            </div>

            {/* Phone Top Status Bar */}
            <div className="w-full h-8 pt-1 px-6 flex items-center justify-between text-[11px] font-semibold text-neutral-800 z-40">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <div className="w-5 h-2.5 border border-neutral-700 rounded-sm p-0.5 flex items-center">
                  <div className="w-full h-full bg-neutral-800 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Interactive Screen Content Container */}
            <div className="relative flex-1 w-full bg-[#f4ebe1] rounded-[36px] overflow-hidden flex flex-col shadow-inner">
              {children}
            </div>

            {/* Mobile Safari Style URL Bar at Bottom (Matches TikTok video mockup) */}
            <div className="w-full pt-2 pb-1 px-3 bg-[#e8ded0] border-t border-[#d8cbbd] flex items-center justify-between rounded-b-[36px] z-40 text-[#5a483c] text-xs">
              <div className="text-[11px] font-serif font-bold opacity-70">aA</div>
              <div className="flex-1 mx-2 py-1 px-3 bg-[#f7f2eb] rounded-xl flex items-center justify-center gap-1.5 border border-[#d8cbbd] shadow-2xs">
                <span className="text-[10px] text-neutral-400">🔒</span>
                <span className="text-[11px] font-medium tracking-tight truncate max-w-[200px]">
                  {siteUrl}
                </span>
                <span className="text-[10px] text-neutral-400">↻</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <span>📖</span>
              </div>
            </div>
          </div>
        ) : (
          /* Fullscreen Desktop View Container */
          <div className="w-full max-w-2xl h-[82vh] bg-[#f4ebe1] rounded-3xl shadow-2xl border border-[#d8cbbd] overflow-hidden relative flex flex-col">
            {children}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="text-[11px] text-[#9a8678] text-center pt-1 font-serif italic">
        Fait avec amour pour {recipientName || 'ta copine'} ❤️
      </footer>
    </div>
  );
};
