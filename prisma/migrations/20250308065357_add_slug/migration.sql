/*
  Warnings:

  - Added the required column `slug` to the `article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "article" ADD COLUMN     "slug" TEXT NOT NULL;
