import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(request: NextRequest) {
  let text: string;
  
  try {
    const body = await request.json();
    text = body.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { text: improved } = await generateText({
      model: openai('gpt-4o-mini'), // Using cheaper model
      prompt: `Improve the following text by making it more engaging, clear, and well-written. Enhance the vocabulary, sentence structure, and flow while maintaining the original meaning:

"${text}"

Improved text:`,
      maxTokens: 150, // Reduced tokens
      temperature: 0.4,
    });

    return NextResponse.json({ improved });
  } catch (error: any) {
    console.error('Improve text error:', error);
    
    if (error?.statusCode === 429 || error?.message?.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'OpenAI quota exceeded. Please check your billing settings.',
          fallback: text || ''
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to improve text',
        fallback: text || ''
      },
      { status: 500 }
    );
  }
}
