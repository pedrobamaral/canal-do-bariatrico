"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { IoClose, IoChevronDown } from "react-icons/io5";

interface HealthSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModalStepProps {
  onAction: () => void;
}

// --- Estilos Comuns ---
const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-black bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";
const labelStyle = "sr-only";

// --- Limites (ajuste aqui se quiser) ---
const LIMITS = {
  pesoKg: { min: 20, max: 350 },
  alturaCm: { min: 120, max: 230 },
  idadeAnos: { min: 10, max: 120 },
  pesoMetaKg: { min: 20, max: 350 },
};

type Step1Form = {
  peso: string;
  altura: string;
  idade: string;
  sexo: "" | "masculino" | "feminino";
  pesoMeta: string;
};

type Step1Errors = Partial<Record<keyof Step1Form, string>>;

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
  const pesoMeta = toNumberOrNaN(values.pesoMeta);

  // Peso atual
  if (isEmpty(values.peso)) errors.peso = "Informe seu peso.";
  else if (Number.isNaN(peso)) errors.peso = "Peso inválido.";
  else if (peso < LIMITS.pesoKg.min || peso > LIMITS.pesoKg.max)
    errors.peso = `Peso deve estar entre ${LIMITS.pesoKg.min} e ${LIMITS.pesoKg.max} kg.`;

  // Altura
  if (isEmpty(values.altura)) errors.altura = "Informe sua altura.";
  else if (Number.isNaN(altura)) errors.altura = "Altura inválida.";
  else if (altura < LIMITS.alturaCm.min || altura > LIMITS.alturaCm.max)
    errors.altura = `Altura deve estar entre ${LIMITS.alturaCm.min} e ${LIMITS.alturaCm.max} cm.`;

  // Idade
  if (isEmpty(values.idade)) errors.idade = "Informe sua idade.";
  else if (Number.isNaN(idade)) errors.idade = "Idade inválida.";
  else if (idade < LIMITS.idadeAnos.min || idade > LIMITS.idadeAnos.max)
    errors.idade = `Idade deve estar entre ${LIMITS.idadeAnos.min} e ${LIMITS.idadeAnos.max} anos.`;

  // Sexo
  if (!values.sexo) errors.sexo = "Selecione o sexo biológico.";

  // Peso meta
  if (isEmpty(values.pesoMeta)) errors.pesoMeta = "Informe seu peso desejado.";
  else if (Number.isNaN(pesoMeta)) errors.pesoMeta = "Peso desejado inválido.";
  else if (pesoMeta < LIMITS.pesoMetaKg.min || pesoMeta > LIMITS.pesoMetaKg.max)
    errors.pesoMeta = `Peso desejado deve estar entre ${LIMITS.pesoMetaKg.min} e ${LIMITS.pesoMetaKg.max} kg.`;

  return errors;
}

// Pequeno helper visual de erro
const FieldError = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return <p className="mt-1 ml-4 text-xs font-medium text-red-600">{msg}</p>;
};

