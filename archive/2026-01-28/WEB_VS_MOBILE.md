# Web vs Mobile - Key Differences

Quick reference for converting PIA web app code to React Native mobile.

## 🎨 UI Component Mapping

### Basic Components

| Web (HTML/React) | Mobile (React Native) |
|-----------------|----------------------|
| `<div>` | `<View>` |
| `<span>`, `<p>`, `<h1>`, `<h2>` | `<Text>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| `<a>` (link) | `<TouchableOpacity>` |
| `<ul>`, `<ol>` | `<View>` + `<FlatList>` or `<ScrollView>` |
| `<li>` | `<View>` |

### Example Conversion

**Web (Next.js):**
```tsx
<div className="container">
  <h1 className="title">Welcome to PIA</h1>
  <p className="subtitle">A calm space for kids</p>
  <button onClick={handleClick}>
    Get Started
  </button>
</div>
```

**Mobile (React Native):**
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Welcome to PIA</Text>
  <Text style={styles.subtitle}>A calm space for kids</Text>
  <TouchableOpacity onPress={handleClick}>
    <Text>Get Started</Text>
  </TouchableOpacity>
</View>
```

---

## 🎨 Styling Differences

### CSS Classes vs StyleSheet

**Web (Tailwind/CSS):**
```tsx
<div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg">
  <h1 className="text-3xl font-bold text-gray-900">Title</h1>
</div>
```

**Mobile (StyleSheet):**
```tsx
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>

const styles = StyleSheet.create({
  container: {
    display: 'flex',        // Default in RN, can omit
    flexDirection: 'column', // Default in RN
    alignItems: 'center',
    gap: 16,                // 4 * 4 (assuming 4px base)
    padding: 24,            // 6 * 4
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  title: {
    fontSize: 28,           // Approximate text-3xl
    fontWeight: 'bold',
    color: '#1E293B',       // gray-900
  },
});
```

### Common Style Property Changes

| CSS Property | React Native |
|--------------|-------------|
| `background-color` | `backgroundColor` |
| `font-size` | `fontSize` |
| `font-weight` | `fontWeight` (string: 'bold', '600', etc.) |
| `margin-top` | `marginTop` |
| `padding-left` | `paddingLeft` |
| `border-radius` | `borderRadius` |
| `flex-direction` | `flexDirection` |
| `align-items` | `alignItems` |
| `justify-content` | `justifyContent` |

### Important Notes

1. **No pixels:** Use numbers directly (not 'px', 'rem', etc.)
   ```tsx
   // Web
   fontSize: '16px'
   
   // Mobile
   fontSize: 16
   ```

2. **camelCase:** All properties use camelCase
   ```tsx
   // Web
   'background-color': 'blue'
   
   // Mobile
   backgroundColor: 'blue'
   ```

3. **Flexbox by default:** All Views use flexbox
   ```tsx
   // Don't need: display: 'flex'
   // Default is: flexDirection: 'column'
   ```

---

## 🎯 Event Handling

| Web | Mobile |
|-----|--------|
| `onClick` | `onPress` |
| `onChange` | `onChangeText` (for TextInput) |
| `onSubmit` | `onPress` (on submit button) |
| `onMouseEnter` | (Not available - use onPressIn) |
| `onMouseLeave` | (Not available - use onPressOut) |
| `onFocus` | `onFocus` ✅ Same |
| `onBlur` | `onBlur` ✅ Same |

**Example:**

```tsx
// Web
<button onClick={() => handleClick()}>Click me</button>
<input onChange={(e) => setText(e.target.value)} />

// Mobile
<TouchableOpacity onPress={() => handleClick()}>
  <Text>Click me</Text>
</TouchableOpacity>
<TextInput onChangeText={(text) => setText(text)} />
```

---

## 🧭 Navigation

### Next.js Router vs React Navigation

**Web (Next.js):**
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navigate
router.push('/parent');
router.back();
router.replace('/login');
```

**Mobile (React Navigation):**
```tsx
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate
navigation.navigate('Parent');
navigation.goBack();
navigation.replace('Login');
```

### Route Parameters

**Web:**
```tsx
// Navigate
router.push('/profile?id=123');

// Get params
const searchParams = useSearchParams();
const id = searchParams.get('id');
```

**Mobile:**
```tsx
// Navigate
navigation.navigate('Profile', { id: 123 });

// Get params
const { id } = route.params;
```

---

## 🎨 Icons & Images

### Icons

**Web (lucide-react):**
```tsx
import { Mail, User, Settings } from 'lucide-react';

<Mail className="w-6 h-6" />
```

**Mobile:**
Options:
1. Use `@expo/vector-icons`
2. Use SVG with `react-native-svg`
3. Use image files

```tsx
// Option 1: Expo Icons
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="mail" size={24} color="black" />

// Option 2: Emoji (simple)
<Text style={{ fontSize: 24 }}>✉️</Text>
```

### Images

**Web:**
```tsx
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

**Mobile:**
```tsx
import { Image } from 'react-native';

<Image 
  source={require('./assets/logo.png')} 
  style={{ width: 100, height: 100 }}
/>

// Or remote URL
<Image 
  source={{ uri: 'https://example.com/logo.png' }}
  style={{ width: 100, height: 100 }}
/>
```

