import OpenAI from 'openai';
import { AIProvider, MultilingualDescription } from '../types';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    this.client = new OpenAI({ apiKey });
  }

  getName(): string {
    return 'OpenAI';
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
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional product copywriter for an electronics marketplace.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    return JSON.parse(content);
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  }
}
