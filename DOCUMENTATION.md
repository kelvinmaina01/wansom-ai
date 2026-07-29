# Wansom AI - Comprehensive Technical Documentation

## 🏗️ Architecture Overview

Wansom AI is an enterprise-grade Legal Technology platform transitioning to a **High-Architecture Service-Oriented System**. It decouples a high-fidelity React frontend from specialized backend se[...]

### Directory Structure
```
/
  /supabase             # PostgreSQL schemas, RLS, and Storage config
  /backend-service      # Multi-model AI Proxy (DeepSeek, PageIndex, Agent Kit)
  /supabase             # Supabase Auth, Persistence & Storage
  /src                  # React 18 / Vite / TypeScript Frontend
    /components         # Modular feature components
    /services           # API service layer (transitioning to backend-mediated)
    /types.ts           # Unified cross-service type definitions
```

---

## 🧩 Core Platform Features

### 1. Legal AI (Conversation Engine)
The primary interface for solicitors and legal researchers.
- **Dynamic Interaction**: Streaming responses with Markdown and LaTeX support.
- **Verification Layer**: Real-time citations of East African statutes and precedents.
- **Multimodal Input**: Support for voice-to-text transcription and document attachments.
- **Specialized Personas**: Ability to swap system instructions via the "Specialists" layer.

### 2. Judicial Analytics (Data Intelligence)
Strategic litigation insights through data visualization.
- **Judge Profiles**: Comprehensive dossiers including WIN rates and ruling tendencies.
- **Comparative Analysis**: Analytics on citation frequency and common legal grounds.
- **Court Filtering**: Data segmented by various East African jurisdictions and court levels.

### 3. Agentic Mentorship (Amani)
AI-powered training and professional development.
- **Immersive Sessions**: Simulated video/audio calls with AI mentors.
- **Training Drills**: Cross-examination practice and Socratic tutoring.
- **Performance Evaluation**: Integration with `backend-service` for transcript analysis.

### 4. Files & Document Vault
Professional-grade document management.
- **Hierarchical Storage**: Folder-based organization with starring and tagging.
- **Metadata Insight**: Automatic extraction of file types, sizes, and last-modified data.
- **Cloud Persistence**: (In Migration) transitioning from local state to Supabase Storage.

### 5. Specialist Marketplace
A catalog of pre-configured AI agents.
- **Domain Focus**: Specialists for Conveyancing, Commercial Law, Family Law, etc.
- **Custom Creation**: User-defined agents with specific jurisdictional prompts.

### 6. Platform Governance (Auth, Onboarding, Settings)
- **Enterprise Auth**: Real-time authentication via Supabase Google OAuth.
- **Seamless Onboarding**: 5-step guided setup for individuals and firms.
- **Granular Settings**: Management of 2FA, billing, and organizational notifications.

---

## 🎨 Design System & UX
- **Theme**: Premium dark aesthetic (`bg-ai-studio`) with high-contrast typography.
- **Animations**: Strategic use of `framer-motion` for reduced cognitive load and premium feel.
- **Global UI Components**:
  - `GlobalRail`: Primary navigation.
  - `ContextualSidebar`: Secondary, state-aware navigation and search.
  - `NotificationCenter`: Real-time system alerts.

---

## 🔒 Security & Data Integrity
- **Backend AI Proxying**: Prevents client-side exposure of sensitive API keys (Gemini, PageIndex).
- **Identity Security**: All routes protected by Supabase session verification.
- **Tenancy Isolation**: Database-level Row Level Security (RLS) ensures matter confidentiality.

---

## 🚀 Infrastructure Stack
- **Languages**: TypeScript (Frontend/Service Logic), SQL (Supabase).
- **Hosting**: Vercel (Frontend), Managed Cloud (Database/Proxies).
- **Communication**: REST & WebSockets for real-time AI streaming.