// --- PASSO 1 ---
const ModalStep1: React.FC<ModalStepProps> = ({ onAction }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<Step1Form>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
    pesoMeta: "",
  });

  const [touched, setTouched] = useState<Partial<Record<keyof Step1Form, boolean>>>({});
  const errors = useMemo(() => validateStep1(values), [values]);
  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const setField =
    (field: keyof Step1Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const next = e.target.value;

      // bloqueia "-" e "e" / "E" em number (evita negativos e notação científica no input)
      // (ainda validamos no final, mas isso evita muita dor)
      setValues((prev) => ({ ...prev, [field]: next }));
    };

  const markTouched = (field: keyof Step1Form) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const canShowError = (field: keyof Step1Form) => Boolean(touched[field] && errors[field]);

  const handleNext = () => {
    // força mostrar tudo antes de avançar
    setTouched({ peso: true, altura: true, idade: true, sexo: true, pesoMeta: true });

    const currentErrors = validateStep1(values);
    if (Object.keys(currentErrors).length > 0) return;

    onAction();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black font-['Montserrat']">Medidas Físicas</h2>

        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
        <button
          type="button"
          onClick={handleFileButtonClick}
          className="flex items-center gap-1 bg-[#6F3CF6] text-white py-1.5 px-4 rounded-full text-xs font-bold hover:bg-[#5c2fe0] transition-colors"
        >
          <FiPlus size={14} />
          Adicionar Bioimpedância
        </button>
      </div>

      {/* Formulário */}
      <form className="space-y-4 flex-1">
        <div>
          <label className={labelStyle}>Peso (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            min={LIMITS.pesoKg.min}
            max={LIMITS.pesoKg.max}
            placeholder="Peso (kg)"
            className={`${inputStyle} ${canShowError("peso") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            value={values.peso}
            onChange={setField("peso")}
            onBlur={markTouched("peso")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("peso") ? errors.peso : undefined} />
        </div>

        <div>
          <label className={labelStyle}>Altura (cm)</label>
          <input
            type="number"
            inputMode="numeric"
            min={LIMITS.alturaCm.min}
            max={LIMITS.alturaCm.max}
            placeholder="Altura (cm)"
            className={`${inputStyle} ${canShowError("altura") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            value={values.altura}
            onChange={setField("altura")}
            onBlur={markTouched("altura")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("altura") ? errors.altura : undefined} />
        </div>

        <div>
          <label className={labelStyle}>Idade (anos)</label>
          <input
            type="number"
            inputMode="numeric"
            min={LIMITS.idadeAnos.min}
            max={LIMITS.idadeAnos.max}
            placeholder="Idade (anos)"
            className={`${inputStyle} ${canShowError("idade") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            value={values.idade}
            onChange={setField("idade")}
            onBlur={markTouched("idade")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("idade") ? errors.idade : undefined} />
        </div>

        {/* Select Sexo */}
        <div className="relative">
          <select
            className={`${inputStyle} appearance-none cursor-pointer bg-white ${
              canShowError("sexo") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
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

        <div>
          <label className={labelStyle}>Quantos quilos quero ter (kg)</label>
          <input
            type="number"
            inputMode="decimal"
            min={LIMITS.pesoMetaKg.min}
            max={LIMITS.pesoMetaKg.max}
            placeholder="Quantos quilos quero ter (kg)"
            className={`${inputStyle} ${canShowError("pesoMeta") ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            value={values.pesoMeta}
            onChange={setField("pesoMeta")}
            onBlur={markTouched("pesoMeta")}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault();
            }}
          />
          <FieldError msg={canShowError("pesoMeta") ? errors.pesoMeta : undefined} />
        </div>

        {/* Botão Próximo Centralizado */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            className={`flex items-center gap-2 py-3 px-10 rounded-full text-sm font-bold transition-transform shadow-md
              ${
                isValid
                  ? "bg-[#6F3CF6] text-white hover:bg-[#5c2fe0] hover:scale-105"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
          >
            Próximo
            <HiOutlineArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- PASSO 2 ---
const ModalStep2: React.FC<ModalStepProps> = ({ onAction }) => (
  <div className="flex flex-col h-full text-center">
    <h2 className="text-2xl font-bold text-black font-['Montserrat'] mb-8 text-left">Medidas Físicas</h2>

    <form className="space-y-6 flex-1 flex flex-col items-center">
      <div className="relative w-full">
        <select className={`${inputStyle} appearance-none cursor-pointer bg-white text-left`}>
          <option value="" disabled selected>
            Tipo de Intervenção
          </option>
          <option value="bypass">Bypass Gástrico</option>
          <option value="sleeve">Sleeve Gastrectomia</option>
          <option value="caneta">Caneta Emagrecedora</option>
        </select>
        <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      <button type="button" className="text-[#6F3CF6] font-bold text-sm hover:underline self-start ml-2">
        Preencher Informações Adicionais
      </button>

      <button
        type="button"
        onClick={onAction}
        className="bg-[#6F3CF6] text-white py-3 px-12 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md mt-4"
      >
        Finalizar
      </button>

      <div className="mt-auto pt-6 flex flex-col items-center">
        <p className="text-gray-500 text-xs max-w-[80%] mb-4">
          O preenchimento de informações adicionais fará com que a BARI te entregue resultados mais precisos
        </p>

        <div className="relative w-24 h-24">
          <Image src="/images/bari_padrao.png" alt="Mascote Bari" fill className="object-contain object-top" />
        </div>
      </div>
    </form>
  </div>
);

// --- Componente Principal ---
export const HealthSurveyModal: React.FC<HealthSurveyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setStep(1), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(2);

  const handleFinish = () => {
    console.log("Fluxo finalizado!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-[500px] min-h-[550px] p-8 md:p-10 border border-gray-100 flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
        >
          <IoClose size={24} />
        </button>

        {step === 1 ? <ModalStep1 onAction={handleNext} /> : <ModalStep2 onAction={handleFinish} />}
      </div>
    </div>
  );
};
