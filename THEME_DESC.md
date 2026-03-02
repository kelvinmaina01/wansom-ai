# Lawlify AI - Design System & Theme

## 🎨 Core Philosophy

Lawlify AI's design language is built on three pillars:
1.  **Professional Authority**: Clean, modern, and trustworthy.
2.  **East African Context**: Tailored to the region's legal landscape.
3.  **Accessible Innovation**: High-tech AI tools presented in an approachable, user-friendly interface.

## 🌈 Color Palette

### Primary Colors
-   **Primary Red (#EF4444)**: Used for key actions (CTAs), branding accents, and highlighting critical information. Represents urgency, power, and the boldness of modern legal practice.
-   **Black (#000000)**: Used for backgrounds, text, and structural elements. Provides a sleek, professional foundation.
-   **White (#FFFFFF)**: Used for text on dark backgrounds, card surfaces, and high-contrast elements.

### Secondary Colors (Feature Accents)
-   **Blue (#3B82F6)**: Used for "Draft & Review" features, representing trust and stability.
-   **Green (#10B981)**: Used for "Document Vault" and security features, symbolizing safety and growth.
-   **Purple/Indigo (#6366F1)**: Used for "Education Support" and "AI Assistant" features, representing innovation and wisdom.

### Backgrounds & Surfaces
-   **Glassmorphism**: Used for overlays, modals, and interactive cards to create depth and a modern feel.
    -   `bg-white/10 backdrop-blur-xl border-white/10`
-   **Solid Dark**: Used for high-impact sections like testimonials and pricing cards.
    -   `bg-[#111]` or `bg-zinc-900`

## 🔠 Typography

### Font Family
-   **Inter (Sans-serif)**: The primary typeface for all UI elements. Clean, legible, and versatile.
    -   `font-sans`

### Hierarchy
-   **Headings**: Bold, tracking-tight, and often oversized for impact.
    -   `text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]`
-   **Body Text**: Medium weight, relaxed leading for readability.
    -   `text-lg md:text-xl text-gray-400 font-medium leading-relaxed`
-   **Labels/Tags**: Uppercase, tracking-widest, small font size.
    -   `text-[10px] font-bold tracking-widest uppercase`

## 🧩 UI Patterns

### Oversized Cards
-   **Concept**: Cards are designed to be large, with generous padding and rounded corners, creating a sense of substance and importance.
    -   `p-10 rounded-[2.5rem]`
-   **Interaction**: Subtle scale and shadow effects on hover.
    -   `hover:scale-105 transition-transform shadow-xl`

### Testimonial Carousel
-   **Design**: A dedicated section featuring quotes from East African legal professionals.
-   **Animation**: Auto-sliding cards with smooth fade/slide transitions using `framer-motion`.
-   **Content**: Includes author name, role, location (e.g., Nairobi, Dar es Salaam), and avatar.

### Pricing Tiers
-   **Layout**: Three-column grid with a highlighted "Most Popular" plan.
-   **Visuals**: Distinct styling for the "Personal" plan (dark background, red accents) vs. "Free" and "Teams" plans (light background).
-   **Toggle**: Monthly/Annual switch with a "Save 20%" badge.

### Education Support Section
-   **Theme**: Soft purple/indigo background (`bg-[#F8F9FF]`) to differentiate from the main dark/red theme.
-   **Content**: Highlights discounts for students, academic institutions, and non-profits.

## 📸 Imagery & Icons

-   **Icons**: Lucide React icons are used throughout for consistency and clarity.
    -   `Scale`, `ShieldCheck`, `Zap`, `Globe`, `MessageSquare`, `FileText`
-   **Logos**: High-quality logos of partner law firms (Bowmans, ALN, etc.) in a grayscale marquee.
-   **Avatars**: DiceBear avatars or real photos for testimonials.

## 📱 Responsiveness

-   **Mobile-First**: All layouts are designed to stack vertically on mobile screens (`flex-col`) and expand horizontally on desktop (`md:flex-row`).
-   **Touch Targets**: Buttons and interactive elements are sized appropriately for touch input (min 44px height).
