import { CardData } from '../types';

export const defaultCardData: CardData = {
  recipientName: 'Alice',
  senderName: 'Mon Amour',
  title: 'You got a mail!',
  salutation: 'Dear Alice,',
  letterContent: `Happy birthday! Wishing you a day filled with love, laughter and beautiful little moments that make your heart happy.

You bring so much joy, genuine smiles and good things into my life. Thank you for being you, for every sweet memory we share, and for shining so brightly in my world.

I love you more than words can express. ❤️`,
  songTitle: 'L-O-V-E',
  artistName: 'Nat King Cole',
  audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-love-song-114510.mp3',
  surpriseMessage: 'Surprise ! 🎁',
  surpriseSubtext: 'I got you a special gift... Look behind you! I love you so much!',
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
