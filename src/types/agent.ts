export type Language = 'ar' | 'en';

export type AgentMode = 'autonomous' | 'research' | 'analytics' | 'code';

export interface ThoughtStep {
  step: number;
  type: 'plan' | 'observation' | 'critique' | 'conclusion';
  title: string;
  content: string;
}

export interface ToolExecution {
  tool: string;
  callId: string;
  input: any;
  output?: any;
  status: 'running' | 'success' | 'failed';
  timestamp: number;
}

export interface Artifact {
  id: string;
  title: string;
  type: 'markdown' | 'code' | 'table' | 'plan';
  content: string;
  language?: string;
  timestamp: number;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thoughts?: ThoughtStep[];
  tools?: ToolExecution[];
  artifacts?: Artifact[];
  sources?: Array<{ title: string; uri: string }>;
  timestamp: number;
}

export interface AgentSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  language: Language;
  mode: AgentMode;
  messages: AgentMessage[];
}
