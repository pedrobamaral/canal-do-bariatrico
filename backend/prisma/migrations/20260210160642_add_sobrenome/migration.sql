-- AlterTable: add sobrenome column with default for existing rows
ALTER TABLE `Usuario` ADD COLUMN `sobrenome` VARCHAR(100) NOT NULL DEFAULT '';

-- Rename Nascimento -> nascimento to match schema casing (preserves data)
ALTER TABLE `Usuario` CHANGE COLUMN `Nascimento` `nascimento` DATETIME(3) NULL;
