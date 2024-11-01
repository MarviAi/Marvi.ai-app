import knowledgeBase from '../data/knowledgeBase.json';

interface KnowledgeItem {
  question?: string;
  answer?: string;
  name?: string;
  description?: string;
  issue?: string;
  steps?: string[];
  title?: string;
}

class KnowledgeBaseService {
  private static instance: KnowledgeBaseService;
  private interactionLog: { query: string; matchedItem: string | null; timestamp: number }[] = [];

  private constructor() {}

  public static getInstance(): KnowledgeBaseService {
    if (!KnowledgeBaseService.instance) {
      KnowledgeBaseService.instance = new KnowledgeBaseService();
    }
    return KnowledgeBaseService.instance;
  }

  private isGreeting(query: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'];
    return greetings.some(greeting => query.toLowerCase().includes(greeting));
  }

  public search(query: string): string | null {
    const normalizedQuery = query.toLowerCase();

    // Check for greetings first
    if (this.isGreeting(normalizedQuery)) {
      return null; // Let the OpenAI handler manage greetings
    }

    let bestMatch: KnowledgeItem | null = null;
    let bestMatchScore = 0;

    const searchInCategory = (category: KnowledgeItem[]) => {
      for (const item of category) {
        const itemText = JSON.stringify(item).toLowerCase();
        const score = this.calculateMatchScore(normalizedQuery, itemText);
        if (score > bestMatchScore) {
          bestMatch = item;
          bestMatchScore = score;
        }
      }
    };

    searchInCategory(knowledgeBase.faq);
    searchInCategory(knowledgeBase.products);
    searchInCategory(knowledgeBase.troubleshooting);
    searchInCategory(knowledgeBase.supportPolicies);

    this.logInteraction(query, bestMatch);

    if (bestMatch && bestMatchScore > 0.7) {
      if ('answer' in bestMatch) {
        return bestMatch.answer;
      } else if ('description' in bestMatch) {
        return `${bestMatch.name}: ${bestMatch.description}`;
      } else if ('steps' in bestMatch) {
        return `For the issue "${bestMatch.issue}", follow these steps:\n${bestMatch.steps.join('\n')}`;
      } else if ('title' in bestMatch) {
        return `${bestMatch.title}: ${bestMatch.description}`;
      }
    }

    return null;
  }

  private calculateMatchScore(query: string, text: string): number {
    const queryWords = query.split(' ');
    let score = 0;
    let matches = 0;

    for (const word of queryWords) {
      if (word.length <= 2) continue;
      if (text.includes(word)) {
        matches++;
        score += word.length;
      }
    }

    const queryLength = queryWords.filter(word => word.length > 2).length;
    return queryLength > 0 ? (score / queryLength) / 10 : 0;
  }

  private logInteraction(query: string, matchedItem: KnowledgeItem | null): void {
    this.interactionLog.push({
      query,
      matchedItem: matchedItem ? JSON.stringify(matchedItem) : null,
      timestamp: Date.now(),
    });

    if (this.interactionLog.length > 1000) {
      this.interactionLog.shift();
    }
  }

  public getInteractionLog(): { query: string; matchedItem: string | null; timestamp: number }[] {
    return this.interactionLog;
  }

  public analyzeInteractions(): { commonQueries: string[]; gapsInKnowledge: string[] } {
    const queryCounts: { [key: string]: number } = {};
    const unansweredQueries: string[] = [];

    for (const interaction of this.interactionLog) {
      queryCounts[interaction.query] = (queryCounts[interaction.query] || 0) + 1;
      if (!interaction.matchedItem) {
        unansweredQueries.push(interaction.query);
      }
    }

    const commonQueries = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query]) => query);

    const gapsInKnowledge = [...new Set(unansweredQueries)].slice(0, 10);

    return { commonQueries, gapsInKnowledge };
  }
}

export default KnowledgeBaseService;