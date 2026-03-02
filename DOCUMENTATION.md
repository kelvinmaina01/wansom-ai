# Lawlify AI - Technical Documentation

## 🏗️ Architecture Overview

Lawlify AI is a single-page application (SPA) built with React 18, TypeScript, and Vite. It leverages a component-based architecture with a centralized state management approach for navigation and feature toggling.

### 📂 Directory Structure

-   `/src`: Source code root.
    -   `/components`: Reusable UI components and page-level views.
        -   `LandingPage.tsx`: The main marketing landing page with features, testimonials, and CTAs.
        -   `AuthPage.tsx`: Authentication page with login options (Google, Microsoft, LinkedIn, Apple, SSO) and a dynamic testimonial carousel.
        -   `OnboardingPage.tsx`: Multi-step onboarding flow for new users (Email verification, Discovery source, Terms acceptance, Team setup).
        -   `PricingPage.tsx`: Detailed pricing plans (Free, Personal, Teams) with monthly/annual toggles and enterprise options.
    -   `App.tsx`: Main application entry point. Manages global `viewState` (landing, auth, onboarding, pricing, app).
    -   `index.css`: Global styles, Tailwind directives, and custom animations.
    -   `main.tsx`: React root rendering.

### 🧩 Key Components

#### 1. `App.tsx` (State Management)
-   **State**: `viewState` ('landing' | 'auth' | 'onboarding' | 'pricing' | 'app') controls which page is rendered.
-   **Logic**: Handles transitions between views based on user actions (e.g., clicking "Launch App" sets state to 'auth', completing onboarding sets state to 'app').

#### 2. `LandingPage.tsx`
-   **Features**:
    -   Hero section with "Launch App" CTA.
    -   "Trusted By" marquee with logos of major East African law firms.
    -   Features grid showcasing core capabilities (Research, Drafting, Vault, etc.).
    -   Security section highlighting ISO 27001 certification.
    -   Footer with resource links.
-   **Props**: `onEnterApp` (navigates to Auth), `onPricingClick` (navigates to Pricing).

#### 3. `AuthPage.tsx`
-   **Layout**: Split screen design.
    -   **Left Panel**: Branding, value proposition, and an auto-sliding testimonial carousel featuring East African legal professionals.
    -   **Right Panel**: Authentication form with social login buttons and email input.
-   **State**: Manages carousel index and auto-slide timer.
-   **Props**: `onLogin` (navigates to Onboarding).

#### 4. `OnboardingPage.tsx`
-   **Flow**: 4-step process:
    1.  **Account Setup**: Verify email, connect socials.
    2.  **Discovery**: How did you hear about us?
    3.  **Legal**: Terms of Service & Privacy Policy acceptance.
    4.  **Team**: Set team name and invite members.
-   **State**: `currentStep` (1-4), `formData` (stores user inputs).
-   **Props**: `onComplete` (navigates to main App).

#### 5. `PricingPage.tsx`
-   **Features**:
    -   Monthly/Annual pricing toggle.
    -   Three tier cards: Free, Personal (highlighted), Teams.
    -   Enterprise custom quote section.
    -   Education/Non-profit discount section.
-   **State**: `isAnnual` (boolean toggle for pricing).
-   **Props**: `onBack` (returns to Landing), `onGetStarted` (navigates to Auth).

## 🎨 Styling & Theming

-   **Framework**: Tailwind CSS.
-   **Design System**: Custom color palette (Primary Red, Secondary Blue/Green), Inter font family, and specific UI patterns like glassmorphism and oversized cards.
-   **Animations**: `framer-motion` is used for page transitions, carousel slides, and interactive elements.

## 🚀 Development Workflow

1.  **Run Dev Server**: `npm run dev` (starts Vite server on port 3000).
2.  **Linting**: `npm run lint` (checks for code quality issues).
3.  **Build**: `npm run build` (generates production-ready assets in `/dist`).

## 🔒 Security Considerations

-   **Authentication**: Placeholder for OAuth integration (Google, Microsoft, etc.).
-   **Data Handling**: Onboarding data is currently stored in local component state. In a production environment, this would be sent to a secure backend API.
-   **Compliance**: The UI emphasizes GDPR and ISO 27001 compliance, reflecting the platform's commitment to data security.
