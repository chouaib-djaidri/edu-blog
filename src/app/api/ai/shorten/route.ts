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

    const { text: shortened } = await generateText({
      model: openai('gpt-4o-mini'), // Using cheaper model
      prompt: `Make the following text shorter and more concise while preserving the key meaning and important details. Remove unnecessary words and redundancy:

"${text}"

Shortened text:`,
      maxTokens: 100, // Reduced tokens
      temperature: 0.3,
    });

    return NextResponse.json({ shortened });
  } catch (error: any) {
    console.error('Shorten text error:', error);
    
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
        error: 'Failed to shorten text',
        fallback: text || ''
      },
      { status: 500 }
    );
  }
}
