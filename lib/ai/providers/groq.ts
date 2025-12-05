import Groq from 'groq-sdk';
import { AIProvider, MultilingualDescription } from '../types';

export class GroqProvider implements AIProvider {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set');
    }
    this.client = new Groq({ apiKey });
  }

  getName(): string {
    return 'Groq';
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

    const completion = await this.client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a professional product copywriter. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in Groq response');
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Groq response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async embedText(text: string): Promise<number[]> {
    throw new Error('Groq does not support embeddings directly. Use another provider for embeddings or implement delegation.');
  }
}
