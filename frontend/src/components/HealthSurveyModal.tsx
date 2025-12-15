"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { BsCalendar3 } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';

interface HealthSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}
interface ModalStep1Props {
  onNext: () => void;
}

const ModalStep1: React.FC<ModalStep1Props> = ({ onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click(); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("Arquivo selecionado:", file.name, file.type);
      alert(`Arquivo ${file.name} selecionado!`);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8"> {/* Espaçamento maior */}
        <h2 className="text-3xl font-bold text-gray-900">Medidas Físicas</h2> {/* Cor do texto */}
        
        {/* Botão de Adicionar Bioimpedância com input type="file" */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="flex items-center gap-2 bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <FiPlus size={18} />
          Adicionar Bioimpedância
        </button>
      </div>

      <form className="space-y-4"> 
        <input type="number" placeholder="Peso (kg)" className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="number" placeholder="Altura (cm)" className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="number" placeholder="Idade (anos)" className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="text" placeholder="Sexo Biológico" className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input type="number" placeholder="Massa Magra (kg)" className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

        <button
          type="button"
          onClick={onNext}
          className="w-full flex justify-center items-center gap-2 bg-purple-700 text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors mt-6" // Margem superior
        >
          Próximo
          <HiOutlineArrowRight size={20} />
        </button>
      </form>
    </>
  );
};

interface ModalStep2Props {
  onFinish: () => void;
}

const ModalStep2: React.FC<ModalStep2Props> = ({ onFinish }) => (
  <>
    <h2 className="text-3xl font-bold text-gray-900 mb-8">Sistema de Pontuação</h2> 

    <form className="space-y-4"> 
      <div className="relative">
        <select className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10">
          <option value="" disabled selected>Medicamentos</option> 
          <option>Opção 1</option>
          <option>Opção 2</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10">
          <option value="" disabled selected>Dieta</option>
          <option>Opção A</option>
          <option>Opção B</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10">
          <option value="" disabled selected>Treino</option>
          <option>Opção X</option>
          <option>Opção Y</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <input type="text" placeholder="Data de Início" onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')} className="w-full p-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <BsCalendar3 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="w-full bg-purple-700 text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-indigo-700 transition-colors mt-6"
      >
        Finalizar
      </button>
    </form>
  </>
);

export const HealthSurveyModal: React.FC<HealthSurveyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen) {
    return null;
  }

  const handleNext = () => setStep(2);
  const handleFinish = () => {
    console.log("Formulário finalizado!");
    onClose();
  };

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white shadow-2xl rounded-3xl w-full max-w-xl p-8 md:p-10" 
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
        >
          <IoClose size={28} />
        </button>

        {step === 1 ? (
          <ModalStep1 onNext={handleNext} />
        ) : (
          <ModalStep2 onFinish={handleFinish} />
        )}
      </div>
    </div>
  );
};