import { NextRequest, NextResponse } from 'next/server';
import { getIPGeoLocation } from '@/utils/ipInfo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get('ip');

    if (!ip) {
      return NextResponse.json(
        { success: false, message: 'IP address is required' },
        { status: 400 }
      );
    }

    const geo = await getIPGeoLocation(ip);

    if (!geo) {
      return NextResponse.json(
        { success: false, message: 'Could not fetch geo-location' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: geo },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching geo-location:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch geo-location',
        error: error.message
      },
      { status: 500 }
    );
  }
}

