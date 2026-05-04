#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy 2>/dev/null || echo "No migrations to run or DB not ready yet"

echo "Starting Next.js server..."
exec node server.js
