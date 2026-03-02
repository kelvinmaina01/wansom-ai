# Lawlify AI - Technical Documentation

## 🏗️ Architecture Overview

Lawlify AI is a modern, single-page application (SPA) built using React 18, TypeScript, and Vite. It leverages a component-based architecture with a focus on modularity, reusability, and performance.

### Directory Structure

```
/src
  /components       # Reusable UI components and page-specific components
    /layout         # Layout components (GlobalRail, ContextualSidebar)
    /LandingPage.tsx # Main landing page
    /PricingPage.tsx # Pricing page
    /LegalAI.tsx    # Core AI chat interface
    /LegalSpecialists.tsx # Specialist selection interface
    ...
  /types.ts         # Global TypeScript type definitions
  /App.tsx          # Main application component and routing logic
  /main.tsx         # Application entry point
  /index.css        # Global styles and Tailwind configuration
```

## 🧩 Key Components

### 1. `App.tsx`
The central component that manages the application state (`viewState`) and handles client-side routing between different views (Landing, Auth, Onboarding, App, Pricing). It also manages the global layout structure, including the sidebar and top navigation.

### 2. `LandingPage.tsx`
The public-facing landing page designed to showcase the product's value proposition. It features a responsive design, hero section, feature highlights, and a call-to-action for user acquisition.

### 3. `PricingPage.tsx`
A dedicated page for displaying subscription plans. It includes interactive elements like monthly/annual toggles and detailed feature comparisons. It follows the application's dark theme (`bg-ai-studio`).

### 4. `LegalAI.tsx`
The core feature of the application, providing an interface for users to interact with the AI. It handles message history, input processing, and displays AI responses.

### 5. `LegalSpecialists.tsx`
Allows users to select specialized AI agents tailored to specific legal domains (e.g., Conveyancing, Commercial Law).

##  state Management

The application uses React's built-in `useState` and `useEffect` hooks for local state management.
- **`viewState`**: Controls the high-level view (Landing, Auth, App, Pricing).
- **`currentView`**: Manages the active module within the main app (Overview, Legal AI, Specialists, etc.).
- **`notifications`**: Manages the list of user notifications.

## 🎨 Styling & Theming

- **Tailwind CSS**: Used for utility-first styling.
- **Custom Theme**: Defined in `index.css` under the `@theme` directive.
  - **Colors**: `primary` (#ef4444), `secondary-green` (#22c55e), `secondary-blue` (#3b82f6), `sidebar` (#000000).
  - **Fonts**: `Inter` (sans-serif) and `Poppins` (display).
  - **Backgrounds**: `bg-ai-studio` for the signature dark gradient background.
- **Animations**: `framer-motion` is used for smooth transitions and interactive elements.

## 🤖 AI Integration

The application integrates with the Google Gemini API via the `@google/genai` SDK.
- **Model**: Uses `gemini-2.5-flash` for fast and efficient text generation.
- **Context**: The AI is provided with system instructions to act as a legal assistant specialized in East African law.

## 🔒 Security Considerations

- **Environment Variables**: API keys are stored in `.env` and accessed via `import.meta.env` (client-side) or `process.env` (server-side if applicable).
- **Data Handling**: Sensitive client data is intended to be stored securely. The frontend implements UI for a "Document Vault" to represent this capability.

## 🚀 Build & Deployment

- **Build Tool**: Vite is used for fast development and optimized production builds.
- **Command**: `npm run build` generates static assets in the `dist` folder.
- **Deployment**: The app is designed to be deployed to any static hosting service (e.g., Vercel, Netlify, Google Cloud Run).
