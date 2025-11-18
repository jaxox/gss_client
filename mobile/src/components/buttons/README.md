# Button Components

## FABButton (Floating Action Button)

A reusable gradient button component with shadow for add/remove actions. Implements **Style 7** from the approved design system.

### Features

- ✅ 3 sizes: small (28px), medium (32px), large (36px)
- ✅ 2 variants: add (orange) and remove (red)
- ✅ Built-in press animations (scale + opacity)
- ✅ Disabled state support
- ✅ Shadow effect for premium feel
- ✅ Customizable icon

### Usage

```tsx
import { FABButton } from '../../../components/buttons';

// Basic usage (large add button with plus icon)
<FABButton onPress={handleAdd} />

// Medium size for inline actions
<FABButton onPress={handleAdd} size="medium" />

// Small size for compact spaces
<FABButton onPress={handleAdd} size="small" />

// Disabled state
<FABButton onPress={handleAdd} disabled={count >= 5} />

// Remove variant (red)
<FABButton onPress={handleRemove} variant="remove" icon="close" />

// Custom icon
<FABButton onPress={handleSave} icon="check" />
```

### Props

| Prop       | Type                             | Default     | Description                     |
| ---------- | -------------------------------- | ----------- | ------------------------------- |
| `onPress`  | `() => void`                     | required    | Callback when button is pressed |
| `icon`     | `string`                         | `'plus'`    | Material Community Icons name   |
| `size`     | `'small' \| 'medium' \| 'large'` | `'large'`   | Button size                     |
| `disabled` | `boolean`                        | `false`     | Disable button interaction      |
| `variant`  | `'add' \| 'remove'`              | `'add'`     | Color variant                   |
| `style`    | `ViewStyle`                      | `undefined` | Additional styles               |

### Sizes

- **small**: 28x28px, icon 16px (for compact inline use)
- **medium**: 32x32px, icon 18px (for option lists)
- **large**: 36x36px, icon 20px (for main section actions)

### Colors

- **add**: #ff6b35 (orange)
- **remove**: #ff3b30 (red)

### Benefits

1. **Single source of truth** - Change button style in one place
2. **Consistent sizing** - All buttons use same size system
3. **Type-safe** - Full TypeScript support
4. **Accessible** - Built-in press states for mobile
5. **Maintainable** - Easy to update across entire app

### Where Used

- Step2Social.premium.tsx (4 buttons: Cohosts, Links, Questionnaire, Reminders)
- AddQuestionnaireModal.tsx (1 button: Add Option)
- Any future screens that need FAB-style buttons
