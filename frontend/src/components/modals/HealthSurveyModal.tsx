"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { FiPlus, FiCalendar } from "react-icons/fi";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  FaWeight,
  FaRulerVertical,
  FaBirthdayCake,
  FaVenusMars,
  FaBullseye,
  FaDumbbell,
  FaFire,
  FaCalendarAlt,
  FaBullseye as FaTarget,
} from "react-icons/fa";

// Modais
import { MedicationModal } from "@/components/modals/MedicationModal";
import { DietModal } from "@/components/modals/DietModal";
import { TrainingModal } from "@/components/modals/TrainingModal";

/* ================== ESTILOS PADRÃO (IGUAL PostLogin) ================== */

const inputStyle =
  "w-full h-[50px] pl-12 pr-12 rounded-2xl bg-white/80 backdrop-blur-md text-[#1f1f1f] border border-gray-300/70 focus:border-[#6A38F3] focus:ring-4 focus:ring-[#6A38F3]/20 focus:outline-none transition-all duration-300";

const selectStyle = "appearance-none cursor-pointer";

/* ================== COMPONENTES AUX ================== */

function Input({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <input {...props} className={inputStyle} />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A38F3] transition">
        {icon}
      </span>
    </div>
  );
}

function Select({ icon, children, ...props }: any) {
  return (
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
}

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
      type="button"
      aria-label="Fechar modal"
    >
      <IoClose />
    </button>
  </div>
);

/* ================== STEP 1 ================== */

const Step1 = ({ onNext }: { onNext: () => void }) => {
  const [values, setValues] = useState<{
    peso: string;
    altura: string;
    idade: string;
    sexo: "" | "Masculino" | "Feminino" | "Outro";
  }>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
  });

  const valid =
    values.peso && values.altura && values.idade && values.sexo;

  const setField =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="p-8 space-y-4">
      <Input icon={<FaWeight />} placeholder="Peso (kg)" value={values.peso} onChange={setField("peso")} type="number" />
      <Input icon={<FaRulerVertical />} placeholder="Altura (cm)" value={values.altura} onChange={setField("altura")} type="number" />
      <Input icon={<FaBirthdayCake />} placeholder="Idade" value={values.idade} onChange={setField("idade")} type="number" />

      <Select icon={<FaVenusMars />} value={values.sexo} onChange={setField("sexo")}>
        <option value="" disabled>Sexo biológico</option>
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Outro">Outro</option>
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

/* ================== STEP 2 ================== */

const Step2 = ({ onNext }: { onNext: () => void }) => {
  const [values, setValues] = useState<{
    massa: string;
    gordura: string;
    pesoMeta: string;
    data: string;
    objetivo: "" | "emagrecer" | "manter" | "ganhar_massa";
  }>({
    massa: "",
    gordura: "",
    pesoMeta: "",
    data: "",
    objetivo: "",
  });

  const valid =
    values.massa &&
    values.gordura &&
    values.pesoMeta &&
    values.data &&
    values.objetivo;

  const setField =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  return (
    <div className="p-8 space-y-4">
      <Input icon={<FaDumbbell />} placeholder="Massa muscular (kg)" value={values.massa} onChange={setField("massa")} type="number" />
      <Input icon={<FaFire />} placeholder="% de gordura" value={values.gordura} onChange={setField("gordura")} type="number" />
      <Input icon={<FaBullseye />} placeholder="Peso desejado (kg)" value={values.pesoMeta} onChange={setField("pesoMeta")} type="number" />

      <Input type="date" icon={<FaCalendarAlt />} value={values.data} onChange={setField("data")} />

      <Select icon={<FaTarget />} value={values.objetivo} onChange={setField("objetivo")}>
        <option value="" disabled>Objetivo</option>
        <option value="emagrecer">Emagrecer</option>
        <option value="manter">Manter</option>
        <option value="ganhar_massa">Ganhar massa</option>
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

const Step3 = ({
  onFinish,
  onOpenMedication,
  onOpenDiet,
  onOpenTraining,
}: any) => (
  <div className="p-8 space-y-4">
    <button
      onClick={onOpenMedication}
      className="w-full h-[50px] rounded-full border border-gray-300 hover:border-[#6A38F3] flex items-center justify-center gap-3 text-[#2f2f2f] transition"
      type="button"
    >
      <FiPlus className="text-[#6A38F3]" />
      <span>Adicionar medicamentos</span>
    </button>

    <button
      onClick={onOpenDiet}
      className="w-full h-[50px] rounded-full border border-gray-300 hover:border-[#6A38F3] flex items-center justify-center gap-3 text-[#2f2f2f] transition"
      type="button"
    >
      <FiPlus className="text-[#6A38F3]" />
      <span>Adicionar dieta</span>
    </button>

    <button
      onClick={onOpenTraining}
      className="w-full h-[50px] rounded-full border border-gray-300 hover:border-[#6A38F3] flex items-center justify-center gap-3 text-[#2f2f2f] transition"
      type="button"
    >
      <FiPlus className="text-[#6A38F3]" />
      <span>Adicionar treino</span>
    </button>

    <button
      onClick={onFinish}
      className="w-full p-3 rounded-full border border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition"
      type="button"
    >
      Finalizar
    </button>
  </div>
);

/* ================== MODAL PRINCIPAL ================== */

interface HealthSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioId?: number;
}

export const HealthSurveyModal: React.FC<HealthSurveyModalProps> = ({ isOpen, onClose, usuarioId }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [med, setMed] = useState(false);
  const [diet, setDiet] = useState(false);
  const [train, setTrain] = useState(false);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#EDEDED] rounded-xl max-w-md w-full shadow-xl overflow-hidden"
        >
          <ModalHeader title="Health Survey" onClose={handleClose} />

          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onNext={() => setStep(3)} />}
          {step === 3 && (
            <Step3
              onFinish={handleClose}
              onOpenMedication={() => setMed(true)}
              onOpenDiet={() => setDiet(true)}
              onOpenTraining={() => setTrain(true)}
            />
          )}
        </div>
      </div>

      <MedicationModal isOpen={med} onClose={() => setMed(false)} usuarioId={usuarioId} />
      <DietModal isOpen={diet} onClose={() => setDiet(false)} usuarioId={usuarioId} />
      <TrainingModal isOpen={train} onClose={() => setTrain(false)} usuarioId={usuarioId} />
    </>
  );
};
