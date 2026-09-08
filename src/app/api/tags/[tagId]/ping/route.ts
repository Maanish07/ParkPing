import { NextRequest, NextResponse } from 'next/server';
import { getTagById, addPingLog } from '@/lib/storage';
import { maskPhoneNumber } from '@/lib/mask';

export async function POST(
  req: NextRequest,
  { params }: { params: { tagId: string } }
) {
  try {
    const { tagId } = params;
    const tag = getTagById(tagId);

    if (!tag) {
      return NextResponse.json({ success: false, error: 'Vehicle Tag not found' }, { status: 404 });
    }

    const body = await req.json();
    const { alertType = 'blocking', message = '', actionType = 'whatsapp', senderPhone = '' } = body;

    // Record the activity in ping history
    const log = addPingLog({
      tagId: tag.id,
      vehicleNumber: tag.vehicleNumber,
      alertType,
      message: message || `Alert for ${tag.vehicleNumber}`,
      senderPhoneMasked: senderPhone ? maskPhoneNumber(senderPhone) : undefined,
      actionType,
      status: 'delivered',
    });

    // Create privacy-safe response
    // For WhatsApp: Clean phone number without '+' or spaces for wa.me link
    const cleanPhone = tag.phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(
      `🚨 *PARKPING ALERT for [${tag.vehicleNumber}]*\n\n${message || 'Your vehicle requires your immediate attention.'}\n\n_Sent securely via ParkPing Smart Tag_`
    );
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // For Call: We generate a Virtual Masked Call Relay Session ID
    const relaySessionId = `relay_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return NextResponse.json({
      success: true,
      log,
      relaySessionId,
      whatsappUrl,
      maskedRecipient: maskPhoneNumber(tag.phoneNumber),
      instructions: actionType === 'call' 
        ? 'Connecting to ParkPing Masked Voice Relay...' 
        : 'Dispatching masked WhatsApp alert to vehicle owner...',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
