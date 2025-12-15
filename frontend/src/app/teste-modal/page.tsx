// Atualize o arquivo: src/app/teste-modal/page.tsx

"use client";

import React, { useState } from 'react';
import { HealthSurveyModal } from '@/components/HealthSurveyModal';
import { MedicationModal } from '@/components/MedicationModal';
import { TrainingModal } from '@/components/TrainingModal'; // Importe o novo modal

export default function TesteModalPage() {
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  
  // Novo estado para o Modal de Treino
  const [isTrainModalOpen, setIsTrainModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* <Header /> */}

      <main className="flex-1 flex flex-col items-center justify-center text-white gap-6 p-4">
        <h1 className="text-3xl font-bold mb-4">Área de Testes</h1>
        
        {/* Botão 1: Medidas Físicas */}
        <button onClick={() => setIsBioModalOpen(true)} className="bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 w-full max-w-md border border-gray-600">
          Teste 1: Medidas Físicas
        </button>

        {/* Botão 2: Medicamentos */}
        <button onClick={() => setIsMedModalOpen(true)} className="bg-white text-gray-900 py-4 px-6 rounded-3xl w-full max-w-xl flex justify-between items-center shadow-lg hover:bg-gray-50 transition-all">
          <span className="text-xl font-semibold">Medicamentos</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* --- Botão 3: Treino (NOVO) --- */}
        <button onClick={() => setIsTrainModalOpen(true)} className="bg-white text-gray-900 py-4 px-6 rounded-3xl w-full max-w-xl flex justify-between items-center shadow-lg hover:bg-gray-50 transition-all">
          <span className="text-xl font-semibold">Treino</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

      </main>

      {/* Modais */}
      <HealthSurveyModal isOpen={isBioModalOpen} onClose={() => setIsBioModalOpen(false)} />
      <MedicationModal isOpen={isMedModalOpen} onClose={() => setIsMedModalOpen(false)} />
      
      {/* Novo Modal de Treino */}
      <TrainingModal isOpen={isTrainModalOpen} onClose={() => setIsTrainModalOpen(false)} />
    </div>
  );
}