"use client";

import React, { useState, useEffect } from "react";
import { IoClose, IoChevronDown, IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsInstagram } from "react-icons/bs";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StepProps {
  onNext: () => void;
  onClose?: () => void;
}

// Estilos compartilhados
const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-black bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";
const headerStyle = "flex justify-between items-center w-full mb-6";
const titleStyle = "text-xl font-normal text-gray-800 font-['Montserrat']";

// --- PASSO 0: Pergunta Inicial ---
const StepQuestion: React.FC<StepProps> = ({ onNext, onClose }) => (
  <div className="flex flex-col h-full justify-center items-center text-center px-4">
    <h2 className="text-[22px] font-semibold text-[#19191A] font-['Montserrat'] leading-tight mb-8">
      Você faz uso contínuo de <br />
      <span className="text-[#6F3CF6]">algum medicamento?</span>
    </h2>

    <div className="flex gap-4 w-full justify-center max-w-[320px]">
      <button
        onClick={onClose}
        className="flex-1 py-3 rounded-full border-[1.5px] border-[#6F3CF6] text-[#6F3CF6] font-bold text-sm hover:bg-purple-50 transition-all active:scale-95"
      >
        Não
      </button>
      <button
        onClick={onNext}
        className="flex-1 py-3 rounded-full bg-[#6F3CF6] text-white font-bold text-sm hover:bg-[#5c2fe0] shadow-lg shadow-purple-200 transition-all active:scale-95"
      >
        Sim
      </button>
    </div>
  </div>
);

// --- PASSO 1: Botão Adicionar ---
const StepAddButton: React.FC<StepProps> = ({ onNext }) => (
  <div className="flex flex-col h-full">
    <div className={headerStyle}>
      <h2 className={titleStyle}>Medicamentos</h2>
      <IoChevronDown className="text-gray-400" />
    </div>

    <div className="flex-1 flex items-center justify-center">
      <button
        onClick={onNext}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-8 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
      >
        <IoAddCircleOutline size={22} />
        Adicionar Medicamento
      </button>
    </div>
  </div>
);

// --- PASSO 2: Form do Medicamento ---
const StepMedForm: React.FC<StepProps> = ({ onNext }) => {
  const [isFrequencyExpanded, setIsFrequencyExpanded] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className={headerStyle}>
        <h2 className={titleStyle}>Medicamentos</h2>
        <IoChevronDown className="text-gray-400" />
      </div>

      <form className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <input type="text" placeholder="Nome do Medicamento" className={inputStyle} />
        <input type="text" placeholder="Concentração" className={inputStyle} />

        {!isFrequencyExpanded ? (
          <input
            type="text"
            placeholder="Frequência"
            className={`${inputStyle} cursor-pointer`}
            onFocus={() => setIsFrequencyExpanded(true)}
            readOnly
          />
        ) : (
          <div className="border border-black rounded-[24px] p-6 animate-fadeIn bg-white">
            <p className="text-gray-500 font-medium mb-3 text-sm">Frequência</p>
            <div className="flex flex-col gap-3 mb-4">
              <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  className="accent-[#6F3CF6] w-5 h-5"
                  defaultChecked
                />
                Frequência Diária
              </label>
              <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                <input type="radio" name="freq" className="accent-[#6F3CF6] w-5 h-5" />
                Frequência Semanal
              </label>
            </div>
            <input
              type="text"
              placeholder="Insira o valor da frequência"
              className="w-full h-[40px] px-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#6F3CF6]"
            />
          </div>
        )}

        <p className="text-[10px] text-gray-400 px-2 leading-tight">
          Obs: Medicamentos injetáveis, manipulados e reposições hormonais se enquadram nesse contexto
        </p>

        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-colors shadow-md"
          >
            Próximo <HiOutlineArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- PASSO 3: Form do Médico ---
const StepDoctor: React.FC<{ onFinish: () => void }> = ({ onFinish }) => (
  <div className="flex flex-col h-full">
    <div className={headerStyle}>
      <h2 className={titleStyle}>Medicamentos</h2>
      <IoChevronDown className="text-gray-400" />
    </div>

    <form className="space-y-4 flex-1">
      <input type="text" placeholder="Nome do Médico" className={inputStyle} />

      {/* Instagram padronizado (igual seu exemplo) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Instagram do Médico"
          className={`${inputStyle} pl-12`}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F3CF6]/50">
          <BsInstagram size={16} />
        </div>
      </div>

      <div className="pt-8 flex justify-center">
        <button
          type="button"
          onClick={onFinish}
          className="bg-[#6F3CF6] text-white py-3 px-12 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-colors shadow-md"
        >
          Adicionar
        </button>
      </div>
    </form>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setStep(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => prev + 1);

  const handleFinish = () => {
    console.log("Fluxo Medicamentos Finalizado!");
    onClose();
  };

  const containerHeightClass = step === 0 ? "min-h-[280px]" : "min-h-[500px]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-[40px] shadow-2xl w-full max-w-[500px] ${containerHeightClass} p-8 md:p-10 border border-gray-100 flex flex-col transition-all duration-300 ease-in-out`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <IoClose size={24} />
        </button>

        {step === 0 && <StepQuestion onNext={handleNext} onClose={onClose} />}
        {step === 1 && <StepAddButton onNext={handleNext} />}
        {step === 2 && <StepMedForm onNext={handleNext} />}
        {step === 3 && <StepDoctor onFinish={handleFinish} />}
      </div>
    </div>
  );
};
