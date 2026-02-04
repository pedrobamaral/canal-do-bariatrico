'use client';

import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserEdit, FaHeartbeat, FaUtensils, FaPills, FaDumbbell, FaEye, FaSearch, FaSync, FaLock } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

// API
import { getAllUsers, getCurrentUser, Usuario, getUserAdherenceStats, UserAdherenceStats } from '@/api/api';

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

import PatientsTable from '@/components/PatientsTable';

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

  // Buscar pacientes com estatísticas reais de adesão
  const fetchPatients = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const data = await getAllUsers();
      
      // Busca estatísticas de adesão para cada paciente em paralelo
      const patientsWithStats = await Promise.all(
        data.map(async (user: Usuario) => {
          try {
            const stats = await getUserAdherenceStats(user.id);
            return {
              ...user,
              dietaStatus: stats?.dieta.status || 'gray',
              hidratacaoStatus: stats?.hidratacao.status || 'gray',
              medicacaoStatus: stats?.medicacao.status || 'gray',
              checkins: stats ? `${stats.diasComDaily}/${stats.totalDiaCiclos}` : '0/0',
              adesao: stats && stats.dieta.porcentagem !== null 
                ? `${Math.round((
                    (stats.dieta.porcentagem || 0) + 
                    (stats.hidratacao.porcentagem || 0) + 
                    (stats.medicacao.porcentagem || 0)
                  ) / 3)}%` 
                : 'Sem dados',
              // Guardar stats completas para uso no modal
              adherenceStats: stats,
            };
          } catch (error) {
            // Se falhar ao buscar stats, retorna valores padrão
            return {
              ...user,
              dietaStatus: 'gray' as const,
              hidratacaoStatus: 'gray' as const,
              medicacaoStatus: 'gray' as const,
              checkins: '0/0',
              adesao: 'Sem dados',
            };
          }
        })
      );
      
      setPatients(patientsWithStats);
      setFilteredPatients(patientsWithStats);
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

      {/* Container da Tabela (extraído para componente) */}
      <PatientsTable
        filteredPatients={filteredPatients}
        loading={loading}
        onPatientClick={handlePatientClick}
        formatDate={formatDate}
        getStatusColor={getStatusColor}
      />

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