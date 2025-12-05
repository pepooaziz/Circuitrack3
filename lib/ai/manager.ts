import { AIProvider, AIProviderType } from './types';
import { GoogleAIProvider } from './providers/google';
import { OpenAIProvider } from './providers/openai';
import { GroqProvider } from './providers/groq';
import { HuggingFaceProvider } from './providers/huggingface';

export function getAIProvider(providerType?: AIProviderType): AIProvider {
  const provider = providerType || (process.env.AI_PROVIDER as AIProviderType) || 'google';

  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'groq':
      return new GroqProvider();
    case 'huggingface':
      return new HuggingFaceProvider();
    case 'google':
    default:
      return new GoogleAIProvider();
  }
}

export async function generateProductDescriptions(
  productName: string,
  category?: string,
  providerType?: AIProviderType
) {
  const provider = getAIProvider(providerType);
  return provider.generateDescriptionAllLanguages(productName, category);
}

export async function generateEmbedding(
  text: string,
  providerType?: AIProviderType
): Promise<number[]> {
  const provider = getAIProvider(providerType);
  return provider.embedText(text);
}
