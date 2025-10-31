-- DropForeignKey
ALTER TABLE `produto` DROP FOREIGN KEY `Produto_idCarrinho_fkey`;

-- DropIndex
DROP INDEX `Produto_idCarrinho_fkey` ON `produto`;

-- AlterTable
ALTER TABLE `produto` MODIFY `preco` DECIMAL(10, 2) NOT NULL;

-- CreateTable
CREATE TABLE `itemCarrinho` (
    `idCarrinho` INTEGER NOT NULL,
    `idProduto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`idCarrinho`, `idProduto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `itemCarrinho` ADD CONSTRAINT `itemCarrinho_idCarrinho_fkey` FOREIGN KEY (`idCarrinho`) REFERENCES `Carrinho`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `itemCarrinho` ADD CONSTRAINT `itemCarrinho_idProduto_fkey` FOREIGN KEY (`idProduto`) REFERENCES `Produto`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
