import React, { useRef, useLayoutEffect, useState } from 'react';
import { FaSearch, FaEye } from 'react-icons/fa';

// Tipagens locais (compatíveis com a página original)
export type Usuario = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  peso?: number;
  altura?: number;
  meta?: number;
  admin?: boolean;
  ativo?: boolean;
  dataCriacao?: Date | string;
  foto?: string;
};

export type PatientData = Usuario & {
  dietaStatus?: 'red' | 'yellow' | 'green' | 'gray';
  hidratacaoStatus?: 'red' | 'yellow' | 'green' | 'gray';
  treinoStatus?: 'red' | 'yellow' | 'green' | 'gray';
  bioimpedanciaStatus?: 'red' | 'yellow' | 'green' | 'gray';
  checkins?: string;
  adesao?: string;
};

interface Props {
  filteredPatients: PatientData[];
  loading: boolean;
  onPatientClick: (p: PatientData) => void;
  formatDate: (d?: Date | string) => string;
  getStatusColor: (c: string) => string;
}

const PatientNameWithTooltip: React.FC<{ nome: string; email?: string; telefone?: string }> = ({ nome, email, telefone }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const formatPhone = (phone?: string) => {
    if (!phone) return 'Não informado';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) return numbers.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return phone;
  };

  useLayoutEffect(() => {
    if (!showTooltip || !containerRef.current || !tooltipRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const tipRect = tooltipRef.current.getBoundingClientRect();
    const margin = 8;
    if (rect.bottom + tipRect.height + margin > window.innerHeight) setPlacement('top');
    else setPlacement('bottom');
  }, [showTooltip]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="cursor-pointer hover:text-purple-600 transition font-semibold">{nome}</span>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 left-20 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 animate-fadeIn ${
            placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
          }`}
        >
          <div className="space-y-2">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase tracking-wide">Email</span>
              <span className="text-white break-all">{email || 'Não informado'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase tracking-wide">Telefone</span>
              <span className="text-white">{formatPhone(telefone)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PatientsTable: React.FC<Props> = ({ filteredPatients, loading, onPatientClick, formatDate, getStatusColor }) => {
  return (
    <div className="max-w-6xl mx-auto bg-[#D1D1D1] rounded-3xl overflow-hidden shadow-lg">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <FaSearch className="text-4xl mb-4 opacity-50" />
          <p>Nenhum paciente encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-black border-collapse">
            <thead>
              <tr className="text-[10px] md:text-xs uppercase font-bold text-center bg-gray-300">
                <th className="py-4 md:py-6 px-2 md:px-4">Nome</th>
                <th className="py-4 md:py-6 px-2 md:px-4 hidden sm:table-cell">Email</th>
                <th className="py-4 md:py-6 px-2 md:px-4">Cadastro</th>
                <th className="py-4 md:py-6 px-2 md:px-4">Hidrat.</th>
                <th className="py-4 md:py-6 px-2 md:px-4">Dieta</th>
                <th className="py-4 md:py-6 px-2 md:px-4">Treino</th>
                <th className="py-4 md:py-6 px-2 md:px-4">Bioimp.</th>
                <th className="py-4 md:py-6 px-2 md:px-4 hidden md:table-cell">Check-ins</th>
                <th className="py-4 md:py-6 px-2 md:px-4">Ações</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-t border-gray-400 hover:bg-gray-200 transition cursor-pointer"
                  onClick={() => onPatientClick(patient)}
                >
                  <td className="py-3 md:py-4 px-2 md:px-4 text-center">
                    <PatientNameWithTooltip nome={patient.nome} email={patient.email} telefone={patient.telefone} />
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-center text-xs hidden sm:table-cell">{patient.email}</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-center text-xs">{formatDate(patient.dataCriacao)}</td>

                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.hidratacaoStatus || 'gray')}`} />
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.dietaStatus || 'gray')}`} />
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.treinoStatus || 'gray')}`} />
                  </td>
                  <td className="py-3 md:py-4 px-2 md:px-4">
                    <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.bioimpedanciaStatus || 'gray')}`} />
                  </td>

                  <td className="py-3 md:py-4 px-2 md:px-4 text-center hidden md:table-cell">{patient.checkins}</td>
                  <td className="py-3 md:py-4 px-2 md:px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPatientClick(patient);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition"
                    >
                      <FaEye className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientsTable;
