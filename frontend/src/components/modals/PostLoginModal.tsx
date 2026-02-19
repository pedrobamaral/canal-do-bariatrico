"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Ícones
import {
  FaWeight,
  FaRulerVertical,
  FaBirthdayCake,
  FaVenusMars,
  FaBullseye,
  FaStethoscope,
  FaArrowLeft,
} from "react-icons/fa";
import { IoClose, IoChevronDown } from "react-icons/io5";
import { MedicationModal } from "@/components/modals/MedicationModal";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  onCloseAction?: () => void;
  onFinishAction?: () => void;
  usuarioId: number;
  usuario?: any;
}

export default function PostLoginModal({
  isOpen,
  onClose,
  onCloseAction,
  onFinishAction,
  usuarioId,
}: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<any>({
    peso: "",
    altura: "",
    dataNascimento: "",
    sexo: "",
    pesoMeta: "",
    tipoIntervencao: "",
  });

  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [medPrescrita, setMedPrescrita] = useState(false);
  const [freqMedPrescrita, setFreqMedPrescrita] = useState(0);

  const callClose = () => {
    onClose?.();
    onCloseAction?.();
  };

  if (!isOpen) return null;

  const setField =
    (field: string) =>
    (e: any) =>
      setValues((prev: any) => ({
        ...prev,
        [field]: e.target.value,
      }));

  const step1Valid =
    values.peso &&
    values.altura &&
    values.dataNascimento &&
    values.sexo &&
    values.pesoMeta;

  const handleFinish = async () => {
    try {
      setLoading(true);

      // 👉 SUA LÓGICA ORIGINAL DE SALVAR DADOS AQUI
      console.log({
        ...values,
        medPrescrita,
        freqMedPrescrita,
        usuarioId,
      });

      onClose?.();
      onFinishAction?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={callClose}>
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
        transition={{ duration: 0.35 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl p-8 text-white"
        style={{
          background: "rgba(20,15,35,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Fechar */}
        <button onClick={callClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition">
          <IoClose size={22} />
        </button>

        {/* Título */}
        <h2 className="text-lg font-semibold text-center mb-6">
          {step === 1 && "Medidas físicas"}
          {step === 2 && "Medicamentos"}
          {step === 3 && "Tipo de intervenção"}
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <DarkInput
              icon={<FaWeight />}
              placeholder="Peso (kg)"
              value={values.peso}
              onChange={setField("peso")}
            />

            <DarkInput
              icon={<FaRulerVertical />}
              placeholder="Altura (cm)"
              value={values.altura}
              onChange={setField("altura")}
            />

            <DarkInput
              icon={<FaBirthdayCake />}
              type="date"
              value={values.dataNascimento}
              onChange={setField("dataNascimento")}
            />

            <DarkSelect
              icon={<FaVenusMars />}
              value={values.sexo}
              onChange={setField("sexo")}
            >
              <option value="" disabled className="bg-[#140f23] text-white/60">
                Sexo biológico
              </option>
              <option value="Masculino" className="bg-[#140f23] text-white">
                Masculino
              </option>
              <option value="Feminino" className="bg-[#140f23] text-white">
                Feminino
              </option>
              <option value="Outro" className="bg-[#140f23] text-white">
                Outro
              </option>
            </DarkSelect>

            <DarkInput
              icon={<FaBullseye />}
              placeholder="Peso desejado (kg)"
              value={values.pesoMeta}
              onChange={setField("pesoMeta")}
            />

            <button
              disabled={!step1Valid}
              onClick={() => setShowMedicationModal(true)}
              className="
                w-full py-3 rounded-full font-medium
                bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]
                hover:scale-105 transition
                disabled:opacity-40
              "
            >
              Próximo
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <FaArrowLeft /> Voltar
            </button>

            <DarkSelect
              icon={<FaStethoscope />}
              value={values.tipoIntervencao}
              onChange={setField("tipoIntervencao")}
            >
              <option value="" disabled className="bg-[#140f23] text-white/60">
                Tipo de intervenção
              </option>
              <option value="mounjaro" className="bg-[#140f23] text-white">
                Caneta emagrecedora
              </option>
              <option value="apenas_dieta_treino" className="bg-[#140f23] text-white">
                Apenas dieta e treino
              </option>
            </DarkSelect>

            <p className="text-xs text-white/50 text-center">
              Essas informações ajudam a personalizar seu acompanhamento
            </p>

            <div className="flex justify-center">
              <Image
                src="/images/bari_icon.png"
                alt="Bari"
                width={70}
                height={70}
              />
            </div>

            <button
              onClick={handleFinish}
              disabled={loading || !values.tipoIntervencao}
              className="
                w-full py-3 rounded-full font-medium
                bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]
                hover:scale-105 transition
                disabled:opacity-40
              "
            >
              {loading ? "Salvando..." : "Finalizar"}
            </button>
          </div>
        )}

        {/* MODAL DE MEDICAMENTO */}
        <MedicationModal
          isOpen={showMedicationModal}
          onClose={() => {
            setShowMedicationModal(false);
            setStep(3);
          }}
          usuarioId={usuarioId}
          embeddedMode
          onYesCallback={(data: any) => {
            setMedPrescrita(true);
            setFreqMedPrescrita(data?.frequencia ?? 0);
            setShowMedicationModal(false);
            setStep(3);
          }}
          onNoCallback={() => {
            setMedPrescrita(false);
            setFreqMedPrescrita(0);
            setShowMedicationModal(false);
            setStep(3);
          }}
          onBackCallback={() => {
            setShowMedicationModal(false);
            setStep(1);
          }}
        />
      </motion.div>
    </div>
  );
}

/* Global styles for date input calendar indicator to appear white */
export const __postLoginModal_date_styles = null;

/* Add a global style tag by injecting into document head at runtime for broader browser support */
if (typeof window !== "undefined") {
  const styleId = "postloginmodal-date-style";
  if (!document.getElementById(styleId)) {
    const s = document.createElement("style");
    s.id = styleId;
    s.innerHTML = `
      /* make calendar icon white */
      .dark-input::-webkit-calendar-picker-indicator { filter: brightness(0) invert(1) !important; }
      .dark-input::-moz-calendar-picker-indicator { filter: brightness(0) invert(1) !important; }

      /* default date text color inherits (visible when value is set) */
      .dark-input::-webkit-datetime-edit,
      .dark-input::-webkit-datetime-edit-fields-wrapper,
      .dark-input::-webkit-datetime-edit-text { color: inherit !important; }

      /* hide browser format hint when input has empty value so our label shows */
      .dark-input[value=""]::-webkit-datetime-edit,
      .dark-input[value=""]::-webkit-datetime-edit-fields-wrapper,
      .dark-input[value=""]::-webkit-datetime-edit-text { color: transparent !important; }

      /* Firefox: hide placeholder-like text when empty */
      .dark-input:-moz-ui-invalid::-moz-datetime-text { color: transparent !important; }
    `;
    document.head.appendChild(s);
  }
}

/* ========================= */
/* COMPONENTES AUXILIARES */
/* ========================= */

const DarkInput = ({ icon, ...props }: any) => {
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = (e: any) => {
    setActive(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setActive(false);
    if (props.onBlur) props.onBlur(e);
  };

  const isDate = props.type === "date";

  const placeholder = isDate ? "" : props.placeholder ?? "";

  return (
    <div className="relative group">
      <input
        ref={inputRef}
        {...props}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={
          `
          w-full h-[50px] rounded-full
          bg-white/5 border border-white/10
          pl-12 pr-4
          text-white placeholder-white/40
          focus:outline-none focus:border-[#8B5CF6]
        ` + (isDate ? " dark-input" : "")
        }
      />

      {/* Icon */}
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${
        active ? "text-[#8B5CF6]" : "text-white/40"
      } group-focus-within:text-[#8B5CF6]`}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon as any, {
              className: `${active ? "text-[#8B5CF6]" : "text-white/40"} w-4 h-4`,
            })
          : icon}
      </span>

      {/* In-input label for date fields (only when empty) */}
      {isDate && !props.value && (
        <span
          onClick={() => inputRef.current?.focus()}
          className="absolute left-12 top-1/2 -translate-y-1/2 text-white/60 text-sm cursor-text"
        >
          Data de aniversário
        </span>
      )}
    </div>
  );
};

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
      } group-focus-within:text-[#8B5CF6]`}>
        {React.isValidElement(icon)
          ? React.cloneElement(icon as any, {
              className: `${active ? "text-[#8B5CF6]" : "text-white/40"} w-4 h-4`,
            })
          : icon}
      </span>

      <IoChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${
        active ? "text-[#8B5CF6]" : "text-white/40"
      } group-focus-within:text-[#8B5CF6]`} />
    </div>
  );
}