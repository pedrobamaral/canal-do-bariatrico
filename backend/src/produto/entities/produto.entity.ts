export class ProdutoEntity {
  id: number;                   // gerado pelo Prisma
  nome: string;                  // varchar(100)
  img: string | null;            // URL (varchar(100))
  imgNutricional: string | null; // URL (varchar(100))
  descricao: string;             // varchar(100)
  preco: number;                 // Decimal
};
