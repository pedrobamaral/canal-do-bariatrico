export class CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string; 
  
  endereco?: {
    rua: string;
    numero: string;
    cidade: string;
    estado: string;
    cep: string;
  };

  dadosPagamento?: {
    idGatewayPagamento: string;
  };
}