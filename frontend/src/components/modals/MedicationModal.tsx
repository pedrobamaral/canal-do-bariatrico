"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { HiOutlineArrowRight } from "react-icons/hi";
import { BsInstagram } from "react-icons/bs";
import { FaPills, FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";
import { createOrUpdateMedicacao } from "@/api/api";

/* ================== PROPS ================== */

export type MedicationFrequency = "diaria" | "semanal" | "eventual" | "";

export interface MedicationData {
  nome: string;
  concentracao: string;
  frequencia: MedicationFrequency;
  nomeMedico: string;
  instagramMedico: string;
}

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId?: number;
  /** Callback quando usuário clica "Sim" - retorna os dados do medicamento */
  onYesCallback?: (data: MedicationData) => void;
  /** Callback quando usuário clica "Não" */
  onNoCallback?: () => void;
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
      Você faz uso contínuo de algum medicamento?
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

const StepMedication = ({ onNext, onValuesChange }: { 
  onNext: () => void; 
  onValuesChange: (values: { nome: string; concentracao: string; frequencia: MedicationFrequency }) => void;
}) => {
  const [values, setValues] = useState<{
    nome: string;
    concentracao: string;
    frequencia: MedicationFrequency;
  }>({
    nome: "",
    concentracao: "",
    frequencia: "",
  });

  // Notifica o componente pai quando os valores mudam
  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  const valid =
    values.nome.trim() &&
    values.concentracao.trim() &&
    values.frequencia;

  const setField =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="p-8 space-y-4">
      <Input
        icon={<FaPills />}
        placeholder="Nome do medicamento"
        value={values.nome}
        onChange={setField("nome")}
      />

      <Input
        icon={<FaPills />}
        placeholder="Concentração / Dosagem"
        value={values.concentracao}
        onChange={setField("concentracao")}
      />

      <Select
        icon={<FaPills />}
        value={values.frequencia}
        onChange={setField("frequencia")}
      >
        <option value="" disabled>
          Frequência de uso
        </option>
        <option value="diaria">Diária</option>
        <option value="semanal">Semanal</option>
        <option value="eventual">Eventual</option>
      </Select>

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

const StepDoctor = ({ 
  onFinish, 
  usuarioId, 
  medicationValues,
  embeddedMode,
  onYesCallback 
}: { 
  onFinish: () => void; 
  usuarioId?: number;
  medicationValues: { nome: string; concentracao: string; frequencia: MedicationFrequency };
  embeddedMode?: boolean;
  onYesCallback?: (data: MedicationData) => void;
}) => {
  const [values, setValues] = useState({
    nomeMedico: "",
    instagramMedico: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Se estiver em modo embutido, apenas retorna os dados via callback
    if (embeddedMode && onYesCallback) {
      const fullData: MedicationData = {
        nome: medicationValues.nome,
        concentracao: medicationValues.concentracao,
        frequencia: medicationValues.frequencia,
        nomeMedico: values.nomeMedico,
        instagramMedico: values.instagramMedico,
      };
      onYesCallback(fullData);
      onFinish();
      return;
    }

    if (!usuarioId) {
      toast.error('ID do usuário não informado');
      return;
    }

    setLoading(true);
    try {
      await createOrUpdateMedicacao(usuarioId, {
        nome: medicationValues.nome,
        concentracao: medicationValues.concentracao,
        frequencia: medicationValues.frequencia,
        nomeMedico: values.nomeMedico,
        instagramMedico: values.instagramMedico,
      });
      toast.success('Medicamento salvo com sucesso!');
      onFinish();
    } catch (error: any) {
      console.error('Erro ao salvar medicamento:', error);
      toast.error(error.message || 'Erro ao salvar medicamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <Input 
        icon={<FaUserMd />} 
        placeholder="Nome do médico"
        value={values.nomeMedico}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValues(prev => ({ ...prev, nomeMedico: e.target.value }))}
      />

      <Input
        icon={<BsInstagram />}
        placeholder="Instagram do médico"
        value={values.instagramMedico}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValues(prev => ({ ...prev, instagramMedico: e.target.value }))}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full p-3 rounded-full border border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
        type="button"
      >
        {loading ? 'Salvando...' : 'Salvar medicamento'}
      </button>
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
  embeddedMode = false,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [medicationValues, setMedicationValues] = useState<{ 
    nome: string; 
    concentracao: string; 
    frequencia: MedicationFrequency 
  }>({
    nome: "",
    concentracao: "",
    frequencia: "",
  });

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setMedicationValues({ nome: "", concentracao: "", frequencia: "" });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    setMedicationValues({ nome: "", concentracao: "", frequencia: "" });
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
    setMedicationValues({ nome: "", concentracao: "", frequencia: "" });
    onClose();
  };

  const handleMedicationValuesChange = useMemo(
    () => (values: { nome: string; concentracao: string; frequencia: MedicationFrequency }) => {
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
            onNext={() => setStep(3)} 
            onValuesChange={handleMedicationValuesChange}
          />
        )}
        {step === 3 && (
          <StepDoctor 
            onFinish={handleFinish} 
            usuarioId={usuarioId}
            medicationValues={medicationValues}
            embeddedMode={embeddedMode}
            onYesCallback={onYesCallback}
          />
        )}
      </div>
    </div>
  );
};
