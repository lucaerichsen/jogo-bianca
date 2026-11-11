// Gerenciador de Áudio & Efeitos Sonoros usando Web Audio API + Player do YouTube
class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ytPlayer = null;
    this.isPlayingMusic = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tocar um bipe harmônico / nota musical sintetizada
  playTone(freq, type = 'sine', duration = 0.15, vol = 0.1, pitchBend = 0) {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchBend !== 0) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(10, freq + pitchBend),
          this.ctx.currentTime + duration
        );
      }

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Erro ao tocar som:', e);
    }
  }

  // Som de passos leves
  playStep(isSnow = false) {
    if (!this.enabled) return;
    this.init();
    const freq = isSnow ? 140 : 180;
    this.playTone(freq, 'triangle', 0.05, 0.03, -40);
  }

  // Som de coletar item doce (Sushi / Brigadeiro)
  playCollect() {
    this.init();
    const now = this.ctx ? this.ctx.currentTime : 0;
    setTimeout(() => this.playTone(523.25, 'sine', 0.1, 0.12), 0); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.12), 80); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.15, 0.15), 160); // G5
    setTimeout(() => this.playTone(1046.50, 'sine', 0.25, 0.15), 240); // C6
  }

  // Som de desbloquear Memória
  playMemoryUnlock() {
    this.init();
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.25, 0.15), i * 90);
    });
  }

  // Som de carinho no pet (Zara ou Jully)
  playPetHeart() {
    this.init();
    this.playTone(600, 'sine', 0.1, 0.1, 200);
    setTimeout(() => this.playTone(850, 'sine', 0.2, 0.12, 100), 90);
  }

  // Latidinho alegre sintetizado
  playBark(isZara = false) {
    this.init();
    if (isZara) {
      // Buldogue francês: tom mais encorpado e fofo
      this.playTone(220, 'sawtooth', 0.08, 0.08, 80);
      setTimeout(() => this.playTone(260, 'triangle', 0.12, 0.07, -40), 90);
    } else {
      // Jully yorkshire: tom mais fininho e alegre
      this.playTone(587.33, 'triangle', 0.06, 0.09, 120);
      setTimeout(() => this.playTone(740, 'sine', 0.09, 0.09, -60), 70);
    }
  }

  // Som de digitação no diálogo
  playTypewriter() {
    this.init();
    this.playTone(480 + Math.random() * 80, 'sine', 0.03, 0.03);
  }

  // Fanfarra triunfal do Baú Final
  playFanfare() {
    this.init();
    const melody = [
      { f: 523.25, d: 150 }, // C5
      { f: 659.25, d: 150 }, // E5
      { f: 783.99, d: 150 }, // G5
      { f: 1046.50, d: 300 }, // C6
      { f: 880, d: 150 }, // A5
      { f: 1046.50, d: 500 } // C6
    ];
    let time = 0;
    melody.forEach((note) => {
      setTimeout(() => this.playTone(note.f, 'sine', note.d / 1000, 0.18), time);
      time += note.d + 30;
    });
  }

  // Som fofo de beijinho
  playKiss() {
    this.init();
    this.playTone(520, 'sine', 0.08, 0.12, 280);
    setTimeout(() => {
      this.playTone(780, 'sine', 0.14, 0.15, 120);
    }, 70);
  }

  // Som de alimentar o pet (mastigadinha alegre e sino)
  playFeed() {
    this.init();
    this.playTone(320, 'triangle', 0.06, 0.1, -80);
    setTimeout(() => this.playTone(400, 'triangle', 0.06, 0.1, -90), 80);
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.12, 100), 180);
  }

  // Som ao dar as mãos
  playHandHold() {
    this.init();
    this.playTone(440, 'sine', 0.15, 0.08, 50);
    setTimeout(() => this.playTone(554.37, 'sine', 0.2, 0.1, 40), 100);
  }

  // Melodia de Conquista desbloqueada
  playAchievement() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.18, 0.14), i * 75);
    });
  }

  // Som de obturador de câmera fotográfica + brilho mágico (para fotos reveladas)
  playPhotoSnap() {
    this.init();
    // Clique do obturador
    this.playTone(800, 'square', 0.04, 0.12, -400);
    setTimeout(() => {
      this.playTone(1200, 'square', 0.05, 0.1, -600);
    }, 45);
    // Brilho harmônico doce de memória revelada
    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.22, 0.12);
      }, 90 + idx * 60);
    });
  }

  // Som ao colher rosa do amor
  playRosePickup() {
    this.init();
    this.playTone(440, 'triangle', 0.08, 0.1, 120);
    setTimeout(() => this.playTone(659.25, 'sine', 0.18, 0.12, 60), 70);
  }

  // Som triunfal e fofo ao presentear o Luca com buquê
  playBouquet() {
    this.init();
    const chords = [
      [523.25, 659.25], // C5 + E5
      [587.33, 698.46], // D5 + F5
      [659.25, 783.99], // E5 + G5
      [783.99, 1046.50] // G5 + C6
    ];
    chords.forEach((chord, i) => {
      setTimeout(() => {
        chord.forEach(f => this.playTone(f, 'sine', 0.25, 0.1));
      }, i * 110);
    });
  }

  // Som suave de desdobrar cartinha de amor
  playLetterOpen() {
    this.init();
    this.playTone(350, 'triangle', 0.07, 0.08, -80);
    setTimeout(() => this.playTone(520, 'sine', 0.14, 0.1, 40), 60);
  }

  // Trilha sonora ambiente suave (fallback em 8-bit lofi caso YouTube não esteja disponível)
  startSynthAmbientMusic() {
    if (this.synthBgmInterval) return;
    this.init();
    const chordProgression = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66]  // G
    ];
    let step = 0;
    this.synthBgmInterval = setInterval(() => {
      if (!this.isPlayingMusic && !this.ytPlayer) {
        const chord = chordProgression[step % chordProgression.length];
        chord.forEach(f => this.playTone(f, 'sine', 0.6, 0.02));
        step++;
      }
    }, 1800);
  }

  // Controle da Música no YouTube (Romântico 2 - Aka Rasta, Veigh)
  initYouTube(player) {
    this.ytPlayer = player;
  }

  toggleMusic() {
    if (!this.ytPlayer) {
      this.isPlayingMusic = !this.isPlayingMusic;
      if (this.isPlayingMusic) {
        this.startSynthAmbientMusic();
      }
      return this.isPlayingMusic;
    }
    try {
      const state = this.ytPlayer.getPlayerState();
      // 1 = playing, 2 = paused
      if (state === 1) {
        this.ytPlayer.pauseVideo();
        this.isPlayingMusic = false;
      } else {
        this.ytPlayer.playVideo();
        this.isPlayingMusic = true;
      }
    } catch (e) {
      console.warn('Erro ao alternar música:', e);
    }
    return this.isPlayingMusic;
  }

  startMusic() {
    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
        this.isPlayingMusic = true;
      } catch (e) {
        console.warn('Aguardando clique para iniciar música');
      }
    }
  }
}

export const sound = new SoundManager();
