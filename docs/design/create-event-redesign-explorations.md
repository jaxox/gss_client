# Create Event Wizard - Design Redesign Explorations

**Created:** November 14, 2025  
**Designer:** Sally (UX Designer Agent)  
**Objective:** Modernize the 4-step Create Event wizard with premium 2025 aesthetics

---

## 🎯 Design Goal

Transform the functional but "plain, stock, and boxy" wizard into a **modern, premium, high-end mobile experience** inspired by Airbnb, ClassPass, Headspace, and Strava.

### Key Improvements Across All Explorations

1. **Header + Progress** - Integrated gradient header with smooth segmented progress bar
2. **Input Fields** - Filled variants with soft backgrounds, clean focus states
3. **Sport Cards** - Glassmorphism effects, better shadows, polished active states
4. **Buttons** - Gradient primary buttons, clear hierarchy, increased depth
5. **Typography** - Stronger hierarchy with better weight contrast
6. **Spacing** - Tighter, more intentional rhythm (12-16px mix)
7. **Review Card** - Premium summary with color-coded sections and iconography

---

## Exploration 1: Modern Minimal 🌊

**Personality:** Clean, Airy, Effortless  
**Inspired by:** Airbnb + Headspace  
**Best for:** Trust & Approachability

### Visual Characteristics

**Color Palette:**

