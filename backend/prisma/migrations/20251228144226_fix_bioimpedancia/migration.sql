/*
  Warnings:

  - You are about to drop the column `bioimpendancia` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `temMensagem` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `bioimpendancia_check` on the `Daily` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ciclo` DROP COLUMN `bioimpendancia`,
    DROP COLUMN `temMensagem`,
    ADD COLUMN `ativoChatbot` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `bioimpedancia` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Daily` DROP COLUMN `bioimpendancia_check`,
    ADD COLUMN `bioimpedancia_check` BOOLEAN NULL;

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_dia0Id_fkey` FOREIGN KEY (`dia0Id`) REFERENCES `Dia0`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
