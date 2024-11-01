import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  sessionId: string;
  message: string;
  isUser: boolean;
  timestamp: number;
}

interface SessionStats {
  totalSessions: number;
  totalMessages: number;
  avgMessagesPerSession: number;
}

class DatabaseService {
  private static instance: DatabaseService;
  private messages: ChatMessage[] = [];

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async addMessage(sessionId: string, message: string, isUser: boolean): Promise<void> {
    this.messages.push({
      sessionId,
      message,
      isUser,
      timestamp: Date.now(),
    });
  }

  public async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    if (sessionId === 'all') {
      return this.messages;
    }
    return this.messages.filter(msg => msg.sessionId === sessionId);
  }

  public async getSessionStats(): Promise<SessionStats> {
    const uniqueSessions = new Set(this.messages.map(msg => msg.sessionId));
    const totalSessions = uniqueSessions.size;
    const totalMessages = this.messages.length;
    const avgMessagesPerSession = totalSessions > 0 ? totalMessages / totalSessions : 0;

    return {
      totalSessions,
      totalMessages,
      avgMessagesPerSession,
    };
  }

  public async clearSession(sessionId: string): Promise<void> {
    this.messages = this.messages.filter(msg => msg.sessionId !== sessionId);
  }

  public async clearAllSessions(): Promise<void> {
    this.messages = [];
  }
}

export default DatabaseService;