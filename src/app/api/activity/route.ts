import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        include: {
          venue: { select: { id: true, name: true, coverImageUrl: true } },
          list: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.activity.count(),
    ]);

    return NextResponse.json({ success: true, data: activities, total, page, limit });
  } catch (error) {
    console.error('GET /api/activity error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch activity' }, { status: 500 });
  }
}
