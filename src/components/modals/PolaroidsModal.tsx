import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CardData, PolaroidMemory } from '../../types';
import { soundFx } from '../../utils/audio';

interface PolaroidsModalProps {
  cardData: CardData;
  onBack: () => void;
}

export const PolaroidsModal: React.FC<PolaroidsModalProps> = ({ cardData, onBack }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidMemory | null>(null);

  useEffect(() => {
    // Automatically start playing Ed Sheeran - Perfect when viewing photos
    soundFx.startMusic(cardData.audioUrl || '/perfect.mp3');
  }, [cardData.audioUrl]);

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
        {/* Music Playing Indicator Badge */}
        <div className="flex items-center gap-2 bg-[#e8ded0]/90 px-3 py-1 rounded-full text-xs text-[#59382b] font-serif font-medium border border-[#d8c5b0] shadow-sm mb-3">
          <span className="animate-bounce">🎵</span>
          <span>Ed Sheeran — Perfect</span>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-xl">📸</div>
          <h2 className="font-serif italic text-2xl text-[#4a3227] font-semibold tracking-wide">
            Our Sweet Memories
          </h2>
        </div>

        {/* Polaroid Vertical Stack Container (Matches 00:09 video layout) */}
        <div className="w-full space-y-6 flex flex-col items-center py-2">
          {cardData.polaroids.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.03, rotate: 0 }}
              style={{ rotate: `${item.rotation || (index % 2 === 0 ? -2 : 2)}deg` }}
              onClick={() => {
                soundFx.playClick();
                setSelectedPhoto(item);
              }}
              className="w-[230px] bg-white rounded-md p-3 pb-6 shadow-2xl border border-[#e2d5c3] cursor-pointer relative group transition-transform"
            >
              {/* Tape Sticker Accent on Top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f2e6d5]/80 backdrop-blur-xs border border-[#d8c5b0] shadow-xs rotate-[-2deg] z-10 opacity-90" />

              {/* Photo Frame Container */}
              <div className="w-full h-[190px] bg-[#211714] overflow-hidden rounded-xs relative">
                <img
                  src={item.imageUrl}
                  alt={item.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Handwritten Style Caption */}
              <div className="mt-3 text-center">
                <p className="font-serif italic text-base text-[#3d2b22] font-medium leading-tight">
                  {item.caption}
                </p>
                {item.date && (
                  <span className="text-[10px] text-[#917769] font-sans block mt-1">
                    {item.date}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

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

      {/* Fullscreen Photo Zoom Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-4 pb-8 rounded-lg max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-h-[60vh] overflow-hidden rounded bg-neutral-900">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="font-serif italic text-lg text-center text-[#3d2b22] mt-4">
                {selectedPhoto.caption}
              </p>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="mt-4 w-full py-2 bg-[#543528] text-white rounded-lg text-sm font-semibold"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
