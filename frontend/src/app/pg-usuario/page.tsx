'use client'

import Image from 'next/image';
import HeaderTeste from "@/components/header";
import ModalEditarPerfil from "@/components/modal-perfil"; // Importação do modal
import { useState } from 'react';

export default function PgUsuarioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <main className="w-full min-h-screen bg-[#F6F3E4]">
      <HeaderTeste />
      
      <div className="w-full h-3/9 absolute bg-[#000000]">
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
              <h1 className='text-5xl font-lato text-black ml-3'>Nome de usuario</h1>

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

        <div className='absolute left-16/21 top-17/15'>
          <button 
            onClick={openModal}
            className='bg-purple-700 text-white py-3 px-15 rounded-full hover:bg-purple-600
            font-light shadow-md cursor-pointer' type='button'>
            Editar Perfil
          </button>
        </div>

        <div className="absolute w-13.5 h-21.75 top-5/8 left-2/18">
          <Image 
            src="/imagens/voltar.png"
            alt="voltar"
            fill
          />
        </div>

      </div>

      <ModalEditarPerfil isOpen={isModalOpen} onClose={closeModal} />
    </main>
  );
}
