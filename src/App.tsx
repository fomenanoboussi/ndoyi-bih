import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CardData, ActiveView } from './types';
import { defaultCardData } from './data/defaultCard';
import { PhoneMockup } from './components/PhoneMockup';
import { EnvelopeClosed } from './components/EnvelopeClosed';
import { EnvelopeOpenHub } from './components/EnvelopeOpenHub';
import { LetterModal } from './components/modals/LetterModal';
import { CassetteModal } from './components/modals/CassetteModal';
import { PolaroidsModal } from './components/modals/PolaroidsModal';
import { SurpriseModal } from './components/modals/SurpriseModal';
import { CustomizerDrawer } from './components/CustomizerDrawer';

export default function App() {
  const [cardData, setCardData] = useState<CardData>(() => {
    try {
      const saved = localStorage.getItem('user_romantic_card_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved card data:', e);
    }
    return defaultCardData;
  });

  const [activeView, setActiveView] = useState<ActiveView>('closed');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Sync cardData to the backend server file (src/data/defaultCard.ts)
  // so that when deploying to Vercel or opening on a fresh device,
  // the exact user customization is preserved as the default.
  useEffect(() => {
    fetch('/api/save-default-card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cardData),
    }).catch((err) => console.log('Syncing default card to server:', err));
  }, [cardData]);

  const handleUpdateCardData = (updated: CardData) => {
    setCardData(updated);
    try {
      localStorage.setItem('user_romantic_card_data', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save card data to localStorage:', e);
    }
  };

  return (
    <PhoneMockup
      recipientName={cardData.recipientName}
      onOpenCustomizer={() => setIsCustomizerOpen(true)}
      siteUrl="racedigitals.my.canva.site"
    >
      <div className="w-full h-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'closed' && (
            <EnvelopeClosed
              key="closed"
              title={cardData.title}
              recipientName={cardData.recipientName}
              onOpen={() => setActiveView('hub')}
            />
          )}

          {activeView === 'hub' && (
            <EnvelopeOpenHub
              key="hub"
              cardData={cardData}
              onSelectView={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'letter' && (
            <LetterModal
              key="letter"
              cardData={cardData}
              onBack={() => setActiveView('hub')}
            />
          )}

          {activeView === 'cassette' && (
            <CassetteModal
              key="cassette"
              cardData={cardData}
              onBack={() => setActiveView('hub')}
            />
          )}

          {activeView === 'polaroids' && (
            <PolaroidsModal
              key="polaroids"
              cardData={cardData}
              onBack={() => setActiveView('hub')}
            />
          )}

          {activeView === 'surprise' && (
            <SurpriseModal
              key="surprise"
              cardData={cardData}
              onBack={() => setActiveView('hub')}
            />
          )}
        </AnimatePresence>

        {/* Customization Drawer */}
        <CustomizerDrawer
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          cardData={cardData}
          onUpdateCardData={handleUpdateCardData}
        />
      </div>
    </PhoneMockup>
  );
}
