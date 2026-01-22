"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoChevronDown, IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsInstagram } from "react-icons/bs";

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* =======================
   Styles
======================= */
const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";

const Header = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <>
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900 font-['Montserrat']">
        {title}
      </h2>

      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-800 transition-colors"
        aria-label="Fechar modal"
      >
        <IoClose size={22} />
      </button>
    </div>

    <div className="w-full h-px bg-gray-200 mt-4 mb-8" />
  </>
);

/* =======================
   STEP 1
======================= */
const StepAddButton = ({
  onNext,
  onClose,
}: {
  onNext: () => void;
  onClose: () => void;
}) => (
  <div className="flex flex-col h-full">
    <Header title="Treino" onClose={onClose} />

    <div className="flex-1 flex items-center justify-center">
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-3 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-semibold hover:bg-[#5c2fe0] transition-all hover:scale-105 shadow-md"
      >
        <IoAddCircleOutline size={22} />
        Adicionar Treino
      </button>
    </div>
  </div>
);

/* =======================
   STEP 2
======================= */
type Step2Values = {
  musc: string;
  aero: string;
};

const StepFrequency = ({
  onNext,
  onClose,
}: {
  onNext: () => void;
  onClose: () => void;
}) => {
  const [v, setV] = useState<Step2Values>({ musc: "", aero: "" });
  const isValid = useMemo(() => v.musc !== "" && v.aero !== "", [v]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Treino" onClose={onClose} />

      <form className="flex-1 space-y-5">
        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer`}
            value={v.musc}
            onChange={(e) => setV((p) => ({ ...p, musc: e.target.value }))}
          >
            <option value="" disabled>
              Frequência semanal - Musculação
            </option>
            <option value="1">1 dia</option>
            <option value="2">2 dias</option>
            <option value="3">3 dias</option>
            <option value="4">4 dias</option>
            <option value="5">5 dias</option>
            <option value="6">6 dias</option>
            <option value="7">Todos os dias</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer`}
            value={v.aero}
            onChange={(e) => setV((p) => ({ ...p, aero: e.target.value }))}
          >
            <option value="" disabled>
              Frequência semanal - Aeróbico
            </option>
            <option value="0">Não faço</option>
            <option value="1">1 dia</option>
            <option value="2">2 dias</option>
            <option value="3">3 dias</option>
            <option value="4">4 dias</option>
            <option value="5">5 dias</option>
            <option value="6">6 dias</option>
            <option value="7">Todos os dias</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <p className="text-xs text-gray-500 leading-snug px-2">
          Aeróbico inclui atividades como caminhada, esportes, dança, corrida,
          entre outros.
        </p>

        <div className="pt-10 flex justify-center">
          <button
            type="button"
            onClick={onNext}
            disabled={!isValid}
            className={`flex items-center gap-2 py-3 px-12 rounded-full text-sm font-semibold transition-all shadow-md
              ${
                isValid
                  ? "bg-[#6F3CF6] text-white hover:bg-[#5c2fe0] hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Próximo <HiOutlineArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

/* =======================
   STEP 3
======================= */
const StepPersonal = ({
  onFinish,
  onClose,
}: {
  onFinish: () => void;
  onClose: () => void;
}) => (
  <div className="flex flex-col h-full">
    <Header title="Treino" onClose={onClose} />

    <form className="flex-1 space-y-5">
      <input
        type="text"
        placeholder="Nome do personal"
        className={inputStyle}
      />

      <div className="relative">
        <input
          type="text"
          placeholder="Instagram do personal"
          className={`${inputStyle} pl-12`}
        />
        <BsInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F3CF6]/60" />
      </div>

      <div className="pt-12 flex justify-center">
        <button
          type="button"
          onClick={onFinish}
          className="bg-[#6F3CF6] text-white py-3 px-14 rounded-full text-sm font-semibold hover:bg-[#5c2fe0] transition-all hover:scale-105 shadow-md"
        >
          Salvar treino
        </button>
      </div>
    </form>
  </div>
);

/* =======================
   MODAL
======================= */
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[720px] min-h-[560px] rounded-3xl p-10 shadow-2xl flex flex-col"
      >
        {step === 1 && (
          <StepAddButton onNext={() => setStep(2)} onClose={onClose} />
        )}
        {step === 2 && (
          <StepFrequency onNext={() => setStep(3)} onClose={onClose} />
        )}
        {step === 3 && (
          <StepPersonal onFinish={onClose} onClose={onClose} />
        )}
      </div>
    </div>
  );
};
