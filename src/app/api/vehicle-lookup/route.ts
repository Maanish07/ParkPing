import { NextRequest, NextResponse } from 'next/server';
import { fetchVehicleDetails } from '@/lib/vahan';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const plate = url.searchParams.get('plate');

    if (!plate || plate.trim().length < 4) {
      return NextResponse.json({ success: false, error: 'Valid vehicle plate is required' }, { status: 400 });
    }

    const details = await fetchVehicleDetails(plate);
    return NextResponse.json({ success: true, vehicle: details });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
