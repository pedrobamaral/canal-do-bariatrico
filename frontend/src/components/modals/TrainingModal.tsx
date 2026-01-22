"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoChevronDown, IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsInstagram } from "react-icons/bs";

interface TrainingModalProps {
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

// STEP 1
const StepAddButton = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col h-full">
    <HeaderRow title="Treino" />

    <div className="flex-1 flex items-center justify-center">
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
      >
        <IoAddCircleOutline size={22} />
        Adicionar Treino
      </button>
    </div>
  </div>
);

// STEP 2
type Step2Values = {
  musc: string;
  aero: string;
};

const StepFrequency = ({ onNext }: { onNext: () => void }) => {
  const [v, setV] = useState<Step2Values>({ musc: "", aero: "" });
  const isValid = useMemo(() => v.musc !== "" && v.aero !== "", [v]);

  return (
    <div className="flex flex-col h-full">
      <HeaderRow title="Treino" />

      <form className="space-y-4 flex-1">
        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer bg-white`}
            value={v.musc}
            onChange={(e) => setV((p) => ({ ...p, musc: e.target.value }))}
          >
            <option value="" disabled>
              Frequência Semanal - Musculação
            </option>
            <option value="1">1 dia na semana</option>
            <option value="2">2 dias na semana</option>
            <option value="3">3 dias na semana</option>
            <option value="4">4 dias na semana</option>
            <option value="5">5 dias na semana</option>
            <option value="6">6 dias na semana</option>
            <option value="7">Todos os dias</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer bg-white`}
            value={v.aero}
            onChange={(e) => setV((p) => ({ ...p, aero: e.target.value }))}
          >
            <option value="" disabled>
              Frequência Semanal - Aeróbico
            </option>
            <option value="0">Não faço</option>
            <option value="1">1 dia na semana</option>
            <option value="2">2 dias na semana</option>
            <option value="3">3 dias na semana</option>
            <option value="4">4 dias na semana</option>
            <option value="5">5 dias na semana</option>
            <option value="6">6 dias na semana</option>
            <option value="7">Todos os dias</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <p className="text-[10px] text-gray-500 px-2 leading-tight">
          Obs: Aeróbico = Atividades físicas como: esportes, caminhada, dança, etc.
        </p>

        <div className="pt-8 flex justify-center">
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
const StepPersonal = ({ onFinish }: { onFinish: () => void }) => (
  <div className="flex flex-col h-full">
    <HeaderRow title="Treino" />

    <form className="space-y-4 flex-1">
      <input type="text" placeholder="Nome do Personal" className={inputStyle} />

      <div className="relative">
        <input
          type="text"
          placeholder="Instagram do Personal"
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

export const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
}) => {
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

        {step === 1 && <StepAddButton onNext={() => setStep(2)} />}
        {step === 2 && <StepFrequency onNext={() => setStep(3)} />}
        {step === 3 && <StepPersonal onFinish={onClose} />}
      </div>
    </div>
  );
};
