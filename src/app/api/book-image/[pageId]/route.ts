import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  const { pageId } = await params;
  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId });
    const props = page.properties;

    const imageProp = Object.values(props).find(
      (p: any) => p.id === 'mWz;' || p.id === 'mWz%3B'
    ) as any;

    let s3Url = '';
    if (imageProp?.type === 'files' && imageProp.files?.length > 0) {
      const file = imageProp.files[0];
      s3Url = file.file?.url || file.external?.url || '';
    }

    if (!s3Url) {
      return new NextResponse(null, { status: 404 });
    }

    const response = NextResponse.redirect(s3Url, 307);
    // Vercel CDN が約58分キャッシュ → 失効前に自動更新
    response.headers.set('Cache-Control', 'public, s-maxage=3500, stale-while-revalidate=600');
    return response;
  } catch (error) {
    console.error('Book image proxy error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
