# Lawlify AI - Theme & Design System

## 🎨 Core Identity

Lawlify AI embodies a **modern, professional, and authoritative** aesthetic, tailored for the legal industry in East Africa. The design language prioritizes clarity, trust, and technological sophistication.

### 🌑 Dark Mode First

The application is built with a **dark mode-first** approach to reduce eye strain during long research sessions and convey a sense of premium software.

- **Background**: `bg-ai-studio` (Custom radial gradient: `#1a1a1a` to `#000000`)
- **Text**: `text-white` (Primary content), `text-gray-400` (Secondary content)
- **Borders**: `border-white/10` (Subtle dividers)

### 🔴 Primary Accent

- **Color**: `#ef4444` (Red-500)
- **Usage**: Primary buttons, active states, key highlights, and brand elements.
- **Meaning**: Represents urgency, importance, and legal authority.

### 🟢 Secondary Accents

- **Green**: `#22c55e` (Success, validation, positive outcomes)
- **Blue**: `#3b82f6` (Information, links, neutral actions)

## 🔤 Typography

- **Headings**: `Poppins` (Sans-serif, geometric, modern)
- **Body**: `Inter` (Sans-serif, highly legible, versatile)
- **Code/Data**: `JetBrains Mono` (Monospace, technical precision)

## 🖼️ UI Patterns

### Glassmorphism
Used extensively for cards, modals, and overlays to create depth and hierarchy without clutter.
- **Class**: `backdrop-blur-xl bg-black/50 border border-white/5`

### Oversized Cards
Feature large, rounded corners (`rounded-[2.5rem]`) to soften the interface and make content approachable.

### Subtle Gradients
Backgrounds often feature subtle radial gradients or "glows" to add visual interest and guide the user's focus.

### Iconography
Consistent use of `lucide-react` icons with thin strokes (`stroke-width={1.5}`) for a clean, technical look.

## 📸 Imagery

- **Style**: High-quality, professional photography or abstract tech visualizations.
- **Source**: Unsplash (via Picsum Photos) or custom assets.
- **Treatment**: Often desaturated or overlaid with a dark gradient to blend seamlessly with the UI.

## 📱 Responsiveness

- **Mobile First**: All layouts are designed to work seamlessly on mobile devices (`sm:` breakpoint) and scale up to desktop (`lg:` breakpoint).
- **Fluid Typography**: Font sizes adjust based on viewport width (`text-5xl md:text-7xl`).
