import OpenAI from 'openai';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function createOpenAIClient() {
  const subscription = useSubscriptionStore.getState().subscription;
  
  return new OpenAI({
    apiKey: subscription?.customApiKey || import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
}