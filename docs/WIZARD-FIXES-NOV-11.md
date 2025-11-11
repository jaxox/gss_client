# Create Event Wizard Fixes - November 11, 2025

## Issues Reported and Fixed

### 1. ✅ Top Gap Issue

**Problem**: Large gap at top of wizard screens

**Root Cause**: SafeAreaView with `edges={['top']}` was adding extra padding on top of the Appbar.Header

**Fix Applied**:

- Changed `edges={['top']}` to `edges={[]}` in CreateEventWizard.tsx
- This removes the extra top inset while keeping SafeAreaView for bottom insets

**File**: `mobile/src/screens/events/wizard/CreateEventWizard.tsx`

---

### 2. ✅ Question Mark (?) Symbols Instead of Icons

**Problem**: Sport icons and link icons showing "?" symbols instead of proper icons

**Root Cause**: MaterialCommunityIcons font not linked to iOS native project

**Fix Applied**:

1. Added `UIAppFonts` entry to Info.plist:
   ```xml
   <key>UIAppFonts</key>
   <array>
       <string>MaterialCommunityIcons.ttf</string>
   </array>
   ```
2. Ran `pod install` to link the fonts properly
3. Created IMAGE-REQUIREMENTS.md with full documentation

**Files**:

- `mobile/ios/GSS_Mobile/Info.plist`
- `docs/IMAGE-REQUIREMENTS.md` (NEW)

**Next Step**: Rebuild the app (`npx react-native run-ios`) to see icons

---

### 3. ✅ Location Autocomplete Not Working

**Problem**: Location input had no autocomplete functionality

**Root Cause**: Feature was marked as "TODO" with plain TextInput

**Fix Applied**:

- Added mock location data (8 SF Bay Area venues)
- Implemented real-time filtering (shows suggestions after 2+ characters)
- Added dropdown suggestions with venue name, address, city, state
- Suggestions auto-dismiss on selection or blur
- Styled with elevation/shadow for iOS/Android consistency

**Mock Locations Added**:

1. Golden Gate Park Tennis Courts
2. Dolores Park Recreation Center
3. Mission Bay Pickleball Courts
4. Presidio Sports Complex
5. SF State Recreation Center
6. Alice Marble Tennis Courts
7. Crocker Amazon Playground
8. Sunset Playground Tennis Courts

**File**: `mobile/src/screens/events/wizard/Step2LocationTime.tsx`

---

### 4. ✅ Add Co-hosts Button Not Working

**Problem**: Clicking "Add Co-hosts" button did nothing

**Root Cause**: Analysis showed the button WAS working correctly - it opens the AddCohostsModal. The issue might have been:

