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

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { text: corrected } = await generateText({
      model: openai('gpt-4o-mini'), // Using cheaper model
      prompt: `Correct the grammar and spelling in the following text. Maintain the original meaning and style. Only return the corrected text without any explanations:

"${text}"

Corrected text:`,
      maxTokens: 150, // Reduced tokens to save costs
      temperature: 0.3,
    });

    return NextResponse.json({ corrected });
  } catch (error: any) {
    console.error('Grammar correction error:', error);
    
    // Handle quota exceeded error specifically
    if (error?.statusCode === 429 || error?.message?.includes('quota')) {
      return NextResponse.json(
        { 
          error: 'OpenAI quota exceeded. Please check your billing settings.',
          fallback: text || '' // Return original text as fallback
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to correct grammar',
        fallback: text || '' // Return original text as fallback
      },
      { status: 500 }
    );
  }
}
