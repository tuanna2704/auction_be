-- CreateEnum
CREATE TYPE "BidItemState" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "BidItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startPrice" INTEGER NOT NULL,
    "state" "BidItemState" NOT NULL DEFAULT 'DRAFT',
    "userId" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BidItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BidItem" ADD CONSTRAINT "BidItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
