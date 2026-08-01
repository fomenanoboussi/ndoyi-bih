// Audio Synthesizer & Sound Effects for Romantic Envelope

class SoundManager {
  private ctx: AudioContext | null = null;
  private backgroundMusicSource: AudioBufferSourceNode | null = null;
  private musicGainNode: GainNode | null = null;
  private isMusicPlaying: boolean = false;
  private externalAudio: HTMLAudioElement | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Wax seal breaking sound effect
  playWaxSealBreak() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Ignore audio context errors
    }
  }

  // Open envelope rustle sound
  playEnvelopeOpen() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Soft paper rustle noise
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;
      filter.Q.value = 1.5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Audio error fallback
    }
  }

  // Crisp tape button click
  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // Audio error fallback
    }
  }

  // Toggle cassette background music
  toggleMusic(url?: string): boolean {
    this.initCtx();

    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic(url);
      return true;
    }
  }

  startMusic(url?: string) {
    this.initCtx();
    this.stopMusic();

    if (url && url.length > 5) {
      try {
        this.externalAudio = new Audio(url);
        this.externalAudio.loop = true;
        this.externalAudio.volume = 0.6;
        this.externalAudio.play().catch(() => {
          // Fallback to synthesized melody if external audio fails/CORS blocked
          this.startSynthesizedMelody();
        });
        this.isMusicPlaying = true;
        return;
      } catch {
        this.startSynthesizedMelody();
        return;
      }
    }

    this.startSynthesizedMelody();
  }

  private startSynthesizedMelody() {
    if (!this.ctx) return;

    try {
      // Create a sweet romantic synthesized music loop (C major 7th arpeggios)
      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 493.88, 392.00, 329.63]; // C E G B C B G E
      const tempo = 0.4; // seconds per note

      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.musicGainNode.connect(this.ctx.destination);

      let noteIndex = 0;

      const playNextNote = () => {
        if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIndex], this.ctx.currentTime);

        noteGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + tempo * 0.9);

        osc.connect(noteGain);
        noteGain.connect(this.musicGainNode);

        osc.start();
        osc.stop(this.ctx.currentTime + tempo * 0.95);

        noteIndex = (noteIndex + 1) % notes.length;

        if (this.isMusicPlaying) {
          setTimeout(playNextNote, tempo * 1000);
        }
      };

      this.isMusicPlaying = true;
      playNextNote();
    } catch {
      // Audio fallback
    }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.externalAudio) {
      this.externalAudio.pause();
      this.externalAudio = null;
    }
    if (this.backgroundMusicSource) {
      try {
        this.backgroundMusicSource.stop();
      } catch {
        // Ignore
      }
      this.backgroundMusicSource = null;
    }
  }

  getPlayingState(): boolean {
    return this.isMusicPlaying;
  }
}

export const soundFx = new SoundManager();
