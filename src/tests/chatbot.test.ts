import { sendMessage } from '../services/chatService';
import KnowledgeBaseService from '../services/knowledgeBaseService';

describe('Chatbot Functionality Tests', () => {
  // Basic Interaction Tests
  test('handles basic greetings correctly', async () => {
    const greetings = ['hi', 'hello', 'hey', 'good morning'];
    for (const greeting of greetings) {
      const response = await sendMessage(greeting);
      expect(response).toMatch(/^(Hi|Hello|Hey|Good morning)/i);
      expect(response.length).toBeLessThan(200); // Ensure concise responses
    }
  });

  // Context Retention Tests
  test('maintains conversation context', async () => {
    await sendMessage('My name is John');
    const response = await sendMessage('What is my name?');
    expect(response).toContain('John');
  });

  // Knowledge Base Integration Tests
  test('provides accurate knowledge base responses', async () => {
    const kbService = KnowledgeBaseService.getInstance();
    
    // Test FAQ responses
    const faqResponse = await sendMessage('What are your business hours?');
    expect(faqResponse).toContain('9:00 AM to 5:00 PM AEST');

    // Test pricing inquiry response
    const pricingResponse = await sendMessage('What are your pricing plans?');
    expect(pricingResponse).toContain('sales@marvi.ai');
    expect(pricingResponse).toContain('customized solutions');

    // Test product information
    const productResponse = await sendMessage('Tell me about your chatbot development');
    expect(productResponse).toContain('Chatbot');
  });

  // Error Handling Tests
  test('handles empty messages gracefully', async () => {
    const response = await sendMessage('');
    expect(response).toContain('I didn\'t receive any message');
  });

  test('handles special characters and symbols', async () => {
    const response = await sendMessage('!@#$%^&*()');
    expect(response).toContain('understand');
  });

  // Complex Query Tests
  test('processes multi-part questions', async () => {
    const response = await sendMessage(
      'Can you tell me about your pricing and also explain how the implementation works?'
    );
    expect(response).toContain('sales@marvi.ai');
    expect(response).toContain('implementation');
  });

  // File Handling Tests
  test('handles file-related queries', async () => {
    const response = await sendMessage('Can you help me upload a file?');
    expect(response).toContain('cannot directly handle file uploads');
  });

  // Command Processing Tests
  test('processes commands correctly', async () => {
    const response = await sendMessage('/help');
    expect(response).toContain('available commands');
  });

  // Edge Cases
  test('handles extremely long messages', async () => {
    const longMessage = 'test '.repeat(1000);
    const response = await sendMessage(longMessage);
    expect(response).toBeDefined();
    expect(response.length).toBeLessThan(500);
  });

  test('handles non-English characters', async () => {
    const response = await sendMessage('こんにちは');
    expect(response).toBeDefined();
    expect(response).toContain('language');
  });

  // Rate Limiting Tests
  test('handles rapid consecutive messages', async () => {
    const messages = Array(5).fill('Hello');
    const responses = await Promise.all(messages.map(msg => sendMessage(msg)));
    expect(responses).toHaveLength(5);
    responses.forEach(response => expect(response).toBeDefined());
  });

  // Security Tests
  test('sanitizes potentially harmful inputs', async () => {
    const response = await sendMessage('<script>alert("test")</script>');
    expect(response).not.toContain('<script>');
  });

  // Business Logic Tests
  test('provides accurate business information', async () => {
    const responses = await Promise.all([
      sendMessage('What services do you offer?'),
      sendMessage('How can AI help my business?'),
      sendMessage('What industries do you work with?')
    ]);

    responses.forEach(response => {
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(20);
      expect(response).not.toContain('undefined');
    });
  });

  // Integration Tests
  test('integrates with knowledge base correctly', async () => {
    const kbService = KnowledgeBaseService.getInstance();
    const testQuery = 'What are your business hours?';
    
    // Direct knowledge base query
    const kbResponse = kbService.search(testQuery);
    expect(kbResponse).toBeDefined();
    
    // Chatbot response using knowledge base
    const chatResponse = await sendMessage(testQuery);
    expect(chatResponse).toContain(kbResponse);
  });

  // Performance Tests
  test('responds within acceptable time limits', async () => {
    const start = Date.now();
    await sendMessage('Hello');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000); // Response should be under 2 seconds
  });
});