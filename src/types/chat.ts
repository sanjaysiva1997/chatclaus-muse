
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatSettings {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}
