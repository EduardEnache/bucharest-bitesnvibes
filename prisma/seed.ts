import { PrismaClient, VenueStatus, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.listVenue.deleteMany();
  await prisma.list.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.userPreferences.deleteMany();

  // Seed venues
  const venues = await Promise.all([
    prisma.venue.create({
      data: {
        name: 'Origo Coffee Shop',
        type: 'Coffee',
        neighborhood: 'Lipscani',
        sector: 'Sector 3',
        lat: 44.4328,
        lng: 26.0997,
        status: VenueStatus.VISITED,
        personalRating: 5,
        googleRating: 4.8,
        googleReviewCount: 2150,
        priceLevel: 2,
        tags: ['Specialty Coffee', 'Pastries'],
        address: 'Strada Lipscani 9, București 030031',
        notes: 'Pioneers of the specialty coffee movement in Bucharest. Must try their pour-over.',
        dateVisited: new Date('2024-10-15'),
      },
    }),
    prisma.venue.create({
      data: {
        name: "Caru' cu Bere",
        type: 'Romanian',
        neighborhood: 'Centrul Vechi',
        sector: 'Sector 3',
        lat: 44.4318,
        lng: 26.0979,
        status: VenueStatus.VISITED,
        personalRating: 4,
        googleRating: 4.6,
        googleReviewCount: 48200,
        priceLevel: 3,
        tags: ['Traditional', 'Historic', 'Beer'],
        address: 'Strada Stavropoleos 5, București 030081',
        notes: 'Always book at least 2 days in advance for weekend dinners. Try the traditional papanași.',
        dateVisited: new Date('2024-09-20'),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Control Club',
        type: 'Nightclub',
        neighborhood: 'Universitate',
        sector: 'Sector 1',
        lat: 44.4368,
        lng: 26.1012,
        status: VenueStatus.FAVORITE,
        personalRating: 5,
        googleRating: 4.7,
        googleReviewCount: 5800,
        priceLevel: 2,
        tags: ['Live Music', 'Nightlife', 'Cocktails'],
        address: 'Strada Constantin Mille 4, București 010142',
        notes: 'Best live music venue in Bucharest. Great underground vibe.',
        dateVisited: new Date('2024-11-01'),
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Linea / Closer To The Moon',
        type: 'Bar',
        neighborhood: 'Centrul Vechi',
        sector: 'Sector 3',
        lat: 44.4305,
        lng: 26.0985,
        status: VenueStatus.TO_TRY,
        googleRating: 4.9,
        googleReviewCount: 3200,
        priceLevel: 3,
        tags: ['Rooftop', 'Cocktails', 'Views'],
        address: 'Strada Franceză 24, București 030106',
      },
    }),
    prisma.venue.create({
      data: {
        name: 'Fix Me A Drink',
        type: 'Bar',
        neighborhood: 'Universitate',
        sector: 'Sector 1',
        lat: 44.4355,
        lng: 26.1025,
        status: VenueStatus.VISITED,
        personalRating: 4,
        googleRating: 4.5,
        googleReviewCount: 1900,
        priceLevel: 3,
        tags: ['Botanical', 'Craft Cocktails'],
        address: 'Strada Batiștei 14, București 020932',
        notes: 'Amazing botanical-themed cocktails. The garden area is perfect in summer.',
        dateVisited: new Date('2024-08-10'),
      },
    }),
  ]);

  console.log(`✅ Created ${venues.length} venues`);

  // Create a sample list
  const list = await prisma.list.create({
    data: {
      name: 'Late Night Eats',
      description: 'Best spots for after-midnight cravings.',
      isPublic: false,
    },
  });

  // Add venues to the list
  await prisma.listVenue.createMany({
    data: [
      { listId: list.id, venueId: venues[2].id },
      { listId: list.id, venueId: venues[4].id },
    ],
  });

  console.log('✅ Created 1 list with 2 venues');

  // Create seed activities
  await prisma.activity.createMany({
    data: [
      {
        type: ActivityType.VENUE_ADDED,
        description: 'Added Origo Coffee Shop to directory',
        venueId: venues[0].id,
        createdAt: new Date('2024-10-10'),
      },
      {
        type: ActivityType.VENUE_VISITED,
        description: 'Marked Origo Coffee Shop as visited',
        venueId: venues[0].id,
        metadata: { rating: 5 },
        createdAt: new Date('2024-10-15'),
      },
      {
        type: ActivityType.VENUE_ADDED,
        description: "Added Caru' cu Bere to directory",
        venueId: venues[1].id,
        createdAt: new Date('2024-09-15'),
      },
      {
        type: ActivityType.VENUE_FAVORITED,
        description: 'Added Control Club to favorites',
        venueId: venues[2].id,
        createdAt: new Date('2024-11-01'),
      },
      {
        type: ActivityType.LIST_CREATED,
        description: 'Created list: Late Night Eats',
        listId: list.id,
        createdAt: new Date('2024-10-24'),
      },
      {
        type: ActivityType.VENUE_UPDATED,
        description: "Updated notes for Caru' cu Bere",
        venueId: venues[1].id,
        metadata: { field: 'notes' },
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        type: ActivityType.VENUE_RATED,
        description: 'Rated Fix Me A Drink ★★★★',
        venueId: venues[4].id,
        metadata: { rating: 4 },
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
  });

  console.log('✅ Created 7 activity entries');

  // Create default user preferences
  await prisma.userPreferences.create({
    data: {
      mapProvider: 'google',
      defaultSector: 'all',
      highContrast: false,
    },
  });

  console.log('✅ Created default user preferences');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
