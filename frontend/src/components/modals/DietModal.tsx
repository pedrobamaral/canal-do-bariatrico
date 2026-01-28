"use client";

import React, { useEffect, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import {
  FaUtensils,
  FaFireAlt,
  FaAppleAlt,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { createOrUpdateDieta } from "@/api/api";

/* ================== PROPS ================== */

interface DietModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId?: number;
}

/* ================== ESTILOS (IGUAL MEDICATION / TRAINING) ================== */

const inputStyle =
  "w-full h-[50px] pl-12 pr-12 rounded-2xl bg-white/80 backdrop-blur-md text-[#1f1f1f] border border-gray-300/70 focus:border-[#6A38F3] focus:ring-4 focus:ring-[#6A38F3]/20 focus:outline-none transition-all duration-300";

const selectStyle = "appearance-none cursor-pointer";

/* ================== COMPONENTES AUX ================== */

const Input = ({ icon, ...props }: any) => (
  <div className="relative group">
    <input {...props} className={inputStyle} />
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A38F3] transition">
      {icon}
    </span>
  </div>
);

const Select = ({ icon, children, ...props }: any) => (
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

/* ================== STEP 1 — INTRO ================== */

const StepIntro = ({ onNext }: { onNext: () => void }) => (
  <div className="p-8 flex flex-col items-center justify-center space-y-6">
    <FaUtensils className="text-[#6A38F3] text-4xl opacity-80" />

    <p className="text-sm text-gray-600 text-center max-w-xs">
      Vamos entender melhor sua alimentação para criar uma dieta mais adequada
      aos seus objetivos.
    </p>

    <button
      onClick={onNext}
      className="px-10 py-3 rounded-full border border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition"
      type="button"
    >
      Adicionar dieta
    </button>
  </div>
);

/* ================== STEP 2 — FORM ================== */

const StepDietForm = ({ onFinish, usuarioId }: { onFinish: () => void; usuarioId?: number }) => {
  const [values, setValues] = useState<{
    tipoDieta: "" | "low_carb" | "cetogenica" | "mediterranea" | "vegetariana" | "vegana" | "paleo" | "jejum_intermitente" | "outra";
    calorias: string;
    refeicoesDia: string;
    horarioPreferido: string;
    inicio: string;
  }>({
    tipoDieta: "",
    calorias: "",
    refeicoesDia: "",
    horarioPreferido: "",
    inicio: "",
  });
  const [loading, setLoading] = useState(false);

  const setField =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const valid =
    values.tipoDieta &&
    values.calorias &&
    values.refeicoesDia &&
    values.inicio;

  const handleSave = async () => {
    if (!usuarioId) {
      toast.error('ID do usuário não informado');
      return;
    }

    setLoading(true);
    try {
      await createOrUpdateDieta(usuarioId, {
        tipo: values.tipoDieta,
        calorias: parseFloat(values.calorias),
        refeicoes: parseInt(values.refeicoesDia),
        horarioPreferido: values.horarioPreferido,
        dataInicio: values.inicio,
      });
      toast.success('Dieta salva com sucesso!');
      onFinish();
    } catch (error: any) {
      console.error('Erro ao salvar dieta:', error);
      toast.error(error.message || 'Erro ao salvar dieta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <Select
        icon={<FaUtensils />}
        value={values.tipoDieta}
        onChange={setField("tipoDieta")}
      >
        <option value="" disabled>
          Tipo de dieta
        </option>
        <option value="lowcarb">Low carb</option>
        <option value="hipocalorica">Hipocalórica</option>
        <option value="hipercalorica">Hipercalórica</option>
        <option value="balanceada">Balanceada</option>
      </Select>

      <Input
        icon={<FaFireAlt />}
        placeholder="Calorias diárias (kcal)"
        value={values.calorias}
        onChange={setField("calorias")}
        type="number"
      />

      <Input
        icon={<FaAppleAlt />}
        placeholder="Refeições por dia"
        value={values.refeicoesDia}
        onChange={setField("refeicoesDia")}
        type="number"
      />

      <Input
        icon={<FaClock />}
        placeholder="Horário preferido (opcional)"
        value={values.horarioPreferido}
        onChange={setField("horarioPreferido")}
      />

      <Input
        type="date"
        icon={<FaCalendarAlt />}
        value={values.inicio}
        onChange={setField("inicio")}
      />

      <button
        disabled={!valid || loading}
        onClick={handleSave}
        className={`w-full p-3 rounded-full border transition
          ${
            valid && !loading
              ? "border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white"
              : "border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
          }`}
        type="button"
      >
        {loading ? 'Salvando...' : 'Salvar dieta'}
      </button>
    </div>
  );
};

/* ================== MODAL ================== */

export const DietModal: React.FC<DietModalProps> = ({
  isOpen,
  onClose,
  usuarioId,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => setStep(1), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleFinish = () => {
    setStep(1);
    onClose();
  };

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
        <ModalHeader title="Dieta" onClose={handleClose} />

        {step === 1 && <StepIntro onNext={() => setStep(2)} />}
        {step === 2 && <StepDietForm onFinish={handleFinish} usuarioId={usuarioId} />}
      </div>
    </div>
  );
};
