/*
  Warnings:

  - You are about to drop the column `idCiclo` on the `Dia0` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dia0Id]` on the table `Ciclo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dia0Id` to the `Ciclo` table without a default value. This is not possible if the table is not empty.
  - Made the column `idUsuario` on table `Ciclo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idUsuario` on table `Dia0` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Ciclo` DROP FOREIGN KEY `Ciclo_idUsuario_fkey`;

-- DropForeignKey
ALTER TABLE `Dia0` DROP FOREIGN KEY `Dia0_idCiclo_fkey`;

-- DropForeignKey
ALTER TABLE `Dia0` DROP FOREIGN KEY `Dia0_idUsuario_fkey`;

-- DropIndex
DROP INDEX `Ciclo_idUsuario_key` ON `Ciclo`;

-- DropIndex
DROP INDEX `Dia0_idCiclo_key` ON `Dia0`;

-- DropIndex
DROP INDEX `Dia0_idUsuario_key` ON `Dia0`;

-- AlterTable
ALTER TABLE `Ciclo` ADD COLUMN `dia0Id` INTEGER NOT NULL,
    MODIFY `idUsuario` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Dia0` DROP COLUMN `idCiclo`,
    MODIFY `idUsuario` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ciclo_dia0Id_key` ON `Ciclo`(`dia0Id`);

-- AddForeignKey
ALTER TABLE `Dia0` ADD CONSTRAINT `Dia0_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_dia0Id_fkey` FOREIGN KEY (`dia0Id`) REFERENCES `Dia0`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
