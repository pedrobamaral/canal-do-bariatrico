'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getUserById } from "@/api/api";
import EditUserModal from "@/components/modals/EditUserModal";
import { toast, ToastContainer } from "react-toastify";

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
  meta?: string;
  admin?: boolean;
  ativo?: boolean;
  dataCriacao?: Date;
  foto?: string;
};

const EmailIcon = () => (
  <svg className="h-3 w-4 translate-y-0.5" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.04074 16.3259C1.47954 16.3259 0.999283 16.1263 0.599978 15.727C0.200673 15.3277 0.000680247 14.8471 0 14.2852V2.04074C0 1.47954 0.199993 0.999283 0.599978 0.599978C0.999963 0.200673 1.48022 0.000680247 2.04074 0H18.3667C18.9279 0 19.4085 0.199992 19.8084 0.599978C20.2084 0.999963 20.4081 1.48022 20.4074 2.04074V14.2852C20.4074 14.8464 20.2078 15.327 19.8084 15.727C19.4091 16.127 18.9285 16.3266 18.3667 16.3259H2.04074ZM10.2037 9.18333L18.3667 4.08148V2.04074L10.2037 7.14259L2.04074 2.04074V4.08148L10.2037 9.18333Z" 
      fill="currentColor"
      fillOpacity="0.6"
    />
  </svg>
);

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [Dono, setDono] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [error, setError] = useState(false);

  const fetchAllPageData = async () => {
    if (!id) return;

    try {
      const userData = await getUserById(Number(id));
      console.log("=== DADOS DO USUÁRIO ===");
      console.log("userData:", userData);
      console.log("userData.telefone:", userData.telefone);
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
            {usuario.telefone && <p className="text-sm text-gray-600">Tel: {usuario.telefone}</p>}
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
