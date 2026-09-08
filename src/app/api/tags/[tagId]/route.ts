import { NextRequest, NextResponse } from 'next/server';
import { getTagById, updateTag, deleteTag, recordScan } from '@/lib/storage';
import { maskPhoneNumber } from '@/lib/mask';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tagId: string }> | { tagId: string } }
) {
  try {
    const params = await context.params;
    const tagId = params.tagId;
    const tag = getTagById(tagId);

    if (!tag) {
      return NextResponse.json({ success: false, error: 'Vehicle Tag not found' }, { status: 404 });
    }

    // Check if this is a public scan request (via ?scan=true)
    const url = new URL(req.url);
    const isScan = url.searchParams.get('scan') === 'true';
    if (isScan) {
      recordScan(tagId);
    }

    // Check if full details requested for dashboard (e.g. ?full=true) or public view
    const isFull = url.searchParams.get('full') === 'true';

    if (isFull) {
      return NextResponse.json({ success: true, tag });
    }

    // For public passerby view, MASK the private phone numbers
    return NextResponse.json({
      success: true,
      tag: {
        id: tag.id,
        vehicleNumber: tag.vehicleNumber,
        vehicleModel: tag.vehicleModel,
        vehicleType: tag.vehicleType,
        status: tag.status,
        statusMessage: tag.statusMessage,
        badgeTheme: tag.badgeTheme,
        // Masked for privacy
        maskedPhone: maskPhoneNumber(tag.phoneNumber),
        maskedAlternate: tag.alternatePhone ? maskPhoneNumber(tag.alternatePhone) : undefined,
        hasAlternate: Boolean(tag.alternatePhone),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ tagId: string }> | { tagId: string } }
) {
  try {
    const params = await context.params;
    const tagId = params.tagId;
    const updates = await req.json();

    const updated = updateTag(tagId, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Vehicle Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, tag: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ tagId: string }> | { tagId: string } }
) {
  try {
    const params = await context.params;
    const tagId = params.tagId;
    const deleted = deleteTag(tagId);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Vehicle Tag not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Tag deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
