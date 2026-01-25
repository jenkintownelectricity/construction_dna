import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function POST(request: Request) {
  try {
    const { question, context } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const answer = await engine.ask(question, context);

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
