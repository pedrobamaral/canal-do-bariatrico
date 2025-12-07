'use client'

import Image from 'next/image';
import HeaderTeste from "@/components/header";
import ModalEditarPerfil from "@/components/modal-perfil";
import { useState } from 'react';

export default function PgUsuarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="w-full min-h-screen bg-[#F6F3E4]">
      <HeaderTeste />
      
      <div className="w-full h-3/9 absolute bg-[#000000]">
        <div className="absolute top-4 right-8 flex items-center gap-3 mr-7">
          <Image 
                src="/imagens/calendario.png"
                alt="calendario"
                height={100}
                width={100}
              />

          <div className="calendar-text flex flex-col">
            <span className="text-[#0D99FF] text-5xl">X</span>
            <text className='text-[#0D99FF] text-xl'>dias restantes</text>
          </div>
        </div>

        <div className="absolute top-3/8 left-1/6 flex justify-center items-center">
          <div className='flex flex-col justify-center'>
            <div className="items-center">
              <Image 
                src="/imagens/perfil_generico.png"
                alt="foto de perfil generico"
                height={230}
                width={230}
                className='rounded-full'
              />
              <div className='mt-4 flex justify items-center'>
              <h1 className='text-5xl font-lato text-black ml-3'>Nome de usuario</h1>
              <Image 
                src="/imagens/pontos.png"
                alt="pontuacao"
                height={50}
                width={50}
                className='rounded-full ml-8'
              />
              <h2 className='text-2xl font-lato text-[#0D99FF] ml-3'>pontos</h2>
              </div>

              <div className='text-black flex justify items-center mt-2'>
                <Image 
                  src="/imagens/mail.png"
                  alt="mail"
                  height={26}
                  width={26}
                  className='mr-1.5'
                />
                <h1 className='font-lato text-lg text-gray-500'>email do usuario</h1>
              </div>
            </div>
          </div>
        </div>

        

        <div className="absolute w-13.5 h-21.75 top-5/8 left-2/18">
          <Image 
            src="/imagens/voltar.png"
            alt="voltar"
            fill
          />
        </div>
      </div>

      <div className='relative left-16/21 top-85 mb-10'>
          <button 
            onClick={openModal}
            className='bg-purple-700 text-white py-3 px-15 rounded-full hover:bg-purple-600
            font-light shadow-md cursor-pointer' type='button'>
            Editar Perfil
          </button>
        </div>

      <div className="w-[1900px] px-80 py-40 mt-[340px]">
        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/imagens/injetaveis.png"
            alt="injetáveis"
            width={32}
            height={32}
          />
          <h2 className="text-2xl text-[#6A38F3]">Injetáveis</h2>
        </div>
        <div className="bg-[#F2F3FF] rounded-full p-6 min-h-[70px] mb-4">
          <p className="text-gray-500 text-center">Nenhum relatório adicionado</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/imagens/exercicio.png"
            alt="exercicio"
            width={32}
            height={32}
          />
          <h2 className="text-2xl text-[#6A38F3]">Atividade Física</h2>
        </div>
        <div className="bg-[#F2F3FF] rounded-full p-6 min-h-[70px] mb-4">
          <p className="text-gray-500 text-center">Nenhum relatório adicionado</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/imagens/dietaCor.png"
            alt="dieta_roxa"
            width={32}
            height={32}
          />
          <h2 className="text-2xl text-[#6A38F3]">Dieta</h2>
        </div>
        <div className="bg-[#F2F3FF] rounded-full p-6 min-h-[70px] mb-4">
          <p className="text-gray-500 text-center">Nenhum relatório adicionado</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/imagens/medida.png"
            alt="medidas"
            width={32}
            height={32}
          />
          <h2 className="text-2xl text-[#6A38F3]">Medidas</h2>
        </div>
        <div className="bg-[#F2F3FF] rounded-full p-6 min-h-[70px] mb-4">
          <p className="text-gray-500 text-center">Nenhum relatório adicionado</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/imagens/medicacao.png"
            alt="medicacao"
            width={32}
            height={32}
          />
          <h2 className="text-2xl text-[#6A38F3]">Medicações</h2>
        </div>
        <div className="bg-[#F2F3FF] rounded-full p-6 min-h-[70px] mb-4">
          <p className="text-gray-500 text-center">Nenhum relatório adicionado</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Image 
            src="/imagens/suplemento.png"
            alt="suplemento"
            width={32}
            height={32}
          />
          <h2 className="text-2xl text-[#6A38F3]">suplementos</h2>
        </div>
        <div className="bg-[#F2F3FF] rounded-full p-6 min-h-[70px] mb-4">
          <p className="text-gray-500 text-center">Nenhum relatório adicionado</p>
        </div>

        
      </div>

      <ModalEditarPerfil isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
