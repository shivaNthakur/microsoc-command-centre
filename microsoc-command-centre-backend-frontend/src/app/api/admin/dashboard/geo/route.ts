import { NextRequest, NextResponse } from 'next/server';
import { getIPGeoLocation } from '@/utils/ipInfo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get('ip');

    if (!ip) {
      return NextResponse.json(
        { success: false, message: 'IP parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🌍 Fetching geo for IP: ${ip}`);

    // Check if IP is private/local
    const isPrivateIP = 
      ip === '127.0.0.1' || 
      ip === 'localhost' ||
      ip.startsWith('192.168.') || 
      ip.startsWith('10.') || 
      ip.startsWith('172.16.') ||
      ip.startsWith('172.17.') ||
      ip.startsWith('172.18.') ||
      ip.startsWith('172.19.') ||
      ip.startsWith('172.20.') ||
      ip.startsWith('172.21.') ||
      ip.startsWith('172.22.') ||
      ip.startsWith('172.23.') ||
      ip.startsWith('172.24.') ||
      ip.startsWith('172.25.') ||
      ip.startsWith('172.26.') ||
      ip.startsWith('172.27.') ||
      ip.startsWith('172.28.') ||
      ip.startsWith('172.29.') ||
      ip.startsWith('172.30.') ||
      ip.startsWith('172.31.');

    if (isPrivateIP) {
      // Return a default location for private IPs (e.g., your city)
      console.log(`⚠️ Private IP detected: ${ip} - using default location`);
      return NextResponse.json(
        {
          success: true,
          data: {
            ip,
            lat: 26.8467,  // Lucknow, India (your location)
            lng: 80.9462,
            country: 'India',
            countryCode: 'IN',
            city: 'Lucknow',
            region: 'Uttar Pradesh',
            isPrivate: true
          }
        },
        { status: 200 }
      );
    }

    // Fetch real geolocation for public IPs
    const geo = await getIPGeoLocation(ip);

    if (!geo) {
      console.warn(`❌ Geolocation failed for IP: ${ip}`);
      // Return default location on failure
      return NextResponse.json(
        {
          success: true,
          data: {
            ip,
            lat: 26.8467,
            lng: 80.9462,
            country: 'Unknown',
            countryCode: 'XX',
            city: 'Unknown',
            region: 'Unknown',
            isPrivate: false
          }
        },
        { status: 200 }
      );
    }

    console.log(`✅ Geo found for ${ip}: ${geo.city}, ${geo.country}`);

    return NextResponse.json(
      {
        success: true,
        data: {
          ip: geo.ip,
          lat: geo.lat,
          lng: geo.lng,
          country: geo.country,
          countryCode: geo.countryCode,
          city: geo.city,
          region: geo.region,
          isPrivate: false
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Geo API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch geolocation',
        error: error.message
      },
      { status: 500 }
    );
  }
}



// import { NextRequest, NextResponse } from "next/server";
// import { getIPGeoLocation } from "@/utils/ipInfo";

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const ip = searchParams.get("ip");

//     if (!ip) {
//       return NextResponse.json(
//         { success: false, message: "IP address is required" },
//         { status: 400 }
//       );
//     }

//     const geo = await getIPGeoLocation(ip);

//     if (!geo) {
//       return NextResponse.json(
//         { success: false, message: "Could not fetch geo-location" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { success: true, data: geo },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("Error fetching geo-location:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch geo-location",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }