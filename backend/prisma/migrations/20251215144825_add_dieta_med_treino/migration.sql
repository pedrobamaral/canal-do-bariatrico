/*
  Warnings:

  - You are about to drop the column `hidratação` on the `dieta` table. All the data in the column will be lost.
  - You are about to alter the column `caloria_dia` on the `dieta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(10,2)`.
  - You are about to alter the column `carb` on the `dieta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(10,2)`.
  - You are about to alter the column `prot` on the `dieta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(10,2)`.
  - You are about to alter the column `gord` on the `dieta` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `Decimal(10,2)`.
  - You are about to drop the column `medicamento` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the column `suplemento` on the `medicamentos` table. All the data in the column will be lost.
  - Added the required column `hidratacao` to the `Dieta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Medicamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dieta` DROP COLUMN `hidratação`,
    ADD COLUMN `hidratacao` DECIMAL(10, 2) NOT NULL,
    MODIFY `caloria_dia` DECIMAL(10, 2) NOT NULL,
    MODIFY `carb` DECIMAL(10, 2) NOT NULL,
    MODIFY `prot` DECIMAL(10, 2) NOT NULL,
    MODIFY `gord` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `medicamentos` DROP COLUMN `medicamento`,
    DROP COLUMN `suplemento`,
    ADD COLUMN `nome` VARCHAR(100) NOT NULL,
    MODIFY `freq_sem` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `medico` VARCHAR(100) NULL,
    MODIFY `insta_medico` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `treino` ADD COLUMN `pdf_url` VARCHAR(255) NULL;
