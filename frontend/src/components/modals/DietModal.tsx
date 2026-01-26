"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoChevronDown,IoClose } from "react-icons/io5";

interface DietModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-black bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";

const HeaderRow = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-black font-['Montserrat']">{title}</h2>
  </div>
);

const FieldHint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] text-gray-500 px-2 leading-tight">{children}</p>
);

// STEP 1
const StepAddDiet = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col h-full">
    <HeaderRow title="Dieta" />

    <div className="flex-1 flex items-center justify-center">
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
      >
        <FiPlus size={16} />
        Adicionar Dieta
      </button>
    </div>
  </div>
);

// STEP 2
type Step2Form = {
  frequencia: string;
  calorias: string;
  macrosOpen: boolean;
  carbo: string;
  proteina: string;
  gordura: string;
  hidratacao: string;
};

const StepDietForm = ({ onNext }: { onNext: () => void }) => {
  const [v, setV] = useState<Step2Form>({
    frequencia: "",
    calorias: "",
    macrosOpen: false,
    carbo: "",
    proteina: "",
    gordura: "",
    hidratacao: "",
  });

  const isValid = useMemo(() => {
    if (!v.frequencia.trim()) return false;
    if (!v.calorias.trim()) return false;
    if (!v.hidratacao.trim()) return false;
    if (v.macrosOpen) {
      if (!v.carbo.trim()) return false;
      if (!v.proteina.trim()) return false;
      if (!v.gordura.trim()) return false;
    }
    return true;
  }, [v]);

  return (
    <div className="flex flex-col h-full">
      <HeaderRow title="Dieta" />

      <form className="space-y-4 flex-1 overflow-y-auto pr-1">
        <input
          placeholder="Frequência Diária"
          className={inputStyle}
          value={v.frequencia}
          onChange={(e) => setV((p) => ({ ...p, frequencia: e.target.value }))}
        />

        <input
          placeholder="Calorias Diárias Consumidas"
          className={inputStyle}
          value={v.calorias}
          onChange={(e) => setV((p) => ({ ...p, calorias: e.target.value }))}
        />

        {!v.macrosOpen ? (
          <button
            type="button"
            onClick={() => setV((p) => ({ ...p, macrosOpen: true }))}
            className={`${inputStyle} flex items-center justify-between text-left bg-white`}
          >
            <span className="text-gray-600">Gramas de Macros</span>
            <IoChevronDown className="text-gray-500" />
          </button>
        ) : (
          <div className="border border-black rounded-[24px] p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-medium text-sm">Gramas de Macros</p>
              <button
                type="button"
                onClick={() => setV((p) => ({ ...p, macrosOpen: false }))}
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Fechar macros"
              >
                <IoChevronDown className="rotate-180" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                placeholder="Carboidrato"
                className={inputStyle}
                value={v.carbo}
                onChange={(e) => setV((p) => ({ ...p, carbo: e.target.value }))}
              />
              <input
                placeholder="Proteína"
                className={inputStyle}
                value={v.proteina}
                onChange={(e) =>
                  setV((p) => ({ ...p, proteina: e.target.value }))
                }
              />
              <input
                placeholder="Gordura"
                className={inputStyle}
                value={v.gordura}
                onChange={(e) =>
                  setV((p) => ({ ...p, gordura: e.target.value }))
                }
              />
            </div>
          </div>
        )}

        <input
          placeholder="Hidratação"
          className={inputStyle}
          value={v.hidratacao}
          onChange={(e) =>
            setV((p) => ({ ...p, hidratacao: e.target.value }))
          }
        />

        <FieldHint>
          Obs para dica: Peso x 30 ml = qtd. de água diária do paciente (calcular
          e já entregar o valor que o paciente precisa consumir)
        </FieldHint>

        <div className="pt-6 flex justify-center">
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className={`flex items-center gap-2 py-3 px-12 rounded-full text-sm font-bold transition-transform shadow-md
              ${
                isValid
                  ? "bg-[#6F3CF6] text-white hover:bg-[#5c2fe0] hover:scale-105"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Próximo <HiOutlineArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

// STEP 3
const StepNutritionist = ({ onFinish }: { onFinish: () => void }) => (
  <div className="flex flex-col h-full">
    <HeaderRow title="Dieta" />

    <form className="space-y-4 flex-1">
      <input type="text" placeholder="Nome do Nutricionista" className={inputStyle} />

      <div className="relative">
        <input
          type="text"
          placeholder="Instagram do Nutricionista"
          className={`${inputStyle} pl-12`}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F3CF6]/50">
          <BsInstagram size={16} />
        </div>
      </div>

      <div className="pt-10 flex justify-center">
        <button
          type="button"
          onClick={onFinish}
          className="bg-[#6F3CF6] text-white py-3 px-14 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
        >
          Adicionar
        </button>
      </div>
    </form>
  </div>
);

export const DietModal: React.FC<DietModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setStep(1), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[56px] shadow-2xl w-full max-w-[720px] min-h-[560px] p-10 border border-gray-100 flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
          aria-label="Fechar modal"
        >
          <IoClose size={24} />
        </button>

        {step === 1 && <StepAddDiet onNext={() => setStep(2)} />}
        {step === 2 && <StepDietForm onNext={() => setStep(3)} />}
        {step === 3 && <StepNutritionist onFinish={onClose} />}
      </div>
    </div>
  );
};
