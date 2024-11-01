import OpenAI from 'openai';
import KnowledgeBaseService from './knowledgeBaseService';
import { config } from '../config/env';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
  dangerouslyAllowBrowser: true // Note: This is for demo purposes. In production, use a backend service.
});

const knowledgeBaseService = KnowledgeBaseService.getInstance();

let conversationHistory: { role: string; content: string }[] = [
  { role: "system", content: "You are a helpful AI assistant." }
];

export const sendMessage = async (message: string) => {
  if (!message.trim()) {
    return "I didn't receive any message. How can I help you?";
  }

  try {
    // Sanitize input
    const sanitizedMessage = message.replace(/<[^>]*>/g, '');

    // First, try to find an answer in the knowledge base
    const knowledgeBaseAnswer = knowledgeBaseService.search(sanitizedMessage);
    if (knowledgeBaseAnswer) {
      return knowledgeBaseAnswer;
    }

    // Check if it's a pricing-related query
    const pricingKeywords = ['pricing', 'price', 'cost', 'package', 'plan', 'subscription', 'payment'];
    if (pricingKeywords.some(keyword => sanitizedMessage.toLowerCase().includes(keyword))) {
      return "For detailed information about our pricing plans and packages, please contact our sales team at sales@marvi.ai. We offer customized solutions tailored to your business needs and scale.";
    }

    // Add user message to conversation history
    conversationHistory.push({ role: "user", content: sanitizedMessage });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationHistory,
      max_tokens: 250,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    });

    const assistantMessage = response.choices[0].message.content;

    // Add assistant's response to conversation history
    conversationHistory.push({ role: "assistant", content: assistantMessage });

    return assistantMessage;
  } catch (error) {
    console.error('Chat error:', error);
    return "I apologize, but I'm having trouble processing your request. Please try again later.";
  }
};

export const analyzeInteractions = () => {
  return knowledgeBaseService.analyzeInteractions();
};