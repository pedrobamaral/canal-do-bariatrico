-- AlterTable
ALTER TABLE `Ciclo` ADD COLUMN `consulta` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `descanso` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `refeicao_livre` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Daily` ADD COLUMN `consulta_check` BOOLEAN NULL;
