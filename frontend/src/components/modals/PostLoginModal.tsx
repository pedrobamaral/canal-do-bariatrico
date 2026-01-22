"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoClose, IoChevronDown } from "react-icons/io5";
import {
  FaWeight,
  FaRulerVertical,
  FaBirthdayCake,
  FaBullseye,
  FaVenusMars,
  FaArrowLeft,
  FaStethoscope,
} from "react-icons/fa";

/* ================== TIPOS ================== */

export type PostLoginData = {
  peso: string;
  altura: string;
  idade: string;
  sexo: "" | "masculino" | "feminino";
  pesoMeta: string;
  tipoIntervencao:
    | ""
    | "cirurgia_bariatrica"
    | "medicacao"
    | "dieta_treino";
};

interface PostLoginModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onFinishAction: (data: PostLoginData) => void;
  onFillAdditionalInfoAction?: () => void;
}

/* ================== ESTILOS ================== */

const inputStyle =
  "w-full h-[50px] pl-12 pr-12 rounded-2xl bg-white/80 backdrop-blur-md text-[#1f1f1f] border border-gray-300/70 focus:border-[#6A38F3] focus:ring-4 focus:ring-[#6A38F3]/20 focus:outline-none transition-all duration-300";

const selectStyle = "appearance-none cursor-pointer";

/* ================== COMPONENTE ================== */

export const PostLoginModal: React.FC<PostLoginModalProps> = ({
  isOpen,
  onCloseAction,
  onFinishAction,
  onFillAdditionalInfoAction,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [values, setValues] = useState<PostLoginData>({
    peso: "",
    altura: "",
    idade: "",
    sexo: "",
    pesoMeta: "",
    tipoIntervencao: "",
  });

  const setField =
    (field: keyof PostLoginData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  /** ✅ VALIDAÇÃO STEP 1 */
  const step1Valid =
    values.peso &&
    values.altura &&
    values.idade &&
    values.sexo &&
    values.pesoMeta;

  /** ✅ FECHAR MODAL (RESET TOTAL) */
  const handleClose = () => {
    setStep(1);
    setValues({
      peso: "",
      altura: "",
      idade: "",
      sexo: "",
      pesoMeta: "",
      tipoIntervencao: "",
    });
    onCloseAction();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#EDEDED] rounded-xl max-w-md w-full shadow-xl relative overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative px-8 py-6 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-center text-[#2f2f2f]">
            Medidas físicas
          </h2>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
          >
            <IoClose />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="p-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <Input icon={<FaWeight />} placeholder="Peso (kg)" value={values.peso} onChange={setField("peso")} />
              <Input icon={<FaRulerVertical />} placeholder="Altura (cm)" value={values.altura} onChange={setField("altura")} />
              <Input icon={<FaBirthdayCake />} placeholder="Idade" value={values.idade} onChange={setField("idade")} />

              <Select icon={<FaVenusMars />} value={values.sexo} onChange={setField("sexo")}>
                <option value="" disabled>Sexo biológico</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </Select>

              <Input icon={<FaBullseye />} placeholder="Peso desejado (kg)" value={values.pesoMeta} onChange={setField("pesoMeta")} />

              <button
                disabled={!step1Valid}
                onClick={() => step1Valid && setStep(2)}
                className={`w-full p-3 rounded-full border transition
                  ${
                    step1Valid
                      ? "border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white"
                      : "border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
                  }`}
              >
                Próximo
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
              >
                <FaArrowLeft />
                Voltar
              </button>

              <Select
                icon={<FaStethoscope />}
                value={values.tipoIntervencao}
                onChange={setField("tipoIntervencao")}
              >
                <option value="" disabled>Tipo de intervenção</option>
                <option value="cirurgia_bariatrica">Cirurgia bariátrica</option>
                <option value="medicacao">Medicação</option>
                <option value="dieta_treino">Dieta e treino</option>
              </Select>

              <button
                onClick={onFillAdditionalInfoAction}
                className="text-sm underline text-[#6A38F3] text-left"
              >
                Preencher informações adicionais
              </button>

              <p className="text-xs text-gray-500 text-center">
                O preenchimento de informações adicionais fará com que a BARI te
                entregue resultados mais precisos
              </p>

              <div className="flex justify-center">
                <Image src="/images/bari_icon.png" alt="Bari" width={70} height={70} />
              </div>

              <button
                onClick={() => onFinishAction(values)}
                className="w-full p-3 rounded-full border border-[#6A38F3]
                           text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition"
              >
                Finalizar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

function Select({
  icon,
  children,
  value,
  onChange,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={onChange}
        className={`${inputStyle} ${selectStyle}`}
      >
        {children}
      </select>

      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#6A38F3] transition">
          {icon}
        </span>
      )}

      <IoChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                   group-focus-within:text-[#6A38F3] 
                   group-focus-within:rotate-180
                   transition-transform duration-300 pointer-events-none"
      />
    </div>
  );
}