---

## 🎬 Animations

### Framer Motion vs React Native Animated

**Web (framer-motion):**
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Mobile (React Native Animated):**
```tsx
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const fadeAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
}, []);

<Animated.View style={{ opacity: fadeAnim }}>
  <Text>Content</Text>
</Animated.View>
```

**Or use react-native-reanimated (recommended):**
```bash
npm install react-native-reanimated
```

---

## 📝 Forms & Input

### Text Input

**Web:**
```tsx
<input 
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email"
/>
```

**Mobile:**
```tsx
<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### Input Types

| Web type | Mobile keyboardType |
|----------|-------------------|
| `type="email"` | `keyboardType="email-address"` |
| `type="number"` | `keyboardType="numeric"` |
| `type="tel"` | `keyboardType="phone-pad"` |
| `type="password"` | `secureTextEntry={true}` |
| `type="url"` | `keyboardType="url"` |

---

## 🌐 Web-Specific → Mobile Alternative

| Web API/Feature | Mobile Alternative |
|----------------|-------------------|
| `localStorage` | `AsyncStorage` from `@react-native-async-storage/async-storage` |
| `sessionStorage` | `AsyncStorage` (same) |
| `window.location` | `Linking` from 'react-native' |
| `document.cookie` | `AsyncStorage` or secure storage |
| `fetch()` | `fetch()` ✅ Same API! |
| CSS Media Queries | `useWindowDimensions()` hook |
| `alert()` | `Alert.alert()` from 'react-native' |
| `console.log()` | `console.log()` ✅ Same! |

---

## 🎯 Common PIA Components Conversion

### FloatingCard

**Web:**
```tsx
<div className="bg-white rounded-2xl shadow-md p-4">
  {children}
</div>
```

**Mobile:** ✅ Already created
```tsx
<FloatingCard>
  {children}
</FloatingCard>
```

### PiaButton

**Web:**
```tsx
<button 
  className="bg-indigo-500 text-white px-6 py-3 rounded-xl"
  onClick={onPress}
>
  {children}
</button>
```

**Mobile:** ✅ Already created
```tsx
<PiaButton onPress={onPress}>
  {children}
</PiaButton>
```

---

## 📦 Package Replacements

| Web Package | Mobile Alternative |
|-------------|-------------------|
| `next/navigation` | `@react-navigation/native` |
| `framer-motion` | `react-native-reanimated` or `Animated` |
| `lucide-react` | `@expo/vector-icons` or `react-native-svg` |
| `react-hook-form` | `react-hook-form` ✅ Works on RN! |
| `date-fns` | `date-fns` ✅ Works on RN! |
| `clsx` / `classnames` | Not needed (use inline styles) |
| `tailwindcss` | Not available (use StyleSheet) |

---

## ✅ What's the Same?

Good news! These work identically:

- ✅ `useState`, `useEffect`, `useContext` - All React hooks
- ✅ `fetch()` - HTTP requests
- ✅ Firebase SDK - Same API
- ✅ TypeScript - Same language
- ✅ `console.log()` - Debugging
- ✅ `JSON.parse/stringify` - Data parsing
- ✅ Most JavaScript logic

---

## 🎓 Learning Resources

**React Native Docs:**
- https://reactnative.dev/docs/components-and-apis

**Expo Docs:**
- https://docs.expo.dev/

**React Navigation:**
- https://reactnavigation.org/docs/getting-started

**Style Converter:**
- Search "CSS to React Native" online

---

## 💡 Quick Tips

1. **Start simple:** Convert HTML → Views first, style later
2. **Use web for testing:** Faster iteration than mobile simulators
3. **Copy logic directly:** Most JavaScript works as-is
4. **StyleSheet.create:** Define all styles at bottom of file
5. **No hover states:** Design for touch (tap/press only)
6. **Test on real device:** Simulators don't show real performance

---

## 🔄 Step-by-Step Conversion Process

For each web screen:

1. **Copy the file**
   ```bash
   cp ../pia/src/screens/MyScreen.tsx src/screens/
   ```

2. **Change imports**
   ```tsx
   // Remove:
   import { useRouter } from 'next/navigation'
   import { motion } from 'framer-motion'
   
   // Add:
   import { View, Text, StyleSheet } from 'react-native'
   import { useNavigation } from '@react-navigation/native'
   ```

3. **Convert JSX**
   - `<div>` → `<View>`
   - `<p>`, `<h1>` → `<Text>`
   - `<button>` → `<TouchableOpacity>`

4. **Convert styles**
   - Extract className styles
   - Create StyleSheet
   - Apply with style prop

5. **Test**
   ```bash
   npm run web
   ```

6. **Commit**
   ```bash
   git add .
   git commit -m "Add MyScreen"
   ```

Done! Repeat for each screen.

---

**Need help with a specific conversion?**

See the examples in:
- `src/screens/LoginScreen.tsx` - Converted from web
- `src/screens/EmailLoginScreen.tsx` - Converted from web
- `src/components/FloatingCard.tsx` - Converted from web

These show the exact conversion patterns used for PIA!
