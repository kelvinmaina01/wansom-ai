
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
  AGENTIC_MENTORSHIP = 'agentic-mentorship',
  DRAFTS = 'drafts',
  CASE_MANAGEMENT = 'case-management',
  DOCUMENT_INSIGHTS = 'document-insights',
  INTELLIGENCE_HUB = 'intelligence-hub'
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
  notifications: {
    email: boolean;
    push: boolean;
    caseUpdates: boolean;
    newsDigest: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  billing: {
    plan: 'Free' | 'Pro' | 'Enterprise';
    nextBillingDate: Date;
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
