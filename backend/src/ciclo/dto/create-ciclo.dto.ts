export class CreateCicloDto {
  idUsuario: number;
  dia0Id: number;

  numCiclo?: number;
  emCiclo?: boolean;
  ativoChatbot?: boolean;

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
