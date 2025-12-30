export type ProdutoDto = {
  id?: number;            // gerado pelo Prisma
  Nome: string;           // varchar(100)
  Imagem: string;         // URL (varchar(100))
  descricao: string;      // varchar(100)
  preco: number;          // float
  idCarrinho?: number | null; // opcional (FK), se aplicar
};
// Observação: campo de relação `Carrinho` é resolvido pelo Prisma via idCarrinho.
