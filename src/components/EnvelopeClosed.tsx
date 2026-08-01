import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

interface EnvelopeClosedProps {
  title?: string;
  recipientName: string;
  onOpen: () => void;
}

// Generated wax seal asset path
import waxSealImg from '../assets/images/wax_seal_gold_1785572998244.jpg';

export const EnvelopeClosed: React.FC<EnvelopeClosedProps> = ({
  title = 'You got a mail!',
  recipientName,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState<boolean>(false);

  const handleSealClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play wax seal break audio pop
    soundFx.playWaxSealBreak();

    // Trigger sweet heart confetti explosion
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#e8a3a3', '#d9777f', '#f7d6d6', '#ffd700'],
        shapes: ['circle'],
      });
    } catch {
      // Ignore fallback
    }

    // Delay slightly for animation before switching to hub
    setTimeout(() => {
      soundFx.playEnvelopeOpen();
      onOpen();
    }, 600);
  };

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-6 overflow-hidden bg-[#f3ebd9] bg-[radial-gradient(#e6dabf_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Soft Striped Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#b89e83,#b89e83_10px,transparent_10px,transparent_20px)] pointer-events-none" />

      {/* Header: Ribbon Icon & Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center pt-6 z-10"
      >
        {/* Ribbon Bow Icon */}
        <div className="text-3xl text-[#8d5b4c] mb-1 drop-shadow-xs">🎀</div>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#4a3227] tracking-wider font-[#59382b]">
          {title}
        </h2>
        {recipientName && (
          <p className="text-xs font-sans text-[#8c6d5e] mt-1 tracking-wide uppercase font-medium">
            Pour {recipientName}
          </p>
        )}
      </motion.div>

      {/* Main Envelope Visual Container */}
      <div className="w-full max-w-[310px] my-auto relative z-10 flex flex-col items-center">
        <motion.div
          animate={
            isOpening
              ? { scale: [1, 1.05, 0.95], rotate: [0, -2, 2, 0] }
              : { y: [0, -4, 0] }
          }
          transition={
            isOpening
              ? { duration: 0.5 }
              : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
          }
          className="w-full relative cursor-pointer group"
          onClick={handleSealClick}
        >
          {/* Envelope Body Shadow */}
          <div className="absolute inset-x-2 -bottom-3 h-8 bg-[#3d271d]/20 rounded-full blur-md" />

          {/* Envelope Main Body */}
          <div className="w-full h-[200px] bg-[#543528] rounded-2xl shadow-xl relative overflow-hidden border border-[#6d4637] flex flex-col justify-between">
            {/* Inner Envelope Flap Lines & Shading */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#694333] via-[#543528] to-[#40271c]" />

            {/* Triangle Flap top fold */}
            <div
              className="absolute top-0 left-0 right-0 h-[100px] bg-[#613d2f] border-b border-[#784d3b] shadow-md z-10"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />

            {/* Side Flaps folds */}
            <div
              className="absolute bottom-0 left-0 w-1/2 h-[120px] bg-[#4a2e22]"
              style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
            />
            <div
              className="absolute bottom-0 right-0 w-1/2 h-[120px] bg-[#43291d]"
              style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
            />

            {/* Gold Wax Seal Stamp in Center */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-[80px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center cursor-pointer group-hover:brightness-110"
            >
              <img
                src={waxSealImg}
                alt="Gold Wax Seal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full border-2 border-[#b88a38] shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Click Instruction Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-serif italic text-[#785b4d] mt-6 tracking-wide text-center"
        >
          (Click on the wax seal to open)
        </motion.p>
      </div>

      {/* Decorative Bottom Corner Flowers / Accent */}
      <div className="w-full text-center text-xs text-[#a38b7d] font-serif z-10 pb-2 flex items-center justify-center gap-2">
        <span>🌸</span>
        <span className="italic font-light">Une pensée particulière pour toi</span>
        <span>🌸</span>
      </div>
    </div>
  );
};
