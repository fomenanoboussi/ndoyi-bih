import React from 'react';
import { motion } from 'motion/react';
import { CardData, ActiveView } from '../types';
import { soundFx } from '../utils/audio';

// Generated asset image imports
import teddyImg from '../assets/images/teddy_bear_ribbon_1785573014790.jpg';
import cassetteImg from '../assets/images/cassette_vintage_1785573026511.jpg';

interface EnvelopeOpenHubProps {
  cardData: CardData;
  onSelectView: (view: ActiveView) => void;
}

export const EnvelopeOpenHub: React.FC<EnvelopeOpenHubProps> = ({
  cardData,
  onSelectView,
}) => {
  const handleItemClick = (view: ActiveView) => {
    soundFx.playClick();
    onSelectView(view);
  };

  const firstPolaroid = cardData.polaroids[0]?.imageUrl || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-between p-4 overflow-hidden bg-[#f3ebd9] bg-[radial-gradient(#e6dabf_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Background Soft Striped Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,#b89e83,#b89e83_10px,transparent_10px,transparent_20px)] pointer-events-none" />

      {/* Top Banner / Decorative Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center pt-2 z-10"
      >
        <span className="text-xl">💌</span>
      </motion.div>

      {/* Envelope Hub Stage */}
      <div className="w-full max-w-[320px] my-auto relative z-10 flex flex-col items-center justify-center">
        {/* Open Brown Envelope Back Outer Container */}
        <div className="w-full h-[230px] relative flex flex-col items-center justify-end">
          
          {/* Envelope Back Wall */}
          <div className="absolute inset-0 bg-[#3f271d] rounded-2xl shadow-xl border border-[#523427] overflow-hidden">
            {/* Open Top Flap (Flapped UP) */}
            <div
              className="absolute top-0 left-0 right-0 h-[100px] bg-[#4f3125] border-b border-[#633e2f]"
              style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
            />
            {/* Envelope Interior Lining */}
            <div className="absolute bottom-0 inset-x-0 h-[140px] bg-[#2d1b13]" />
          </div>

          {/* ========================================================= */}
          {/* INTERACTIVE ITEMS PEEKING OUT OF THE ENVELOPE */}
          {/* ========================================================= */}

          {/* 1. Main Letter Card (Sticking out in back) */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: -30, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ y: -42, scale: 1.02 }}
            onClick={() => handleItemClick('letter')}
            className="absolute top-2 w-[88%] h-[155px] bg-[#fcf8f2] rounded-t-xl p-3 shadow-lg border border-[#e3d7c5] cursor-pointer z-10 hover:shadow-2xl transition-all"
          >
            <div className="w-full h-full border border-dashed border-[#d8c3ad] p-2 rounded-lg flex flex-col justify-between bg-[radial-gradient(#f0e6d6_1px,transparent_1px)] [background-size:12px_12px]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#4a3227] leading-snug">
                  {cardData.salutation || `Dear ${cardData.recipientName},`}
                </h3>
                <p className="text-[10px] font-sans text-[#786154] line-clamp-3 mt-1 leading-tight font-serif italic">
                  {cardData.letterContent}
                </p>
              </div>
              <div className="flex justify-between items-end text-[9px] text-[#a38c7e] font-serif font-medium">
                <span>Clique pour lire la lettre 📜</span>
                <span>❤️</span>
              </div>
            </div>
          </motion.div>

          {/* 2. Cassette Tape Item (Peeking on left) */}
          <motion.div
            initial={{ x: -30, y: 20, opacity: 0, rotate: -10 }}
            animate={{ x: -75, y: -15, opacity: 1, rotate: -12 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            whileHover={{ scale: 1.08, rotate: -6 }}
            onClick={() => handleItemClick('cassette')}
            className="absolute z-20 cursor-pointer group"
          >
            <div className="relative w-28 h-20 bg-[#efe6d8] rounded-lg p-1.5 shadow-xl border border-[#c4b29d] flex flex-col justify-between overflow-hidden">
              <img
                src={cassetteImg}
                alt="Cassette Tape"
                referrerPolicy="no-referrer"
                className="w-full h-12 object-cover rounded border border-[#d8c8b4]"
              />
              <div className="text-[8px] font-bold text-center text-[#594235] tracking-tighter uppercase font-mono">
                {cardData.songTitle || 'STEREO TAPE'}
              </div>

              {/* Video Style Pointer Callout Label */}
              <div className="absolute -top-6 -left-2 bg-[#ffffff]/90 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#59382b] border border-[#d4beaa] shadow-md whitespace-nowrap animate-bounce">
                click this! 🎵
              </div>
            </div>
          </motion.div>

          {/* 3. Polaroid Photo Deck (Peeking on right) */}
          <motion.div
            initial={{ x: 30, y: 20, opacity: 0, rotate: 10 }}
            animate={{ x: 75, y: -15, opacity: 1, rotate: 12 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            whileHover={{ scale: 1.08, rotate: 6 }}
            onClick={() => handleItemClick('polaroids')}
            className="absolute z-20 cursor-pointer group"
          >
            <div className="relative w-24 h-28 bg-white p-1.5 pt-2 pb-5 shadow-2xl rounded-sm border border-[#e0d3c3] flex flex-col items-center">
              <div className="w-full h-16 bg-[#33221a] overflow-hidden rounded-2xs">
                <img
                  src={firstPolaroid}
                  alt="Polaroid preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[8px] font-serif italic text-[#665042] mt-1 font-semibold truncate w-full text-center">
                Memories ✨
              </span>

              {/* Video Style Pointer Callout Label */}
              <div className="absolute -top-6 -right-2 bg-[#ffffff]/90 px-2 py-0.5 rounded-full text-[9px] font-bold text-[#59382b] border border-[#d4beaa] shadow-md whitespace-nowrap">
                tap on polaroids! 📸
              </div>
            </div>
          </motion.div>

          {/* Envelope Front Pocket Body */}
          <div
            className="absolute bottom-0 inset-x-0 h-[115px] bg-[#543528] rounded-b-2xl border-t border-[#6d4637] shadow-xl z-20"
            style={{
              clipPath: 'polygon(0 25%, 50% 0, 100% 25%, 100% 100%, 0 100%)',
            }}
          />

          {/* 4. Cute Teddy Bear with Bow (Sitting in center front) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => handleItemClick('surprise')}
            className="absolute -bottom-4 z-30 cursor-pointer flex flex-col items-center group"
          >
            <div className="relative w-28 h-28">
              <img
                src={teddyImg}
                alt="Teddy Bear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-xl"
              />

              {/* Video Style Callout Label for Teddy Bear */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ffffff] px-2.5 py-0.5 rounded-full text-[9px] font-bold text-[#6b3e2e] border border-[#e0cbb8] shadow-md whitespace-nowrap">
                I have a surprise! 🧸
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Instruction Prompt (Matching Video: Click on the letter to read it!) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs font-serif italic text-[#785b4d] mt-10 tracking-wide text-center z-10"
        >
          (Click on any item above to explore!)
        </motion.p>
      </div>

      {/* Footer Quote */}
      <div className="text-[11px] text-[#9c8273] font-serif text-center z-10 pb-1">
        Fait avec beaucoup d'amour 💖
      </div>
    </div>
  );
};
