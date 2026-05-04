import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const list = await prisma.list.findUnique({
      where: { id },
      include: {
        listVenues: { include: { venue: true }, orderBy: { addedAt: 'desc' } },
        _count: { select: { listVenues: true } },
      },
    });

    if (!list) return NextResponse.json({ success: false, error: 'List not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('GET /api/lists/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch list' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const list = await prisma.list.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('PUT /api/lists/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update list' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.list.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/lists/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete list' }, { status: 500 });
  }
}

// POST to add venue to list
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { venueId } = body;

    const listVenue = await prisma.listVenue.create({
      data: { listId: id, venueId },
      include: { venue: true, list: true },
    });

    await prisma.activity.create({
      data: {
        type: 'LIST_VENUE_ADDED',
        description: `Added ${listVenue.venue.name} to ${listVenue.list.name}`,
        venueId,
        listId: id,
      },
    });

    return NextResponse.json({ success: true, data: listVenue }, { status: 201 });
  } catch (error) {
    console.error('POST /api/lists/[id]/venues error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add venue to list' }, { status: 500 });
  }
}
