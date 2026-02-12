"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FaPills } from "react-icons/fa";
import { toast } from "react-toastify";
import { createOrUpdateMedicacao } from "@/api/api";

/* ================== PROPS ================== */

export type MedicationFrequency = number | null;

export interface MedicationData {
  frequencia: MedicationFrequency;
}

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId?: number;
  /** Callback quando usuário clica "Sim" - retorna os dados do medicamento */
  onYesCallback?: (data: MedicationData) => void;
  /** Callback quando usuário clica "Não" */
  onNoCallback?: () => void;
  /** Callback para voltar - retorna ao passo anterior */
  onBackCallback?: () => void;
  /** Se true, não salva no banco (usado quando incorporado em outro modal) */
  embeddedMode?: boolean;
}

/* ================== ESTILOS (IGUAL TRAINING / HEALTH) ================== */

const inputStyle =
  "w-full h-[50px] pl-12 pr-12 rounded-2xl bg-white/80 backdrop-blur-md text-[#1f1f1f] border border-gray-300/70 focus:border-[#6A38F3] focus:ring-4 focus:ring-[#6A38F3]/20 focus:outline-none transition-all duration-300";

const selectStyle = "appearance-none cursor-pointer";

/* ================== COMPONENTES AUX ================== */

const Input = ({ icon, ...props }: { icon: React.ReactNode; [key: string]: any }) => (
  <div className="relative group">
    <input {...props} className={inputStyle} />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A38F3] transition">
      {icon}
    </span>
  </div>
);

const Select = ({ icon, children, ...props }: { icon: React.ReactNode; children: React.ReactNode; [key: string]: any }) => (
  <div className="relative group">
    <select {...props} className={`${inputStyle} ${selectStyle}`}>
      {children}
    </select>

    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A38F3] transition">
      {icon}
    </span>

    <IoChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A38F3] transition" />
  </div>
);

const ModalHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <div className="relative px-8 py-6 border-b border-gray-300">
    <h2 className="text-lg font-semibold text-center text-[#2f2f2f]">
      {title}
    </h2>

    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl transition"
      aria-label="Fechar modal"
      type="button"
    >
      <IoClose />
    </button>
  </div>
);

/* ================== STEP 1 ================== */

