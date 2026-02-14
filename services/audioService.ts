
class AudioService {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private musicInterval: any = null;
  private currentTTS: AudioBufferSourceNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(val: boolean) {
    this.muted = val;
    if (val) {
      this.stopMusic();
      this.stopTTS();
    } else {
      this.startMusic();
    }
  }

  private decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private async decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  async playTTS(base64Data: string) {
    if (this.muted) return;
    this.init();
    this.stopTTS();
    
    const bytes = this.decode(base64Data);
    const buffer = await this.decodeAudioData(bytes, this.ctx!, 24000, 1);
    
    const source = this.ctx!.createBufferSource();
    source.buffer = buffer;
    source.connect(this.ctx!.destination);
    source.start();
    this.currentTTS = source;
  }

  stopTTS() {
    if (this.currentTTS) {
      try { this.currentTTS.stop(); } catch(e) {}
      this.currentTTS = null;
    }
  }

  startMusic() {
    if (this.muted || this.musicInterval) return;
    this.init();
    
    // Escala pentatónica de Dó Maior (C4, D4, E4, G4, A4, C5) para um som harmonioso e mágico
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    // Padrão melódico tipo "caixa de música"
    const pattern = [0, 2, 4, 3, 5, 2, 4, 1];
    let step = 0;

    this.musicInterval = setInterval(() => {
      if (this.muted || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      const freq = scale[pattern[step % pattern.length]];
      
      // Camada Principal (Timbre de Marimba/Sino)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.015, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 1.6);

      // Adicionar um leve "brilho" harmónico ocasional (oitava acima)
      if (step % 4 === 0) {
        const sparkle = this.ctx.createOscillator();
        const sparkleGain = this.ctx.createGain();
        sparkle.type = 'triangle';
        sparkle.frequency.setValueAtTime(freq * 2, now);
        sparkleGain.gain.setValueAtTime(0, now);
        sparkleGain.gain.linearRampToValueAtTime(0.005, now + 0.02);
        sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        sparkle.connect(sparkleGain);
        sparkleGain.connect(this.ctx.destination);
        sparkle.start(now);
        sparkle.stop(now + 1);
      }
      
      step++;
    }, 600); // Ritmo ligeiramente mais rápido e fluido
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  playClick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx!.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.1);
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    const now = this.ctx!.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.3);
    });
  }

  playFailure() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx!.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx!.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, this.ctx!.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx!.destination);
    osc.start();
    osc.stop(this.ctx!.currentTime + 0.3);
  }
}

export const audioService = new AudioService();
