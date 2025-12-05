import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider, MultilingualDescription } from '../types';

export class GoogleAIProvider implements AIProvider {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  getName(): string {
    return 'Google Gemini';
  }

  async generateDescriptionAllLanguages(
    productName: string,
    category?: string
  ): Promise<MultilingualDescription> {
    const prompt = `Generate three product descriptions for an electronics marketplace for the following product:
Product Name: ${productName}
${category ? `Category: ${category}` : ''}

Generate descriptions in three languages:
1. Arabic (ar) - professional marketing description
2. English (en) - professional marketing description
3. Chinese Simplified (zh) - professional marketing description

Each description should be 2-3 sentences, highlighting key features and benefits.
Format as JSON: {"ar": "...", "en": "...", "zh": "..."}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const descriptions = JSON.parse(jsonMatch[0]);
    return descriptions;
  }

  async embedText(text: string): Promise<number[]> {
    const embeddingModel = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
  }
}
