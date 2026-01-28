'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit, FaHeartbeat, FaUtensils, FaPills, FaDumbbell, FaEye, FaSearch, FaSync, FaLock } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

// API
import { getAllUsers, getCurrentUser, Usuario } from '@/api/api';

// Modais
import EditUserModal from '@/components/modals/EditUserModal';
import { HealthSurveyModal } from '@/components/modals/HealthSurveyModal';
import { DietModal } from '@/components/modals/DietModal';
import { MedicationModal } from '@/components/modals/MedicationModal';
import { TrainingModal } from '@/components/modals/TrainingModal';

// Interface estendida do paciente com dados calculados
interface PatientData extends Usuario {
  consulta?: string;
  retorno?: string;
  dietaStatus?: 'red' | 'yellow' | 'green' | 'gray';
  hidratacaoStatus?: 'red' | 'yellow' | 'green' | 'gray';
  medicacaoStatus?: 'red' | 'yellow' | 'green' | 'gray';
  checkins?: string;
  adesao?: string;
}

// Componente Tooltip para informações do paciente
interface PatientTooltipProps {
  nome: string;
  email?: string;
  telefone?: string;
}

const PatientNameWithTooltip: React.FC<PatientTooltipProps> = ({ nome, email, telefone }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatPhone = (phone?: string) => {
    if (!phone) return 'Não informado';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="cursor-pointer hover:text-purple-600 transition font-semibold">
        {nome}
      </span>
      
      {showTooltip && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl border border-gray-700 animate-fadeIn">
          {/* Seta do tooltip */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
          
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

// Componente do Modal de Detalhes do Paciente
interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientData | null;
  onOpenEditUser: () => void;
  onOpenHealthSurvey: () => void;
  onOpenDiet: () => void;
  onOpenMedication: () => void;
  onOpenTraining: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  isOpen,
  onClose,
  patient,
  onOpenEditUser,
  onOpenHealthSurvey,
  onOpenDiet,
  onOpenMedication,
  onOpenTraining,
}) => {
  if (!isOpen || !patient) return null;

  const actionButtons = [
    { icon: <FaUserEdit />, label: 'Editar Perfil', onClick: onOpenEditUser, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: <FaHeartbeat />, label: 'Health Survey', onClick: onOpenHealthSurvey, color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: <FaUtensils />, label: 'Dieta', onClick: onOpenDiet, color: 'bg-green-500 hover:bg-green-600' },
    { icon: <FaPills />, label: 'Medicação', onClick: onOpenMedication, color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: <FaDumbbell />, label: 'Treino', onClick: onOpenTraining, color: 'bg-red-500 hover:bg-red-600' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1a1a] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-700"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-purple-600 to-blue-600">
          <h2 className="text-xl font-bold text-white text-center">
            {patient.nome}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition"
            aria-label="Fechar modal"
          >
            <IoClose />
          </button>
        </div>

        {/* Informações do Paciente */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400 block text-xs mb-1">Email</span>
              <span className="text-white">{patient.email || '-'}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400 block text-xs mb-1">Telefone</span>
              <span className="text-white">{patient.telefone || '-'}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400 block text-xs mb-1">Peso</span>
              <span className="text-white">{patient.peso ? `${patient.peso} kg` : '-'}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400 block text-xs mb-1">Altura</span>
              <span className="text-white">{patient.altura ? `${patient.altura} cm` : '-'}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400 block text-xs mb-1">Meta</span>
              <span className="text-white">{patient.meta ? `${patient.meta} kg` : '-'}</span>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <span className="text-gray-400 block text-xs mb-1">Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${patient.ativo ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {patient.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          {/* Indicadores de Status */}
          <div className="flex justify-center gap-6 py-4 border-t border-b border-gray-700">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(patient.dietaStatus || 'gray')}`} />
              <span className="text-xs text-gray-400">Dieta</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(patient.hidratacaoStatus || 'gray')}`} />
              <span className="text-xs text-gray-400">Hidratação</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-4 h-4 rounded-full ${getStatusColor(patient.medicacaoStatus || 'gray')}`} />
              <span className="text-xs text-gray-400">Medicação</span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {actionButtons.map((btn, index) => (
              <button
                key={index}
                onClick={btn.onClick}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium transition-all transform hover:scale-105 ${btn.color}`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
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

const DashboardPacientes = () => {
  const router = useRouter();
  
  // Estados
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Estados dos Modais
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showHealthSurvey, setShowHealthSurvey] = useState(false);
  const [showDiet, setShowDiet] = useState(false);
  const [showMedication, setShowMedication] = useState(false);
  const [showTraining, setShowTraining] = useState(false);

  // Verificar se o usuário é admin
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser.admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          toast.error('Acesso restrito a administradores');
        }
      } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        setIsAdmin(false);
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  // Função para calcular status dos indicadores (você pode customizar essa lógica)
  const calculateStatus = (patient: Usuario): Partial<PatientData> => {
    // Lógica exemplo - ajuste conforme seus dados reais
    const dietaStatus = patient.meta ? 'green' : 'gray';
    const hidratacaoStatus = patient.ativo ? 'yellow' : 'gray';
    const medicacaoStatus = patient.ativo ? 'green' : 'gray';
    
    return {
      dietaStatus,
      hidratacaoStatus,
      medicacaoStatus,
      checkins: patient.ativo ? '3/5' : '0/5',
      adesao: patient.ativo ? 'Regular' : 'Sem resposta',
    };
  };

  // Buscar pacientes
  const fetchPatients = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAllUsers();
      const patientsWithStatus = data.map((user: Usuario) => ({
        ...user,
        ...calculateStatus(user),
      }));
      setPatients(patientsWithStatus);
      setFilteredPatients(patientsWithStatus);
    } catch (error: any) {
      console.error('Erro ao buscar pacientes:', error);
      toast.error('Erro ao carregar lista de pacientes');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Carregar pacientes quando confirmado que é admin
  useEffect(() => {
    if (isAdmin) {
      fetchPatients();
    }
  }, [isAdmin, fetchPatients]);

  // Filtrar pacientes por busca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  // Abrir modal de detalhes
  const handlePatientClick = (patient: PatientData) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
  };

  // Handlers dos modais
  const handleOpenEditUser = () => {
    setShowPatientDetail(false);
    setShowEditUser(true);
  };

  const handleOpenHealthSurvey = () => {
    setShowPatientDetail(false);
    setShowHealthSurvey(true);
  };

  const handleOpenDiet = () => {
    setShowPatientDetail(false);
    setShowDiet(true);
  };

  const handleOpenMedication = () => {
    setShowPatientDetail(false);
    setShowMedication(true);
  };

  const handleOpenTraining = () => {
    setShowPatientDetail(false);
    setShowTraining(true);
  };

  const handleEditUserSuccess = () => {
    fetchPatients();
    toast.success('Dados do paciente atualizados!');
  };

  // Formatar data
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  // Tela de carregamento durante verificação de autenticação
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Tela de acesso negado para não-admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="text-red-500 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-gray-400 mb-6">
            Esta página é exclusiva para administradores. Você não tem permissão para acessar esta área.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <ToastContainer position="top-right" theme="dark" />

      {/* Header com Título e Busca */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Qual Paciente Está Vendo?
        </h1>

        {/* Barra de Busca e Atualizar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar paciente por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={fetchPatients}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* Contador de resultados */}
        <p className="text-center text-gray-400 text-sm">
          {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Container da Tabela */}
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
                  <th className="py-4 md:py-6 px-2 md:px-4">Dieta</th>
                  <th className="py-4 md:py-6 px-2 md:px-4">Hidrat.</th>
                  <th className="py-4 md:py-6 px-2 md:px-4">Medicação</th>
                  <th className="py-4 md:py-6 px-2 md:px-4 hidden md:table-cell">Check-ins</th>
                  <th className="py-4 md:py-6 px-2 md:px-4">Ações</th>
                </tr>
              </thead>
              
              <tbody className="text-sm font-medium">
                {filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="border-t border-gray-400 hover:bg-gray-200 transition cursor-pointer"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <td className="py-3 md:py-4 px-2 md:px-4 text-center">
                      <PatientNameWithTooltip 
                        nome={patient.nome} 
                        email={patient.email} 
                        telefone={patient.telefone} 
                      />
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-center text-xs hidden sm:table-cell">
                      {patient.email}
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-center text-xs">
                      {formatDate(patient.dataCriacao)}
                    </td>
                    
                    {/* Indicadores de Status */}
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.dietaStatus || 'gray')}`} />
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.hidratacaoStatus || 'gray')}`} />
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4">
                      <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(patient.medicacaoStatus || 'gray')}`} />
                    </td>
                    
                    <td className="py-3 md:py-4 px-2 md:px-4 text-center hidden md:table-cell">
                      {patient.checkins}
                    </td>
                    <td className="py-3 md:py-4 px-2 md:px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePatientClick(patient);
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

      {/* Modais */}
      <PatientDetailModal
        isOpen={showPatientDetail}
        onClose={() => setShowPatientDetail(false)}
        patient={selectedPatient}
        onOpenEditUser={handleOpenEditUser}
        onOpenHealthSurvey={handleOpenHealthSurvey}
        onOpenDiet={handleOpenDiet}
        onOpenMedication={handleOpenMedication}
        onOpenTraining={handleOpenTraining}
      />

      {selectedPatient && (
        <>
          <EditUserModal
            mostrar={showEditUser}
            fechar={() => setShowEditUser(false)}
            foto={selectedPatient.foto}
            usuarioId={selectedPatient.id}
            nome={selectedPatient.nome}
            email={selectedPatient.email}
            telefone={selectedPatient.telefone}
            onSuccess={handleEditUserSuccess}
          />

          <HealthSurveyModal
            isOpen={showHealthSurvey}
            onClose={() => setShowHealthSurvey(false)}
            usuarioId={selectedPatient?.id}
          />

          <DietModal
            isOpen={showDiet}
            onClose={() => setShowDiet(false)}
            usuarioId={selectedPatient?.id}
          />

          <MedicationModal
            isOpen={showMedication}
            onClose={() => setShowMedication(false)}
            usuarioId={selectedPatient?.id}
          />

          <TrainingModal
            isOpen={showTraining}
            onClose={() => setShowTraining(false)}
            usuarioId={selectedPatient?.id}
          />
        </>
      )}
    </div>
  );
};

export default DashboardPacientes;