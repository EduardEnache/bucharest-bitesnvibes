import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { autocompletePlace, getPlaceDetails, extractPlaceIdFromUrl } from '@/lib/googlePlaces';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const serverKey = process.env.GOOGLE_MAPS_SERVER_KEY;

  if (!serverKey) {
    return NextResponse.json(
      { success: false, error: 'Google Maps API key not configured' },
      { status: 503 }
    );
  }

  try {
    // Autocomplete
    if (!action || action === 'autocomplete') {
      const input = searchParams.get('input');
      if (!input) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });
      const results = await autocompletePlace(input);
      return NextResponse.json({ success: true, data: results });
    }

    // Place details
    if (action === 'details') {
      const placeId = searchParams.get('placeId');
      if (!placeId) return NextResponse.json({ success: false, error: 'placeId required' }, { status: 400 });
      const details = await getPlaceDetails(placeId);
      if (!details) return NextResponse.json({ success: false, error: 'Place not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: details });
    }

    // Resolve URL
    if (action === 'resolve') {
      const url = searchParams.get('url');
      if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });
      const placeId = await extractPlaceIdFromUrl(url);
      if (!placeId) return NextResponse.json({ success: false, error: 'Could not extract Place ID' }, { status: 404 });
      return NextResponse.json({ success: true, data: { placeId } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json({ success: false, error: 'Places API error' }, { status: 500 });
  }
}
