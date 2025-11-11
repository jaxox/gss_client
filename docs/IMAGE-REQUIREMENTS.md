# Image Requirements for GSS Mobile App

## Overview

This document specifies all image assets needed for the Create Event Wizard and other mobile app screens.

## Sport Icons (Step 1: Basic Info)

Used in Step 1 of Create Event Wizard - sport selection cards.

### Required Icons (5 total)

All icons should follow Material Design guidelines for consistency with react-native-vector-icons/MaterialCommunityIcons.

| Sport        | Icon Name      | Size    | Format       | Notes                         |
| ------------ | -------------- | ------- | ------------ | ----------------------------- |
| Pickleball   | `badminton`    | 48x48dp | Vector (MDI) | Using badminton icon as proxy |
| Tennis       | `tennis`       | 48x48dp | Vector (MDI) | Tennis racket icon            |
| Table Tennis | `table-tennis` | 48x48dp | Vector (MDI) | Ping pong paddle icon         |
| Badminton    | `badminton`    | 48x48dp | Vector (MDI) | Badminton shuttlecock icon    |
| Padel        | `tennis`       | 48x48dp | Vector (MDI) | Using tennis icon as proxy    |

**Current Status**: Icons are rendered using `react-native-vector-icons/MaterialCommunityIcons` but showing "?" symbols.

**Fix Needed**:

1. Run pod install: `cd ios && pod install && cd ..`
2. Link fonts in Xcode project
3. Or use custom PNG/SVG assets if vector icons don't work

---

## Link Icons (Step 3: Add Link Modal)

Used in Add Link modal - 8 external link types.

### Required Icons (8 total)

| Platform  | MDI Icon Name    | Size    | Format       | Usage                      |
| --------- | ---------------- | ------- | ------------ | -------------------------- |
| Discord   | `discord`        | 32x32dp | Vector (MDI) | Discord server links       |
| WhatsApp  | `whatsapp`       | 32x32dp | Vector (MDI) | WhatsApp group links       |
| Facebook  | `facebook`       | 32x32dp | Vector (MDI) | Facebook group/page links  |
| Instagram | `instagram`      | 32x32dp | Vector (MDI) | Instagram profile links    |
| Maps      | `map-marker`     | 32x32dp | Vector (MDI) | Google Maps location links |
| YouTube   | `youtube`        | 32x32dp | Vector (MDI) | YouTube channel links      |
| Telegram  | `telegram`       | 32x32dp | Vector (MDI) | Telegram group links       |
| Email     | `email-multiple` | 32x32dp | Vector (MDI) | Email group/list links     |

**Current Status**: Icons are defined but may show "?" symbols due to font linking issue.

---

## Avatar Images (Add Cohosts Modal)

Used in Add Cohosts modal - user profile avatars.

### Requirements

| Type           | Size    | Format   | Notes                                |
| -------------- | ------- | -------- | ------------------------------------ |
| User Avatar    | 48x48dp | PNG/WebP | Circular, background color fill      |
| Group Avatar   | 48x48dp | PNG/WebP | Circular, different background color |
| Default Avatar | 48x48dp | PNG/WebP | Text initials (auto-generated)       |

**Current Status**: Using `Avatar.Text` component from react-native-paper with auto-generated initials. No custom images needed.

---

## Progress Indicators

Used in all 4 wizard steps - progress dots.

### Requirements

| Element         | Size    | Format   | Colors               |
| --------------- | ------- | -------- | -------------------- |
| Active Dot      | 12x12dp | SVG/Code | Blue (#3B82F6)       |
| Inactive Dot    | 12x12dp | SVG/Code | Gray (#9CA3AF)       |
| Connecting Line | 24x2dp  | SVG/Code | Light Gray (#E5E7EB) |

**Current Status**: Rendered using View components with borderRadius. No image assets needed.

---

## Buttons and Icons

### Primary Action Buttons

- **Size**: Auto (text-based)
- **Format**: Material Design Paper components
- **Icons**: MDI icons (arrow-right, close, check, etc.)

### Icon Buttons

- **Size**: 24x24dp
- **Format**: Vector (MDI)
- **Examples**: close, calendar, clock-outline, chevron-down, magnify

**Current Status**: All icons from react-native-vector-icons. Font linking issue causes "?" symbols.

---

## Fix Instructions

### Option 1: Link Vector Icon Fonts (Recommended)

#### iOS (React Native):

```bash
cd ios
pod install
cd ..
```

Then in Xcode:

1. Open `ios/GSS_Mobile.xcworkspace`
2. Right-click project → Add Files
3. Navigate to `node_modules/react-native-vector-icons/Fonts/`
4. Select all `.ttf` files (MaterialCommunityIcons.ttf, etc.)
5. Check "Copy items if needed"
6. Add to target: GSS_Mobile
7. Clean build folder (Cmd+Shift+K)
8. Rebuild (Cmd+B)

#### Android (React Native):

Should work automatically after running:

```bash
npx react-native link react-native-vector-icons
```

Or manual linking in `android/app/build.gradle`:

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

---

### Option 2: Use Custom PNG Assets

If vector icons don't work, create PNG assets:

#### Directory Structure:

```
mobile/assets/images/
  sports/
    pickleball@2x.png (96x96px)
    pickleball@3x.png (144x144px)
    tennis@2x.png
    tennis@3x.png
    ...
  links/
    discord@2x.png (64x64px)
    discord@3x.png (96x96px)
    ...
```

#### Image Specifications:

- **Format**: PNG with transparency
- **Color**: Single color icons (can be tinted via code)
- **Sizes**:
  - @1x (base)
  - @2x (2x resolution)
  - @3x (3x resolution for iPhone)
- **Style**: Flat, Material Design inspired
- **Background**: Transparent

---

## Assets Checklist

- [ ] Link MaterialCommunityIcons.ttf font to iOS project
- [ ] Test icon rendering on iOS simulator
- [ ] Test icon rendering on Android emulator
- [ ] Verify all 5 sport icons display correctly
- [ ] Verify all 8 link icons display correctly
- [ ] Verify UI icons (search, calendar, clock, etc.)

---

## Design Tools

Recommended tools for creating custom assets if needed:

1. **Figma** - UI design, export @2x/@3x PNGs
2. **Adobe Illustrator** - Vector graphics, export PNGs
3. **Sketch** - iOS-focused design tool
4. **Material Design Icons** - https://materialdesignicons.com/ (free MDI icons)
5. **Icon8** - https://icons8.com/ (paid/free icon library)

---

## AI Image Generation Prompts

If using AI tools (DALL-E, Midjourney, Stable Diffusion) to generate icons:

### Sport Icons:

```
"Flat minimalist icon of [sport name], Material Design style, single color,
transparent background, 144x144px, simple geometric shapes, no text"
```

Example:

```
"Flat minimalist icon of pickleball paddle, Material Design style,
navy blue color, transparent background, 144x144px, simple geometric shapes"
```

### Link Icons:

```
"Social media icon for [platform], Material Design style, single color,
transparent background, 96x96px, recognizable brand logo simplified"
```

---

## Notes

- Current issue: Font icons showing "?" symbols means fonts aren't linked to native project
- Quick fix: Run `cd ios && pod install` then rebuild
- Permanent fix: Add fonts to Xcode project manually (see Option 1 above)
- Alternative: Create custom PNG assets (more control, but larger bundle size)
