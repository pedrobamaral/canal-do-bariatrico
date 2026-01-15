import React from 'react';

// 1. Definição dos dados para popular a tabela
const patients = [
  {
    id: 1,
    nome: "Rômulo C. M.",
    consulta: "19/12/2025",
    retorno: "16/01/2026",
    dieta: "red", // cores para os indicadores
    hidratacao: "yellow",
    medicacao: "green",
    checkins: "3/5",
    adesao: "Dias s/ resposta",
  },
  // Adicione mais objetos aqui para testar o scroll/lista
];

const DashboardPacientes = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">

      {/* Título Central */}
      <h1 className="text-4xl font-bold text-center mb-12">
        Qual Paciente Está Vendo?
      </h1>

      {/* Container da Tabela */}
      <div className="max-w-6xl mx-auto bg-[#D1D1D1] rounded-3xl overflow-hidden shadow-lg">
        <table className="w-full text-black border-collapse">
          <thead>
            <tr className="text-[10px] md:text-xs uppercase font-bold text-center">
              <th className="py-6 px-4">Nome do Paciente</th>
              <th className="py-6 px-4">Dia da Consulta</th>
              <th className="py-6 px-4">Dia de Retorno</th>
              <th className="py-6 px-4">Dieta</th>
              <th className="py-6 px-4">Hidratação</th>
              <th className="py-6 px-4">Medicação</th>
              <th className="py-6 px-4">Check-ins</th>
              <th className="py-6 px-4">Adesão</th>
            </tr>
          </thead>
          
          <tbody className="text-sm font-medium">
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t border-gray-400">
                <td className="py-4 px-4 text-center">{patient.nome}</td>
                <td className="py-4 px-4 text-center">{patient.consulta}</td>
                <td className="py-4 px-4 text-center">{patient.retorno}</td>
                
                {/* Indicadores de Status */}
                <td className="py-4 px-4">
                  <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.dieta)}`} />
                </td>
                <td className="py-4 px-4">
                  <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.hidratacao)}`} />
                </td>
                <td className="py-4 px-4">
                  <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.medicacao)}`} />
                </td>
                
                <td className="py-4 px-4 text-center">{patient.checkins}</td>
                <td className="py-4 px-4 text-center text-xs leading-tight">
                  {patient.adesao}
                </td>
              </tr>
            ))}
            
            {/* Linhas Vazias para manter o estilo do design (Opcional) */}
            {[...Array(4)].map((_, i) => (
              <tr key={`empty-${i}`} className="border-t border-gray-400 h-12">
                <td colSpan={8}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Função auxiliar para as cores dos status
const getStatusColor = (color: string) => {
  switch (color) {
    case 'red': return 'bg-red-500';
    case 'yellow': return 'bg-yellow-400';
    case 'green': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
};

export default DashboardPacientes;