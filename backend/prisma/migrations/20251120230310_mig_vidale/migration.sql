/*
  Warnings:

  - You are about to drop the column `idCarrinho` on the `produto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `produto` DROP COLUMN `idCarrinho`;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `Nascimento` DATETIME(3) NULL,
    ADD COLUMN `altura` DECIMAL(3, 2) NULL,
    ADD COLUMN `ativo` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `massa_magra` DECIMAL(5, 2) NULL,
    ADD COLUMN `meta` DECIMAL(5, 2) NULL,
    ADD COLUMN `peso` DECIMAL(5, 2) NULL,
    ADD COLUMN `sexo` ENUM('Masculino', 'Feminino', 'Outro') NULL,
    ADD COLUMN `telefone` VARCHAR(20) NULL;

-- CreateTable
CREATE TABLE `Sistema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NULL,

    UNIQUE INDEX `Sistema_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSistema` INTEGER NULL,
    `medicamento` VARCHAR(100) NOT NULL,
    `suplemento` VARCHAR(100) NOT NULL,
    `freq_sem` BOOLEAN NOT NULL DEFAULT true,
    `freq_dia` BOOLEAN NOT NULL DEFAULT false,
    `qtnd_freq` INTEGER NOT NULL,
    `medico` VARCHAR(100) NOT NULL,
    `insta_medico` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSistema` INTEGER NULL,
    `freq_musc` INTEGER NOT NULL,
    `freq_aero` INTEGER NOT NULL,
    `personal` VARCHAR(100) NOT NULL,
    `insta_personal` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dieta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSistema` INTEGER NULL,
    `freq` INTEGER NOT NULL,
    `caloria_dia` DECIMAL(4, 2) NOT NULL,
    `hidratação` DECIMAL(3, 2) NOT NULL,
    `carb` DECIMAL(4, 2) NOT NULL,
    `prot` DECIMAL(4, 2) NOT NULL,
    `gord` DECIMAL(4, 2) NOT NULL,
    `nutri` VARCHAR(100) NOT NULL,
    `insta_nutri` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dia0` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NULL,
    `idCiclo` INTEGER NULL,
    `quer_msg` BOOLEAN NOT NULL DEFAULT true,
    `iniciou_medicamento` BOOLEAN NOT NULL DEFAULT false,
    `dia_iniciar_med` DATETIME(3) NOT NULL,
    `dia1` DATETIME(3) NOT NULL,
    `dia0` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dia0_idUsuario_key`(`idUsuario`),
    UNIQUE INDEX `Dia0_idCiclo_key`(`idCiclo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ciclo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT false,
    `num` INTEGER NOT NULL,
    `med_prescrita` BOOLEAN NOT NULL DEFAULT false,
    `mounjaro` BOOLEAN NOT NULL DEFAULT false,
    `treino` BOOLEAN NOT NULL DEFAULT false,
    `bioimpendancia` BOOLEAN NOT NULL DEFAULT false,
    `cumpriu` DECIMAL(5, 2) NOT NULL,
    `pontos` INTEGER NOT NULL DEFAULT 0,
    `data_atual` DATETIME(3) NOT NULL,
    `dia_ciclo` INTEGER NOT NULL,

    UNIQUE INDEX `Ciclo_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Daily` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCiclo` INTEGER NULL,
    `data` DATETIME(3) NOT NULL,
    `hora_ans` DATETIME(3) NOT NULL,
    `mounjaro_check` BOOLEAN NOT NULL,
    `treino_check` BOOLEAN NOT NULL,
    `bioimpendancia_check` BOOLEAN NOT NULL,
    `agua_check` BOOLEAN NOT NULL,
    `refeicao_livre_check` BOOLEAN NOT NULL,
    `dieta_check` BOOLEAN NOT NULL,
    `descanso_check` BOOLEAN NOT NULL,

    UNIQUE INDEX `Daily_idCiclo_key`(`idCiclo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Sistema` ADD CONSTRAINT `Sistema_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicamentos` ADD CONSTRAINT `Medicamentos_idSistema_fkey` FOREIGN KEY (`idSistema`) REFERENCES `Sistema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treino` ADD CONSTRAINT `Treino_idSistema_fkey` FOREIGN KEY (`idSistema`) REFERENCES `Sistema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dieta` ADD CONSTRAINT `Dieta_idSistema_fkey` FOREIGN KEY (`idSistema`) REFERENCES `Sistema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dia0` ADD CONSTRAINT `Dia0_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dia0` ADD CONSTRAINT `Dia0_idCiclo_fkey` FOREIGN KEY (`idCiclo`) REFERENCES `Ciclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_idCiclo_fkey` FOREIGN KEY (`idCiclo`) REFERENCES `Ciclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
