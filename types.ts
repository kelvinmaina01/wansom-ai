
export enum AppView {
  OVERVIEW = 'overview',
  FILES = 'files',
  WORKSPACES = 'workspaces',
  WORKFLOWS = 'workflows',
  SETTINGS = 'settings',
  LEGAL_AI = 'legal-ai',
  HISTORY = 'history'
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
}

export interface Workspace {
  id: string;
  name: string;
  type: WorkspaceType;
  lastModified: Date;
}
