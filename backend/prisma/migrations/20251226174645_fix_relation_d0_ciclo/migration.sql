-- DropForeignKey
ALTER TABLE `Ciclo` DROP FOREIGN KEY `Ciclo_dia0Id_fkey`;

-- DropIndex
DROP INDEX `Ciclo_dia0Id_key` ON `Ciclo`;

