"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // Import necessário para a mascote
import { FiPlus } from 'react-icons/fi';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { IoClose, IoChevronDown } from 'react-icons/io5';

interface HealthSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalStepProps {
  onAction: () => void;
}

// --- Estilos Comuns ---
const inputStyle = "w-full h-[50px] px-6 rounded-full border border-black bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";
const labelStyle = "sr-only"; // Esconde label visualmente mas mantém acessibilidade

// --- PASSO 1: Medidas Físicas Básicas ---
const ModalStep1: React.FC<ModalStepProps> = ({ onAction }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black font-['Montserrat']">Medidas Físicas</h2>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
        />
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="flex items-center gap-1 bg-[#6F3CF6] text-white py-1.5 px-4 rounded-full text-xs font-bold hover:bg-[#5c2fe0] transition-colors"
        >
          <FiPlus size={14} />
          Adicionar Bioimpedância
        </button>
      </div>

      {/* Formulário */}
      <form className="space-y-4 flex-1">
        <div>
          <label className={labelStyle}>Peso (kg)</label>
          <input type="number" placeholder="Peso (kg)" className={inputStyle} />
        </div>
        
        <div>
          <label className={labelStyle}>Altura (cm)</label>
          <input type="number" placeholder="Altura (cm)" className={inputStyle} />
        </div>

        <div>
          <label className={labelStyle}>Idade (anos)</label>
          <input type="number" placeholder="Idade (anos)" className={inputStyle} />
        </div>

        {/* Select de Sexo - Apenas Masculino/Feminino */}
        <div className="relative">
          <select className={`${inputStyle} appearance-none cursor-pointer bg-white`}>
            <option value="" disabled selected>Sexo Biológico</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <div>
          <label className={labelStyle}>Quantos quilos quero ter (kg)</label>
          <input type="number" placeholder="Quantos quilos quero ter (kg)" className={inputStyle} />
        </div>

        {/* Botão Próximo Centralizado */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
          >
            Próximo
            <HiOutlineArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- PASSO 2: Intervenção e Finalização ---
const ModalStep2: React.FC<ModalStepProps> = ({ onAction }) => (
  <div className="flex flex-col h-full text-center">
    <h2 className="text-2xl font-bold text-black font-['Montserrat'] mb-8 text-left">Medidas Físicas</h2>

    <form className="space-y-6 flex-1 flex flex-col items-center">
      {/* Dropdown Tipo de Intervenção */}
      <div className="relative w-full">
        <select className={`${inputStyle} appearance-none cursor-pointer bg-white text-left`}>
          <option value="" disabled selected>Tipo de Intervenção</option>
          <option value="bypass">Bypass Gástrico</option>
          <option value="sleeve">Sleeve Gastrectomia</option>
          <option value="caneta">Caneta Emagrecedora</option>
        </select>
        <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* Link de Informações Adicionais */}
      <button 
        type="button" 
        className="text-[#6F3CF6] font-bold text-sm hover:underline self-start ml-2"
      >
        Preencher Informações Adicionais
      </button>

      {/* Botão Finalizar */}
      <button
        type="button"
        onClick={onAction}
        className="bg-[#6F3CF6] text-white py-3 px-12 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md mt-4"
      >
        Finalizar
      </button>

      {/* Texto de Rodapé e Mascote */}
      <div className="mt-auto pt-6 flex flex-col items-center">
        <p className="text-gray-500 text-xs max-w-[80%] mb-4">
          O preenchimento de informações adicionais fará com que a BARI te entregue resultados mais precisos
        </p>
        
        {/* Imagem da Mascote - Ajustada para parecer a cabeça saindo de baixo */}
        <div className="relative w-24 h-24">
             {/* ATENÇÃO: Estou usando a imagem que você já tem no projeto.
                Se tiver uma imagem cortada só da cabeça (como no design), 
                troque o src para ela. 
             */}
            <Image 
                src="/images/bari_padrao.png" 
                alt="Mascote Bari" 
                fill
                className="object-contain object-top"
            />
        </div>
      </div>
    </form>
  </div>
);

// --- Componente Principal do Modal ---
export const HealthSurveyModal: React.FC<HealthSurveyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  // Reseta o modal para o passo 1 sempre que fechar
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setStep(1), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  
  const handleFinish = () => {
    console.log("Fluxo finalizado!");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-[500px] min-h-[550px] p-8 md:p-10 border border-gray-100 flex flex-col"
      >
        {/* Botão Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <IoClose size={24} />
        </button>

        {step === 1 ? (
          <ModalStep1 onAction={handleNext} />
        ) : (
          <ModalStep2 onAction={handleFinish} />
        )}
      </div>
    </div>
  );
};