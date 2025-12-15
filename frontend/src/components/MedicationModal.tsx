"use client";

import React, { useState, useEffect } from 'react';
import { IoClose, IoAddCircleOutline } from 'react-icons/io5';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsInstagram } from 'react-icons/bs';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Step1 = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center justify-center py-10">
    <button
      onClick={onNext}
      className="flex items-center gap-2 bg-purple-700 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg"
    >
      <IoAddCircleOutline size={24} />
      Adicionar Medicamento
    </button>
  </div>
);

const Step2 = ({ onNext }: { onNext: () => void }) => {
  const [isFrequencyExpanded, setIsFrequencyExpanded] = useState(false);

  return (
    <form className="space-y-4 animate-fadeIn">
      <input type="text" placeholder="Nome do Medicamento" className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <input type="text" placeholder="Concentração" className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

      {!isFrequencyExpanded ? (
        <input 
          type="text" 
          placeholder="Frequência" 
          className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          onFocus={() => setIsFrequencyExpanded(true)} 
          readOnly 
        />
      ) : (
        <div className="border border-indigo-300 rounded-xl p-4 animate-fadeIn">
          <p className="text-indigo-500 font-medium mb-2 px-2">Frequência</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-3 px-2">
            <label className="flex items-center gap-2 text-indigo-700 cursor-pointer">
              <input type="radio" name="freq" className="accent-indigo-600 w-4 h-4" defaultChecked />
              Frequência Diária
            </label>
            <label className="flex items-center gap-2 text-indigo-700 cursor-pointer">
              <input type="radio" name="freq" className="accent-indigo-600 w-4 h-4" />
              Frequência Semanal
            </label>
          </div>
          <input 
            type="text" 
            placeholder="Insira o valor da frequência" 
            className="w-full p-2 bg-white border border-indigo-200 rounded-full text-sm text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-400" 
          />
        </div>
      )}
      
      <p className="text-xs text-indigo-400 px-2">
        Obs: Medicamentos injetáveis, manipulados e reposições hormonais se enquadram nesse contexto
      </p>

      <div className="flex justify-center mt-6">
        <button type="button" onClick={onNext} className="flex items-center gap-2 bg-purple-700 text-white py-2 px-8 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors">
          Próximo <HiOutlineArrowRight />
        </button>
      </div>
    </form>
  );
};

const Step3 = ({ onFinish }: { onFinish: () => void }) => (
  <form className="space-y-4 animate-fadeIn">
    <input type="text" placeholder="Nome do Médico" className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    <div className="relative">
        <input type="text" placeholder="Instagram do Médico" className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10" />
        <BsInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" />
    </div>

    <div className="flex justify-center mt-8">
      <button type="button" onClick={onFinish} className="bg-purple-800 text-white py-2 px-10 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors shadow-md">
        Adicionar
      </button>
    </div>
  </form>
);


export const MedicationModal: React.FC<MedicationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setStep(1), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep((prev) => prev + 1);
  const handleFinish = () => {
    alert("Medicamento Adicionado!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white shadow-2xl rounded-3xl w-full max-w-xl p-8 min-h-[300px] flex flex-col">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-normal text-gray-800">Medicamentos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex-1">
            {step === 1 && <Step1 onNext={handleNext} />}
            {step === 2 && <Step2 onNext={handleNext} />}
            {step === 3 && <Step3 onFinish={handleFinish} />}
        </div>
      </div>
    </div>
  );
};