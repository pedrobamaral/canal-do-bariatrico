"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsInstagram } from "react-icons/bs";
import { FaDumbbell, FaRunning, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import { createOrUpdateTreino } from "@/api/api";

/* ================== PROPS ================== */

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId?: number;
}

/* ================== ESTILOS (IGUAL HEALTH SURVEY) ================== */

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

/* ================== STEP 1 ================== */

const Step1 = ({ onNext }: { onNext: () => void }) => (
  <div className="p-8 flex flex-col items-center justify-center space-y-6">
    <FaDumbbell className="text-[#6A38F3] text-4xl opacity-80" />

    <p className="text-sm text-gray-600 text-center max-w-xs">
      Vamos entender melhor sua rotina de treinos para criar recomendações mais
      precisas.
    </p>

    <button
      onClick={onNext}
      className="px-10 py-3 rounded-full border border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition"
      type="button"
    >
      Adicionar treino
    </button>
  </div>
);

/* ================== STEP 2 ================== */

type Step2Values = {
  musc: string;
  aero: string;
};

const Step2 = ({ onNext }: { onNext: () => void }) => {
  const [values, setValues] = useState<Step2Values>({
    musc: "",
    aero: "",
  });

  const valid = values.musc && values.aero;

  const setField =
    (field: keyof Step2Values) =>
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="p-8 space-y-4">
      <Select
        icon={<FaDumbbell />}
        value={values.musc}
        onChange={setField("musc")}
      >
        <option value="" disabled>
          Frequência semanal - Musculação
        </option>
        <option value="1">1 dia</option>
        <option value="2">2 dias</option>
        <option value="3">3 dias</option>
        <option value="4">4 dias</option>
        <option value="5">5 dias</option>
        <option value="6">6 dias</option>
        <option value="7">Todos os dias</option>
      </Select>

      <Select
        icon={<FaRunning />}
        value={values.aero}
        onChange={setField("aero")}
      >
        <option value="" disabled>
          Frequência semanal - Aeróbico
        </option>
        <option value="0">Não faço</option>
        <option value="1">1 dia</option>
        <option value="2">2 dias</option>
        <option value="3">3 dias</option>
        <option value="4">4 dias</option>
        <option value="5">5 dias</option>
        <option value="6">6 dias</option>
        <option value="7">Todos os dias</option>
      </Select>

      <p className="text-xs text-gray-500 px-2">
        Aeróbico inclui caminhada, esportes, dança e atividades cardiovasculares.
      </p>

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
    </div>
  );
};

/* ================== STEP 3 ================== */

const Step3 = ({ onFinish, usuarioId }: { onFinish: () => void; usuarioId?: number }) => {
  const [values, setValues] = useState({
    nomePersonal: "",
    instagramPersonal: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!usuarioId) {
      toast.error('ID do usuário não informado');
      return;
    }

    setLoading(true);
    try {
      await createOrUpdateTreino(usuarioId, {
        nomePersonal: values.nomePersonal,
        instagramPersonal: values.instagramPersonal,
      });
      toast.success('Treino salvo com sucesso!');
      onFinish();
    } catch (error: any) {
      console.error('Erro ao salvar treino:', error);
      toast.error(error.message || 'Erro ao salvar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <Input 
        icon={<FaUser />} 
        placeholder="Nome do personal"
        value={values.nomePersonal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValues(prev => ({ ...prev, nomePersonal: e.target.value }))}
      />

      <Input
        icon={<BsInstagram />}
        placeholder="Instagram do personal"
        value={values.instagramPersonal}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValues(prev => ({ ...prev, instagramPersonal: e.target.value }))}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full p-3 rounded-full border border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
        type="button"
      >
        {loading ? 'Salvando...' : 'Salvar treino'}
      </button>
    </div>
  );
};

/* ================== MODAL ================== */

export const TrainingModal: React.FC<TrainingModalProps> = ({
  isOpen,
  onClose,
  usuarioId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

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
        <ModalHeader title="Treino" onClose={handleClose} />

        {step === 1 && <Step1 onNext={() => setStep(2)} />}
        {step === 2 && <Step2 onNext={() => setStep(3)} />}
        {step === 3 && <Step3 onFinish={handleFinish} usuarioId={usuarioId} />}
      </div>
    </div>
  );
};
