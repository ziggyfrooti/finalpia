# Recommended Bobo States by Screen

This document provides recommendations for which Bobo emotional state to use on each screen in the PIA app.

## Screen-by-Screen Recommendations

### ✅ Already Implemented

| Screen | Current Type | Status | Notes |
|--------|-------------|--------|-------|
| `PartsOfMyDay.tsx` | `happy` | ✅ Good | Perfect for activity selection |
| `AddChildScreen.tsx` | `excited` | ✅ Good | Great for onboarding |
| `MomentCards.tsx` | `thinking` | ✅ Good | Appropriate for loading |
| `CompletionScreen.tsx` | `excited` | ✅ Updated | Changed from "celebrating" to "excited" |

### 💡 Recommendations for Other Screens

| Screen | Recommended Type | Reasoning |
|--------|-----------------|-----------|
| `SplashScreen.tsx` | `idle` or `shy` | First impression - calm welcome or shy greeting |
| `LoginScreen.tsx` | `idle` or `calm` | Neutral, welcoming state |
| `MyDayWelcome.tsx` | `happy` or `idle` | Warm greeting for starting the day |
| `ModeSelector.tsx` | `curious` | Asking user to make a choice |
| `CategoryHub.tsx` | `idle` or `happy` | Neutral or encouraging exploration |

## Contextual State Changes

Consider dynamically changing Bobo's state based on context:

### Loading States
```tsx
// While data is loading
<Mascot type="thinking" size="md" animate={true} />

// After successful load
<Mascot type="happy" size="md" animate={true} />
```

### User Achievements
```tsx
// First time completing something
<Mascot type="excited" size="lg" animate={true} />

// Regular completion
<Mascot type="happy" size="md" animate={true} />

// Streak achievement (3+ days)
<Mascot type="excited" size="lg" animate={true} />
```

### Time of Day
```tsx
// Morning (6am - 12pm)
<Mascot type="happy" size="md" animate={true} />

// Afternoon (12pm - 6pm)
<Mascot type="idle" size="md" animate={true} />

// Evening (6pm - 9pm)
<Mascot type="calm" size="md" animate={true} />

// Night (9pm+)
<Mascot type="sleepy" size="md" animate={true} />
```

### Parent vs Child Mode
```tsx
// Parent Space screens
<Mascot type="calm" size="sm" animate={false} />

// Child Space screens
<Mascot type="idle" size="md" animate={true} />
```

### First Time User Experience
```tsx
// First launch
<Mascot type="shy" size="lg" animate={true} />

// After first activity
<Mascot type="excited" size="lg" animate={true} />
```

## Example Implementation: Dynamic State

```tsx
import { Mascot } from '../components/Mascot';

const MyScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(false);
  
  const getMascotState = () => {
    if (isLoading) return 'thinking';
    if (isFirstTime) return 'shy';
    return 'happy';
  };
  
  return (
    <View>
      <Mascot 
        type={getMascotState()} 
        size="md" 
        animate={!isLoading} 
      />
    </View>
  );
};
```

## Best Practices

1. **Consistency**: Use the same state for similar contexts across the app
2. **Transitions**: Consider smooth transitions between states
3. **Performance**: Use `animate={false}` for static contexts (e.g., parent dashboard)
4. **Context**: Match Bobo's emotion to the user's expected emotional state
5. **Feedback**: Use excited/happy states for positive feedback
6. **Calm**: Use calm/idle for informational or neutral screens

## State Selection Guide

### When to use each state:

- **idle**: Default, neutral screens, home screens, waiting for user action
- **happy**: Positive actions, after saving, encouraging moments
- **curious**: Asking questions, prompting input, exploration
- **thinking**: Loading, processing, waiting for data
- **excited**: Achievements, celebrations, milestones, first-time successes
- **sleepy**: End of day, bedtime, closing screens
- **calm**: Parent space, informational screens, settings
- **shy**: First-time experiences, onboarding, introducing new features

## Migration Checklist

- [x] Update `CompletionScreen.tsx` from "celebrating" to "excited"
- [ ] Review `SplashScreen.tsx` - add appropriate type
- [ ] Review `LoginScreen.tsx` - add appropriate type
- [ ] Review `MyDayWelcome.tsx` - add appropriate type
- [ ] Review `ModeSelector.tsx` - add appropriate type
- [ ] Review `CategoryHub.tsx` - add appropriate type
- [ ] Consider time-based state changes for welcome screens
- [ ] Consider achievement-based state changes
- [ ] Update COMPONENT_GUIDE.md with new Bobo states

## Next Steps

1. Test Bobo on all screens to ensure visual consistency
2. Consider adding sound effects for each emotional state
3. Gather user feedback on Bobo's expressiveness
4. Consider adding subtle micro-animations (e.g., blinking for idle state)
5. Create a storybook or visual guide showing all 8 states side-by-side
