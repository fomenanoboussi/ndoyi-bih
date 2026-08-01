import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Heart, Image as ImageIcon, Music, Gift, Type, RefreshCw, Plus, Trash2, Check } from 'lucide-react';
import { CardData, PolaroidMemory } from '../types';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cardData: CardData;
  onUpdateCardData: (data: CardData) => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  cardData,
  onUpdateCardData,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'polaroids' | 'music' | 'surprise'>('letter');
  const [localData, setLocalData] = useState<CardData>(cardData);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiOccasion, setAiOccasion] = useState<string>('Anniversaire');
  const [aiMemories, setAiMemories] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    onUpdateCardData(localData);
    setSaveSuccess(true);
    
    // Explicitly push to server API so src/data/defaultCard.ts is updated on disk
    try {
      await fetch('/api/save-default-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData),
      });
    } catch (e) {
      console.error('Error saving default card to disk:', e);
    }

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  // AI Love Letter Generation via Server API
  const handleGenerateAiLetter = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: localData.recipientName || 'Mon Amour',
          occasion: aiOccasion,
          keyMemories: aiMemories,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLocalData((prev) => ({
          ...prev,
          salutation: data.salutation,
          letterContent: data.letterContent,
        }));
      }
    } catch (err) {
      console.error('Error generating AI letter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File, i: number) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          if (typeof index === 'number' && i === 0) {
            // Replace specific index
            const updated = [...localData.polaroids];
            updated[index] = { ...updated[index], imageUrl: resultUrl };
            setLocalData((prev) => ({ ...prev, polaroids: updated }));
          } else {
            // Append as new polaroid
            const beautyCaptions = [
              'Tellement belle mon amour ✨',
              'Sublime sous tous les angles 🌹',
              'La plus magnifique à mes yeux ❤️',
              'Ton sourire est une merveille 😍',
              'Incomparable beauté 💕'
            ];
            const randomCaption = beautyCaptions[i % beautyCaptions.length];

            const newPolaroid: PolaroidMemory = {
              id: `p_upload_${Date.now()}_${i}`,
              imageUrl: resultUrl,
              caption: randomCaption,
              date: 'Mon ange',
              rotation: Math.floor(Math.random() * 6) - 3,
            };
            setLocalData((prev) => ({ ...prev, polaroids: [...prev.polaroids, newPolaroid] }));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpdatePolaroid = (index: number, field: keyof PolaroidMemory, value: string) => {
    const updated = [...localData.polaroids];
    updated[index] = { ...updated[index], [field]: value };
    setLocalData({ ...localData, polaroids: updated });
  };

  const handleAddPolaroid = () => {
    const newPolaroid: PolaroidMemory = {
      id: `p_${Date.now()}`,
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      caption: 'Sublime sous tous les angles 🌹',
      date: 'Mon amour',
      rotation: Math.floor(Math.random() * 6) - 3,
    };
    setLocalData({ ...localData, polaroids: [...localData.polaroids, newPolaroid] });
  };

  const handleRemovePolaroid = (index: number) => {
    const updated = localData.polaroids.filter((_, i) => i !== index);
    setLocalData({ ...localData, polaroids: updated });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-lg h-full bg-[#fcf8f2] text-[#3d2b22] shadow-2xl flex flex-col border-l border-[#e3d7c5] font-sans"
          >
            {/* Drawer Header */}
            <div className="p-4 bg-[#543528] text-[#f4ebe1] flex items-center justify-between border-b border-[#6f4838]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#e8a3a3] fill-[#e8a3a3]" />
                <h2 className="font-serif font-bold text-base sm:text-lg">
                  Personnaliser la Lettre pour {localData.recipientName}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-[#d8c5b0] hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#e8ded0] bg-[#f4ebe1] text-xs font-semibold">
              <button
                onClick={() => setActiveTab('letter')}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
                  activeTab === 'letter'
                    ? 'border-[#8c4636] text-[#8c4636] bg-[#fcf8f2]'
                    : 'border-transparent text-[#8c7467] hover:text-[#3d2b22]'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Lettre & Textes</span>
              </button>

              <button
                onClick={() => setActiveTab('polaroids')}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
                  activeTab === 'polaroids'
                    ? 'border-[#8c4636] text-[#8c4636] bg-[#fcf8f2]'
                    : 'border-transparent text-[#8c7467] hover:text-[#3d2b22]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos ({localData.polaroids.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('music')}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
                  activeTab === 'music'
                    ? 'border-[#8c4636] text-[#8c4636] bg-[#fcf8f2]'
                    : 'border-transparent text-[#8c7467] hover:text-[#3d2b22]'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Musique</span>
              </button>

              <button
                onClick={() => setActiveTab('surprise')}
                className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
                  activeTab === 'surprise'
                    ? 'border-[#8c4636] text-[#8c4636] bg-[#fcf8f2]'
                    : 'border-transparent text-[#8c7467] hover:text-[#3d2b22]'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Surprise</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* TAB 1: LETTER & AI GENERATOR */}
              {activeTab === 'letter' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#665144] mb-1">
                        Prénom de ta copine
                      </label>
                      <input
                        type="text"
                        value={localData.recipientName}
                        onChange={(e) => setLocalData({ ...localData, recipientName: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#665144] mb-1">
                        Ton prénom / Surnom
                      </label>
                      <input
                        type="text"
                        value={localData.senderName}
                        onChange={(e) => setLocalData({ ...localData, senderName: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                      />
                    </div>
                  </div>

                  {/* Gemini AI Letter Generator Box */}
                  <div className="p-3.5 bg-gradient-to-r from-[#f7e8e8] to-[#fceee2] rounded-xl border border-[#e5bebe] space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#913840]">
                      <Sparkles className="w-4 h-4 text-[#d9777f]" />
                      <span>Assistant IA Gemini - Rédiger une lettre personnalisée</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-[#7a484c]">Occasion</label>
                        <select
                          value={aiOccasion}
                          onChange={(e) => setAiOccasion(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white rounded border border-[#e2bcbc] text-xs"
                        >
                          <option value="Anniversaire">Anniversaire 🎂</option>
                          <option value="Saint-Valentin">Saint-Valentin 🌹</option>
                          <option value="Anniversaire de rencontre">Nos X ans de rencontre 💕</option>
                          <option value="Juste pour lui dire je t'aime">Juste pour lui dire je t'aime ❤️</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#7a484c]">Détails / Souvenirs</label>
                        <input
                          type="text"
                          placeholder="Ex: notre voyage à Rome, ses yeux..."
                          value={aiMemories}
                          onChange={(e) => setAiMemories(e.target.value)}
                          className="w-full px-2 py-1.5 bg-white rounded border border-[#e2bcbc] text-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateAiLetter}
                      disabled={isGenerating}
                      className="w-full py-2 bg-[#913840] hover:bg-[#a6434c] text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Rédaction par l'IA en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Générer une magnifique lettre avec l'IA</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Titre d'introduction (Salutation)
                    </label>
                    <input
                      type="text"
                      value={localData.salutation}
                      onChange={(e) => setLocalData({ ...localData, salutation: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f] font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Contenu de la lettre
                    </label>
                    <textarea
                      rows={8}
                      value={localData.letterContent}
                      onChange={(e) => setLocalData({ ...localData, letterContent: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f] font-serif leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: POLAROID PHOTOS */}
              {activeTab === 'polaroids' && (
                <div className="space-y-4">
                  <div className="p-3 bg-[#f3e9dc] rounded-xl border border-[#d8c8b4] space-y-2">
                    <p className="text-xs text-[#543528] font-semibold">
                      📸 Importer tes vraies photos depuis ton téléphone / ordinateur :
                    </p>
                    <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#8c4636] hover:bg-[#a35240] text-white text-xs font-bold rounded-lg cursor-pointer shadow transition">
                      <ImageIcon className="w-4 h-4" />
                      <span>Choisir des photos dans ma galerie</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#665144] font-medium">
                      Photos actuelles ({localData.polaroids.length}) :
                    </p>
                    <button
                      onClick={handleAddPolaroid}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#543528] text-white text-xs font-semibold rounded-lg hover:bg-[#684334] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter avec URL</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localData.polaroids.map((p, index) => (
                      <div
                        key={p.id || index}
                        className="p-3 bg-white rounded-xl border border-[#e2d5c3] shadow-2xs space-y-2 relative"
                      >
                        <div className="flex gap-3 items-center">
                          <div className="relative group/img">
                            <img
                              src={p.imageUrl}
                              alt="preview"
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 object-cover rounded-md border border-[#c4b29d]"
                            />
                            <label className="absolute inset-0 bg-black/50 text-white text-[10px] flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer rounded-md transition">
                              <span>Changer</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, index)}
                                className="hidden"
                              />
                            </label>
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] font-bold text-[#8c4636] cursor-pointer underline">
                                📤 Importer une photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, index)}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            <input
                              type="text"
                              placeholder="Ou colle une URL d'image"
                              value={p.imageUrl.startsWith('data:') ? '[Photo importée]' : p.imageUrl}
                              onChange={(e) => handleUpdatePolaroid(index, 'imageUrl', e.target.value)}
                              className="w-full px-2 py-1 text-[11px] bg-[#fdfbf7] rounded border border-[#d8cbbd]"
                            />

                            <input
                              type="text"
                              placeholder="Légende sous la photo (ex: Notre voyage)"
                              value={p.caption}
                              onChange={(e) => handleUpdatePolaroid(index, 'caption', e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-[#fdfbf7] rounded border border-[#d8cbbd] font-serif font-medium"
                            />
                          </div>

                          {localData.polaroids.length > 1 && (
                            <button
                              onClick={() => handleRemovePolaroid(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MUSIC */}
              {activeTab === 'music' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Titre de la chanson
                    </label>
                    <input
                      type="text"
                      value={localData.songTitle}
                      onChange={(e) => setLocalData({ ...localData, songTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Artiste
                    </label>
                    <input
                      type="text"
                      value={localData.artistName}
                      onChange={(e) => setLocalData({ ...localData, artistName: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Fichier Audio MP3 / URL (Optionnel)
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={localData.audioUrl || ''}
                      onChange={(e) => setLocalData({ ...localData, audioUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                    />
                    <p className="text-[11px] text-[#8c7467] mt-1">
                      Si l'URL est vide, une douce mélodie acoustique synthétisée sera jouée automatiquement.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: SURPRISE */}
              {activeTab === 'surprise' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Titre de la surprise
                    </label>
                    <input
                      type="text"
                      value={localData.surpriseMessage}
                      onChange={(e) => setLocalData({ ...localData, surpriseMessage: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#665144] mb-1">
                      Texte de l'ourson / Indice
                    </label>
                    <textarea
                      rows={4}
                      value={localData.surpriseSubtext}
                      onChange={(e) => setLocalData({ ...localData, surpriseSubtext: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-lg border border-[#d8cbbd] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#d9777f]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer Save Button */}
            <div className="p-4 bg-[#f4ebe1] border-t border-[#e8ded0] flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#665144] hover:text-black"
              >
                Annuler
              </button>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#543528] hover:bg-[#684334] text-[#f4ebe1] font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
              >
                {saveSuccess ? <Check className="w-4 h-4 text-green-400" /> : <Heart className="w-4 h-4 text-[#e8a3a3]" />}
                <span>{saveSuccess ? 'Enregistré dans le projet !' : 'Enregistrer dans le projet'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
