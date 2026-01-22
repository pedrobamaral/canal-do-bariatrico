"use client";

import React, { useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";
import {
  FaUtensils,
  FaAppleAlt,
  FaFireAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

/* ================== PROPS ================== */

interface DietModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ================== ESTILOS (IGUAL PostLogin) ================== */

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
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
      aria-label="Fechar modal"
    >
      <IoClose />
    </button>
  </div>
);

/* ================== MODAL ================== */

export const DietModal: React.FC<DietModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [values, setValues] = useState({
    tipoDieta: "",
    calorias: "",
    refeicoesDia: "",
    horarioPreferido: "",
    inicio: "",
  });

  const setField =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((p) => ({ ...p, [field]: e.target.value }));

  const valid =
    values.tipoDieta &&
    values.calorias &&
    values.refeicoesDia &&
    values.inicio;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#EDEDED] rounded-xl max-w-md w-full shadow-xl overflow-hidden"
      >
        <ModalHeader title="Configuração da Dieta" onClose={onClose} />

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
          />

          <Input
            icon={<FaAppleAlt />}
            placeholder="Refeições por dia"
            value={values.refeicoesDia}
            onChange={setField("refeicoesDia")}
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
            disabled={!valid}
            onClick={onClose}
            className={`w-full p-3 rounded-full border transition
              ${
                valid
                  ? "border-[#6A38F3] text-[#6A38F3] hover:bg-[#6A38F3] hover:text-white"
                  : "border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
              }`}
          >
            Salvar dieta
          </button>
        </div>
      </div>
    </div>
  );
};