- Primary: Blue gradient (#3b82f6 → #2563eb)
- Backgrounds: Light blue tints (#f0f9ff, #e0f2fe)
- Surfaces: Soft gray (#f8fafc)
- Accents: Minimal, blue-focused

**Typography:**

- Headlines: 26px, weight 700, tight letter-spacing (-0.5px)
- Subheads: 14px, weight 400, comfortable leading
- Labels: 13px, weight 600, uppercase with spacing
- Body: 15px, weight 500

**Progress Indicator:**

- Segmented bar (4 segments)
- White active segments with glow effect
- Shimmer animation on active segments
- Centered "STEP X OF 4" label above

**Input Fields:**

- Filled style with light background (#f8fafc)
- 12px border-radius
- 2px transparent border → blue on focus
- Soft blue focus glow (rgba(59,130,246,0.1))
- 14px padding vertical, 16px horizontal

**Sport Cards:**

- 90px min-width, 16px padding
- Light background, subtle border
- Selected: Blue gradient background
- Shadow: 0 8px 16px rgba(59,130,246,0.2)
- Hover lift: translateY(-2px)

**Buttons:**

- Primary: Blue gradient with depth shadow
- Secondary: Light gray (#f1f5f9)
- 12px border-radius
- Hover: Lift effect (translateY(-2px))
- Primary takes 2x width of secondary

**Review Card:**

- Gradient background (#f0f9ff → #e0f2fe)
- 16px border-radius, 20px padding
- Section titles: 12px, uppercase, blue
- Emoji prefixes for visual interest
- Gradient dividers between sections

### React Native Paper Implementation

```tsx
// Theme customization
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6',
    primaryContainer: '#dbeafe',
    surface: '#f8fafc',
    surfaceVariant: '#f1f5f9',
  },
  roundness: 12,
};

// Custom styled components
const FilledInput = styled(TextInput)`
  background-color: #f8fafc;
  border-radius: 12px;
`;

const GradientButton = styled(Button).attrs({
  mode: 'contained',
  contentStyle: { paddingVertical: 6 },
  labelStyle: { fontSize: 15, fontWeight: '600' },
})``;
```

---

## Exploration 2: Premium Athletic 💪

**Personality:** Bold, Energetic, Confident  
**Inspired by:** Strava + Nike  
**Best for:** Active, Sports-Focused Users

### Visual Characteristics

**Color Palette:**

- Primary: Vibrant blue (#2563eb) + orange accents (#f97316)
- Backgrounds: Dark surfaces with depth (#18181b, #27272a)
- Contrast: High contrast white on dark
- Accents: Orange for CTAs and highlights

**Typography:**

- Headlines: 28px, weight 800, aggressive tracking
- Subheads: 15px, weight 600, all-caps labels
- Labels: 12px, weight 700, uppercase tracking
- Body: 16px, weight 500

**Progress Indicator:**

- Thick bar (6px height) with rounded caps
- Orange gradient on completed segments
- Bold numeric indicators (1/2/3/4)
- Progress percentage shown

**Input Fields:**

- Bordered style with subtle shadow
- Dark border (#27272a), 14px radius
- Focus: Orange border (#f97316)
- Inner shadow on focus for depth
- Bold labels with orange asterisks

**Sport Cards:**

- 100px cards with bold icons
- Dark backgrounds with orange borders when selected
- Selected: Orange left border accent (4px)
- Drop shadow: 0 4px 12px rgba(0,0,0,0.15)
- Bold uppercase labels

**Buttons:**

- Primary: Orange gradient (#f97316 → #ea580c)
- Secondary: Dark outline with white text
- 14px border-radius, bold font
- Primary: 3D depth shadow effect
- Hover: Scale up (1.02) + deeper shadow

**Review Card:**

- Dark card (#27272a) with orange accents
- 20px border-radius, 24px padding
- Orange vertical accent bars (4px)
- Bold section headers with icons
- White text with high contrast

### React Native Paper Implementation

```tsx
// Athletic theme
const athleticTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#f97316',
    primaryContainer: '#ea580c',
    secondary: '#2563eb',
    surface: '#27272a',
    background: '#18181b',
  },
  roundness: 14,
};

// Bold components
const BoldInput = styled(TextInput).attrs({
  mode: 'outlined',
  outlineStyle: { borderWidth: 2 },
})``;

const OrangeButton = styled(Button).attrs({
  buttonColor: '#f97316',
  textColor: 'white',
  labelStyle: { fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
})``;
```

---

## Exploration 3: Refined Professional 🎩

**Personality:** Sophisticated, Trust-Building, Polished  
**Inspired by:** Airbnb + ClassPass  
**Best for:** Premium, Quality-Focused Experience

### Visual Characteristics

**Color Palette:**

- Primary: Deep blue (#1e40af) + purple accents (#7c3aed)
- Backgrounds: Warm grays (#fafaf9, #f5f5f4)
- Surfaces: Pure white with soft shadows
- Accents: Purple for premium moments

**Typography:**

- Headlines: 24px, weight 600, refined spacing
- Subheads: 13px, weight 500, elegant leading
- Labels: 12px, weight 600, subtle tracking
- Body: 15px, weight 400, comfortable reading

**Progress Indicator:**

- Elegant circular steps with connecting lines
- Filled circles for completed steps
- Purple fill animation
- Subtle shadow under active step
- Step names shown below circles

**Input Fields:**

- Hybrid: Subtle border + light fill
- 1px border (#e7e5e4), white background
- 10px border-radius for refined look
- Focus: Purple border + soft purple glow
- Floating labels that animate up

**Sport Cards:**

- 95px cards with refined styling
- White background, subtle border (#e7e5e4)
- Selected: Purple ring (2px) + light purple fill
- Soft shadow: 0 2px 8px rgba(0,0,0,0.06)
- Hover: Subtle lift + border color change

**Buttons:**

- Primary: Solid purple (#7c3aed)
- Secondary: Light gray outline
- 10px border-radius for elegance
- Subtle gradient overlay on hover
- Smooth transitions (0.3s ease)

**Review Card:**

- White card with sophisticated shadow
- 16px border-radius, 24px padding
- Purple accent pills for categories
- Structured grid layout
- Icon badges for visual hierarchy

### React Native Paper Implementation

```tsx
// Professional theme
const professionalTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7c3aed',
    primaryContainer: '#f3e8ff',
    secondary: '#1e40af',
    surface: '#ffffff',
    surfaceVariant: '#fafaf9',
    outline: '#e7e5e4',
  },
  roundness: 10,
};

// Refined components
const RefinedInput = styled(TextInput).attrs({
  mode: 'outlined',
  outlineColor: '#e7e5e4',
  activeOutlineColor: '#7c3aed',
})`
  background-color: white;
`;

const PurpleButton = styled(Button).attrs({
  mode: 'contained',
  buttonColor: '#7c3aed',
  labelStyle: { fontSize: 15, fontWeight: '600' },
})``;
```

---

## 📊 Comparison Matrix

| Aspect              | Modern Minimal | Premium Athletic | Refined Professional |
| ------------------- | -------------- | ---------------- | -------------------- |
| **Vibe**            | Calm, Easy     | Bold, Energetic  | Elegant, Trust       |
| **Color Intensity** | Soft           | High             | Medium               |
| **Border Radius**   | 12px           | 14px             | 10px                 |
| **Shadow Depth**    | Light          | Medium           | Subtle               |
| **Best Platform**   | Mobile-first   | Fitness apps     | Web + Mobile         |
| **Button Style**    | Gradient       | 3D Solid         | Flat Refined         |
| **Progress**        | Segments       | Bar + Numbers    | Circles + Labels     |

---

## 🛠️ Implementation Guide

### Step 1: Update Theme Configuration

```tsx
// mobile/src/theme/customTheme.ts
import { MD3LightTheme } from 'react-native-paper';

export const gssTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Choose from exploration 1, 2, or 3
    primary: '#3b82f6', // Modern Minimal
    // OR
    // primary: '#f97316', // Premium Athletic
    // OR
    // primary: '#7c3aed', // Refined Professional
  },
  roundness: 12, // Adjust based on chosen exploration
};
```

### Step 2: Create Reusable Components

```tsx
// mobile/src/components/themed/StyledInput.tsx
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export const StyledInput = props => (
  <TextInput
    {...props}
    mode="flat" // Change to 'outlined' for Athletic or Professional
    style={[styles.input, props.style]}
  />
);

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 2,
  },
});
```

### Step 3: Update Progress Component

```tsx
// mobile/src/components/ProgressIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <View style={styles.container}>
    <Text variant="labelSmall" style={styles.label}>
      STEP {currentStep} OF {totalSteps}
    </Text>
    <View style={styles.bar}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <View key={i} style={[styles.segment, i < currentStep && styles.segmentActive]} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  bar: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  segment: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: 'white',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
});
```

### Step 4: Sport Card Component

```tsx
// mobile/src/components/SportCard.tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const SportCard = ({ sport, selected, onPress }) => (
  <Pressable onPress={onPress}>
    <Card
      mode="elevated"
      style={[styles.card, selected && styles.cardSelected]}
      elevation={selected ? 4 : 1}
    >
      <Card.Content style={styles.content}>
        <Icon name={sport.icon} size={32} color={selected ? '#3b82f6' : '#666'} />
        <Text variant="labelSmall" style={[styles.label, selected && styles.labelSelected]}>
          {sport.label}
        </Text>
      </Card.Content>
    </Card>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    minWidth: 90,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cardSelected: {
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  label: {
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
  labelSelected: {
    color: '#1e40af',
  },
});
```

### Step 5: Gradient Button (iOS/Android compatible)

```tsx
// mobile/src/components/GradientButton.tsx
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

export const GradientButton = ({ onPress, children, disabled }) => (
  <Pressable onPress={onPress} disabled={disabled} style={{ flex: 2 }}>
    <LinearGradient
      colors={['#3b82f6', '#2563eb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text variant="labelLarge" style={styles.text}>
        {children}
      </Text>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
```

---

## 🎨 Visual Assets Needed

1. **Install react-native-linear-gradient:**

   ```bash
   npm install react-native-linear-gradient
   cd ios && pod install
   ```

2. **Custom Icons (Optional):**
   - Replace emoji sport icons with vector icons
   - Use @expo/vector-icons or custom SVG

3. **Shadow Presets:**
   ```tsx
   export const shadows = {
     sm: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.06,
       shadowRadius: 8,
       elevation: 2,
     },
     md: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 4 },
       shadowOpacity: 0.08,
       shadowRadius: 12,
       elevation: 4,
     },
     lg: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 8 },
       shadowOpacity: 0.12,
       shadowRadius: 16,
       elevation: 6,
     },
   };
   ```

---

## 📈 Next Steps

1. **Choose Your Exploration:** Review all 3 and pick the one that best fits GSS Client's brand
2. **View Interactive Mockup:** Open `/docs/design/explorations/exploration-1-modern-minimal.html` in browser
3. **Implement Incrementally:**
   - Phase 1: Theme + Progress (1 day)
   - Phase 2: Input Fields + Buttons (1 day)
   - Phase 3: Sport Cards + Review Screen (2 days)
4. **Test on Device:** Verify shadows, gradients, and animations on iOS and Android
5. **Gather Feedback:** Show to stakeholders before full rollout

---

## 💡 Design Rationale

### Why These Improvements Matter

**Segmented Progress Bar:**

- Clearer visual feedback than dots
- Animated shimmer creates premium feel
- Users instantly know where they are

**Filled Input Fields:**

- Less visual noise than heavy borders
- Modern 2025 aesthetic (used by Airbnb, Notion)
- Better touch targets on mobile

**Glassmorphism Sport Cards:**

- Premium depth without being heavy
- Clear selected state through color + shadow
- Smooth animations feel responsive

**Gradient Buttons:**

- Creates visual hierarchy (primary vs secondary)
- Depth suggests "pressability"
- Modern standard in top apps

**Premium Review Card:**

- Makes final step feel important
- Color-coded sections aid scanning
- Emoji + icons add personality without clutter

---

## 🔧 Troubleshooting

**Gradients not showing on Android:**

- Ensure `react-native-linear-gradient` is installed correctly
- Use `expo-linear-gradient` if using Expo

**Shadows too heavy/not showing:**

- Adjust `elevation` for Android
- iOS: Tweak `shadowOpacity` and `shadowRadius`
- Test on physical devices, not just simulator

**Performance issues:**

- Avoid nested gradients
- Use `shouldRasterizeIOS` for complex shadows
- Memoize sport card components

---

**Created by:** Sally, UX Designer Agent  
**For:** GSS Client - Create Event Wizard Redesign  
**Status:** Ready for Review & Implementation
