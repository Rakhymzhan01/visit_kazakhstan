import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ page: string }> }
) {
  try {
    const { page } = await context.params;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    
    const url = new URL(`${API_BASE_URL}/api/content/${page}`);
    if (section) {
      url.searchParams.set('section', section);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}