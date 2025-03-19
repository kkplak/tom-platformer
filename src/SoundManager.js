import jumpSound from "./assets/jump.mp3";
import attackSound from "./assets/attack.mp3";
import coinSound from "./assets/coin.mp3";
import jetPack from "./assets/jetpack.mp3";
import colide from "./assets/colide.mp3";
import tick from "./assets/tick.mp3";

export default class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = true;
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.bufferList = {};
    this.lastPlayed = {};
    this.playingSources = {}; // Object to keep track of active audio sources
    this.loadSounds();
  }

  loadSounds() {
    const soundFiles = {
      jump: jumpSound,
      attack: attackSound,
      coin: coinSound,
      footstep: jumpSound,
      jetPack: jetPack,
      colide: colide,
      tick: tick,
    };

    const promises = Object.keys(soundFiles).map((key) => {
      return fetch(soundFiles[key])
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
          this.bufferList[key] = audioBuffer;
        })
        .catch((error) => {
          console.error(`Error loading sound "${key}":`, error);
        });
    });

    Promise.all(promises).then(() => {
      console.log("All sounds loaded");
    });
  }

  play(soundName, options = {}) {
    if (this.enabled && this.bufferList[soundName]) {
      const now = this.audioContext.currentTime * 1000; // Convert to milliseconds
      const lastTime = this.lastPlayed[soundName] || 0;
      const timeSinceLastPlay = now - lastTime;

      const minInterval = options.minInterval || 0; // Minimum interval in milliseconds

      if (timeSinceLastPlay < minInterval) {
        // Not enough time has passed; do not play the sound
        return null;
      }

      this.lastPlayed[soundName] = now; // Update the last played time

      const source = this.audioContext.createBufferSource();
      source.buffer = this.bufferList[soundName];
      source.connect(this.audioContext.destination);

      if (options.loop) {
        source.loop = true;
        this.playingSources[soundName] = source; // Store the source for later stopping
      }

      source.start(0);
      return source;
    } else {
      console.warn(`Sound "${soundName}" is not enabled or not loaded.`);
      return null;
    }
  }

  // Add the stop method to stop a playing sound
  stop(soundName) {
    if (this.playingSources[soundName]) {
      this.playingSources[soundName].stop();
      delete this.playingSources[soundName];
    }
  }

  toggleMute() {
    this.enabled = !this.enabled;
  }
}
