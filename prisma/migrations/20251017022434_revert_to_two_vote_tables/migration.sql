/*
  Warnings:

  - You are about to drop the column `optionId` on the `PollVote` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `PollVote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pollId,userId]` on the table `PollVote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."PollVote" DROP CONSTRAINT "PollVote_optionId_fkey";

-- AlterTable
ALTER TABLE "PollVote" DROP COLUMN "optionId",
DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "PollVoteRating" (
    "id" SERIAL NOT NULL,
    "voteId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "PollVoteRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PollVote_pollId_userId_key" ON "PollVote"("pollId", "userId");

-- AddForeignKey
ALTER TABLE "PollVoteRating" ADD CONSTRAINT "PollVoteRating_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "PollVote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVoteRating" ADD CONSTRAINT "PollVoteRating_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "PollOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
