import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const neighborhood = searchParams.get('neighborhood');
    const sector = searchParams.get('sector');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const where: Prisma.VenueWhereInput = {};
    if (status) where.status = status as Prisma.EnumVenueStatusFilter;
    if (type) where.type = type;
    if (neighborhood) where.neighborhood = neighborhood;
    if (sector) where.sector = sector;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const orderBy: Prisma.VenueOrderByWithRelationInput = (() => {
      switch (sortBy) {
        case 'newest': return { createdAt: 'desc' };
        case 'rating': return { personalRating: { sort: 'desc', nulls: 'last' } };
        case 'googleRating': return { googleRating: { sort: 'desc', nulls: 'last' } };
        case 'priceAsc': return { priceLevel: 'asc' };
        case 'priceDesc': return { priceLevel: 'desc' };
        case 'name': return { name: 'asc' };
        case 'visited': return { dateVisited: { sort: 'desc', nulls: 'last' } };
        default: return { createdAt: 'desc' };
      }
    })();

    const [venues, total] = await Promise.all([
      prisma.venue.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.venue.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: venues, total, page, limit });
  } catch (error) {
    console.error('GET /api/venues error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch venues' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const venue = await prisma.venue.create({ data: body });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'VENUE_ADDED',
        description: `Added ${venue.name} to directory`,
        venueId: venue.id,
      },
    });

    return NextResponse.json({ success: true, data: venue }, { status: 201 });
  } catch (error) {
    console.error('POST /api/venues error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create venue' }, { status: 500 });
  }
}
