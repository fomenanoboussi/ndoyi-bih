export type ActiveView = 'closed' | 'hub' | 'letter' | 'cassette' | 'polaroids' | 'surprise';

export interface PolaroidMemory {
  id: string;
  imageUrl: string;
  caption: string;
  date?: string;
  rotation?: number; // aesthetic tilt angle
}

export interface CardData {
  recipientName: string;
  senderName: string;
  title: string; // e.g. "You got a mail!"
  salutation: string; // e.g. "Dear Alice," / "Chérie,"
  letterContent: string;
  songTitle: string;
  artistName: string;
  audioUrl?: string; // Optional custom audio URL or preset synthesized music
  surpriseMessage: string;
  surpriseSubtext: string;
  themeColor: 'brown' | 'pink' | 'red' | 'lavender';
  polaroids: PolaroidMemory[];
}

export interface SoundEffects {
  playSealBreak: () => void;
  playOpenEnvelope: () => void;
  playButtonClick: () => void;
  playTapeClick: () => void;
}
