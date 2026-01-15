export class DiaCiclo {
  id: number;
  idUsuario: number;
  idCiclo: number;
  dia0Id: number;
  emCiclo?: boolean;
  ativoChatbot?: boolean;
  tem_med_prescrita?: boolean;
  tem_mounjaro?: boolean;
  tem_treino?: boolean;
  tem_dieta?: boolean;
  tem_agua?: boolean;
  tem_bioimpedancia?: boolean;
  tem_consulta?: boolean;
  tem_descanso?: boolean;
  tem_refeicao_livre?: boolean;
  cumpriu?: number;
  pontos?: number;
  data_dia?: Date;
  dia_ciclo?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
