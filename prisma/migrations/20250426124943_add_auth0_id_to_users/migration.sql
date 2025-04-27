/*
  Warnings:

  - A unique constraint covering the columns `[auth0_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "auth0_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "auth0_id_unique" ON "user"("auth0_id");
