import { useEffect } from "react";
import Image from "next/image";

interface funcaoModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEditarPerfil( {isOpen, onClose} : funcaoModal) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-120 h-140 p-6 rounded-xl shadow-lg relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-[#EDEDED] flex justify-center items-center">
            <Image src="/imagens/perfil_generico.png" 
              alt="Foto de Perfil" 
              width={100} 
              height={100} 
              className="rounded-full"
             />

             <Image src="/imagens/camera.png" 
              alt="Foto de Perfil" 
              width={40} 
              height={40} 
              className="rounded-full absolute top-25"
             />
          </div>
        </div>

        <form className="flex-col justify-items-center-safe">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Nome" 
              className="w-70 p-2 mt-1 border border-gray-300 rounded-xl text-black" 
            />
          </div>

          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Username" 
              className="w-70 p-2 mt-1 border border-gray-300 rounded-xl text-black" 
            />
          </div>

          <div className="mb-4 mt-5">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-70 p-2 mt-1 border border-gray-300 rounded-xl text-black" 
            />
          </div>

          <div className="flex flex-col mt-14 w-70 ">
            <button className="text-red-500 border-red-500 border-2 p-2 rounded-4xl mb-3 ">
              Deletar Conta
            </button>
            <button className=" text-blue-500 border-blue-500 border-2 p-2 rounded-4xl mb-3">
              Alterar Senha
            </button>
            <button className="bg-purple-600 text-white p-2 rounded-4xl">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
