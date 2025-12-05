export interface MultilingualDescription {
  ar: string;
  en: string;
  zh: string;
}

export interface AIProvider {
  generateDescriptionAllLanguages(productName: string, category?: string): Promise<MultilingualDescription>;
  embedText(text: string): Promise<number[]>;
  getName(): string;
}

export type AIProviderType = 'google' | 'openai' | 'groq' | 'huggingface';
