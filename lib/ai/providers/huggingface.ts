import { HfInference } from '@huggingface/inference';
import { AIProvider, MultilingualDescription } from '../types';

export class HuggingFaceProvider implements AIProvider {
  private client: HfInference;

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not set');
    }
    this.client = new HfInference(apiKey);
  }

  getName(): string {
    return 'HuggingFace';
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

    const response = await this.client.textGeneration({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
      }
    });

    const text = response.generated_text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Failed to parse HuggingFace response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  async embedText(text: string): Promise<number[]> {
    const response = await this.client.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });

    if (Array.isArray(response)) {
      return response as number[];
    }

    throw new Error('Unexpected embedding response format');
  }
}
