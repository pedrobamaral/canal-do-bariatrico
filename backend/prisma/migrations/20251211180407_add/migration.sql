-- CreateTable
CREATE TABLE `pontuacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numCiclo` INTEGER NOT NULL,
    `respSim` INTEGER NULL,
    `respNao` INTEGER NULL,
    `pontos` DECIMAL(4, 2) NULL,
    `porcentagem` DECIMAL(2, 2) NULL,
    `maxPontos` DECIMAL(4, 2) NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pontuacoes` ADD CONSTRAINT `pontuacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
