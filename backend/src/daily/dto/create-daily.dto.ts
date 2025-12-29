export class CreateDailyDto {
  idCiclo: number;

  data?: Date;
  hora_ans?: Date;

  agua_check?: boolean;
  dieta_check?: boolean;
  treino_check?: boolean;
  mounjaro_check?: boolean;
  bioimpedancia_check?: boolean;
  refeicao_livre_check?: boolean;
  descanso_check?: boolean;
  consulta_check?: boolean;
}
