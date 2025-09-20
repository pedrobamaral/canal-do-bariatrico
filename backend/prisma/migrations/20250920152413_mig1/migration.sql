/*
  Warnings:

  - You are about to alter the column `email` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `email` VARCHAR(100) NOT NULL;
