import { useEffect } from "react";
import Image from "next/image";

interface funcaoModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function addDieta( {isOpen, onClose} : funcaoModal) {
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
      <div className="bg-white w-120 h-40 p-6 rounded-xl shadow-lg relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600">
            <Image src="/imagens/descer.png"
            alt="Descer"
            width={30}
            height={10.2}
            className="mt-2 mr-1.5"
            />
        </button>
        <div className="top-3 text-black left-70">
          <h1>
            Dieta
          </h1>
        </div>

        <form className="flex-col justify-items-center-safe">
          <div className="mb-4">
            <button 
              type="button"
              className="w-90 p-2 mt-10 bg-[#6A38F3] rounded-xl text-white" 
            >Adicionar uma dieta</button>
          </div>
        </form>
      </div>
    </div>
  );
}