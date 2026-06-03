/*
  Warnings:

  - Added the required column `totalSeats` to the `Screen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Screen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Theatre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Screen" DROP CONSTRAINT "Screen_theatreId_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Show" DROP CONSTRAINT "Show_screenId_fkey";

-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalSeats" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "Theatre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