const StepQuestion = ({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) => (
  <div className="p-8 flex flex-col items-center justify-center space-y-6">
    <FaPills className="text-[#6A38F3] text-4xl opacity-80" />

    <p className="text-sm text-gray-600 text-center max-w-xs">
      Você vai tomar algum medicamento manipulado para emagrecer?
    </p>

    <div className="flex gap-4 w-full">
      <button
        onClick={onNo}
        className="flex-1 p-3 rounded-full border border-gray-300 text-gray-600 hover:border-[#6A38F3] transition"
        type="button"
      >
        Não
      </button>

      <button
        onClick={onYes}
        className="flex-1 p-3 rounded-full border border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition"
        type="button"
      >
        Sim
      </button>
    </div>
  </div>
);

/* ================== STEP 2 ================== */

const StepMedication = ({ onNext, onValuesChange, onBack }: { 
  onNext: () => void; 
  onValuesChange: (values: { frequencia: MedicationFrequency }) => void;
  onBack?: () => void;
}) => {
  const [values, setValues] = useState<{
    frequencia: MedicationFrequency;
  }>({
    frequencia: null,
  });
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customFrequency, setCustomFrequency] = useState<string>("");

  // Notifica o componente pai quando os valores mudam
  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  const valid =
    values.frequencia !== null &&
    values.frequencia > 0;

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "outro") {
      // Ativa o modo personalizado
      setShowCustomInput(true);
      setCustomFrequency("");
      setValues((p) => ({ ...p, frequencia: null }));
    } else {
      // Seleciona uma opção predefinida
      const numValue = value ? parseInt(value, 10) : null;
      setValues((p) => ({ ...p, frequencia: numValue }));
      setShowCustomInput(false);
      setCustomFrequency("");
    }
  };

  const handleCustomFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomFrequency(value);
    const numValue = value ? parseInt(value, 10) : null;
    if (numValue && numValue > 0) {
      setValues((p) => ({ ...p, frequencia: numValue }));
    } else {
      setValues((p) => ({ ...p, frequencia: null }));
    }
  };

  return (
    <div className="p-8 space-y-4">
      <Select
        icon={<FaPills />}
        value={
          showCustomInput
            ? "outro"
            : values.frequencia === null
            ? ""
            : values.frequencia.toString()
        }
        onChange={handleFrequencyChange}
      >
        <option value="" disabled>
          Frequência de uso
        </option>
        <option value="1">Todo dia</option>
        <option value="2">De 2 em 2 dias</option>
        <option value="3">De 3 em 3 dias</option>
        <option value="4">De 4 em 4 dias</option>
        <option value="5">De 5 em 5 dias</option>
        <option value="6">De 6 em 6 dias</option>
        <option value="7">De 7 em 7 dias</option>
        <option value="outro">Outro (personalizado)</option>
      </Select>

      {showCustomInput && (
        <Input
          icon={<FaPills />}
          type="number"
          min="1"
          placeholder="Digite o intervalo em dias"
          value={customFrequency}
          onChange={handleCustomFrequencyChange}
        />
      )}

      <button
        disabled={!valid}
        onClick={onNext}
        className={`w-full p-3 rounded-full border transition
          ${
            valid
              ? "border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white"
              : "border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        type="button"
      >
        Próximo
      </button>

      {onBack && (
        <button
          onClick={onBack}
          className="w-full p-3 rounded-full border border-gray-300 text-gray-600 hover:border-gray-400 transition"
          type="button"
        >
          Voltar
        </button>
      )}
    </div>
  );
};

/* ================== STEP 3 ================== */
// Removed doctor fields: final step now saves only frequency (or returns it to parent in embedded mode)

/* ================== MODAL ================== */

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  usuarioId,
  onYesCallback,
  onNoCallback,
  onBackCallback,
  embeddedMode = false,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [medicationValues, setMedicationValues] = useState<{ 
    frequencia: MedicationFrequency 
  }>({
    frequencia: null,
  });

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setMedicationValues({ frequencia: null });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    setMedicationValues({ frequencia: null });
    onClose();
  };

  const handleNo = () => {
    if (onNoCallback) {
      onNoCallback();
    }
    handleClose();
  };

  const handleFinish = () => {
    setStep(1);
    setMedicationValues({ frequencia: null });
    onClose();
  };

  const handleStep2Next = async () => {
    // If embedded, just return the data to parent
    if (embeddedMode && onYesCallback) {
      onYesCallback(medicationValues as MedicationData);
      handleFinish();
      return;
    }

    // Otherwise save directly to backend
    if (!usuarioId) {
      toast.error('ID do usuário não informado');
      return;
    }

    try {
      await createOrUpdateMedicacao(usuarioId, {
        frequencia: medicationValues.frequencia,
      });
      toast.success('Medicamento salvo com sucesso!');
      handleFinish();
    } catch (error: any) {
      console.error('Erro ao salvar medicamento:', error);
      toast.error(error.message || 'Erro ao salvar medicamento');
    }
  };

  const handleMedicationValuesChange = useMemo(
    () => (values: { frequencia: MedicationFrequency }) => {
      setMedicationValues(values);
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#EDEDED] rounded-xl max-w-md w-full shadow-xl overflow-hidden"
      >
        <ModalHeader title="Medicamentos" onClose={handleClose} />

        {step === 1 && (
          <StepQuestion
            onYes={() => setStep(2)}
            onNo={handleNo}
          />
        )}

        {step === 2 && (
          <StepMedication 
            onNext={handleStep2Next} 
            onValuesChange={handleMedicationValuesChange}
            onBack={onBackCallback}
          />
        )}
      </div>
    </div>
  );
};
