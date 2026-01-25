import { NextResponse } from 'next/server';
import { engine } from '@/lib/engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      division: searchParams.get('division') || undefined,
      category: searchParams.get('category') || undefined,
      chemistry: searchParams.get('chemistry') || undefined,
      manufacturer: searchParams.get('manufacturer') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    const materials = await engine.list(filters);
    const total = await engine.count(filters);

    return NextResponse.json({ materials, total });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const material = await engine.create(data);
    return NextResponse.json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { error: 'Failed to create material' },
      { status: 500 }
    );
  }
}
