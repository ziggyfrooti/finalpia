import { Audio } from 'expo-av';

/**
 * SoundManager - Handles all app sound effects
 *
 * Usage:
 * - Call SoundManager.init() once when app loads
 * - Call SoundManager.play('soundName') to play sounds
 * - Call SoundManager.setEnabled(false) to disable sounds
 */
class SoundManagerClass {
  private sounds: { [key: string]: Audio.Sound | null } = {};
  private enabled: boolean = true;
  private initialized: boolean = false;

  /**
   * Initialize and preload all sounds
   * Call this once when the app starts
   */
  async init() {
    if (this.initialized) return;

    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Preload all sounds
      // Note: Sound files need to be added to assets/sounds/ directory
      // For now, we'll handle the case where files don't exist yet

      try {
        const { sound: swipeYes } = await Audio.Sound.createAsync(
          require('../../assets/sounds/swipe-yes.wav'),
          { shouldPlay: false }
        );
        this.sounds['swipeYes'] = swipeYes;
      } catch (error) {
        console.log('swipe-yes.wav not found - using silence');
        this.sounds['swipeYes'] = null;
      }

      try {
        const { sound: swipeNo } = await Audio.Sound.createAsync(
          require('../../assets/sounds/swipe-no.wav'),
          { shouldPlay: false }
        );
        this.sounds['swipeNo'] = swipeNo;
      } catch (error) {
        console.log('swipe-no.wav not found - using silence');
        this.sounds['swipeNo'] = null;
      }

      try {
        const { sound: categoryComplete } = await Audio.Sound.createAsync(
          require('../../assets/sounds/category-complete.wav'),
          { shouldPlay: false }
        );
        this.sounds['categoryComplete'] = categoryComplete;
      } catch (error) {
        console.log('category-complete.wav not found - using silence');
        this.sounds['categoryComplete'] = null;
      }

      try {
        const { sound: allComplete } = await Audio.Sound.createAsync(
          require('../../assets/sounds/all-complete.wav'),
          { shouldPlay: false }
        );
        this.sounds['allComplete'] = allComplete;
      } catch (error) {
        console.log('all-complete.wav not found - using silence');
        this.sounds['allComplete'] = null;
      }

      this.initialized = true;
      console.log('SoundManager initialized');
    } catch (error) {
      console.error('Failed to initialize SoundManager:', error);
    }
  }

  /**
   * Play a sound by name
   * @param soundKey - Name of the sound to play ('swipeYes', 'swipeNo', 'categoryComplete', 'allComplete')
   */
  async play(soundKey: string) {
    if (!this.enabled) return;
    if (!this.initialized) {
      await this.init();
    }

    const sound = this.sounds[soundKey];
    if (!sound) {
      // Sound file not loaded (file missing or error)
      return;
    }

    try {
      // Replay from the beginning
      await sound.replayAsync();
    } catch (error) {
      console.error(`Failed to play sound: ${soundKey}`, error);
    }
  }

  /**
   * Enable or disable all sounds
   * @param enabled - true to enable sounds, false to disable
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Get current enabled state
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Unload all sounds (cleanup)
   * Call this when app is closing
   */
  async cleanup() {
    for (const key in this.sounds) {
      const sound = this.sounds[key];
      if (sound) {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.error(`Failed to unload sound: ${key}`, error);
        }
      }
    }
    this.sounds = {};
    this.initialized = false;
  }
}

// Export singleton instance
export const SoundManager = new SoundManagerClass();
