import React from 'react';
import { motion } from 'motion/react';
import { CardData } from '../../types';
import { soundFx } from '../../utils/audio';

interface LetterModalProps {
  cardData: CardData;
  onBack: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ cardData, onBack }) => {
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
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#b89e83,#b89e83_10px,transparent_10px,transparent_20px)] pointer-events-none" />

      <div className="w-full max-w-[340px] my-auto relative z-10 flex flex-col items-center py-4">
        {/* Main Stationery Paper */}
        <div className="w-full bg-[#fdfbf7] rounded-2xl p-6 shadow-2xl border border-[#e8ded0] relative overflow-hidden flex flex-col justify-between min-h-[380px]">
          
          {/* Subtle Floral Corner Illustration Decorations */}
          <div className="absolute top-2 right-2 text-xl opacity-60 pointer-events-none">🌸</div>
          <div className="absolute bottom-2 left-2 text-xl opacity-60 pointer-events-none">🍃</div>

          {/* Letter Header */}
          <div className="border-b border-[#ebdcc9] pb-3 mb-4">
            <h2 className="font-serif italic text-2xl font-semibold text-[#4a3227] tracking-wide">
              {cardData.salutation || `Dear ${cardData.recipientName},`}
            </h2>
          </div>

          {/* Letter Body Content */}
          <div className="flex-1 font-serif text-[#4a3528] text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line py-2">
            {cardData.letterContent}
          </div>

          {/* Letter Footer Sign-off */}
          <div className="pt-4 border-t border-[#ebdcc9] mt-4 text-right">
            <p className="font-serif italic text-xs text-[#8c6d5e]">Avec tout mon amour,</p>
            <p className="font-serif text-base font-bold text-[#59382b] mt-0.5">
              {cardData.senderName || 'Mon Amour'}
            </p>
          </div>
        </div>

        {/* Back Button (Matches video: brown pill BACK button) */}
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
