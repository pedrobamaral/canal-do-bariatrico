/*
  Warnings:

  - You are about to drop the column `num` on the `Ciclo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ciclo` DROP COLUMN `num`,
    ADD COLUMN `numCiclo` INTEGER NULL;
