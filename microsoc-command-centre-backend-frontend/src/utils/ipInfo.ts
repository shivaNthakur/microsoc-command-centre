import axios from 'axios';
import { cacheGet, cacheSet } from '@/lib/redis';

interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  isp?: string;
  timezone?: string;
}

// Free IP geolocation API (no rate limit for reasonable use)
const GEO_API_URL = 'http://ip-api.com/json';

export async function getIPGeoLocation(ip: string): Promise<GeoLocation | null> {
  try {
    // Check cache first
    const cacheKey = `ip:geo:${ip}`;
    const cached = await cacheGet(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit for IP: ${ip}`);
      return cached;
    }

    // Skip localhost and private IPs
    if (
      ip === '127.0.0.1' || 
      ip === 'localhost' || 
      ip.startsWith('192.168.') || 
      ip.startsWith('10.') || 
      ip.startsWith('172.')
    ) {
      const localGeo: GeoLocation = {
        ip,
        country: 'Local Network',
        countryCode: 'XX',
        city: 'Local',
        region: 'Private',
        lat: 26.8467,  // Default to your location (Lucknow)
        lng: 80.9462,
      };
      await cacheSet(cacheKey, localGeo, 86400); // Cache for 24 hours
      return localGeo;
    }

    console.log(`🌍 Fetching geo from API for: ${ip}`);

    // Fetch from API with timeout
    const response = await axios.get(`${GEO_API_URL}/${ip}`, {
      timeout: 5000,
      params: {
        fields: 'status,message,country,countryCode,region,regionName,city,lat,lon,isp,timezone'
      }
    });

    console.log(`📡 API Response for ${ip}:`, response.data);

    if (response.data.status === 'success') {
      const geo: GeoLocation = {
        ip,
        country: response.data.country || 'Unknown',
        countryCode: response.data.countryCode || 'XX',
        city: response.data.city || 'Unknown',
        region: response.data.regionName || response.data.region || 'Unknown',
        lat: response.data.lat || 0,
        lng: response.data.lon || 0,
        isp: response.data.isp,
        timezone: response.data.timezone,
      };

      // Cache for 24 hours
      await cacheSet(cacheKey, geo, 86400);
      console.log(`✅ Geo cached for ${ip}: ${geo.city}, ${geo.country}`);
      return geo;
    } else {
      console.warn(`⚠️ API returned failure for ${ip}:`, response.data.message);
      return null;
    }

  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      console.error(`⏱️ Timeout fetching geo for IP ${ip}`);
    } else {
      console.error(`❌ Error fetching geo for IP ${ip}:`, error.message);
    }
    
    // Return default location on error
    const fallbackGeo: GeoLocation = {
      ip,
      country: 'Unknown',
      countryCode: 'XX',
      city: 'Unknown',
      region: 'Unknown',
      lat: 26.8467,
      lng: 80.9462,
    };
    
    // Cache fallback to avoid repeated failed requests
    await cacheSet(`ip:geo:${ip}`, fallbackGeo, 3600); // Cache for 1 hour
    return fallbackGeo;
  }
}

export async function getBulkIPGeoLocation(ips: string[]): Promise<Map<string, GeoLocation>> {
  const results = new Map<string, GeoLocation>();
  
  // Process in batches to avoid rate limits (45 requests per minute for ip-api.com)
  const batchSize = 10;
  for (let i = 0; i < ips.length; i += batchSize) {
    const batch = ips.slice(i, i + batchSize);
    const promises = batch.map(ip => getIPGeoLocation(ip));
    const batchResults = await Promise.allSettled(promises);
    
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        results.set(batch[index], result.value);
      }
    });
    
    // Delay between batches (to respect rate limits)
    if (i + batchSize < ips.length) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
    }
  }
  
  return results;
}


// import axios from 'axios';
// import { cacheGet, cacheSet } from '@/lib/redis';

// interface GeoLocation {
//   ip: string;
//   country: string;
//   countryCode: string;
//   city: string;
//   region: string;
//   lat: number;
//   lng: number;
//   isp?: string;
//   timezone?: string;
// }

// // Free IP geolocation API
// const GEO_API_URL = 'http://ip-api.com/json';

// export async function getIPGeoLocation(ip: string): Promise<GeoLocation | null> {
//   try {
    
//     const cacheKey = `ip:geo:${ip}`;
//     const cached = await cacheGet(cacheKey);
//     if (cached) {
//       return cached;
//     }

//     // Skip localhost and private IPs
//     if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
//       return {
//         ip,
//         country: 'Unknown',
//         countryCode: 'XX',
//         city: 'Local',
//         region: 'Local',
//         lat: 0,
//         lng: 0,
//       };
//     }

//     // Fetch from API
//     const response = await axios.get(`${GEO_API_URL}/${ip}`, {
//       timeout: 5000,
//     });

//     if (response.data.status === 'success') {
//       const geo: GeoLocation = {
//         ip,
//         country: response.data.country || 'Unknown',
//         countryCode: response.data.countryCode || 'XX',
//         city: response.data.city || 'Unknown',
//         region: response.data.regionName || 'Unknown',
//         lat: response.data.lat || 0,
//         lng: response.data.lon || 0,
//         isp: response.data.isp,
//         timezone: response.data.timezone,
//       };

//       // Cache for 24 hours
//       await cacheSet(cacheKey, geo, 86400);
//       return geo;
//     }

//     return null;
//   } catch (error: any) {
//     console.error(`Error fetching geo for IP ${ip}:`, error.message);
//     // Return default for errors
//     return {
//       ip,
//       country: 'Unknown',
//       countryCode: 'XX',
//       city: 'Unknown',
//       region: 'Unknown',
//       lat: 0,
//       lng: 0,
//     };
//   }
// }

// export async function getBulkIPGeoLocation(ips: string[]): Promise<Map<string, GeoLocation>> {
//   const results = new Map<string, GeoLocation>();
  
//   // Process in batches to avoid rate limits
//   const batchSize = 10;
//   for (let i = 0; i < ips.length; i += batchSize) {
//     const batch = ips.slice(i, i + batchSize);
//     const promises = batch.map(ip => getIPGeoLocation(ip));
//     const batchResults = await Promise.all(promises);
    
//     batchResults.forEach((geo, index) => {
//       if (geo) {
//         results.set(batch[index], geo);
//       }
//     });
    
//     // Small delay between batches
//     if (i + batchSize < ips.length) {
//       await new Promise(resolve => setTimeout(resolve, 100));
//     }
//   }
  
//   return results;
// }

