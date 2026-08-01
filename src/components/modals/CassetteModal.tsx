import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Music, Volume2 } from 'lucide-react';
import { CardData } from '../../types';
import { soundFx } from '../../utils/audio';

interface CassetteModalProps {
  cardData: CardData;
  onBack: () => void;
}

export const CassetteModal: React.FC<CassetteModalProps> = ({ cardData, onBack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundFx.getPlayingState());

  useEffect(() => {
    // Sync state
    setIsPlaying(soundFx.getPlayingState());
  }, []);

  const handleTogglePlay = () => {
    const newState = soundFx.toggleMusic(cardData.audioUrl);
    setIsPlaying(newState);
  };

  const handleBack = () => {
    soundFx.playClick();
    onBack();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full h-full relative flex flex-col items-center justify-between p-4 bg-[#f3ebd9] bg-[radial-gradient(#e6dabf_1px,transparent_1px)] [background-size:16px_16px] overflow-y-auto"
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#b89e83,#b89e83_10px,transparent_10px,transparent_20px)] pointer-events-none" />

      <div className="w-full max-w-[340px] my-auto relative z-10 flex flex-col items-center py-4">
        {/* Title Header */}
        <div className="text-center mb-4">
          <div className="text-xl">🎶</div>
          <h2 className="font-serif italic text-2xl text-[#4a3227] font-semibold tracking-wide">
            Your favorite song!
          </h2>
        </div>

        {/* Vintage Cassette Tape Unit */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTogglePlay}
          className="w-full bg-[#f2e9dc] rounded-2xl p-4 shadow-2xl border-2 border-[#d6c5b0] relative cursor-pointer select-none"
        >
          {/* Cassette Top Header Label */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#7a6455] mb-2 px-1">
            <span className="bg-[#e2d4c0] px-2 py-0.5 rounded border border-[#c4b39e]">A INDEX</span>
            <span className="text-[#a84444] tracking-widest font-sans font-bold">STUDIO QUALITY</span>
            <span className="flex items-center gap-1 text-[9px]">
              <span>IN</span> / <span>OUT</span>
            </span>
          </div>

          {/* Main Cassette Body */}
          <div className="w-full bg-[#e8ded0] rounded-xl p-3 border border-[#cca891] shadow-inner relative flex flex-col items-center">
            {/* Title Bar Label */}
            <div className="w-full bg-[#3d2c25] text-[#f7eedf] py-1.5 px-3 rounded text-center mb-3 shadow">
              <span className="font-serif text-sm font-bold tracking-wide uppercase">
                {cardData.songTitle || 'STEREO CASSETTE'}
              </span>
              {cardData.artistName && (
                <span className="block text-[10px] text-[#d6beab] font-sans font-normal italic">
                  — {cardData.artistName}
                </span>
              )}
            </div>

            {/* Tape Window with Reels */}
            <div className="w-4/5 h-20 bg-[#241a15] rounded-lg border-2 border-[#544136] p-2 flex items-center justify-between relative overflow-hidden shadow-inner">
              {/* Left Spinning Tape Reel */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-12 h-12 rounded-full border-4 border-[#e8ded0] bg-[#3a2c24] flex items-center justify-center relative shadow"
              >
                <div className="w-4 h-4 rounded-full bg-[#241a15] border border-white/40" />
                <div className="absolute inset-0 border border-dashed border-white/30 rounded-full" />
              </motion.div>

              {/* Tape Level Window in Middle */}
              <div className="flex-1 mx-2 h-6 bg-[#17100d] rounded border border-[#42332a] flex items-center justify-center relative px-2">
                <div className="w-full h-1 bg-[#47382f] rounded flex overflow-hidden">
                  <div
                    className={`h-full bg-[#d9777f] transition-all duration-300 ${
                      isPlaying ? 'w-3/4 animate-pulse' : 'w-1/3'
                    }`}
                  />
                </div>
              </div>

              {/* Right Spinning Tape Reel */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="w-12 h-12 rounded-full border-4 border-[#e8ded0] bg-[#3a2c24] flex items-center justify-center relative shadow"
              >
                <div className="w-4 h-4 rounded-full bg-[#241a15] border border-white/40" />
                <div className="absolute inset-0 border border-dashed border-white/30 rounded-full" />
              </motion.div>
            </div>

            {/* Equalizer Visualizer Bars */}
            <div className="w-full flex items-center justify-center gap-1.5 mt-3 h-6">
              {[40, 70, 30, 90, 60, 100, 50, 80, 35, 65].map((height, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-200 ${
                    isPlaying ? 'bg-[#d9777f]' : 'bg-[#b8a594]'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (height * (i % 2 === 0 ? 0.9 : 0.6)))}%` : '20%',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Interactive Play Controller Ribbon */}
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-serif text-[#5e493b]">
              <Volume2 className="w-4 h-4" />
              <span className="font-medium">{isPlaying ? 'Lecture en cours...' : 'Musique en pause'}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="w-10 h-10 rounded-full bg-[#543528] text-white flex items-center justify-center shadow-lg hover:bg-[#684334] transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
          </div>
        </motion.div>

        {/* Double Tap Instruction */}
        <p className="text-xs font-serif italic text-[#785b4d] mt-4 tracking-wide text-center">
          (Click or tap on the cassette to play the music!)
        </p>

        {/* BACK Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="mt-6 px-8 py-2.5 bg-[#543528] text-[#f4ebe1] font-serif text-sm font-semibold rounded-xl shadow-lg border border-[#6f4838] hover:bg-[#633e30] transition-colors"
        >
          BACK
        </motion.button>
      </div>
    </motion.div>
  );
};
