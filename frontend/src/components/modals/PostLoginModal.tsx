// components/PostLoginModal.tsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { IoClose, IoChevronDown } from "react-icons/io5";

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
  onClose: () => void;
  onFinish: (data: PostLoginData) => void;
  onFillAdditionalInfo?: () => void;
}

const inputStyle =
  "w-full h-[50px] px-6 rounded-full border border-black bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none focus:border-[#6F3CF6] focus:ring-1 focus:ring-[#6F3CF6] transition-all";

const labelStyle = "sr-only";

const FieldError = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return <p className="mt-1 ml-4 text-xs font-medium text-red-600">{msg}</p>;
};

function isEmpty(v: string) {
  return v.trim() === "";
}
function toNumberOrNaN(v: string) {
  if (isEmpty(v)) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

const LIMITS = {
  pesoKg: { min: 20, max: 350 },
  alturaCm: { min: 120, max: 230 },
  idadeAnos: { min: 10, max: 120 },
  pesoMetaKg: { min: 20, max: 350 },
};

type Step1Errors = Partial<
  Record<"peso" | "altura" | "idade" | "sexo" | "pesoMeta", string>
>;

function validateStep1(values: PostLoginData): Step1Errors {
  const errors: Step1Errors = {};

  const peso = toNumberOrNaN(values.peso);
  const altura = toNumberOrNaN(values.altura);
  const idade = toNumberOrNaN(values.idade);
  const pesoMeta = toNumberOrNaN(values.pesoMeta);

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

  if (isEmpty(values.pesoMeta)) errors.pesoMeta = "Informe o peso que você quer ter.";
  else if (Number.isNaN(pesoMeta)) errors.pesoMeta = "Peso desejado inválido.";
  else if (pesoMeta < LIMITS.pesoMetaKg.min || pesoMeta > LIMITS.pesoMetaKg.max)
    errors.pesoMeta = `Peso desejado deve estar entre ${LIMITS.pesoMetaKg.min} e ${LIMITS.pesoMetaKg.max} kg.`;

  return errors;
}

function validateStep2(values: PostLoginData) {
  if (!values.tipoIntervencao) return "Selecione o tipo de intervenção.";
  return "";
}

export const PostLoginModal: React.FC<PostLoginModalProps> = ({
  isOpen,
  onClose,
  onFinish,
  onFillAdditionalInfo,
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

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const step1Errors = useMemo(() => validateStep1(values), [values]);
  const step1Valid = useMemo(
    () => Object.keys(step1Errors).length === 0,
    [step1Errors]
  );

  const step2Error = useMemo(() => validateStep2(values), [values]);

  const canShowError = (field: string) => Boolean(touched[field]);

  const setField =
    (field: keyof PostLoginData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value as any }));

  const goNext = () => {
    setTouched((p) => ({
      ...p,
      peso: true,
      altura: true,
      idade: true,
      sexo: true,
      pesoMeta: true,
    }));

    const currentErrors = validateStep1(values);
    if (Object.keys(currentErrors).length > 0) return;

    setStep(2);
  };

  const finish = () => {
    setTouched((p) => ({ ...p, tipoIntervencao: true }));

    const err = validateStep2(values);
    if (err) return;

    onFinish(values);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-transparent backdrop-blur-sm p-4 transition-all duration-300">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[56px] shadow-2xl w-full max-w-[620px] min-h-[540px] p-10 border border-gray-100 flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-10"
          aria-label="Fechar modal"
        >
          <IoClose size={24} />
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-black font-['Montserrat']">
            Medidas Físicas
          </h2>
        </div>

        {step === 1 && (
          <div className="flex flex-col flex-1">
            <form className="space-y-4 flex-1">
              <div>
                <label className={labelStyle}>Peso (kg)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Peso (kg)"
                  className={`${inputStyle} ${
                    canShowError("peso") && step1Errors.peso
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={values.peso}
                  onChange={setField("peso")}
                  onBlur={() => setTouched((p) => ({ ...p, peso: true }))}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E")
                      e.preventDefault();
                  }}
                />
                <FieldError msg={canShowError("peso") ? step1Errors.peso : undefined} />
              </div>

              <div>
                <label className={labelStyle}>Altura (cm)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Altura (cm)"
                  className={`${inputStyle} ${
                    canShowError("altura") && step1Errors.altura
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={values.altura}
                  onChange={setField("altura")}
                  onBlur={() => setTouched((p) => ({ ...p, altura: true }))}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E")
                      e.preventDefault();
                  }}
                />
                <FieldError msg={canShowError("altura") ? step1Errors.altura : undefined} />
              </div>

              <div>
                <label className={labelStyle}>Idade (anos)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Idade (anos)"
                  className={`${inputStyle} ${
                    canShowError("idade") && step1Errors.idade
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={values.idade}
                  onChange={setField("idade")}
                  onBlur={() => setTouched((p) => ({ ...p, idade: true }))}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E")
                      e.preventDefault();
                  }}
                />
                <FieldError msg={canShowError("idade") ? step1Errors.idade : undefined} />
              </div>

              <div className="relative">
                <select
                  className={`${inputStyle} appearance-none cursor-pointer bg-white ${
                    canShowError("sexo") && step1Errors.sexo
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={values.sexo}
                  onChange={setField("sexo")}
                  onBlur={() => setTouched((p) => ({ ...p, sexo: true }))}
                >
                  <option value="" disabled>
                    Sexo Biológico
                  </option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
                <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <FieldError msg={canShowError("sexo") ? step1Errors.sexo : undefined} />
              </div>

              <div>
                <label className={labelStyle}>Peso desejado (kg)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Quantos quilos quero ter (kg)"
                  className={`${inputStyle} ${
                    canShowError("pesoMeta") && step1Errors.pesoMeta
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={values.pesoMeta}
                  onChange={setField("pesoMeta")}
                  onBlur={() => setTouched((p) => ({ ...p, pesoMeta: true }))}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E")
                      e.preventDefault();
                  }}
                />
                <FieldError msg={canShowError("pesoMeta") ? step1Errors.pesoMeta : undefined} />
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!step1Valid}
                  className={`flex items-center gap-2 py-3 px-12 rounded-full text-sm font-bold transition-transform shadow-md
                    ${
                      step1Valid
                        ? "bg-[#6F3CF6] text-white hover:bg-[#5c2fe0] hover:scale-105"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  Próximo
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1">
            <div className="space-y-4 flex-1">
              <div className="relative">
                <select
                  className={`${inputStyle} appearance-none cursor-pointer bg-white ${
                    canShowError("tipoIntervencao") && step2Error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  value={values.tipoIntervencao}
                  onChange={setField("tipoIntervencao")}
                  onBlur={() => setTouched((p) => ({ ...p, tipoIntervencao: true }))}
                >
                  <option value="" disabled>
                    Tipo de Intervenção
                  </option>

                  <option value="cirurgia_bariatrica">Cirurgia bariátrica</option>
                  <option value="medicacao">Medicação</option>
                  <option value="dieta_treino">Dieta e treino</option>
                </select>

                <IoChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <FieldError msg={canShowError("tipoIntervencao") ? step2Error : undefined} />
              </div>

              <button
                type="button"
                onClick={onFillAdditionalInfo}
                className="text-[#6F3CF6] font-semibold underline underline-offset-4 text-sm text-left pl-2"
              >
                Preencher Informações Adicionais
              </button>

              <p className="text-xs text-gray-500 leading-relaxed px-2">
                O preenchimento de informações adicionais fará com que a BARI te entregue resultados mais precisos
              </p>

              <div className="flex justify-center pt-3">
                <div className="relative w-[92px] h-[92px]">
                  <Image
                    src="/images/bari_padrao.png"
                    alt="Mascote Bari"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={finish}
                className="bg-[#6F3CF6] text-white py-3 px-14 rounded-full text-sm font-bold hover:bg-[#5c2fe0] transition-transform hover:scale-105 shadow-md"
              >
                Finalizar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