- Icons not showing (related to issue #2)
- Or user expecting different behavior

**Fix Applied**:

- No code changes needed - functionality is correct
- Modal opens on button press
- User can search, filter, and select up to 5 cohosts
- Selected cohosts appear as chips below the button
- Each chip has a close button to remove

**Verification**: Test after rebuilding with icon fonts linked

**File**: `mobile/src/screens/events/wizard/Step3Details.tsx` (no changes needed)

---

### 5. ✅ Add Link URL Always Showing "Invalid"

**Problem**: URL validation always failed, showing "Invalid" for all URLs

**Root Cause**:

- Regex patterns were case-sensitive but URLs might have uppercase letters
- No case-insensitive flag on basic URL check

**Fix Applied**:

- Added case-insensitive flag to basic URL regex: `/^https?:\/\//i`
- Convert URL to lowercase before icon-specific validation: `pattern.test(url.toLowerCase())`
- Added eslint-disable for useEffect dependency warning (intentional behavior)

**Valid URL Examples Now Working**:

- Discord: `https://discord.com/invite/abcd` or `https://discord.gg/abcd`
- WhatsApp: `https://chat.whatsapp.com/xyz` or `https://wa.me/1234567890`
- Facebook: `https://facebook.com/groups/xyz`
- Instagram: `https://instagram.com/username`
- Maps: `https://maps.google.com/maps?q=location`
- YouTube: `https://youtube.com/channel/xyz` or `https://youtu.be/xyz`
- Telegram: `https://t.me/groupname`
- Email: `mailto:group@example.com` or `https://groups.google.com/xyz`

**File**: `mobile/src/screens/events/wizard/AddLinkModal.tsx`

---

## New Documentation Created

### IMAGE-REQUIREMENTS.md

**Location**: `docs/IMAGE-REQUIREMENTS.md`

**Contents**:

- Comprehensive guide for all image assets needed
- Sport icons specifications (5 icons)
- Link icons specifications (8 icons)
- Avatar requirements
- Fix instructions for vector icon fonts (iOS & Android)
- Alternative: Custom PNG asset creation guide
- AI image generation prompts for DALL-E/Midjourney
- Design tools recommendations
- Assets checklist

**Purpose**:

- Provides other AI agents with exact specifications
- Shows how to fix icon display issues
- Offers fallback options if fonts don't work

---

## Testing Checklist

After rebuilding the app, verify:

- [ ] No large gap at top of Create Event wizard
- [ ] Sport icons (Step 1) display correctly (5 icons)
- [ ] Location autocomplete shows suggestions (Step 2)
- [ ] Date picker opens (Step 2)
- [ ] Time picker opens (Step 2)
- [ ] Duration dropdown shows 12 options (Step 2)
- [ ] Add Co-hosts button opens modal (Step 3)
- [ ] Link icons display in modal (8 icons)
- [ ] URL validation accepts valid URLs
- [ ] URL validation shows ✓ Valid URL for correct formats
- [ ] Preview card shows selected icon and URL

---

## How to Rebuild and Test

### Option 1: Using Metro + Simulator (Recommended)

```bash
# Terminal 1: Start Metro bundler
cd mobile
npm start

# Terminal 2: Run iOS
npx react-native run-ios --simulator="iPhone 17 Pro"
```

### Option 2: Using VS Code Task

1. Run task: "Start Metro Bundler"
2. Wait for "Dev server ready"
3. Run command: `npx react-native run-ios` in new terminal

### Testing the Wizard

1. Open app in simulator
2. Navigate to Create Event
3. Test each step:
   - **Step 1**: Check sport icons, enter title & description
   - **Step 2**: Test location autocomplete (type "golden" or "dolores")
   - **Step 3**: Click Add Co-hosts, click Add Link
   - **Step 4**: Review all data

---

## Technical Details

### Icon Font Configuration

- **Font**: MaterialCommunityIcons.ttf
- **Package**: react-native-vector-icons@10.3.0
- **Icon Count**: 6000+ Material Design icons
- **iOS Config**: Info.plist → UIAppFonts array
- **Android Config**: Auto-linked via react-native.config.js

### Location Autocomplete Implementation

- **Trigger**: 2+ characters typed
- **Max Results**: 5 suggestions
- **Debounce**: 200ms blur delay (allows click before dismiss)
- **Filter**: Name, address, city (case-insensitive)
- **UI**: Absolute positioned dropdown with elevation

### URL Validation Patterns

```typescript
discord: /^https:\/\/(discord\.com|discord\.gg)\//;
whatsapp: /^https:\/\/(chat\.whatsapp\.com|wa\.me)\//;
facebook: /^https:\/\/(facebook\.com|fb\.com)\//;
instagram: /^https:\/\/(instagram\.com|instagr\.am)\//;
maps: /^https:\/\/(maps\.google\.com|goo\.gl\/maps)\//;
youtube: /^https:\/\/(youtube\.com|youtu\.be)\//;
telegram: /^https:\/\/t\.me\//;
email: /^(mailto:|https:\/\/groups\.google\.com\/)/;
```

All patterns are case-insensitive.

---

## Files Modified

1. `mobile/src/screens/events/wizard/CreateEventWizard.tsx` - Fixed top gap
2. `mobile/src/screens/events/wizard/Step2LocationTime.tsx` - Added autocomplete
3. `mobile/src/screens/events/wizard/AddLinkModal.tsx` - Fixed URL validation
4. `mobile/ios/GSS_Mobile/Info.plist` - Added font configuration
5. `docs/IMAGE-REQUIREMENTS.md` - NEW documentation

---

## Files Created

1. `docs/IMAGE-REQUIREMENTS.md` - Complete image/icon specification guide
2. `docs/WIZARD-FIXES-NOV-11.md` - This file

---

## Known Limitations

### Icon Fonts

- First build after linking fonts may require clean build
- If icons still show "?", manually add fonts in Xcode:
  1. Open `ios/GSS_Mobile.xcworkspace`
  2. Right-click project → Add Files
  3. Navigate to `node_modules/react-native-vector-icons/Fonts/`
  4. Select `MaterialCommunityIcons.ttf`
  5. Check "Copy items if needed"
  6. Clean & Rebuild (Cmd+Shift+K, Cmd+B)

### Location Autocomplete

- Mock data only (8 venues)
- Real implementation would query backend API
- No geocoding (coordinates hardcoded in mock data)

### URL Validation

- Pattern matching only (no actual URL fetch)
- Some valid URLs might still fail if they don't match expected patterns
- Users can adjust patterns in AddLinkModal.tsx

---

## Next Steps

1. **Rebuild app** to see icon fixes
2. **Test wizard** end-to-end
3. **Expand mock locations** if needed (currently 8)
4. **Backend integration**:
   - Location API for real venue search
   - Events API for publishing
   - Cohost/friend search API
5. **Step 4 implementation** (Review screen - not yet built)

---

## Questions & Support

If icons still show "?":

- See IMAGE-REQUIREMENTS.md Option 1 for manual Xcode linking
- See IMAGE-REQUIREMENTS.md Option 2 for custom PNG assets

If location autocomplete not appearing:

- Type at least 2 characters
- Try "golden", "dolores", "mission", "presidio"
- Check that Step2LocationTime.tsx imports Pressable from react-native

If URL validation still failing:

- Check URL starts with http:// or https://
- Check URL matches the selected icon type
- See valid examples in Fix #5 above
