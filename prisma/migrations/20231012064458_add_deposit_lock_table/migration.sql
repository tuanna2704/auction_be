-- CreateEnum
CREATE TYPE "DepositLockState" AS ENUM ('RELEASED', 'LOCKED');

-- CreateTable
CREATE TABLE "DepositLock" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "state" "DepositLockState" NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositLock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepositLock" ADD CONSTRAINT "DepositLock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositLock" ADD CONSTRAINT "DepositLock_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "BidItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
