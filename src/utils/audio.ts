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

    const ONLINE_FALLBACK = 'https://archive.org/download/perfect-ed-sheeran-lyrics_202202/Perfect%20-%20Ed%20Sheeran%20%28Lyrics%29.mp3';
    const primaryUrl = (url && url.length > 2) ? url : '/perfect.mp3';

    try {
      const audio = new Audio(primaryUrl);
      audio.loop = true;
      audio.volume = 0.7;
      this.externalAudio = audio;
      this.isMusicPlaying = true;

      // Handle loading errors (e.g. if /perfect.mp3 is missing on Vercel deployment)
      audio.onerror = () => {
        if (this.externalAudio && primaryUrl !== ONLINE_FALLBACK) {
          console.warn("Primary audio failed to load. Switching to online fallback URL...");
          this.externalAudio.src = ONLINE_FALLBACK;
          this.externalAudio.load();
          this.externalAudio.play().catch((e) => console.warn("Fallback play error:", e));
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay restriction detected. Waiting for user interaction...", err);
          // Retry playing on user touch or click if blocked by browser policy
          const resumeAudio = () => {
            if (this.externalAudio && this.isMusicPlaying) {
              this.externalAudio.play().catch(() => {});
            }
            window.removeEventListener('click', resumeAudio);
            window.removeEventListener('touchstart', resumeAudio);
          };
          window.addEventListener('click', resumeAudio, { once: true });
          window.addEventListener('touchstart', resumeAudio, { once: true });
        });
      }
    } catch (err) {
      console.error("Audio initialization error:", err);
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
