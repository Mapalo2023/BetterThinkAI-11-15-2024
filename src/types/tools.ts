export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'development' | 'communication' | 'analytics' | 'storage';
  icon: string;
  connected: boolean;
  status?: 'active' | 'pending' | 'error';
  config: Record<string, any>;
}

export interface ToolMessage {
  type: 'tool-update' | 'tool-query' | 'tool-response';
  data: {
    toolId: string;
    [key: string]: any;
  };
}

export interface ToolQuery {
  toolId: string;
  action: string;
  parameters: Record<string, any>;
}

export interface ToolResponse {
  toolId: string;
  success: boolean;
  data?: any;
  error?: string;
}