"use client"

import React, { useEffect, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { HiOutlineArrowRight } from "react-icons/hi"
import { IoClose, IoChevronDown } from "react-icons/io5"

interface DietModalProps {
  isOpen: boolean
  onClose: () => void
}

// ====== Estilo (igual vibe do protótipo) ======
const inputPill =
  "w-full h-[46px] px-5 rounded-full border border-[#6F3CF6] bg-white text-[#19191A] placeholder-[#6F3CF6]/70 focus:outline-none focus:ring-1 focus:ring-[#6F3CF6] transition-all"

const headerRow = "flex justify-between items-center w-full"
const titleStyle = "text-[18px] font-medium text-[#19191A] font-['Montserrat']"

// ====== Step 1: Botão Adicionar ======
const StepAddDiet = ({ onNext }: { onNext: () => void }) => {
  return (
    <div className="flex flex-col h-full">
      <div className={headerRow}>
        <h2 className={titleStyle}>Dieta</h2>
        <IoChevronDown className="text-[#19191A]/60" />
      </div>

      <div className="flex-1 mt-6 rounded-2xl border border-[#6F3CF6]/40 bg-white flex items-center justify-center p-6">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-[#6F3CF6] text-white py-2.5 px-6 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-colors shadow-md"
        >
          <FiPlus size={16} />
          Adicionar Dieta
        </button>
      </div>
    </div>
  )
}

// ====== Step 2: Form Dieta (com Macros expandível) ======
const StepDietForm = ({ onNext }: { onNext: () => void }) => {
  const [macrosExpanded, setMacrosExpanded] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className={headerRow}>
        <h2 className={titleStyle}>Dieta</h2>
        <IoChevronDown className="text-[#19191A]/60" />
      </div>

      <form className="mt-6 space-y-3 flex-1">
        <input type="text" placeholder="Frequência Diária" className={inputPill} />
        <input type="text" placeholder="Calorias Diárias Consumidas" className={inputPill} />

        {/* Gramas de Macros (colapsa/expande como no protótipo) */}
        {!macrosExpanded ? (
          <button
            type="button"
            onClick={() => setMacrosExpanded(true)}
            className={`${inputPill} flex items-center justify-between text-left`}
          >
            <span className="text-[#6F3CF6]/70">Gramas de Macros</span>
            <IoChevronDown className="text-[#19191A]/60" />
          </button>
        ) : (
          <div className="w-full rounded-[22px] border border-[#6F3CF6] bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#6F3CF6]">Gramas de Macros</span>
              <button
                type="button"
                onClick={() => setMacrosExpanded(false)}
                className="text-[#19191A]/60 hover:text-[#19191A] transition-colors"
                aria-label="Fechar macros"
              >
                <IoChevronDown className="rotate-180" />
              </button>
            </div>

            <div className="space-y-3">
              <input type="text" placeholder="Carboidrato" className={inputPill} />
              <input type="text" placeholder="Proteína" className={inputPill} />
              <input type="text" placeholder="Gordura" className={inputPill} />
            </div>
          </div>
        )}

        <input type="text" placeholder="Hidratação" className={inputPill} />

        <p className="text-[10px] text-[#6F3CF6]/70 px-2 leading-tight">
          Obs para dica: Peso x 30 ml = qtd. de água diária do paciente (calcular e já entregar o valor que o paciente
          precisa consumir)
        </p>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-[1.02] shadow-md"
          >
            Próximo <HiOutlineArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  )
}

// ====== Step 3: Nutricionista ======
const StepNutritionist = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <div className="flex flex-col h-full">
      <div className={headerRow}>
        <h2 className={titleStyle}>Dieta</h2>
        <IoChevronDown className="text-[#19191A]/60" />
      </div>

      <form className="mt-6 space-y-4 flex-1">
        <input type="text" placeholder="Nome do Nutricionista" className={inputPill} />
        <input type="text" placeholder="Instagram do Nutricionista" className={inputPill} />

        <div className="pt-6 flex justify-center">
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
}

// ====== Componente Principal ======
export const DietModal: React.FC<DietModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // reset ao fechar (igual seus outros modais)
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setStep(1), 250)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => setStep((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 3))
  const handleFinish = () => {
    // aqui você pode salvar o payload depois
    onClose()
  }

  const containerHeightClass = step === 1 ? "min-h-[340px]" : "min-h-[520px]"

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-transparent backdrop-blur-sm p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-[40px] shadow-2xl w-full max-w-[520px] ${containerHeightClass} p-8 md:p-10 border border-gray-100 flex flex-col transition-all duration-300`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
          aria-label="Fechar modal"
        >
          <IoClose size={24} />
        </button>

        {step === 1 && <StepAddDiet onNext={handleNext} />}
        {step === 2 && <StepDietForm onNext={handleNext} />}
        {step === 3 && <StepNutritionist onFinish={handleFinish} />}
      </div>
    </div>
  )
}
