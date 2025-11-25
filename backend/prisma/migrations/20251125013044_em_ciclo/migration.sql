/*
  Warnings:

  - You are about to drop the column `ativo` on the `Ciclo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ciclo` DROP COLUMN `ativo`,
    ADD COLUMN `emCiclo` BOOLEAN NULL DEFAULT false;
