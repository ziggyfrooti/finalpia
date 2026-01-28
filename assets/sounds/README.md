# Sound Files for PIA Mobile App

## Required Sound Files

You need to add the following sound files to this directory:

### 1. swipe-yes.wav
- **Purpose**: Plays when user swipes RIGHT (yes/this happened)
- **Duration**: 0.3-0.5 seconds
- **Feel**: Happy, positive, uplifting
- **Recommended sources**:
  - Mixkit: https://mixkit.co/free-sound-effects/notification/
  - Freesound: https://freesound.org/search/?q=positive+chime
  - Search for: "positive chime", "happy ding", "success beep"

### 2. swipe-no.wav
- **Purpose**: Plays when user swipes LEFT (no/didn't happen)
- **Duration**: 0.3-0.5 seconds
- **Feel**: Neutral, soft whoosh (NOT negative!)
- **Recommended sources**:
  - Freesound: https://freesound.org/search/?q=soft+whoosh
  - Zapsplat: https://www.zapsplat.com/
  - Search for: "soft whoosh", "gentle swipe", "neutral swipe"

### 3. category-complete.wav
- **Purpose**: Plays when user completes a category
- **Duration**: 1-2 seconds
- **Feel**: Accomplishment, mini celebration
- **Recommended sources**:
  - Mixkit: https://mixkit.co/free-sound-effects/win/
  - Freesound: https://freesound.org/search/?q=success+chime
  - Search for: "success chime", "level complete", "achievement"

### 4. all-complete.wav
- **Purpose**: Plays on CompletionScreen (all categories done)
- **Duration**: 3-4 seconds
- **Feel**: Big celebration, victory!
- **Recommended sources**:
  - Mixkit: https://mixkit.co/free-sound-effects/fanfare/
  - Freesound: https://freesound.org/search/?q=victory+fanfare
  - Search for: "victory fanfare", "celebration", "big success"

## Sound Specifications

- **Format**: MP3 (best compatibility)
- **Sample Rate**: 22050 Hz or 44100 Hz
- **Bit Rate**: 64-128 kbps (keep files small)
- **File Size**: Aim for <50KB per file
- **Volume**: Normalized (not too loud)

## Quick Free Resources

### Option 1: Mixkit (No attribution required)
1. Visit https://mixkit.co/free-sound-effects/
2. Search for sound types above
3. Download and rename to match filenames
4. Drop into this folder

### Option 2: Freesound (Free with account)
1. Create free account at https://freesound.org/
2. Search for sounds
3. Download (check license - use CC0 or CC-BY)
4. Rename and add to this folder

### Option 3: Zapsplat (Free with account)
1. Create free account at https://www.zapsplat.com/
2. Browse sound effects
3. Download and rename
4. Add to this folder

## Testing Sounds

After adding sound files:
1. Restart the Expo dev server
2. Test swipe sounds in MomentCards
3. Test celebration sound on CompletionScreen
4. Adjust volume if needed in SoundManager.ts

## Current Status

⏳ **Sound files not yet added** - App will work without sounds (graceful fallback)

When you add the 4 sound files above, the app will automatically start using them!
