"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FiPlus, FiCalendar } from "react-icons/fi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoClose, IoChevronDown } from "react-icons/io5";

// ✅ Modais
import { MedicationModal } from "@/components/modals/MedicationModal";
import { DietModal } from "@/components/modals/DietModal";
import { TrainingModal } from "@/components/modals/TrainingModal";

interface HealthSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Estilos Comuns (padrão HealthSurvey) ---
const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-black bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";
const labelStyle = "sr-only";

const HeaderRow = ({
  title,
  rightSlot,
}: {
  title: string;
  rightSlot?: React.ReactNode;
}) => (
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold text-black font-['Montserrat']">
      {title}
    </h2>
    {rightSlot}
  </div>
);

const FieldError = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return <p className="mt-1 ml-4 text-xs font-medium text-red-600">{msg}</p>;
};

// -------------------- STEP 1: Medidas Básicas --------------------
type Step1Form = {
  peso: string;
  altura: string;
  idade: string;
  sexo: "" | "masculino" | "feminino";
};

type Step1Errors = Partial<Record<keyof Step1Form, string>>;

const LIMITS = {
  pesoKg: { min: 20, max: 350 },
  alturaCm: { min: 120, max: 230 },
  idadeAnos: { min: 10, max: 120 },
};

function isEmpty(v: string) {
  return v.trim() === "";
}
function toNumberOrNaN(v: string) {
  if (isEmpty(v)) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}
function validateStep1(values: Step1Form): Step1Errors {
  const errors: Step1Errors = {};

  const peso = toNumberOrNaN(values.peso);
  const altura = toNumberOrNaN(values.altura);
  const idade = toNumberOrNaN(values.idade);

  if (isEmpty(values.peso)) errors.peso = "Informe seu peso.";
  else if (Number.isNaN(peso)) errors.peso = "Peso inválido.";
  else if (peso < LIMITS.pesoKg.min || peso > LIMITS.pesoKg.max)
    errors.peso = `Peso deve estar entre ${LIMITS.pesoKg.min} e ${LIMITS.pesoKg.max} kg.`;

  if (isEmpty(values.altura)) errors.altura = "Informe sua altura.";
  else if (Number.isNaN(altura)) errors.altura = "Altura inválida.";
  else if (altura < LIMITS.alturaCm.min || altura > LIMITS.alturaCm.max)
    errors.altura = `Altura deve estar entre ${LIMITS.alturaCm.min} e ${LIMITS.alturaCm.max} cm.`;

  if (isEmpty(values.idade)) errors.idade = "Informe sua idade.";
  else if (Number.isNaN(idade)) errors.idade = "Idade inválida.";
  else if (idade < LIMITS.idadeAnos.min || idade > LIMITS.idadeAnos.max)
    errors.idade = `Idade deve estar entre ${LIMITS.idadeAnos.min} e ${LIMITS.idadeAnos.max} anos.`;

  if (!values.sexo) errors.sexo = "Selecione o sexo biológico.";

  return errors;
}

