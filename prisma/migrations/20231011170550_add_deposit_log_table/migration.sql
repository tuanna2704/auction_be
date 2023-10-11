-- CreateEnum
CREATE TYPE "DepositEventType" AS ENUM ('RECHAGE');

-- CreateTable
CREATE TABLE "DepositLog" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "eventType" "DepositEventType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DepositLog" ADD CONSTRAINT "DepositLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
