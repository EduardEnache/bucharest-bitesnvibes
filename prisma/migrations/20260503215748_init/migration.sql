-- CreateEnum
CREATE TYPE "VenueStatus" AS ENUM ('TO_TRY', 'VISITED', 'NOT_GOING', 'FAVORITE');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('VENUE_ADDED', 'VENUE_UPDATED', 'VENUE_RATED', 'VENUE_VISITED', 'VENUE_FAVORITED', 'LIST_CREATED', 'LIST_VENUE_ADDED');

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "type" TEXT NOT NULL,
    "tags" TEXT[],
    "priceLevel" INTEGER NOT NULL,
    "status" "VenueStatus" NOT NULL DEFAULT 'TO_TRY',
    "neighborhood" TEXT NOT NULL,
    "sector" TEXT,
    "address" TEXT,
    "googlePlaceId" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "dateVisited" TIMESTAMP(3),
    "personalRating" DOUBLE PRECISION,
    "notes" TEXT,
    "openingHours" JSONB,
    "phoneNumber" TEXT,
    "website" TEXT,
    "googleRating" DOUBLE PRECISION,
    "googleReviewCount" INTEGER,
    "googlePriceLevel" INTEGER,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListVenue" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListVenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "venueId" TEXT,
    "listId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "mapProvider" TEXT NOT NULL DEFAULT 'google',
    "defaultSector" TEXT NOT NULL DEFAULT 'all',
    "highContrast" BOOLEAN NOT NULL DEFAULT false,
    "displayName" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venue_googlePlaceId_key" ON "Venue"("googlePlaceId");

-- CreateIndex
CREATE UNIQUE INDEX "ListVenue_listId_venueId_key" ON "ListVenue"("listId", "venueId");

-- AddForeignKey
ALTER TABLE "ListVenue" ADD CONSTRAINT "ListVenue_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListVenue" ADD CONSTRAINT "ListVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
