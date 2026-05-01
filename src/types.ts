export type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrls?: string[];
}

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  year: 11 | 12;
}

export interface SageConfig {
  systemPrompt: string;
}
