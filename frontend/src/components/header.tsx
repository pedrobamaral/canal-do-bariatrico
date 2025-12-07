import Image from 'next/image';
import Link from 'next/link';

export default function HeaderTeste() {
  return (
    <div className="relative w-full h-23 bg-black flex items-center-safe">
      <div className="absolute w-full h-full top-5 left-9 mr-4">
        <Image src="/imagens/logo.png" alt="Logo" width={500} height={500} />
      </div>

      <Link href="#">
        <div
          role="button"
          aria-label="medico"
          className="absolute top-1/4 left-21/28 w-[33px] h-[33px] bg-white hover:bg-sky-300 transition-colors icon-btn"
          style={{
            WebkitMaskImage: "url('/imagens/medico.png')",
            maskImage: "url('/imagens/medico.png')",
          }}
        />
      </Link>

      <Link href="#">
        <div
          role="button"
          aria-label="dieta"
          className="absolute top-1/4 left-22/28 w-[33px] h-[33px] bg-white hover:bg-sky-300 transition-colors icon-btn"
          style={{
            WebkitMaskImage: "url('/imagens/dieta.png')",
            maskImage: "url('/imagens/dieta.png')",
          }}
        />
      </Link>

      <Link href="#">
        <div
          role="button"
          aria-label="pessoa"
          className="absolute top-1/4 left-23/28 w-[33px] h-[33px] bg-white hover:bg-sky-300 transition-colors icon-btn"
          style={{
            WebkitMaskImage: "url('/imagens/pessoa.png')",
            maskImage: "url('/imagens/pessoa.png')",
          }}
        />
      </Link>

      <Link href="#">
        <div
          role="button"
          aria-label="calculadora"
          className="absolute top-1/4 left-24/28 w-[33px] h-[33px] bg-white hover:bg-sky-300 transition-colors icon-btn"
          style={{
            WebkitMaskImage: "url('/imagens/calculadora.png')",
            maskImage: "url('/imagens/calculadora.png')",
          }}
        />
      </Link>

      <Link href="#">
        <div
          role="button"
          aria-label="usuario"
          className="absolute top-1/4 left-25/28 w-[33px] h-[33px] bg-sky-300  transition-colors icon-btn"
          style={{
            WebkitMaskImage: "url('/imagens/user-blue.png')",
            maskImage: "url('/imagens/user-blue.png')",
          }}
        />
      </Link>

      <Link href="#">
        <div
          role="button"
          aria-label="sair"
          className="absolute top-1/4 left-26/28 w-[33px] h-[33px] bg-white hover:bg-sky-300 transition-colors icon-btn"
          style={{
            WebkitMaskImage: "url('/imagens/sair.png')",
            maskImage: "url('/imagens/sair.png')",
          }}
        />
      </Link>
    </div>
  );
}
