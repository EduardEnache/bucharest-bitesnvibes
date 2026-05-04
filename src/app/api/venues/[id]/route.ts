import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const venue = await prisma.venue.findUnique({
      where: { id },
      include: { listVenues: { include: { list: true } } },
    });

    if (!venue) return NextResponse.json({ success: false, error: 'Venue not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: venue });
  } catch (error) {
    console.error('GET /api/venues/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch venue' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const existing = await prisma.venue.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: 'Venue not found' }, { status: 404 });

    const venue = await prisma.venue.update({ where: { id }, data: body });

    // Determine activity type
    let activityType: 'VENUE_UPDATED' | 'VENUE_RATED' | 'VENUE_VISITED' | 'VENUE_FAVORITED' = 'VENUE_UPDATED';
    let description = `Updated ${venue.name}`;

    if (body.personalRating && body.personalRating !== existing.personalRating) {
      activityType = 'VENUE_RATED';
      description = `Rated ${venue.name} ${'★'.repeat(body.personalRating)}`;
    } else if (body.status === 'VISITED' && existing.status !== 'VISITED') {
      activityType = 'VENUE_VISITED';
      description = `Marked ${venue.name} as visited`;
    } else if (body.status === 'FAVORITE' && existing.status !== 'FAVORITE') {
      activityType = 'VENUE_FAVORITED';
      description = `Added ${venue.name} to favorites`;
    }

    await prisma.activity.create({
      data: {
        type: activityType,
        description,
        venueId: venue.id,
        metadata: body.personalRating ? { rating: body.personalRating } : undefined,
      },
    });

    return NextResponse.json({ success: true, data: venue });
  } catch (error) {
    console.error('PUT /api/venues/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update venue' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.venue.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/venues/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete venue' }, { status: 500 });
  }
}
