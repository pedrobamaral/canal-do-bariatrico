"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoAddCircleOutline,IoChevronDown, IoClose } from "react-icons/io5";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Estilo (MESMO padrão HealthSurvey) ---
const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-black bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";
const labelStyle = "sr-only";

const HeaderRow = ({ title }: { title: string }) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-black font-['Montserrat']">{title}</h2>
  </div>
);

const FieldHint = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] text-gray-500 px-2 leading-tight">{children}</p>
);

// STEP 0
const StepQuestion = ({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) => (
  <div className="flex flex-col h-full justify-center items-center text-center px-6">
    <h2 className="text-[26px] font-bold text-black font-['Montserrat'] leading-tight mb-10">
      Você faz uso contínuo de <br />
      <span className="text-[#6F3CF6]">algum medicamento?</span>
    </h2>

    <div className="flex gap-4 w-full justify-center max-w-[360px]">
      <button
        type="button"
        onClick={onNo}
        className="flex-1 py-3 rounded-full border border-[#6F3CF6] text-[#6F3CF6] font-bold text-sm hover:bg-purple-50 transition-all active:scale-95"
      >
        Não
      </button>

      <button
        type="button"
        onClick={onYes}
        className="flex-1 py-3 rounded-full bg-[#6F3CF6] text-white font-bold text-sm hover:bg-[#5c2fe0] shadow-md transition-all active:scale-95"
      >
        Sim
      </button>
    </div>
  </div>
);

// STEP 1
const StepAdd = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col h-full">
    <HeaderRow title="Medicamentos" />

    <div className="flex-1 flex items-center justify-center">
      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-3 px-10 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
      >
        <IoAddCircleOutline size={22} />
        Adicionar Medicamento
      </button>
    </div>
  </div>
);

// STEP 2
type Step2Form = {
  nome: string;
  concentracao: string;
  tipoFreq: "" | "diaria" | "semanal";
  freqValor: string;
};

const StepMedForm = ({ onNext }: { onNext: () => void }) => {
  const [expanded, setExpanded] = useState(false);

  const [values, setValues] = useState<Step2Form>({
    nome: "",
    concentracao: "",
    tipoFreq: "",
    freqValor: "",
  });

  const isValid = useMemo(() => {
    if (!values.nome.trim()) return false;
    if (!values.concentracao.trim()) return false;
    if (expanded) {
      if (!values.tipoFreq) return false;
      if (!values.freqValor.trim()) return false;
    }
    return true;
  }, [values, expanded]);

  return (
    <div className="flex flex-col h-full">
      <HeaderRow title="Medicamentos" />

      <form className="space-y-4 flex-1 overflow-y-auto pr-1">
        <div>
          <label className={labelStyle}>Nome do Medicamento</label>
          <input
            className={inputStyle}
            placeholder="Nome do Medicamento"
            value={values.nome}
            onChange={(e) => setValues((p) => ({ ...p, nome: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelStyle}>Concentração</label>
          <input
            className={inputStyle}
            placeholder="Concentração"
            value={values.concentracao}
            onChange={(e) =>
              setValues((p) => ({ ...p, concentracao: e.target.value }))
            }
          />
        </div>

        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className={`${inputStyle} flex items-center justify-between text-left bg-white`}
          >
            <span className="text-gray-600">Frequência</span>
            <IoChevronDown className="text-gray-500" />
          </button>
        ) : (
          <div className="border border-black rounded-[24px] p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 font-medium text-sm">Frequência</p>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Fechar frequência"
              >
                <IoChevronDown className="rotate-180" />
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  className="accent-[#6F3CF6] w-5 h-5"
                  checked={values.tipoFreq === "diaria"}
                  onChange={() =>
                    setValues((p) => ({ ...p, tipoFreq: "diaria" }))
                  }
                />
                Frequência Diária
              </label>

              <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  className="accent-[#6F3CF6] w-5 h-5"
                  checked={values.tipoFreq === "semanal"}
                  onChange={() =>
                    setValues((p) => ({ ...p, tipoFreq: "semanal" }))
                  }
                />
                Frequência Semanal
              </label>
            </div>

            <input
              className="w-full h-[44px] px-5 bg-transparent border border-black rounded-full text-sm placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6]"
              placeholder="Insira o valor da frequência"
              value={values.freqValor}
              onChange={(e) =>
                setValues((p) => ({ ...p, freqValor: e.target.value }))
              }
            />
          </div>
        )}

        <FieldHint>
          Obs: Medicamentos injetáveis, manipulados e reposições hormonais se
          enquadram nesse contexto
        </FieldHint>

        <div className="pt-6 flex justify-center">
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
const StepDoctor = ({ onFinish }: { onFinish: () => void }) => (
  <div className="flex flex-col h-full">
    <HeaderRow title="Medicamentos" />

    <form className="space-y-4 flex-1">
      <input type="text" placeholder="Nome do Médico" className={inputStyle} />

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

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setStep(0), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    console.log("Fluxo Medicamentos Finalizado!");
    onClose();
  };

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

        {step === 0 && <StepQuestion onYes={() => setStep(1)} onNo={onClose} />}
        {step === 1 && <StepAdd onNext={() => setStep(2)} />}
        {step === 2 && <StepMedForm onNext={() => setStep(3)} />}
        {step === 3 && <StepDoctor onFinish={handleFinish} />}
      </div>
    </div>
  );
};
