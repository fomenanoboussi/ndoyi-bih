import { CardData } from '../types';

export const defaultCardData: CardData = {
  recipientName: 'Ma Chérie',
  senderName: 'Mon Amour',
  title: 'Tu as un message !',
  salutation: 'Ma tendre chérie,',
  letterContent: `Mon amour, je voulais te dire à quel point tu es précieuse pour moi. Chaque moment passé à tes côtés illumine mes journées.

Tu apportes tellement de joie, de douceur et de bonheur dans ma vie. Merci d'être la personne extraordinaire que tu es, pour tous nos beaux souvenirs et pour tout l'amour que nous partageons.

Je t'aime plus que les mots ne peuvent l'exprimer. ❤️`,
  songTitle: 'L-O-V-E',
  artistName: 'Nat King Cole',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-love-song-114510.mp3',
  surpriseMessage: 'Une surprise pour toi ! 🎁',
  surpriseSubtext: 'J\'ai un petit cadeau spécial pour toi... Regarde derrière toi ! Je t\'aime fort !',
  themeColor: 'brown',
  polaroids: [
    {
      id: 'p1',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      caption: 'La plus belle femme du monde ✨',
      date: 'Ton doux sourire',
      rotation: -3,
    },
    {
      id: 'p2',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      caption: 'Sublime & rayonnante chaque jour ❤️',
      date: 'Mon ange',
      rotation: 2,
    },
    {
      id: 'p3',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      caption: 'Incomparable beauté à mes yeux 🌹',
      date: 'Pour toujours',
      rotation: -1,
    }
  ]
};
