# Dashboard Design System

## 🎨 Raydium-Inspired UI

The dashboard features a modern, crypto-native design inspired by Raydium's beautiful interface.

### Design Features

#### 🌑 Dark Theme
- **Background**: Deep dark (`#0a0b0d`) with animated gradient overlays
- **Glass Morphism**: Frosted glass effects with `backdrop-blur-xl`
- **Transparency**: Subtle white overlays (`bg-white/5`, `bg-white/10`)

#### ✨ Visual Effects
- **Animated Gradients**: Pulsing radial gradients in purple, cyan, and blue
- **Grid Pattern**: Subtle grid overlay for depth
- **Hover States**: Smooth transitions with glow effects
- **Border Animations**: Gradient borders that appear on hover

#### 🎨 Color Palette
- **Purple**: `from-purple-500 to-pink-500` - Research Agent
- **Cyan**: `from-cyan-500 to-blue-500` - Analysis Agent  
- **Emerald**: `from-emerald-500 to-green-500` - Trading Agent
- **Orange**: `from-orange-500 to-yellow-500` - Monitor Agent

#### 🔲 Components

**Metrics Cards**
- Glassmorphism background with border
- Gradient icon badges with shadows
- Large bold numbers (text-4xl)
- Hover effects with gradient overlays

**Agent Cards**
- Gradient top border matching agent type
- Large emoji badges with gradient backgrounds
- Status indicators with pulse animation
- Trait badges with subtle styling
- Hover glow effects

**Activity Feed**
- Gradient header with live indicator
- Scrollable feed with custom scrollbar
- Activity cards with left gradient border on hover
- Timestamp and emoji indicators
- Expandable details section

**Connection Status**
- Fixed top-right position
- Glassmorphism badge
- Animated pulse for live status
- Color-coded (emerald = connected, red = disconnected)

### Typography
- **Headers**: Bold, large, gradient text
- **Body**: Clean, readable gray text
- **Accents**: Uppercase tracking for labels

### Animations
- Pulse effects on status indicators
- Smooth transitions (300ms duration)
- Slide-in animations for activity feed
- Rotating GitHub icon on hover

### Layout
- Max width container (7xl)
- Responsive grid layouts
- Generous spacing and padding
- Section dividers with gradient bars

## 🚀 Usage

```bash
# Development
bun run dev

# Production Build
bun run build

# Preview Build
bun run preview
```

## 📱 Responsive Design

- **Mobile**: Single column layout
- **Tablet**: 2-column grid for agents
- **Desktop**: 4-column grid for agents and metrics

## 🎯 Key Improvements

1. **Visual Hierarchy**: Clear separation of sections with gradient bars
2. **Readability**: High contrast text on dark backgrounds
3. **Interactivity**: Hover states provide visual feedback
4. **Performance**: Optimized animations with GPU acceleration
5. **Accessibility**: Semantic HTML and proper contrast ratios
