import { useEffect } from "react";
import Image from "next/image";

interface funcaoModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function modalDieta( {isOpen, onClose} : funcaoModal) {
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
      <div className="bg-white w-120 h-150 p-6 rounded-xl shadow-lg relative">
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

        <form className="flex flex-col justify-items-center">
          <div className="mb-4 justify-items-center">
            <input 
              type="text"
              placeholder="Frequência diária"
              className="w-90 p-2 mt-10 bg-white border-2 border-[#6A38F3] rounded-full text-[#6A38F3] text-center font-bold" 
            />
            <input 
              type="text"
              placeholder="calorias diárias consumidas"
              className="w-90 p-2 mt-10 bg-white border-2 border-[#6A38F3] rounded-full text-[#6A38F3] text-center font-bold" 
            />
            <input 
              type="text"
              placeholder="hidratação"
              className="w-90 p-2 mt-10 bg-white border-2 border-[#6A38F3] rounded-full text-[#6A38F3] text-center font-bold" 
            />

            <fieldset className="mt-4 border-2 border-[#6A38F3] rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                    <legend className="text-lg font-medium text-[#6A38F3]">
                        Gramas de Macros
                    </legend>
                </div>
                <div className="space-y-2 pl-2">
                    <input
                    type="text"
                    placeholder="Carboidrato"
                    className="w-64 px-4 py-1.5 border-2 border-[#6A38F3] rounded-full outline-none text-[#6A38F3]"
                    />
                    <input
                    type="text"
                    placeholder="Proteína"
                    className="w-64 px-4 py-1.5 border-2 border-[#6A38F3] rounded-full outline-none text-[#6A38F3]"
                    />
                    <input
                    type="text"
                    placeholder="Gordura"
                    className="w-64 px-4 py-1.5 border-2 border-[#6A38F3] rounded-full outline-none text-[#6A38F3]"
                    />
                </div>
            </fieldset>
          </div>
        </form>
        <div className="flex justify-center mt-1">
            <button className="text-white bg-[#6A38F3] px-8 py-2 rounded-full text-lg cursor-pointer">
                Próximo
            </button>
        </div>

      </div>
    </div>
  );
}