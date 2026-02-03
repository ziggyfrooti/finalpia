import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  animate?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ 
  size = 'md', 
  type = 'happy',
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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animate) return;

    // Bounce animation
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    // Float/sway animation
    const float = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 5,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    // Gentle rotation
    const rotate = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -0.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    bounce.start();
    float.start();
    rotate.start();

    return () => {
      bounce.stop();
      float.stop();
      rotate.stop();
    };
  }, [animate, bounceAnim, floatAnim, rotateAnim]);

  const renderMascot = () => {
    // Simple cute character - a friendly blob character
    const scale = dimension / 100;
    
    return (
      <Svg width={dimension} height={dimension} viewBox="0 0 100 100">
        <G>
          {/* Shadow */}
          <Ellipse cx="50" cy="90" rx="30" ry="5" fill="rgba(0,0,0,0.1)" />
          
          {/* Main body */}
          <Circle cx="50" cy="50" r="35" fill={Colors.primary} />
          
          {/* Cheeks */}
          <Circle cx="30" cy="55" r="8" fill={Colors.primaryLight} opacity="0.7" />
          <Circle cx="70" cy="55" r="8" fill={Colors.primaryLight} opacity="0.7" />
          
          {/* Eyes */}
          {type === 'happy' && (
            <>
              <Circle cx="38" cy="42" r="4" fill={Colors.text} />
              <Circle cx="62" cy="42" r="4" fill={Colors.text} />
              <Circle cx="39" cy="41" r="1.5" fill="white" />
              <Circle cx="63" cy="41" r="1.5" fill="white" />
            </>
          )}
          
          {type === 'excited' && (
            <>
              <Circle cx="38" cy="40" r="5" fill={Colors.text} />
              <Circle cx="62" cy="40" r="5" fill={Colors.text} />
              <Circle cx="40" cy="38" r="2" fill="white" />
              <Circle cx="64" cy="38" r="2" fill="white" />
            </>
          )}
          
          {type === 'thinking' && (
            <>
              <Ellipse cx="38" cy="42" rx="4" ry="3" fill={Colors.text} />
              <Ellipse cx="62" cy="42" rx="4" ry="3" fill={Colors.text} />
            </>
          )}
          
          {type === 'celebrating' && (
            <>
              <Path d="M 33 42 Q 38 38, 43 42" stroke={Colors.text} strokeWidth="2" fill="none" />
              <Path d="M 57 42 Q 62 38, 67 42" stroke={Colors.text} strokeWidth="2" fill="none" />
            </>
          )}
          
          {/* Mouth */}
          {(type === 'happy' || type === 'excited') && (
            <Path 
              d="M 35 58 Q 50 68, 65 58" 
              stroke={Colors.text} 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
            />
          )}
          
          {type === 'thinking' && (
            <Ellipse cx="50" cy="60" rx="8" ry="5" fill={Colors.text} />
          )}
          
          {type === 'celebrating' && (
            <>
              <Path 
                d="M 30 58 Q 50 70, 70 58" 
                stroke={Colors.text} 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round"
              />
              <Circle cx="50" cy="62" r="4" fill={Colors.text} />
            </>
          )}
          
          {/* Ears/antenna */}
          <Circle cx="20" cy="30" r="8" fill={Colors.secondary} />
          <Circle cx="80" cy="30" r="8" fill={Colors.secondary} />
          <Circle cx="20" cy="30" r="4" fill={Colors.accent4} />
          <Circle cx="80" cy="30" r="4" fill={Colors.accent4} />
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
            { translateY: bounceAnim },
            { translateX: floatAnim },
            { rotate: rotateAnim.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-10deg', '10deg']
              })
            },
          ],
        },
      ]}
    >
      {renderMascot()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mascot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
