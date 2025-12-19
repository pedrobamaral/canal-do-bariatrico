export class CreateCicloDto {
  idUsuario: number;

  numCiclo?: number;
  emCiclo?: boolean;

  med_prescrita?: boolean;
  mounjaro?: boolean;
  treino?: boolean;
  bioimpedancia?: boolean;
  consulta?: boolean;
  descanso?: boolean;
  refeicao_livre?: boolean;

  cumpriu?: number;
  pontos?: number;

  data_atual?: Date;
  dia_ciclo?: number;
}
