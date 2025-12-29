"use client";

import Image from 'next/image';
import Link from 'next/link';

// Importando ícones robustos da biblioteca react-icons
import { FaUserMd, FaCalculator, FaUser } from 'react-icons/fa';
import { IoNutritionSharp, IoLogOutOutline } from 'react-icons/io5';
import { RiUser3Fill } from 'react-icons/ri';

export default function HeaderTeste() {
  // Estilo base para os ícones brancos que ficam azuis no hover
  const iconBaseStyle = "text-white hover:text-[#62B4FF] transition-colors cursor-pointer";

  return (
    // ALTERAÇÃO 1: Adicionado 'fixed top-0 z-50' para o header seguir a tela.
    // Removido 'px-8' geral, pois vamos controlar o espaçamento esquerdo no container do logo.
    <header className="fixed top-0 z-50 w-full h-20 bg-black flex items-center justify-between pr-8 shadow-md font-['Montserrat']">

      {/* --- LADO ESQUERDO: LOGO COM A FORMA ESPECÍFICA --- */}
      {/*
          ALTERAÇÃO 2: Criamos este container wrapper para dar a forma.
          - h-full: Ocupa toda a altura do header.
          - bg-black: Garante o fundo preto nesta área.
          - pl-8 pr-6: Espaçamento interno para o logo.
          - style={{ borderBottomRightRadius: '30px' }}: O segredo para a borda arredondada específica.
      */}
      <div
        className="h-full bg-black flex items-center pl-8 pr-8"
        style={{
            borderBottomRightRadius: '30px', // Define o canto arredondado igual à imagem
            // Se você mudar a cor do 'header' principal para transparente no futuro,
            // esta área do logo continuará preta com a forma correta.
        }}
      >
        {/* Container relativo para o Next Image */}
        {/* Ajustei levemente o tamanho para W-44 H-10 para encaixar melhor na nova forma */}
        <div className="relative w-300 h-11">
            <Image
            src="/imagens/logo.png"
            alt="Logo BARIE"
            fill
            className="object-contain object-left"
            priority
            />
        </div>
      </div>

      {/* --- LADO DIREITO: ÍCONES (Sem alterações na lógica) --- */}
      <div className="flex items-center gap-6">

        {/* 1. Médico */}
        <Link href="#" aria-label="Médico">
          <FaUserMd size={24} className={iconBaseStyle} />
        </Link>

        {/* 2. Dieta (Maçã/Nutrição) */}
        <Link href="#" aria-label="Dieta">
           <IoNutritionSharp size={24} className={iconBaseStyle} />
        </Link>

        {/* 3. Pessoa/Corpo */}
        <Link href="#" aria-label="Pessoa">
          <FaUser size={22} className={iconBaseStyle} />
        </Link>

        {/* 4. Calculadora */}
        <Link href="#" aria-label="Calculadora">
          <FaCalculator size={22} className={iconBaseStyle} />
        </Link>

        {/* 5. Usuário Atual (Destaque Azul) */}
        <Link href="#" aria-label="Meu Perfil">
          <RiUser3Fill size={26} className="text-[#62B4FF] hover:text-white transition-colors cursor-pointer" />
        </Link>

        {/* 6. Separador e Sair */}
        <div className="h-6 w-px bg-gray-700 mx-2"></div>

        <Link href="/login" aria-label="Sair">
          <IoLogOutOutline size={26} className="text-white hover:text-red-400 transition-colors cursor-pointer" />
        </Link>

      </div>
    </header>
  );
}