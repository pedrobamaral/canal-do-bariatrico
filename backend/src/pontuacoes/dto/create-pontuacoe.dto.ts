export class CreatePontuacoeDto {
  numCiclo: number;

  respSim?: number;
  respNao?: number;

  pontos: number;
  porcentagem?: number;
  maxPontos?: number;

  usuarioId: number;
}
