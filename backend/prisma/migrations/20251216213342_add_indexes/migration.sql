-- CreateIndex
CREATE INDEX `Ciclo_idUsuario_data_atual_idx` ON `Ciclo`(`idUsuario`, `data_atual`);

-- CreateIndex
CREATE INDEX `Ciclo_dia0Id_idx` ON `Ciclo`(`dia0Id`);

-- CreateIndex
CREATE INDEX `Dia0_idUsuario_iniciou_medicamento_quer_msg_id_idx` ON `Dia0`(`idUsuario`, `iniciou_medicamento`, `quer_msg`, `id`);

-- CreateIndex
CREATE INDEX `Usuario_ativo_idx` ON `Usuario`(`ativo`);


