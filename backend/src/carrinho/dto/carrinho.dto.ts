export type CarrinhoDto = {
  id?: number;                 // gerado pelo Prisma
  idUsuario?: number | null;   // FK única -> Usuario.id
  produtoIds?: number[];       // IDs de produtos para conectar com o carrinho
};
