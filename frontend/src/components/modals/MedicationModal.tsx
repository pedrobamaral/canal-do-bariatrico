"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { FaPills, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { createOrUpdateMedicacao } from "@/api/api";

/* ================== TIPOS ================== */

export type MedicationFrequency = number | null;

export interface MedicationData {
  frequencia: MedicationFrequency;
}

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId?: number;
  onYesCallback?: (data: MedicationData) => void;
  onNoCallback?: () => void;
  onBackCallback?: () => void;
  embeddedMode?: boolean;
}

/* ================== INPUTS DARK ================== */

const DarkInput = ({ icon, ...props }: any) => (
  <div className="relative">
    <input
      {...props}
      className="
        w-full h-[50px] rounded-full
        bg-white/5 border border-white/10
        pl-12 pr-4
        text-white placeholder-white/40
        focus:outline-none focus:border-[#8B5CF6]
      "
    />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
      {icon}
    </span>
  </div>
);

function DarkSelect({ icon, children, ...props }: any) {
  const [active, setActive] = useState(false);

  const handleBlur = () => setActive(false);

  return (
    <div className="relative group">
      <select
        {...props}
        onClick={() => setActive(true)}
        onFocus={() => setActive(true)}
        onBlur={handleBlur}
        className={
          "w-full h-[50px] rounded-full appearance-none bg-white/5 border border-white/10 pl-12 pr-10 text-white focus:outline-none focus:border-[#8B5CF6] group-focus-within:border-[#8B5CF6]"
        }
      >
        {children}
      </select>

      <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${
        active ? "text-[#8B5CF6]" : "text-white/40"
      }`}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon as any, {
              className: `${active ? "text-[#8B5CF6]" : "text-white/40"} w-4 h-4`,
            })
          : icon}
      </span>

      <IoChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${
        active ? "text-[#8B5CF6]" : "text-white/40"
      }`} />
    </div>
  );
}

/* ================== STEP 1 ================== */

const StepQuestion = ({
  onYes,
  onNo,
}: {
  onYes: () => void;
  onNo: () => void;
}) => (
  <div className="p-8 flex flex-col items-center justify-center space-y-6 text-white">
    <FaPills className="text-[#8B5CF6] text-4xl opacity-90" />

    <p className="text-sm text-white/70 text-center max-w-xs">
      Você vai tomar algum medicamento manipulado para emagrecer?
    </p>

    <div className="flex gap-4 w-full">
      <button
        onClick={onNo}
        className="
          flex-1 py-3 rounded-full
          border border-white/20
          text-white/70
          hover:bg-white/10 transition
        "
        type="button"
      >
        Não
      </button>

      <button
        onClick={onYes}
        className="
          flex-1 py-3 rounded-full font-medium
          bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]
          hover:scale-105 transition
        "
        type="button"
      >
        Sim
      </button>
    </div>
  </div>
);

/* ================== STEP 2 ================== */

const StepMedication = ({
  onNext,
  onValuesChange,
  onBack,
}: {
  onNext: () => void;
  onValuesChange: (values: { frequencia: MedicationFrequency }) => void;
  onBack?: () => void;
}) => {
  const [values, setValues] = useState<{ frequencia: MedicationFrequency }>({
    frequencia: null,
  });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customFrequency, setCustomFrequency] = useState("");

  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  const valid = values.frequencia !== null && values.frequencia > 0;

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "outro") {
      setShowCustomInput(true);
      setCustomFrequency("");
      setValues({ frequencia: null });
    } else {
      const num = value ? parseInt(value, 10) : null;
      setValues({ frequencia: num });
      setShowCustomInput(false);
      setCustomFrequency("");
    }
  };

  const handleCustomFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setCustomFrequency(v);
    const num = v ? parseInt(v, 10) : null;
    setValues({ frequencia: num && num > 0 ? num : null });
  };

  return (
    <div className="p-8 space-y-4 text-white">
      <DarkSelect
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
        <option value="" disabled className="bg-[#140f23] text-white/60">
          Frequência de uso
        </option>
        <option value="1" className="bg-[#140f23] text-white">Todo dia</option>
        <option value="2" className="bg-[#140f23] text-white">De 2 em 2 dias</option>
        <option value="3" className="bg-[#140f23] text-white">De 3 em 3 dias</option>
        <option value="4" className="bg-[#140f23] text-white">De 4 em 4 dias</option>
        <option value="5" className="bg-[#140f23] text-white">De 5 em 5 dias</option>
        <option value="6" className="bg-[#140f23] text-white">De 6 em 6 dias</option>
        <option value="7" className="bg-[#140f23] text-white">De 7 em 7 dias</option>
        <option value="outro" className="bg-[#140f23] text-white">Outro (personalizado)</option>
      </DarkSelect>

      {showCustomInput && (
        <DarkInput
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
        className="
          w-full py-3 rounded-full font-medium
          bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]
          hover:scale-105 transition
          disabled:opacity-40
        "
        type="button"
      >
        Próximo
      </button>

      {onBack && (
        <button
          onClick={onBack}
          className="
            w-full py-3 rounded-full
            border border-white/20
            text-white/70
            hover:bg-white/10 transition
            flex items-center justify-center gap-2
          "
          type="button"
        >
          <FaArrowLeft /> Voltar
        </button>
      )}
    </div>
  );
};

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
    frequencia: MedicationFrequency;
  }>({ frequencia: null });

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
    onNoCallback?.();
    handleClose();
  };

  const handleFinish = () => {
    setStep(1);
    setMedicationValues({ frequencia: null });
    onClose();
  };

  const handleStep2Next = async () => {
    if (embeddedMode && onYesCallback) {
      onYesCallback(medicationValues as MedicationData);
      handleFinish();
      return;
    }

    if (!usuarioId) {
      toast.error("ID do usuário não informado");
      return;
    }

    try {
      await createOrUpdateMedicacao(usuarioId, {
        frequencia: medicationValues.frequencia,
      });
      toast.success("Medicamento salvo com sucesso!");
      handleFinish();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao salvar medicamento");
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
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(20,15,35,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-white/10 text-white">
          <h2 className="text-lg font-semibold text-center">
            Medicamentos
          </h2>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            aria-label="Fechar modal"
            type="button"
          >
            <IoClose size={22} />
          </button>
        </div>

        {step === 1 && (
          <StepQuestion onYes={() => setStep(2)} onNo={handleNo} />
        )}

        {step === 2 && (
          <StepMedication
            onNext={handleStep2Next}
            onValuesChange={handleMedicationValuesChange}
            onBack={onBackCallback}
          />
        )}
      </motion.div>
    </div>
  );
};