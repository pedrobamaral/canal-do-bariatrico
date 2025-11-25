-- AlterTable
ALTER TABLE `Ciclo` MODIFY `ativo` BOOLEAN NULL DEFAULT false,
    MODIFY `num` INTEGER NULL,
    MODIFY `med_prescrita` BOOLEAN NULL DEFAULT false,
    MODIFY `mounjaro` BOOLEAN NULL DEFAULT false,
    MODIFY `treino` BOOLEAN NULL DEFAULT false,
    MODIFY `bioimpendancia` BOOLEAN NULL DEFAULT false,
    MODIFY `cumpriu` DECIMAL(5, 2) NULL,
    MODIFY `pontos` INTEGER NULL DEFAULT 0,
    MODIFY `data_atual` DATETIME(3) NULL,
    MODIFY `dia_ciclo` INTEGER NULL;

-- AlterTable
ALTER TABLE `Daily` MODIFY `data` DATETIME(3) NULL,
    MODIFY `hora_ans` DATETIME(3) NULL,
    MODIFY `mounjaro_check` BOOLEAN NULL,
    MODIFY `treino_check` BOOLEAN NULL,
    MODIFY `bioimpendancia_check` BOOLEAN NULL,
    MODIFY `agua_check` BOOLEAN NULL,
    MODIFY `refeicao_livre_check` BOOLEAN NULL,
    MODIFY `dieta_check` BOOLEAN NULL,
    MODIFY `descanso_check` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `Dia0` MODIFY `quer_msg` BOOLEAN NULL DEFAULT true,
    MODIFY `iniciou_medicamento` BOOLEAN NULL DEFAULT false,
    MODIFY `dia_iniciar_med` DATETIME(3) NULL,
    MODIFY `dia1` DATETIME(3) NULL,
    MODIFY `dia0` DATETIME(3) NULL;
