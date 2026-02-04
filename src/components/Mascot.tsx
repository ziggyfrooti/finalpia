import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Colors } from '../constants/theme';

// Bobo - The friendly mint green blob mascot
interface MascotProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'idle' | 'happy' | 'curious' | 'thinking' | 'excited' | 'sleepy' | 'calm' | 'shy';
  animate?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ 
  size = 'md', 
  type = 'idle',
  animate = true 
}) => {
  const sizeMap = {
    sm: 60,
    md: 80,
    lg: 120,
  };

  const dimension = sizeMap[size];
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) return;

    // Gentle floating animation for idle state
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Bounce for happy/excited states
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: type === 'excited' ? -8 : -4,
          duration: type === 'excited' ? 400 : 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: type === 'excited' ? 400 : 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Gentle pulse for thinking state
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    if (type === 'happy' || type === 'excited') {
      bounce.start();
    } else if (type === 'thinking') {
      pulse.start();
    } else {
      float.start();
    }

    return () => {
      bounce.stop();
      float.stop();
      pulse.stop();
    };
  }, [animate, bounceAnim, floatAnim, pulseAnim, type]);

  const renderBobo = () => {
    // Mint green pastel color for Bobo
    const boboColor = '#B8E6D5'; // Soft mint green
    const boboHighlight = '#D4F1E8'; // Lighter mint
    const eyeColor = '#3D3D3D'; // Charcoal
    const shadowColor = 'rgba(0, 0, 0, 0.08)';
    
    // Adjust body shape based on emotion
    const getBodyPath = () => {
      switch (type) {
        case 'excited':
          // Slightly stretched upward
          return "M 50 15 Q 70 15, 80 35 Q 85 50, 80 65 Q 70 85, 50 85 Q 30 85, 20 65 Q 15 50, 20 35 Q 30 15, 50 15";
        case 'sleepy':
          // Slightly drooped
          return "M 50 20 Q 70 20, 80 40 Q 85 55, 80 70 Q 70 88, 50 88 Q 30 88, 20 70 Q 15 55, 20 40 Q 30 20, 50 20";
        case 'shy':
          // Slightly tilted
          return "M 52 18 Q 72 19, 81 38 Q 86 52, 81 67 Q 71 86, 50 85 Q 29 84, 19 65 Q 14 50, 19 35 Q 29 17, 52 18";
        default:
          // Standard rounded blob
          return "M 50 18 Q 70 18, 80 38 Q 85 52, 80 66 Q 70 86, 50 86 Q 30 86, 20 66 Q 15 52, 20 38 Q 30 18, 50 18";
      }
    };

    // Eyes based on emotion
    const renderEyes = () => {
      switch (type) {
        case 'idle':
        case 'calm':
          // Relaxed, gently blinking eyes
          return (
            <>
              <Circle cx="37" cy="42" r="3.5" fill={eyeColor} />
              <Circle cx="63" cy="42" r="3.5" fill={eyeColor} />
              <Circle cx="38" cy="41" r="1" fill="white" opacity="0.8" />
              <Circle cx="64" cy="41" r="1" fill="white" opacity="0.8" />
            </>
          );
        
        case 'happy':
          // Eyes curved upward (happy eyes)
          return (
            <>
              <Path d="M 33 42 Q 37 39, 41 42" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <Path d="M 59 42 Q 63 39, 67 42" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          );
        
        case 'curious':
          // Slightly larger eyes looking to the side
          return (
            <>
              <Circle cx="36" cy="42" r="4" fill={eyeColor} />
              <Circle cx="62" cy="42" r="4" fill={eyeColor} />
              <Circle cx="37.5" cy="41" r="1.2" fill="white" opacity="0.9" />
              <Circle cx="63.5" cy="41" r="1.2" fill="white" opacity="0.9" />
            </>
          );
        
        case 'thinking':
          // Eyes looking upward
          return (
            <>
              <Circle cx="37" cy="40" r="3.5" fill={eyeColor} />
              <Circle cx="63" cy="40" r="3.5" fill={eyeColor} />
              <Circle cx="38" cy="38.5" r="1" fill="white" opacity="0.8" />
              <Circle cx="64" cy="38.5" r="1" fill="white" opacity="0.8" />
            </>
          );
        
        case 'excited':
          // Wide sparkling eyes
          return (
            <>
              <Circle cx="37" cy="41" r="4.5" fill={eyeColor} />
              <Circle cx="63" cy="41" r="4.5" fill={eyeColor} />
              <Circle cx="39" cy="39" r="1.5" fill="white" opacity="0.95" />
              <Circle cx="65" cy="39" r="1.5" fill="white" opacity="0.95" />
              <Circle cx="37" cy="43" r="0.5" fill="white" opacity="0.7" />
              <Circle cx="63" cy="43" r="0.5" fill="white" opacity="0.7" />
            </>
          );
        
        case 'sleepy':
          // Half-closed eyes
          return (
            <>
              <Path d="M 33 43 Q 37 41, 41 43" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" />
              <Path d="M 59 43 Q 63 41, 67 43" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          );
        
        case 'shy':
          // Gentle, slightly averted eyes
          return (
            <>
              <Circle cx="35" cy="43" r="3" fill={eyeColor} />
              <Circle cx="61" cy="43" r="3" fill={eyeColor} />
              <Circle cx="36" cy="42" r="0.8" fill="white" opacity="0.7" />
              <Circle cx="62" cy="42" r="0.8" fill="white" opacity="0.7" />
            </>
          );
        
        default:
          return null;
      }
    };

    // Mouth based on emotion
    const renderMouth = () => {
      switch (type) {
        case 'idle':
        case 'calm':
          // Small warm smile
          return <Path d="M 40 58 Q 50 62, 60 58" stroke={eyeColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />;
        
        case 'happy':
          // Wider smile
          return <Path d="M 38 58 Q 50 66, 62 58" stroke={eyeColor} strokeWidth="2.2" fill="none" strokeLinecap="round" />;
        
        case 'curious':
          // Small "o" shaped mouth
          return <Circle cx="50" cy="60" r="3" fill={eyeColor} />;
        
        case 'thinking':
          // Tiny neutral smile
          return <Path d="M 42 60 Q 50 62, 58 60" stroke={eyeColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />;
        
        case 'excited':
          // Joyful wide smile
          return (
            <>
              <Path d="M 36 58 Q 50 68, 64 58" stroke={eyeColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          );
        
        case 'sleepy':
          // Gentle calm smile
          return <Path d="M 40 60 Q 50 63, 60 60" stroke={eyeColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />;
        
        case 'shy':
          // Small hesitant smile
          return <Path d="M 42 59 Q 50 62, 58 59" stroke={eyeColor} strokeWidth="1.6" fill="none" strokeLinecap="round" />;
        
        default:
          return null;
      }
    };

    // Sparkles/confetti for excited state
    const renderDecorations = () => {
      if (type === 'excited') {
        return (
          <>
            <Circle cx="20" cy="25" r="1.5" fill="#FFD700" opacity="0.8" />
            <Circle cx="80" cy="30" r="1.2" fill="#FFB6C1" opacity="0.8" />
            <Circle cx="25" cy="70" r="1" fill="#87CEEB" opacity="0.8" />
            <Circle cx="75" cy="68" r="1.3" fill="#FFD700" opacity="0.8" />
            <Path d="M 85 50 L 87 52 L 85 54 L 83 52 Z" fill="#FFB6C1" opacity="0.7" />
            <Path d="M 15 48 L 17 50 L 15 52 L 13 50 Z" fill="#87CEEB" opacity="0.7" />
          </>
        );
      }
      if (type === 'happy') {
        return (
          <>
            <Circle cx="22" cy="35" r="1" fill="#FFD700" opacity="0.6" />
            <Circle cx="78" cy="38" r="0.8" fill="#FFB6C1" opacity="0.6" />
          </>
        );
      }
      return null;
    };
    
    return (
      <Svg width={dimension} height={dimension} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="boboGradient" cx="50%" cy="40%">
            <Stop offset="0%" stopColor={boboHighlight} stopOpacity="1" />
            <Stop offset="70%" stopColor={boboColor} stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <G>
          {/* Soft shadow */}
          <Ellipse cx="50" cy="92" rx="28" ry="4" fill={shadowColor} />
          
          {/* Main body - soft rounded jelly-like blob */}
          <Path d={getBodyPath()} fill="url(#boboGradient)" />
          
          {/* Eyes */}
          {renderEyes()}
          
          {/* Mouth */}
          {renderMouth()}
          
          {/* Decorations (sparkles, confetti) */}
          {renderDecorations()}
        </G>
      </Svg>
    );
  };

  return (
    <Animated.View
      style={[
        styles.mascot,
        {
          transform: [
            { translateY: type === 'happy' || type === 'excited' ? bounceAnim : floatAnim },
            { scale: type === 'thinking' ? pulseAnim : 1 },
          ],
        },
      ]}
    >
      {renderBobo()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
