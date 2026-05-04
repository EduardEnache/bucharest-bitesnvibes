import type { PlaceDetails } from '@/types';

const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

function getServerKey(): string | null {
  return process.env.GOOGLE_MAPS_SERVER_KEY || null;
}

export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const key = getServerKey();
  if (!key) return null;

  const fields = [
    'name',
    'formatted_address',
    'geometry',
    'rating',
    'user_ratings_total',
    'price_level',
    'opening_hours',
    'photos',
    'formatted_phone_number',
    'website',
    'types',
    'vicinity',
  ].join(',');

  const url = `${PLACES_BASE_URL}/details/json?place_id=${placeId}&fields=${fields}&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK' || !data.result) {
      console.error('Places API error:', data.status);
      return null;
    }

    const result = data.result;
    const photoRef = result.photos?.[0]?.photo_reference;

    return {
      name: result.name || '',
      address: result.formatted_address || result.vicinity || '',
      lat: result.geometry?.location?.lat || 0,
      lng: result.geometry?.location?.lng || 0,
      placeId,
      rating: result.rating || null,
      reviewCount: result.user_ratings_total || null,
      priceLevel: result.price_level ?? null,
      openingHours: result.opening_hours
        ? {
            periods: result.opening_hours.periods,
            weekdayText: result.opening_hours.weekday_text,
            openNow: result.opening_hours.open_now,
          }
        : null,
      photoUrl: photoRef ? getPlacePhoto(photoRef) : null,
      phoneNumber: result.formatted_phone_number || null,
      website: result.website || null,
      types: result.types || [],
      venueType: mapGoogleTypesToVenueType(result.types || []),
    };
  } catch (error) {
    console.error('Failed to fetch place details:', error);
    return null;
  }
}

export function getPlacePhoto(photoReference: string, maxWidth: number = 800): string {
  const key = getServerKey();
  if (!key) return '';
  return `${PLACES_BASE_URL}/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${key}`;
}

export async function extractPlaceIdFromUrl(url: string): Promise<string | null> {
  try {
    // Handle short URLs by following redirects
    if (url.includes('goo.gl') || url.includes('maps.app')) {
      try {
        const res = await fetch(url, { redirect: 'follow' });
        url = res.url;
      } catch {
        return null;
      }
    }

    // Try to extract from ?cid= parameter
    const cidMatch = url.match(/[?&]cid=(\d+)/);
    if (cidMatch) {
      // CID requires a separate lookup, return null for now
      return null;
    }

    // Try to extract place ID from /place/ URLs
    // Format: /maps/place/PLACE_NAME/@LAT,LNG,ZOOM/data=...!1s(PLACE_ID)
    const placeIdMatch = url.match(/!1s(ChIJ[a-zA-Z0-9_-]+)/);
    if (placeIdMatch) {
      return placeIdMatch[1];
    }

    // Try ftid format
    const ftidMatch = url.match(/ftid=(0x[a-f0-9]+:0x[a-f0-9]+)/);
    if (ftidMatch) {
      return ftidMatch[1];
    }

    // Try extracting from data parameter
    const dataMatch = url.match(/data=.*?!1s([^!]+)/);
    if (dataMatch) {
      return decodeURIComponent(dataMatch[1]);
    }

    return null;
  } catch {
    return null;
  }
}

export function mapGoogleTypesToVenueType(types: string[]): string {
  const typeMap: Record<string, string> = {
    cafe: 'Coffee',
    coffee_shop: 'Coffee',
    restaurant: 'Restaurant',
    bar: 'Bar',
    night_club: 'Nightclub',
    bakery: 'Bakery',
    meal_takeaway: 'Restaurant',
    meal_delivery: 'Restaurant',
    food: 'Restaurant',
  };

  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type];
    }
  }

  return 'Other';
}

export async function autocompletePlace(
  input: string
): Promise<Array<{ placeId: string; description: string; mainText: string; secondaryText: string }>> {
  const key = getServerKey();
  if (!key) return [];

  const url = `${PLACES_BASE_URL}/autocomplete/json?input=${encodeURIComponent(
    input
  )}&types=establishment&components=country:ro&location=44.4268,26.1025&radius=20000&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== 'OK') return [];

    return (data.predictions || []).map(
      (p: {
        place_id: string;
        description: string;
        structured_formatting: { main_text: string; secondary_text: string };
      }) => ({
        placeId: p.place_id,
        description: p.description,
        mainText: p.structured_formatting.main_text,
        secondaryText: p.structured_formatting.secondary_text,
      })
    );
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
}
