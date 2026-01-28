"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  IoClose,
  IoChevronDown,
} from "react-icons/io5";
import {
  FaWeight,
  FaRulerVertical,
  FaBirthdayCake,
  FaBullseye,
  FaVenusMars,
  FaArrowLeft,
  FaStethoscope,
  FaPills,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { updateData, createOrUpdateMedicacao, createDia0, createCiclo } from "@/api/api";
import { MedicationModal, MedicationData, MedicationFrequency } from "./MedicationModal";

/* ================== TIPOS ================== */

type Step = 1 | 2 | 3;

export type PostLoginData = {
  peso: string;
  altura: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  pesoMeta: string;
  tipoIntervencao: "" | "mounjaro" | "apenas_dieta_treino";
};



interface Props {
  isOpen: boolean;
  onCloseAction: () => void;
  usuarioId?: number;
}

/* ================== ESTILOS ================== */

const inputStyle =
  "w-full h-[50px] pl-12 pr-12 rounded-2xl bg-white/80 backdrop-blur-md text-[#1f1f1f] border border-gray-300/70 focus:border-[#6A38F3] focus:ring-4 focus:ring-[#6A38F3]/20 focus:outline-none transition-all duration-300";

const selectStyle = "appearance-none cursor-pointer";

/* ================== COMPONENTE ================== */

export const PostLoginModal: React.FC<Props> = ({
  isOpen,
  onCloseAction,
  usuarioId,
}) => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);

  /* ===== Medidas ===== */
  const [values, setValues] = useState<Partial<PostLoginData>>({
    peso: "",
    altura: "",
    dataNascimento: "",
    sexo: undefined,
    pesoMeta: "",
    tipoIntervencao: "",
  });

  /* ===== Medicamento Prescrito ===== */
  const [medPrescrita, setMedPrescrita] = useState(false);
  const [freqMedPrescrita, setFreqMedPrescrita] = useState<MedicationFrequency>(null);
  const [medicationData, setMedicationData] = useState<MedicationData | null>(null);

  const setField =
    (field: keyof PostLoginData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const step1Valid =
    values.peso &&
    values.altura &&
    values.dataNascimento &&
    values.sexo &&
    values.pesoMeta;

  const handleClose = () => {
    setStep(1);
    setValues({
      peso: "",
      altura: "",
      dataNascimento: "",
      sexo: undefined,
      pesoMeta: "",
      tipoIntervencao: "",
    });
    setMedPrescrita(false);
    setFreqMedPrescrita(null);
    setMedicationData(null);
    onCloseAction();
  };

  /* ================== FINALIZAR ================== */

  const handleFinish = async () => {
    if (!usuarioId || !values.sexo || !values.dataNascimento) {
      toast.error("Dados obrigatórios não preenchidos");
      return;
    }

    setLoading(true);
    try {
      // Converter string de data para Date
      const dataNascimento = new Date(values.dataNascimento);

      // 1. Atualizar dados do usuário
      await updateData(usuarioId, {
        peso: Number(values.peso),
        altura: Number(values.altura),
        nascimento: dataNascimento,
        sexo: values.sexo,
        meta: Number(values.pesoMeta),
        ativo: true,
      });

      // 2. Criar medicação se fornecida
      if (medicationData && medicationData.nome) {
        await createOrUpdateMedicacao(usuarioId, {
          nome: medicationData.nome,
          concentracao: medicationData.concentracao,
          frequencia: medicationData.frequencia,
          nomeMedico: medicationData.nomeMedico,
          instagramMedico: medicationData.instagramMedico,
        });
      }

      // 3. Criar Dia0
      const dia0Response = await createDia0(usuarioId, {
        dia0: new Date(),
        quer_msg: true,
        iniciou_medicamento: false,
      });

      const dia0Id = dia0Response.id;

      // 4. Criar Ciclo com mounjaro baseado no tipo de intervenção
      // E med_prescrita e freq_med_prescrita baseado na resposta do MedicationModal
      const mounjaro = values.tipoIntervencao === "mounjaro";
      await createCiclo(usuarioId, dia0Id, {
        numCiclo: 1,
        ativoCiclo: true,
        mounjaro: mounjaro,
        med_prescrita: medPrescrita,
        freq_med_prescrita: freqMedPrescrita || 0,
        treino: true,
        dieta: true,
        agua: true,
        bioimpedancia: true,
        consulta: true,
      });

      toast.success("Dados salvos com sucesso!");
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar dados");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#EDEDED] rounded-xl max-w-md w-full shadow-xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative px-8 py-6 border-b border-gray-300">
          <h2 className="text-lg font-semibold text-center">
            {step === 1 && "Medidas físicas"}
            {step === 2 && "Medicamentos"}
            {step === 3 && "Tipo de intervenção"}
          </h2>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-xl text-gray-500"
          >
            <IoClose />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="p-8 space-y-4">

          {/* STEP 1 — MEDIDAS */}
          {step === 1 && (
            <>
              <Input icon={<FaWeight />} placeholder="Peso (kg)" value={values.peso} onChange={setField("peso")} />
              <Input icon={<FaRulerVertical />} placeholder="Altura (cm)" value={values.altura} onChange={setField("altura")} />
              <Input 
                icon={<FaBirthdayCake />} 
                placeholder="Data de nascimento" 
                type="date"
                value={values.dataNascimento} 
                onChange={setField("dataNascimento")} 
              />

              <Select icon={<FaVenusMars />} value={values.sexo || ""} onChange={setField("sexo")}>
                <option value="" disabled>Sexo biológico</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </Select>

              <Input icon={<FaBullseye />} placeholder="Peso desejado (kg)" value={values.pesoMeta} onChange={setField("pesoMeta")} />

              <button
                disabled={!step1Valid}
                onClick={() => setShowMedicationModal(true)}
                className="w-full p-3 rounded-full border border-[#6A38F3] text-[#6A38F3]"
              >
                Próximo
              </button>
            </>
          )}

          {/* STEP 2 — RESUMO MEDICAMENTO (exibido após MedicationModal) */}
          {step === 2 && (
            <div className="text-center space-y-6">
              <FaPills className={`mx-auto text-4xl transition-colors ${medPrescrita ? "text-[#6A38F3]" : "text-gray-400"}`} />
              
              {medPrescrita ? (
                <>
                  <p className="text-sm text-gray-600">
                    ✓ Medicamento prescrito registrado
                  </p>
                  {medicationData && (
                    <div className="text-left bg-white/50 p-4 rounded-xl space-y-1 text-sm text-black">
                      <p><strong>Medicamento:</strong> {medicationData.nome}</p>
                      <p><strong>Dosagem:</strong> {medicationData.concentracao}</p>
                      <p><strong>Frequência:</strong> {medicationData.frequencia}</p>
                      {medicationData.nomeMedico && (
                        <p><strong>Médico:</strong> {medicationData.nomeMedico}</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  Nenhum medicamento prescrito informado
                </p>
              )}

              <div className="flex gap-4">
                <button
                  className="flex-1 p-3 rounded-full border border-gray-300 text-gray-600"
                  onClick={() => setShowMedicationModal(true)}
                >
                  Alterar
                </button>

                <button
                  className="flex-1 p-3 rounded-full border border-[#6A38F3] text-[#6A38F3]"
                  onClick={() => setStep(3)}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — INTERVENÇÃO */}
          {step === 3 && (
            <>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft /> Voltar
              </button>

              <Select icon={<FaStethoscope />} value={values.tipoIntervencao || ""} onChange={setField("tipoIntervencao")}>
                <option value="" disabled>Tipo de intervenção</option>
                <option value="mounjaro">Mounjaro</option>
                <option value="apenas_dieta_treino">Apenas dieta e treino</option>
              </Select>

              <p className="text-xs text-gray-500 text-center">
                Informações adicionais tornam os resultados mais precisos
              </p>

              <div className="flex justify-center">
                <Image src="/images/bari_icon.png" alt="Bari" width={70} height={70} />
              </div>

              <button
                onClick={handleFinish}
                disabled={loading || !values.tipoIntervencao}
                className="w-full p-3 rounded-full border border-[#6A38F3] text-[#6A38F3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : "Finalizar"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* MedicationModal */}
      <MedicationModal
        isOpen={showMedicationModal}
        onClose={() => {
          setShowMedicationModal(false);
          // Se já passou pelo modal de medicamento, vai para step 2
          if (step === 1) {
            setStep(2);
          }
        }}
        usuarioId={usuarioId}
        embeddedMode={true}
        onYesCallback={(data) => {
          setMedPrescrita(true);
          setFreqMedPrescrita(data.frequencia);
          setMedicationData(data);
          setShowMedicationModal(false);
          setStep(2);
        }}
        onNoCallback={() => {
          setMedPrescrita(false);
          setFreqMedPrescrita(null);
          setMedicationData(null);
          setShowMedicationModal(false);
          setStep(2);
        }}
        onBackCallback={() => {
          setShowMedicationModal(false);
          setStep(1);
        }}
      />
    </div>
  );
};

/* ================== AUX ================== */

const Input = ({ icon, ...props }: { icon: React.ReactNode; [key: string]: any }) => {
  const hasValue = props.value !== undefined && props.value !== null && `${props.value}` !== "";

  return (
    <div className="relative group">
      <input {...props} className={inputStyle} />
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-[#6A38F3] ${
          hasValue ? "text-[#6A38F3]" : ""
        }`}
      >
        {icon}
      </span>
    </div>
  );
};

const Select = ({ icon, children, ...props }: { icon: React.ReactNode; children: React.ReactNode; [key: string]: any }) => {
  const hasValue = props.value !== undefined && props.value !== null && `${props.value}` !== "";

  return (
    <div className="relative group">
      <select {...props} className={`${inputStyle} ${selectStyle}`}>
        {children}
      </select>
      <span
        className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-[#6A38F3] ${
          hasValue ? "text-[#6A38F3]" : ""
        }`}
      >
        {icon}
      </span>
      <IoChevronDown
        className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-[#6A38F3] ${
          hasValue ? "text-[#6A38F3]" : ""
        }`}
      />
    </div>
  );
};
