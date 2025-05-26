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

    const { text: expanded } = await generateText({
      model: openai('gpt-4o-mini'), // Using cheaper model
      prompt: `Expand the following text by adding more details, examples, and explanations while maintaining the original meaning and tone. Make it more comprehensive and informative:

"${text}"

Expanded text:`,
      maxTokens: 200, // Slightly reduced tokens
      temperature: 0.5,
    });

    return NextResponse.json({ expanded });
  } catch (error: any) {
    console.error('Expand text error:', error);
    
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
        error: 'Failed to expand text',
        fallback: text || ''
      },
      { status: 500 }
    );
  }
}
