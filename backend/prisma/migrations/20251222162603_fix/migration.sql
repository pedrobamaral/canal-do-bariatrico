-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ativo` BOOLEAN NULL DEFAULT false,
    `telefone` VARCHAR(20) NULL,
    `sexo` ENUM('Masculino', 'Feminino', 'Outro') NULL,
    `peso` DECIMAL(5, 2) NULL,
    `altura` DECIMAL(5, 2) NULL,
    `Nascimento` DATETIME(3) NULL,
    `massa_magra` DECIMAL(5, 2) NULL,
    `meta` DECIMAL(5, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    INDEX `Usuario_ativo_idx`(`ativo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `nome` VARCHAR(100) NOT NULL,
    `freq_sem` BOOLEAN NOT NULL DEFAULT false,
    `freq_dia` BOOLEAN NOT NULL DEFAULT false,
    `qtnd_freq` INTEGER NOT NULL,
    `medico` VARCHAR(100) NULL,
    `insta_medico` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSistema` INTEGER NULL,
    `pdf_url` VARCHAR(255) NULL,
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
    `caloria_dia` DECIMAL(10, 2) NOT NULL,
    `hidratacao` DECIMAL(10, 2) NOT NULL,
    `carb` DECIMAL(10, 2) NOT NULL,
    `prot` DECIMAL(10, 2) NOT NULL,
    `gord` DECIMAL(10, 2) NOT NULL,
    `nutri` VARCHAR(100) NOT NULL,
    `insta_nutri` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pontuacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numCiclo` INTEGER NOT NULL,
    `respSim` INTEGER NULL,
    `respNao` INTEGER NULL,
    `pontos` DECIMAL(5, 2) NULL,
    `porcentagem` DECIMAL(5, 2) NULL,
    `maxPontos` DECIMAL(5, 2) NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pontuacoes_usuarioId_idx`(`usuarioId`),
    INDEX `pontuacoes_usuarioId_numCiclo_idx`(`usuarioId`, `numCiclo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dia0` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `quer_msg` BOOLEAN NULL DEFAULT true,
    `iniciou_medicamento` BOOLEAN NULL DEFAULT false,
    `dia_iniciar_med` DATETIME(3) NULL,
    `dia1` DATETIME(3) NULL,
    `dia0` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Dia0_idUsuario_idx`(`idUsuario`),
    INDEX `Dia0_idUsuario_iniciou_medicamento_quer_msg_id_idx`(`idUsuario`, `iniciou_medicamento`, `quer_msg`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ciclo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `dia0Id` INTEGER NOT NULL,
    `numCiclo` INTEGER NULL,
    `emCiclo` BOOLEAN NULL DEFAULT false,
    `temMensagem` BOOLEAN NULL DEFAULT false,
    `med_prescrita` BOOLEAN NULL DEFAULT false,
    `mounjaro` BOOLEAN NULL DEFAULT false,
    `treino` BOOLEAN NULL DEFAULT false,
    `bioimpendancia` BOOLEAN NULL DEFAULT false,
    `consulta` BOOLEAN NULL DEFAULT false,
    `descanso` BOOLEAN NULL DEFAULT false,
    `refeicao_livre` BOOLEAN NULL DEFAULT false,
    `cumpriu` DECIMAL(5, 2) NULL,
    `pontos` INTEGER NULL DEFAULT 0,
    `data_atual` DATETIME(3) NULL,
    `dia_ciclo` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Ciclo_dia0Id_key`(`dia0Id`),
    INDEX `Ciclo_idUsuario_idx`(`idUsuario`),
    INDEX `Ciclo_idUsuario_data_atual_idx`(`idUsuario`, `data_atual`),
    INDEX `Ciclo_dia0Id_idx`(`dia0Id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Daily` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCiclo` INTEGER NULL,
    `data` DATETIME(3) NULL,
    `hora_ans` DATETIME(3) NULL,
    `agua_check` BOOLEAN NULL,
    `dieta_check` BOOLEAN NULL,
    `treino_check` BOOLEAN NULL,
    `mounjaro_check` BOOLEAN NULL,
    `bioimpendancia_check` BOOLEAN NULL,
    `refeicao_livre_check` BOOLEAN NULL,
    `descanso_check` BOOLEAN NULL,
    `consulta_check` BOOLEAN NULL,
    `med_prescrita_check` BOOLEAN NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Daily_idCiclo_key`(`idCiclo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NULL,
    `endereco` VARCHAR(100) NOT NULL,
    `complemento` VARCHAR(100) NOT NULL,
    `CEP` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `Endereco_CEP_key`(`CEP`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carrinho` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NULL,

    UNIQUE INDEX `Carrinho_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `imgNutricional` VARCHAR(191) NULL,
    `img` VARCHAR(191) NULL,
    `descricao` VARCHAR(100) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itemCarrinho` (
    `idCarrinho` INTEGER NOT NULL,
    `idProduto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`idCarrinho`, `idProduto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carrinhoId` INTEGER NOT NULL,
    `metodo` VARCHAR(100) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `dataCheckout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataConfirmado` DATETIME(3) NULL,

    UNIQUE INDEX `Pagamento_carrinhoId_key`(`carrinhoId`),
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
ALTER TABLE `pontuacoes` ADD CONSTRAINT `pontuacoes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dia0` ADD CONSTRAINT `Dia0_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ciclo` ADD CONSTRAINT `Ciclo_dia0Id_fkey` FOREIGN KEY (`dia0Id`) REFERENCES `Dia0`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Daily` ADD CONSTRAINT `Daily_idCiclo_fkey` FOREIGN KEY (`idCiclo`) REFERENCES `Ciclo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carrinho` ADD CONSTRAINT `Carrinho_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itemCarrinho` ADD CONSTRAINT `itemCarrinho_idCarrinho_fkey` FOREIGN KEY (`idCarrinho`) REFERENCES `Carrinho`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itemCarrinho` ADD CONSTRAINT `itemCarrinho_idProduto_fkey` FOREIGN KEY (`idProduto`) REFERENCES `Produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `Pagamento_carrinhoId_fkey` FOREIGN KEY (`carrinhoId`) REFERENCES `Carrinho`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
