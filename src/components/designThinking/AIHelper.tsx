import React from 'react';
import { Sparkles } from 'lucide-react';
import { OpenAI } from 'openai';
import toast from 'react-hot-toast';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface AIHelperProps {
  stage: 'empathize' | 'define' | 'ideate' | 'prototype' | 'test';
  context?: string;
  onResult: (result: any) => void;
}

export default function AIHelper({ stage, context, onResult }: AIHelperProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const getPromptForStage = (stage: AIHelperProps['stage'], context: string) => {
    const prompts = {
      empathize: `Generate detailed user research insights for: ${context || 'a general product'}. Include research method, number of participants, key insights, pain points, and user needs. Format as JSON with structure: {
        "title": "string",
        "method": "interview" | "survey" | "observation",
        "participants": number,
        "insights": string[],
        "painPoints": string[],
        "needs": string[]
      }`,
      
      define: `Create a detailed problem statement for: ${context || 'a general product'}. Format as JSON with structure: {
        "userGroup": "string",
        "needs": "string",
        "insight": "string",
        "impact": "string"
      }`,
      
      ideate: `Generate innovative solution ideas for: ${context || 'a general product'}. Format as JSON with structure: {
        "title": "string",
        "description": "string",
        "impact": number,
        "feasibility": number,
        "tags": string[]
      }`,
      
      prototype: `Suggest a detailed prototype design for: ${context || 'a general product'}. Format as JSON with structure: {
        "title": "string",
        "description": "string",
        "type": "sketch" | "wireframe" | "mockup",
        "imageUrls": string[],
        "features": string[]
      }`,
      
      test: `Generate a comprehensive user testing plan for: ${context || 'a general product'}. Format as JSON with structure: {
        "participants": number,
        "feedback": {
          "positive": string[],
          "negative": string[],
          "suggestions": string[]
        },
        "metrics": {
          "usability": number,
          "desirability": number,
          "feasibility": number
        },
        "nextSteps": string[]
      }`
    };

    return prompts[stage];
  };

  const generateContent = async () => {
    if (!context?.trim()) {
      toast.error('Please provide context for AI suggestions');
      return;
    }

    setIsLoading(true);
    try {
      const prompt = getPromptForStage(stage, context);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert in design thinking and user-centered design. Generate detailed, practical, and innovative suggestions for each stage of the design thinking process. Ensure all responses are well-structured and follow the requested JSON format exactly."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content generated');
      }

      try {
        const result = JSON.parse(content);
        onResult(result);
        toast.success('AI suggestions generated successfully!');
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast.error('Failed to parse AI response. Please try again.');
      }
    } catch (error: any) {
      console.error('Error generating AI content:', error);
      toast.error(error.message || 'Failed to generate suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={generateContent}
      disabled={isLoading || !context?.trim()}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isLoading || !context?.trim()
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
      }`}
    >
      <Sparkles className="w-5 h-5" />
      {isLoading ? 'Generating...' : 'Get AI Suggestions'}
    </button>
  );
}