const Step1 = ({ onNext }: { onNext: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Step1Form>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof Step1Form, boolean>>
  >({});

  const errors = useMemo(() => validateStep1(values), [values]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const canShowError = (field: keyof Step1Form) =>
    Boolean(touched[field] && errors[field]);

  const markTouched = (field: keyof Step1Form) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  const setField =
    (field: keyof Step1Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const handleNext = () => {
    setTouched({ peso: true, altura: true, idade: true, sexo: true });
    const currentErrors = validateStep1(values);
    if (Object.keys(currentErrors).length > 0) return;
    onNext();
  };

  const uploadButton = (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-2 px-5 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-colors"
      >
        <FiPlus size={16} />
        Adicionar Bioimpedância
      </button>
    </>
  );

  return (
    <div className="flex flex-col h-full">
      <HeaderRow title="Medidas Físicas" rightSlot={uploadButton} />

      <form className="space-y-4 flex-1">
        <div>
          <label className={labelStyle}>Peso (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="Peso (kg)"
            className={`${inputStyle} ${
              canShowError("peso")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.peso}
            onChange={setField("peso")}
            onBlur={markTouched("peso")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E")
                e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("peso") ? errors.peso : undefined} />
        </div>

        <div>
          <label className={labelStyle}>Altura (cm)</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Altura (cm)"
            className={`${inputStyle} ${
              canShowError("altura")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.altura}
            onChange={setField("altura")}
            onBlur={markTouched("altura")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E")
                e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("altura") ? errors.altura : undefined} />
        </div>

        <div>
          <label className={labelStyle}>Idade (anos)</label>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Idade (anos)"
            className={`${inputStyle} ${
              canShowError("idade")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.idade}
            onChange={setField("idade")}
            onBlur={markTouched("idade")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E")
                e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("idade") ? errors.idade : undefined} />
        </div>

        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer bg-white ${
              canShowError("sexo")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.sexo}
            onChange={setField("sexo")}
            onBlur={markTouched("sexo")}
          >
            <option value="" disabled>
              Sexo Biológico
            </option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <FieldError msg={canShowError("sexo") ? errors.sexo : undefined} />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleNext}
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

// -------------------- STEP 2: Bioimpedância/Extras --------------------
type Step2Form = {
  massaMuscular: string;
  gorduraPercent: string;
  pesoMeta: string;
  dataMedidas: string;
  objetivo: "" | "emagrecer" | "manter" | "ganhar_massa";
};

type Step2Errors = Partial<Record<keyof Step2Form, string>>;

function validateStep2(values: Step2Form): Step2Errors {
  const errors: Step2Errors = {};

  if (isEmpty(values.massaMuscular))
    errors.massaMuscular = "Informe a massa muscular.";
  if (isEmpty(values.gorduraPercent))
    errors.gorduraPercent = "Informe a % de gordura.";
  if (isEmpty(values.pesoMeta)) errors.pesoMeta = "Informe o peso desejado.";
  if (isEmpty(values.dataMedidas))
    errors.dataMedidas = "Selecione a data das medidas.";
  if (!values.objetivo) errors.objetivo = "Selecione o objetivo.";

  return errors;
}

const Step2 = ({ onNext }: { onNext: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Step2Form>({
    massaMuscular: "",
    gorduraPercent: "",
    pesoMeta: "",
    dataMedidas: "",
    objetivo: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<keyof Step2Form, boolean>>
  >({});

  const errors = useMemo(() => validateStep2(values), [values]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const canShowError = (field: keyof Step2Form) =>
    Boolean(touched[field] && errors[field]);

  const markTouched = (field: keyof Step2Form) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  const setField =
    (field: keyof Step2Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const handleNext = () => {
    setTouched({
      massaMuscular: true,
      gorduraPercent: true,
      pesoMeta: true,
      dataMedidas: true,
      objetivo: true,
    });

    const currentErrors = validateStep2(values);
    if (Object.keys(currentErrors).length > 0) return;
    onNext();
  };

  const uploadButton = (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-[#6F3CF6] text-white py-2 px-5 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-colors"
      >
        <FiPlus size={16} />
        Adicionar Bioimpedância
      </button>
    </>
  );

  return (
    <div className="flex flex-col h-full">
      <HeaderRow title="Medidas Físicas" rightSlot={uploadButton} />

      <form className="space-y-4 flex-1">
        <div>
          <input
            placeholder="Massa Muscular (kg)"
            className={`${inputStyle} ${
              canShowError("massaMuscular")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.massaMuscular}
            onChange={setField("massaMuscular")}
            onBlur={markTouched("massaMuscular")}
          />
          <FieldError
            msg={
              canShowError("massaMuscular") ? errors.massaMuscular : undefined
            }
          />
        </div>

        <div>
          <input
            placeholder="% de Gordura"
            className={`${inputStyle} ${
              canShowError("gorduraPercent")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.gorduraPercent}
            onChange={setField("gorduraPercent")}
            onBlur={markTouched("gorduraPercent")}
          />
          <FieldError
            msg={
              canShowError("gorduraPercent") ? errors.gorduraPercent : undefined
            }
          />
        </div>

        <div>
          <input
            placeholder="Quantos quilos quero ter (kg)"
            className={`${inputStyle} ${
              canShowError("pesoMeta")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.pesoMeta}
            onChange={setField("pesoMeta")}
            onBlur={markTouched("pesoMeta")}
          />
          <FieldError
            msg={canShowError("pesoMeta") ? errors.pesoMeta : undefined}
          />
        </div>

        {/* Label do campo de data das medidas */}
        <div>
          <label
            style={{
              color: "#6F3CF6",
              fontWeight: 600,
              fontSize: "0.95rem",
              fontFamily: "Montserrat, Arial, sans-serif",
              display: "block",
              marginBottom: "8px",
              textAlign: "left",
              paddingLeft: "16px",
            }}
          >
            Datas das medidas
          </label>

          <div className="relative">
            <input
              type="date"
              className={`${inputStyle} pr-14 bg-white ${
                canShowError("dataMedidas")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              value={values.dataMedidas}
              onChange={setField("dataMedidas")}
              onBlur={markTouched("dataMedidas")}
            />
            <FiCalendar className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
          </div>

          <FieldError
            msg={canShowError("dataMedidas") ? errors.dataMedidas : undefined}
          />
        </div>

        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer bg-white ${
              canShowError("objetivo")
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
            value={values.objetivo}
            onChange={setField("objetivo")}
            onBlur={markTouched("objetivo")}
          >
            <option value="" disabled>
              Objetivo
            </option>
            <option value="emagrecer">Emagrecer</option>
            <option value="manter">Manter</option>
            <option value="ganhar_massa">Ganhar massa</option>
          </select>
          <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <FieldError
            msg={canShowError("objetivo") ? errors.objetivo : undefined}
          />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleNext}
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

// -------------------- STEP 3: Sistema de Pontuação --------------------
type Step3Form = { dataInicio: string };

const Step3 = ({
  onFinish,
  onOpenMedication,
  onOpenDiet,
  onOpenTraining,
}: {
  onFinish: (values: Step3Form) => void;
  onOpenMedication: () => void;
  onOpenDiet: () => void;
  onOpenTraining: () => void;
}) => {
  const [values, setValues] = useState<Step3Form>({ dataInicio: "" });
  const [touched, setTouched] = useState<{ dataInicio?: boolean }>({});

  const dataErr = useMemo(() => {
    if (!touched.dataInicio) return "";
    if (!values.dataInicio.trim()) return "Selecione a data de início.";
    return "";
  }, [touched.dataInicio, values.dataInicio]);

  const pillButton =
    "w-full h-[50px] px-6 rounded-full border border-black bg-white text-left text-gray-900 flex items-center justify-between hover:border-[#6F3CF6] hover:ring-1 hover:ring-[#6F3CF6] transition-all";

  return (
    <div className="flex flex-col h-full">
      <HeaderRow title="Sistema de Pontuação" />

      <div className="space-y-4 flex-1">
        <button type="button" onClick={onOpenMedication} className={pillButton}>
          <span>Medicamentos</span>
          <IoChevronDown className="text-gray-500" />
        </button>

        <button type="button" onClick={onOpenDiet} className={pillButton}>
          <span>Dieta</span>
          <IoChevronDown className="text-gray-500" />
        </button>

        <button type="button" onClick={onOpenTraining} className={pillButton}>
          <span>Treino</span>
          <IoChevronDown className="text-gray-500" />
        </button>

        {/* ✅ ALTERADO: label igual ao Step2, mas preto */}
        <div>
          <label
            style={{
              color: "#000000",
              fontWeight: 600,
              fontSize: "0.95rem",
              fontFamily: "Montserrat, Arial, sans-serif",
              display: "block",
              marginBottom: "8px",
              textAlign: "left",
              paddingLeft: "16px",
            }}
          >
            Data de início
          </label>

          <div className="relative">
            <input
              type="date"
              className={`${inputStyle} pr-14 bg-white ${
                dataErr
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              value={values.dataInicio}
              onChange={(e) => setValues({ dataInicio: e.target.value })}
              onBlur={() => setTouched({ dataInicio: true })}
            />
            <FiCalendar className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
          </div>

          {dataErr ? (
            <p className="mt-1 ml-4 text-xs font-medium text-red-600">
              {dataErr}
            </p>
          ) : null}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setTouched({ dataInicio: true });
              if (!values.dataInicio.trim()) return;
              onFinish(values);
            }}
            className="bg-[#6F3CF6] text-white py-3 px-14 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
          >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- COMPONENTE PRINCIPAL --------------------
export const HealthSurveyModal: React.FC<HealthSurveyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ✅ estados para abrir os modais a partir do Step 3
  const [isMedicationOpen, setIsMedicationOpen] = useState(false);
  const [isDietOpen, setIsDietOpen] = useState(false);
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setStep(1), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    console.log("Fluxo finalizado!");
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300">
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

          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && <Step2 onNext={() => setStep(3)} />}
          {step === 3 && (
            <Step3
              onOpenMedication={() => setIsMedicationOpen(true)}
              onOpenDiet={() => setIsDietOpen(true)}
              onOpenTraining={() => setIsTrainingOpen(true)}
              onFinish={() => handleFinish()}
            />
          )}
        </div>
      </div>

      {/* ✅ Modais que abrem ao clicar no Step 3 */}
      <MedicationModal
        isOpen={isMedicationOpen}
        onClose={() => setIsMedicationOpen(false)}
      />
      <DietModal isOpen={isDietOpen} onClose={() => setIsDietOpen(false)} />
      <TrainingModal
        isOpen={isTrainingOpen}
        onClose={() => setIsTrainingOpen(false)}
      />
    </>
  );
};
