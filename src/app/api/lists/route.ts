import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const lists = await prisma.list.findMany({
      where: search ? { name: { contains: search, mode: 'insensitive' } } : undefined,
      include: {
        _count: { select: { listVenues: true } },
        listVenues: {
          take: 3,
          include: { venue: { select: { id: true, coverImageUrl: true, name: true } } },
          orderBy: { addedAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: lists });
  } catch (error) {
    console.error('GET /api/lists error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch lists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const list = await prisma.list.create({ data: body });

    await prisma.activity.create({
      data: {
        type: 'LIST_CREATED',
        description: `Created list: ${list.name}`,
        listId: list.id,
      },
    });

    return NextResponse.json({ success: true, data: list }, { status: 201 });
  } catch (error) {
    console.error('POST /api/lists error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create list' }, { status: 500 });
  }
}
