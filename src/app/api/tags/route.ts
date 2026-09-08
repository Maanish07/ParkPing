import { NextRequest, NextResponse } from 'next/server';
import { getAllTags, createTag, createBulkTags } from '@/lib/storage';

export async function GET() {
  try {
    const tags = getAllTags();
    return NextResponse.json({ success: true, count: tags.length, tags });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if bulk creation
    if (Array.isArray(body.items)) {
      if (body.items.length === 0) {
        return NextResponse.json({ success: false, error: 'Items array is empty' }, { status: 400 });
      }
      const created = createBulkTags(body.items);
      return NextResponse.json({ success: true, count: created.length, tags: created }, { status: 201 });
    }

    // Single creation
    if (!body.vehicleNumber || !body.phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Both Vehicle Number and Mobile Number are required' },
        { status: 400 }
      );
    }

    const newTag = createTag(body);
    return NextResponse.json({ success: true, tag: newTag }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
