/*
  Warnings:

  - You are about to drop the column `ativoChatbot` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `cumpriu` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `data_atual` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `descanso` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `dia_ciclo` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `emCiclo` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `numCiclo` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `pontos` on the `Ciclo` table. All the data in the column will be lost.
  - You are about to drop the column `refeicao_livre` on the `Ciclo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dia0Id]` on the table `Ciclo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUsuario]` on the table `Daily` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idDiaCiclo]` on the table `Daily` will be added. If there are existing duplicate values, this will fail.
  - Made the column `idCiclo` on table `Daily` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Daily` DROP FOREIGN KEY `Daily_idCiclo_fkey`;

-- DropIndex
DROP INDEX `Ciclo_idUsuario_data_atual_idx` ON `Ciclo`;

-- AlterTable
ALTER TABLE `Ciclo` DROP COLUMN `ativoChatbot`,
    DROP COLUMN `cumpriu`,
    DROP COLUMN `data_atual`,
    DROP COLUMN `descanso`,
    DROP COLUMN `dia_ciclo`,
    DROP COLUMN `emCiclo`,
    DROP COLUMN `numCiclo`,
    DROP COLUMN `pontos`,
    DROP COLUMN `refeicao_livre`,
    ADD COLUMN `ativoCiclo` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `cumpriu_atual` DECIMAL(5, 2) NULL,
    ADD COLUMN `dia_ciclo_atual` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `freq_med_prescrita` INTEGER NULL DEFAULT 0,
    ADD COLUMN `maxPontos` DECIMAL(5, 2) NULL,
    ADD COLUMN `pontos_atual` DECIMAL(5, 2) NULL,
    ADD COLUMN `respNao` INTEGER NULL DEFAULT 0,
    ADD COLUMN `respSim` INTEGER NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Daily` ADD COLUMN `idDiaCiclo` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `idUsuario` INTEGER NOT NULL DEFAULT 0,
    MODIFY `idCiclo` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Dia0` ADD COLUMN `idCiclo` INTEGER NULL;

-- CreateTable
CREATE TABLE `DiaCiclo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `idCiclo` INTEGER NOT NULL,
    `dia0Id` INTEGER NOT NULL,
    `idDaily` INTEGER NULL,
    `emCiclo` BOOLEAN NULL DEFAULT false,
    `ativoChatbot` BOOLEAN NULL DEFAULT false,
    `tem_med_prescrita` BOOLEAN NULL DEFAULT false,
    `tem_mounjaro` BOOLEAN NULL DEFAULT false,
    `tem_treino` BOOLEAN NULL DEFAULT false,
    `tem_bioimpedancia` BOOLEAN NULL DEFAULT false,
    `tem_consulta` BOOLEAN NULL DEFAULT false,
    `tem_descanso` BOOLEAN NULL DEFAULT false,
    `tem_refeicao_livre` BOOLEAN NULL DEFAULT false,
    `cumpriu` DECIMAL(5, 2) NULL,
    `pontos` DECIMAL(5, 2) NULL,
    `data_dia` DATETIME(3) NULL,
    `dia_ciclo` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DiaCiclo_idUsuario_idx`(`idUsuario`),
    INDEX `DiaCiclo_dia0Id_idx`(`dia0Id`),
    INDEX `DiaCiclo_idCiclo_idx`(`idCiclo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ciclo_dia0Id_key` ON `Ciclo`(`dia0Id`);

-- CreateIndex
CREATE UNIQUE INDEX `Daily_idUsuario_key` ON `Daily`(`idUsuario`);

-- CreateIndex
CREATE UNIQUE INDEX `Daily_idDiaCiclo_key` ON `Daily`(`idDiaCiclo`);

-- CreateIndex
CREATE INDEX `Usuario_email_senha_idx` ON `Usuario`(`email`, `senha`);

-- CreateIndex
CREATE INDEX `Usuario_telefone_idx` ON `Usuario`(`telefone`);

-- AddForeignKey
ALTER TABLE `DiaCiclo` ADD CONSTRAINT `DiaCiclo_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaCiclo` ADD CONSTRAINT `DiaCiclo_idCiclo_fkey` FOREIGN KEY (`idCiclo`) REFERENCES `Ciclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaCiclo` ADD CONSTRAINT `DiaCiclo_dia0Id_fkey` FOREIGN KEY (`dia0Id`) REFERENCES `Dia0`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_idCiclo_fkey` FOREIGN KEY (`idCiclo`) REFERENCES `Ciclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_idDiaCiclo_fkey` FOREIGN KEY (`idDiaCiclo`) REFERENCES `DiaCiclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
