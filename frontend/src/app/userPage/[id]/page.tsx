'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PatientsTable, { PatientData } from '@/components/PatientsTable';
import { getAllUsers, getUserAdherenceStats, UserAdherenceStats } from '@/api/api';
import { getUserById } from "@/api/api";
import EditUserModal from "@/components/modals/EditUserModal";
import { toast, ToastContainer } from "react-toastify";
import {
  HiOutlineClipboardList,
  HiOutlineLightningBolt,
  HiOutlineScale,
} from "react-icons/hi";
import { IoWaterOutline } from "react-icons/io5";

// Migração de token antigo para novo no root layout
// Este efeito seria normalmente no layout.tsx, mas colocamos aqui por segurança
const migrateTokenIfNeeded = () => {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken');
    const bariToken = localStorage.getItem('bari_token');
    
    if (authToken && !bariToken) {
      localStorage.setItem('bari_token', authToken);
      localStorage.removeItem('authToken');
    }
  }
};

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  sexo?: string;
  peso?: number;
  altura?: number;
  Nascimento?: Date;
  massa_magra?: number;
  meta?: number;
  admin?: boolean;
  ativo?: boolean;
  dataCriacao?: Date;
  foto?: string;
};

const formatPhoneNumber = (value?: string | null, countryCode = "+55") => {
  if (!value) return "Telefone não informado";

  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, "");
  const codeDigits = countryCode.replace(/\D/g, "");

  // Se o backend já enviou o código do país, remova-o temporariamente para formatar o número local
  let local = numbers;
  if (codeDigits && numbers.startsWith(codeDigits)) {
    local = numbers.slice(codeDigits.length);
  }

  // Garantir os últimos 11 dígitos do número local (DDD + 9 dígitos)
  const limited = local.slice(-11);

  if (limited.length === 0) return "Telefone não informado";

  // Aplica a formatação (XX) XXXXX-XXXX
  let maskedLocal = "";
  if (limited.length > 10) {
    maskedLocal = limited.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (limited.length > 6) {
    maskedLocal = limited.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (limited.length > 2) {
    maskedLocal = limited.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
  } else {
    maskedLocal = limited.replace(/^(\d*)/, "($1");
  }

  return `${countryCode} ${maskedLocal}`.trim();
};

const EmailIcon = () => (
  <svg className="h-3 w-4 translate-y-0.5" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.04074 16.3259C1.47954 16.3259 0.999283 16.1263 0.599978 15.727C0.200673 15.3277 0.000680247 14.8471 0 14.2852V2.04074C0 1.47954 0.199993 0.999283 0.599978 0.599978C0.999963 0.200673 1.48022 0.000680247 2.04074 0H18.3667C18.9279 0 19.4085 0.199992 19.8084 0.599978C20.2084 0.999963 20.4081 1.48022 20.4074 2.04074V14.2852C20.4074 14.8464 20.2078 15.327 19.8084 15.727C19.4091 16.127 18.9285 16.3266 18.3667 16.3259H2.04074ZM10.2037 9.18333L18.3667 4.08148V2.04074L10.2037 7.14259L2.04074 2.04074V4.08148L10.2037 9.18333Z" 
      fill="currentColor"
      fillOpacity="0.6"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-3 w-4 translate-y-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" 
      fill="currentColor"
      fillOpacity="0.6"
    />
  </svg>
);

// Configuração das 4 métricas de progresso
const progressConfig = [
  { key: 'hidratacao' as const, label: "Hidratação", icon: IoWaterOutline },
  { key: 'dieta' as const, label: "Dieta", icon: HiOutlineClipboardList },
  { key: 'treino' as const, label: "Treino", icon: HiOutlineLightningBolt },
  { key: 'bioimpedancia' as const, label: "Bioimpedância", icon: HiOutlineScale },
];

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientData[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [Dono, setDono] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState(false);
  const [userStats, setUserStats] = useState<UserAdherenceStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchAllPageData = async () => {
    if (!id) return;

    try {
      const userData = await getUserById(Number(id));
      setUsuario(userData);
      setError(false);

      const token = localStorage.getItem("bari_token");
      if (token && userData) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setDono(payload.sub == userData.id);
        } catch (err) {
          console.error("Token Inválido");
          setDono(false);
        }
      }
    } catch (err: any) {
      console.error("Erro ao buscar dados:", err);
      setError(true);
      setUsuario(null);
      
      const token = localStorage.getItem("bari_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.sub == Number(id)) {
            localStorage.removeItem('bari_token');
            toast.error('Sua sessão expirou. Faça login novamente.');
            setTimeout(() => router.push('/login'), 2000);
          }
        } catch (e) {
          console.error('Erro ao verificar token:', e);
        }
      }
    }
  };

  useEffect(() => {
    migrateTokenIfNeeded();
    
    // Verificar autenticação antes de qualquer coisa
    const token = localStorage.getItem("bari_token");
    if (!token) {
      toast.error('Você precisa estar logado para acessar esta página.');
      router.push('/login');
      return;
    }
    
    if (!id) return;
    
    const fetchInitialData = async () => {
      setLoading(true);
      
      try {
        const userData = await getUserById(Number(id));
        
        setUsuario(userData);
        setError(false);

        const token = localStorage.getItem("bari_token");
        if (token && userData) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setDono(payload.sub == userData.id);
          } catch (err) {
            console.error("Token Inválido");
            setDono(false);
          }
        }
      } catch (err: any) {
        console.error("Erro ao buscar dados:", err);
        setError(true);
        setUsuario(null);
        
        const token = localStorage.getItem("bari_token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.sub == Number(id)) {
              localStorage.removeItem('bari_token');
              toast.error('Sua sessão expirou. Faça login novamente.');
              setTimeout(() => router.push('/login'), 2000);
            }
          } catch (e) {
            console.error('Erro ao verificar token:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, router]);

  // Se for admin, buscar pacientes para exibir a tabela dentro da userPage
  useEffect(() => {
    const fetchPatients = async () => {
      if (!usuario || !usuario.admin) return;
      setLoadingPatients(true);
      try {
        const data = await getAllUsers();
        
        // Busca estatísticas de adesão para cada paciente em paralelo
        const patientsWithStats = await Promise.all(
          data.map(async (user: any) => {
            try {
              const stats = await getUserAdherenceStats(user.id);
              return {
                ...user,
                dietaStatus: stats?.dieta.status || 'gray',
                hidratacaoStatus: stats?.hidratacao.status || 'gray',
                treinoStatus: stats?.treino.status || 'gray',
                bioimpedanciaStatus: stats?.bioimpedancia.status || 'gray',
                checkins: stats ? `${stats.diasComDaily}/${stats.totalDiaCiclos}` : '0/0',
                adesao: stats && stats.dieta.porcentagem !== null 
                  ? `${Math.round((
                      (stats.dieta.porcentagem || 0) + 
                      (stats.hidratacao.porcentagem || 0) + 
                      (stats.treino.porcentagem || 0) +
                      (stats.bioimpedancia.porcentagem || 0)
                    ) / 4)}%` 
                  : 'Sem dados',
              };
            } catch (error) {
              return {
                ...user,
                dietaStatus: 'gray' as const,
                hidratacaoStatus: 'gray' as const,
                treinoStatus: 'gray' as const,
                bioimpedanciaStatus: 'gray' as const,
                checkins: '0/0',
                adesao: 'Sem dados',
              };
            }
          })
        );
        
        setPatients(patientsWithStats);
        setFilteredPatients(patientsWithStats);
      } catch (e) {
        console.error('Erro ao buscar pacientes:', e);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [usuario]);

  // Se NÃO for admin, buscar stats do próprio usuário para exibir as barras de progresso
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!usuario || usuario.admin) return;
      setLoadingStats(true);
      try {
        const stats = await getUserAdherenceStats(usuario.id);
        setUserStats(stats);
      } catch (e) {
        console.error('Erro ao buscar stats do usuário:', e);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [usuario]);

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-400';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  const handlePatientClick = (patient: PatientData) => {
    // navegar para a página do paciente ao clicar
    router.push(`/userPage/${patient.id}`);
  };


  if (loading) return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-center text-2xl text-[#6A38F3] font-sans font-bold">Carregando usuário...</p>
    </main>
  );
  
  if (error || !usuario) return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-2xl text-red-500 font-sans font-bold mb-4">Usuário não encontrado</p>
        <button 
          onClick={() => router.push('/')} 
          className="px-6 py-2 bg-[#6A38F3] text-white rounded-full hover:bg-[#5c2fe0] transition"
        >
          Voltar para Home
        </button>
      </div>
    </main>
  );
  // Não fazemos return aqui — iremos mostrar a tabela dentro da mesma página

  return (
    <main className="min-h-screen text-black bg-white pb-16">
      <Navbar />

      <div className="w-full h-70 bg-black relative flex items-end px-16"></div>

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="absolute -top-[104px] left-24 flex flex-col items-start">
          <img
            src={usuario.foto || "/images/defaultAvatar.jpg"}
            alt="Foto de Perfil"
            className="w-40 h-40 rounded-full object-cover border-4 border-back"
            onError={(e) => { e.currentTarget.src = "/images/bari_padrao.png"; }}
          />

          <div className="mt-1 font-sans text-left flex flex-col gap-0.5">
            <h2 className="text-3xl font-semibold ">{usuario.nome}</h2>
            <p className="flex items-center gap-1">
              <EmailIcon />
              {usuario.email}
            </p>
            <p className="flex items-center gap-1">
              <PhoneIcon />
              {formatPhoneNumber(usuario.telefone)}
            </p>
          </div>
        </div>

        {Dono && (
          <div>
            <button 
              onClick={() => setMostrar(true)}
              className="absolute top-5 flex right-20 bg-[#6A38F3] border border-[#2563EB] text-white px-20 py-2 rounded-full hover:bg-[#2563EB] hover:text-white transition hover:cursor-pointer font-sans tracking-wider"
            >
              Editar Perfil
            </button>
          </div>
        )}
      </div>

      {/* Espaçador para reservar área do perfil (evita sobreposição com a tabela) */}
      <div className="h-1" />

      {/* PROGRESSO ou TABELA (se admin) */}
      {usuario.admin ? (
        <div className="max-w-6xl mx-auto p-6 mt-44">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantidade de pacientes ativos: <span className="font-semibold">{patients.filter((p) => !p.admin).length}</span></h3>
          <PatientsTable
            filteredPatients={filteredPatients}
            loading={loadingPatients}
            onPatientClick={handlePatientClick}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 mt-48">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Seu Progresso</h3>
          
          {loadingStats ? (
            <p className="text-center text-gray-500">Carregando estatísticas...</p>
          ) : userStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {progressConfig.map(({ key, label, icon: Icon }) => {
                const metric = userStats[key];
                const value = metric?.porcentagem ?? 0;
                
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[#6A38F3] font-semibold">
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {metric?.porcentagem !== null ? `${value}%` : 'Sem dados'}
                        <span className="text-xs text-gray-400 ml-1">
                          ({metric?.cumprida ?? 0}/{metric?.total ?? 0})
                        </span>
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6] rounded-full transition-all duration-500"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhum dado de progresso disponível ainda.</p>
          )}
        </div>
      )}


      <EditUserModal
        mostrar={mostrar}
        fechar={() => setMostrar(false)}
        foto={usuario.foto}
        usuarioId={usuario.id}
        nome={usuario.nome}
        email={usuario.email}
        telefone={usuario.telefone}
        onSuccess={() => fetchAllPageData()}
      />      
      
      <ToastContainer/>
    </main>
  );
}
