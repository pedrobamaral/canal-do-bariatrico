export class Ciclo {
  id: number;
  idUsuario: number;
  dia0Id: number;

  numCiclo?: number;
  ativoCiclo?: boolean;

  med_prescrita?: boolean;
  freq_med_prescrita?: number;
  mounjaro?: boolean;
  treino?: boolean;
  dieta?: boolean;
  agua?: boolean;
  bioimpedancia?: boolean;
  consulta?: boolean;

  cumpriu_atual?: number;
  respSim?: number;
  respNao?: number;
  pontos_atual?: number;
  maxPontos?: number;

  dia_ciclo_atual?: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}
