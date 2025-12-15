"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoAddCircleOutline } from 'react-icons/io5';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsInstagram } from 'react-icons/bs';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Passo 1: Tela Inicial (Adicionar Treino - Upload) ---
const Step1 = ({ onNext }: { onNext: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Simula o upload e avança para o próximo passo
      console.log("Arquivo de treino selecionado:", event.target.files[0].name);
      onNext();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fadeIn">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf" // Aceita apenas PDF como pedido
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-indigo-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg"
      >
        <IoAddCircleOutline size={24} />
        Adicionar Treino
      </button>
    </div>
  );
};

// --- Passo 2: Frequência de Treino ---
const Step2 = ({ onNext }: { onNext: () => void }) => {
  return (
    <form className="space-y-6 animate-fadeIn">
      
      {/* Musculação */}
      <div>
        <label className="block text-indigo-500 font-medium mb-2 pl-2">Frequência Semanal - Musculação</label>
        <select className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
          <option value="" disabled selected>Selecione os dias</option>
          <option value="1">1 dia na semana</option>
          <option value="2">2 dias na semana</option>
          <option value="3">3 dias na semana</option>
          <option value="4">4 dias na semana</option>
          <option value="5">5 dias na semana</option>
          <option value="6">6 dias na semana</option>
          <option value="7">Todos os dias</option>
        </select>
      </div>

      {/* Aeróbico */}
      <div>
        <label className="block text-indigo-500 font-medium mb-2 pl-2">Frequência Semanal - Aeróbico</label>
        <select className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none">
          <option value="" disabled selected>Selecione os dias</option>
          <option value="1">1 dia na semana</option>
          <option value="2">2 dias na semana</option>
          <option value="3">3 dias na semana</option>
          <option value="4">4 dias na semana</option>
          <option value="5">5 dias na semana</option>
          <option value="6">6 dias na semana</option>
          <option value="7">Todos os dias</option>
        </select>
      </div>
      
      <p className="text-xs text-indigo-400 px-2">
        Obs: Aeróbico = Atividades físicas como: esportes, caminhada, dança, etc.
      </p>

      <div className="flex justify-center mt-6">
        <button type="button" onClick={onNext} className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-8 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors">
          Próximo <HiOutlineArrowRight />
        </button>
      </div>
    </form>
  );
};

// --- Passo 3: Dados do Personal ---
const Step3 = ({ onFinish }: { onFinish: () => void }) => (
  <form className="space-y-4 animate-fadeIn">
    <input type="text" placeholder="Nome do Personal" className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    
    <div className="relative">
        <input type="text" placeholder="Instagram do Personal" className="w-full p-3 bg-white border border-indigo-300 rounded-full text-indigo-900 placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10" />
        <BsInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" />
    </div>

    <div className="flex justify-center mt-8">
      <button type="button" onClick={onFinish} className="bg-indigo-600 text-white py-2 px-10 rounded-full text-lg font-bold hover:bg-indigo-700 transition-colors shadow-md">
        Adicionar
      </button>
    </div>
  </form>
);


// --- Componente Principal ---
export const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose }) => {
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
    alert("Treino Adicionado!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div onClick={(e) => e.stopPropagation()} className="relative bg-white shadow-2xl rounded-3xl w-full max-w-xl p-8 min-h-[300px] flex flex-col">
        
        {/* Header do Modal */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-normal text-gray-800">Treino</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1">
            {step === 1 && <Step1 onNext={handleNext} />}
            {step === 2 && <Step2 onNext={handleNext} />}
            {step === 3 && <Step3 onFinish={handleFinish} />}
        </div>
      </div>
    </div>
  );
};