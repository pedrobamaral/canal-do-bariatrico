import Image from 'next/image';
import Link from 'next/link';

export default function HeaderTeste() {
  return (
    <div className="relative w-full h-23 bg-black flex items-center-safe">
      <div className="absolute w-23 h-20 top-5 left-9 mr-4">
        <Image
          src="/imagens/borboleta.png"
          alt="Logo da Borboleta"
          width={44}
          height={44}
        />
      </div>
        <h1 className="text-4xl ml-23 mb-4 font-Montserrat font-bold">CANAL DA BARIE</h1>


    <div className="absolute top-1/4 left-16/21">
        <Image
          src="/imagens/compra.png"
          alt="loja"
          width={33}
          height={33}
        />
      </div>

      <div className="absolute top-1/4 left-17/21">
        <Image
          src="/imagens/calculadora.png"
          alt="calculadora"
          width={33}
          height={33}
        />
      </div>

      <div className="absolute top-1/4 left-18/21">
        <Image
          src="/imagens/carrinho.png"
          alt="carrinho"
          width={33}
          height={33}
        />
      </div>
      
      <div className="absolute top-1/4 left-19/21">
        <Image
          src="/imagens/user-blue.png"
          alt="usuario"
          width={33}
          height={33}
        />
      </div>
      
      <div className="absolute top-1/4 left-20/21">
        <Image
          src="/imagens/sair.png"
          alt="sair"
          width={33}
          height={33}
        />
      </div>
    </div>
  );
}
