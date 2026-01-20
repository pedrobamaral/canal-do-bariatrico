"use client"

import React, { useEffect, useState } from "react"
import { IoClose, IoChevronDown, IoAddCircleOutline } from "react-icons/io5"
import { HiOutlineArrowRight } from "react-icons/hi"
import { BsInstagram } from "react-icons/bs"

interface TrainingModalProps {
  isOpen: boolean
  onClose: () => void
}

// Estilos compartilhados (seguindo padrão dos seus outros modais)
const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-[#6F3CF6] bg-white text-[#19191A] placeholder-[#6F3CF6]/60 focus:outline-none focus:ring-1 focus:ring-[#6F3CF6] transition-all"
const headerStyle = "flex justify-between items-center w-full mb-6"
const titleStyle = "text-xl font-normal text-gray-800 font-['Montserrat']"

// --- PASSO 1: Botão "Adicionar Treino" (SEM upload) ---
const StepAddButton = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col h-full">
    <div className={headerStyle}>
      <h2 className={titleStyle}>Treino</h2>
      <IoChevronDown className="text-gray-400" />
    </div>

    <div className="flex-1 flex items-center justify-center">
      <button
        onClick={onNext}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
      >
        <IoAddCircleOutline size={20} />
        Adicionar Treino
      </button>
    </div>
  </div>
)

// --- PASSO 2: Frequência semanal ---
const StepFrequency = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col h-full">
    <div className={headerStyle}>
      <h2 className={titleStyle}>Treino</h2>
      <IoChevronDown className="text-gray-400" />
    </div>

    <form className="space-y-4 flex-1">
      <div className="relative">
        <select className={`${inputStyle} appearance-none cursor-pointer`}>
          <option value="" disabled selected>
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
        <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select className={`${inputStyle} appearance-none cursor-pointer`}>
          <option value="" disabled selected>
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
        <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      <p className="text-[10px] text-[#6F3CF6]/80 px-2 leading-tight">
        Obs: Aeróbico = Atividades físicas como: esportes, caminhada, dança, etc.
      </p>

      <div className="pt-6 flex justify-center">
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
)

// --- PASSO 3: Personal ---
const StepPersonal = ({ onFinish }: { onFinish: () => void }) => (
  <div className="flex flex-col h-full">
    <div className={headerStyle}>
      <h2 className={titleStyle}>Treino</h2>
      <IoChevronDown className="text-gray-400" />
    </div>

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
          className="bg-[#6F3CF6] text-white py-3 px-12 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-colors shadow-md"
        >
          Adicionar
        </button>
      </div>
    </form>
  </div>
)

export const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1)

  // Resetar passo quando fechar
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setStep(1), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => setStep((prev) => prev + 1)

  const handleFinish = () => {
    console.log("Fluxo Treino Finalizado!")
    onClose()
  }

  // altura dinâmica opcional (se quiser igual ao MedicationModal)
  const containerHeightClass =
    step === 1 ? "min-h-[360px]" : "min-h-[520px]"

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-[40px] shadow-2xl w-full max-w-[500px] ${containerHeightClass} p-8 md:p-10 border border-gray-100 flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <IoClose size={24} />
        </button>

        {step === 1 && <StepAddButton onNext={handleNext} />}
        {step === 2 && <StepFrequency onNext={handleNext} />}
        {step === 3 && <StepPersonal onFinish={handleFinish} />}
      </div>
    </div>
  )
}
