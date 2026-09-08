import { NextRequest, NextResponse } from 'next/server';
import { getPingLogs } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const tagId = url.searchParams.get('tagId') || undefined;
    const logs = getPingLogs(tagId);
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
