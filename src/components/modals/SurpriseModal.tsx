import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CardData } from '../../types';
import { soundFx } from '../../utils/audio';

// Teddy bear asset import
import teddyImg from '../../assets/images/teddy_bear_ribbon_1785573014790.jpg';

interface SurpriseModalProps {
  cardData: CardData;
  onBack: () => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({ cardData, onBack }) => {
  const [revealed, setRevealed] = useState<boolean>(false);

  const handleReveal = () => {
    soundFx.playClick();
    setRevealed(true);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e8a3a3', '#ffd700', '#f7d6d6', '#d9777f'],
      });
    } catch {
      // Ignore
    }
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
        
        {/* Cute Teddy Bear Illustration */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-40 h-40 relative mb-4"
        >
          <img
            src={teddyImg}
            alt="Teddy Bear with Surprise"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>

        {/* Speech Bubble Box (Matches 00:12 video layout) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-[#fcf8f2] rounded-2xl p-5 shadow-xl border border-[#e3d7c5] relative flex flex-col items-center text-center"
        >
          {/* Speech Bubble Arrow */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#fcf8f2] rotate-45 border-t border-l border-[#e3d7c5]" />

          <h3 className="font-serif italic text-2xl font-bold text-[#4a3227] mb-2">
            {cardData.surpriseMessage || 'Surprise! 🎁'}
          </h3>

          <p className="font-serif text-[#5e473a] text-sm leading-relaxed mb-4">
            {cardData.surpriseSubtext || 'I got you a gift. Look behind you! I hope you like it! ❤️'}
          </p>

          {/* Interactive Scratch / Reveal Gift Voucher */}
          {!revealed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReveal}
              className="w-full py-3 bg-gradient-to-r from-[#d9777f] to-[#e8a3a3] text-white font-serif font-bold text-sm rounded-xl shadow-md border border-[#c9626b] flex items-center justify-center gap-2"
            >
              <span>✨ Découvrir mon autre surprise ✨</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full p-4 bg-[#f4ebe1] rounded-xl border border-dashed border-[#c9b29e] text-[#4a3227] font-serif text-sm italic"
            >
              <p className="font-bold text-base not-italic text-[#a84444] mb-1">
                🎟️ Bon pour 1 Soirée Romantique Uniquement pour Toi !
              </p>
              <p className="text-xs text-[#786154]">
                Dîner fait maison, ton film préféré & massage illimité. Valable sans date d'expiration ! ❤️
              </p>
            </motion.div>
          )}
        </motion.div>

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
