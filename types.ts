
export enum AppView {
  OVERVIEW = 'overview',
  LEGAL_AI = 'legal-ai',
  FILES = 'files',
  LEGAL_SPECIALISTS = 'legal-specialists',
  INTEGRATIONS = 'integrations',
  JUDICIAL_ANALYTICS = 'judicial-analytics',
  SETTINGS = 'settings',
  HISTORY = 'history',
  PROFILE = 'profile',
  LIBRARY = 'library',
  CASE_MANAGEMENT = 'case-management',
  DOCUMENT_INSIGHTS = 'document-insights',
  INTELLIGENCE_HUB = 'intelligence-hub',
  PROJECT_NEW = 'project-new',
  PROJECT_VIEW = 'project-view'
}

export enum WorkspaceType {
  CONTRACT_REVIEW = 'Contract Review',
  CASE_PREP = 'Case Preparation',
  LEGAL_RESEARCH = 'Legal Research',
  DRAFTING = 'Drafting'
}

export interface LegalCitation {
  statute: string;
  section?: string;
  description: string;
}

export interface LegalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; uri: string }>;
  citations?: LegalCitation[];
  thinking?: string;
  artifact?: {
    id: string;
    title: string;
    type?: 'document' | 'casefile' | 'affidavit' | 'legal_memo' | 'contract';
    renderMode?: 'markdown' | 'html' | 'react' | 'legal-doc';
    versions: Array<{
      content: string;
      timestamp: Date;
      author?: string;
      metadata?: Record<string, any>;
    }>;
  };
  isDraft?: boolean;
  isGenerating?: boolean;
  statusFeed?: string[];
  followup?: {
    questions: Array<{
      id: string;
      text: string;
      type: 'choice' | 'multi-choice' | 'text';
      options?: string[];
      placeholder?: string;
    }>;
    currentIndex: number;
    total: number;
    answers: Record<string, string | string[]>;
  };
}

export interface LegalSpecialist {
  id: string;
  name: string;
  description: string;
  icon: string;
  practiceAreas: string[];
  instructions: string;
  isPremade?: boolean;
  category?: string;
  color?: string;
  jurisdictions?: string[];
  links?: Array<{ label: string; url: string }>;
  suggestions?: Array<{
    label: string;
    description: string;
    icon: string;
    prompt: string;
    color: 'red' | 'black' | 'blue' | 'green' | 'grey';
  }>;
  supportedDocuments?: string[];
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    firmName: string;
    avatarUrl?: string;
  };
  appearance: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    whatsapp: boolean;
    securityAlerts: boolean;
    billingAlerts: boolean;
    productUpdates: boolean;
    aiDraftComplete: boolean;
    aiInsightReady: boolean;
    commentsMentions: boolean;
    workspaceInvitations: boolean;
    caseDeadlines: boolean;
    digest: 'instant' | 'daily' | 'weekly';
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
  };
  security: {
    twoFactorEnabled: boolean;
  };
  billing: {
    plan: 'Free' | 'Pro' | 'Enterprise';
    nextBillingDate: Date;
    creditsBalance: number;
    planAllocation: number;
  };
  integrations: {
    [key: string]: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  lastModified: Date;
}

export interface SavedPrompt {
  id: string;
  title: string;
  content: string;
  category: string;
  lastUsed: Date;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  instructions: string;
  avatar?: string;
}

export interface Draft {
  id: string;
  title: string;
  content: string;
  type: 'document' | 'email' | 'advice';
  projectName?: string;
  category?: string;
  lastModified: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: LegalMessage[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  category?: 'Case Law' | 'Regulation' | 'System' | 'Update';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'In Progress' | 'On Hold' | 'Completed';
  progress: number;
  dueDate: Date;
  type: string;
}

// ═══════════════════════════════════════════════
// NEW: Structured AI Response System Types
// ═══════════════════════════════════════════════

/** The 8 animation states for the StatePill */
export type PillState = 'thinking' | 'searching' | 'reading' | 'drafting' | 'asking' | 'paused' | 'done' | 'streaming';

/** A single entry in the Thoughts panel */
export interface ThoughtEntry {
  id: string;
  type: 'search' | 'read' | 'calc' | 'doc' | 'check';
  title: string;
  subtitle: string;
  sources?: string[];
  status: 'live' | 'done';
}

/** AI-generated follow-up question card */
export interface FollowUpCardData {
  intro: string;
  questions: Array<{
    id: string;
    question: string;
    options?: string[];
    allowFreeText?: boolean;
    placeholder?: string;
  }>;
}

/** AI-generated pause card for document detail collection */
export interface PauseCardData {
  title?: string;
  description: string;
  buttonText?: string;
  fields: Array<{
    id: string;
    label: string;
    placeholder: string;
    type: 'text' | 'select' | 'textarea';
    options?: string[];
    defaultValue?: string;
  }>;
}

/** AI-generated structured answer card */
export interface AnswerCardData {
  title: string;
  rows: Array<{
    label: string;
    value: string;
    status: 'good' | 'warn' | 'bad' | 'neutral';
  }>;
}

/** Citation card data — expandable in a grid */
export interface CitationData {
  type: 'statute' | 'case' | 'web';
  title: string;
  subtitle: string;
  fullText: string;
  url: string;
}

/** Sources block — compact list of cited sources */
export interface SourcesBlockData {
  sources: string[];
}

/** Action button in the response */
export interface ActionButtonData {
  label: string;
  style: 'primary' | 'secondary' | 'drive';
  action: string; // identifier for the action
}

/** Follow-up suggestion chips */
export interface SuggestionsData {
  suggestions: string[];
}

/** Document preview data for in-chat preview */
export interface DocPreviewData {
  title: string;
  previewHtml: string;
  fullHtml: string;
}

/** A structured component emitted by the AI */
export interface AIComponent {
  type: 'followup_card' | 'pause_card' | 'answer_card' | 'citations' | 'doc_preview' | 'suggestions' | 'sources' | 'actions';
  data: FollowUpCardData | PauseCardData | AnswerCardData | CitationData[] | DocPreviewData | SuggestionsData | SourcesBlockData | ActionButtonData[];
}

/** A single chunk from the SSE stream */
export type AIResponseChunk =
  | { type: 'session'; chatId: string }
  | { type: 'state_change'; state: PillState; stateLabel: string }
  | { type: 'thought'; thought: Omit<ThoughtEntry, 'id'> }
  | { type: 'content'; delta: string; model?: string }
  | { type: 'thinking'; delta: string; model?: string }
  | { type: 'component'; component: AIComponent }
  | { type: 'metadata'; citations: LegalCitation[] }
  | { type: 'error'; message: string }
  | { type: 'done' };

/** Canvas panel state */
export interface CanvasState {
  isOpen: boolean;
  activeTab: 'preview' | 'code' | 'editor';
  documentHtml: string;
  documentTitle: string;
}

export interface RealtimePresenseState {
  user_id: string;
  online_at: string;
  email?: string;
}

export interface CaseActivity {
  id: string;
  case_id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
  profiles?: { full_name: string };
}
