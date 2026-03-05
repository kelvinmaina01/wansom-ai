
export enum AppView {
  OVERVIEW = 'overview',
  FILES = 'files',
  LEGAL_SPECIALISTS = 'legal-specialists',
  WORKSPACE = 'workspace',
  SETTINGS = 'settings',
  LEGAL_AI = 'legal-ai',
  HISTORY = 'history',
  INTEGRATIONS = 'integrations',
  JUDICIAL_ANALYTICS = 'judicial-analytics'
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
  isDraft?: boolean;
  isGenerating?: boolean;
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
}

export interface Case {
  id: string;
  title: string;
  clientName: string;
  status: 'Open' | 'Closed' | 'Pending';
  practiceArea: string;
  nextHearingDate?: Date;
  documents: Array<{ name: string; type: string; date: Date }>;
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    firmName: string;
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

export interface CaseType {
  id: string;
  name: string;
  description?: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
  dueDate: Date;
  type: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  icon?: string;
}
