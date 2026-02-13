'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { getUserById, getUserAdherenceStats, UserAdherenceStats } from "@/api/api";
import EditUserModal from "@/components/modals/EditUserModal";
import { PostLoginModal, PostLoginData } from "@/components/modals/PostLoginModal";
import { toast, ToastContainer } from "react-toastify";

import {
  HiOutlineClipboardList,
  HiOutlineLightningBolt,
  HiOutlineScale,
} from "react-icons/hi";
import { IoWaterOutline } from "react-icons/io5";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  foto?: string;
  peso?: number;
  altura?: number;
  sexo?: string;
  meta?: number;
  admin?: boolean;
};

const baseProgressConfig = [
  { key: 'hidratacao' as const, label: "Hidratação", icon: IoWaterOutline },
  { key: 'treino' as const, label: "Treino", icon: HiOutlineLightningBolt },
  { key: 'dieta' as const, label: "Dieta", icon: HiOutlineClipboardList },
];

const mounjaroCard = { key: 'mounjaro' as const, label: "Caneta Emagrecedora", icon: HiOutlineScale };

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userStats, setUserStats] = useState<UserAdherenceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrar, setMostrar] = useState(false);
  const [isPostLoginModalOpen, setIsPostLoginModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("bari_token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const user = await getUserById(Number(id));
        setUsuario(user);

        if (!user.admin) {
          const stats = await getUserAdherenceStats(user.id);
          setUserStats(stats);
        }

        if (user.peso && user.altura && user.sexo && user.meta) return;
        setIsPostLoginModalOpen(true);
      } catch {
        toast.error("Erro ao carregar usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading || !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  return (
    <main className="min-h-screen relative text-white">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/fundoAcad.jpeg')" }}
      />
        <div className="absolute inset-0 backdrop-blur-sm" />

      <Navbar />

      {/* CARD CENTRAL */}
      <div className="relative z-10 flex justify-center pt-28 pb-24">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Purple glow */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -42%)',
              width: '520px',
              height: '320px',
              borderRadius: '22px',
              filter: 'blur(80px)',
              background: 'radial-gradient(circle at center, rgba(138,92,246,0.45), rgba(111,60,246,0.12) 40%, transparent 70%)',
              zIndex: 0,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              zIndex: 1,
              position: 'relative'
            }}
          >
          {/* PERFIL */}
          <div className="flex flex-col items-center text-center gap-2">
            <img
              src={usuario.foto || "/images/defaultAvatar.jpg"}
              className="w-24 h-24 rounded-full object-cover border-2 border-[#8B5CF6]"
              style={{ marginTop: '-70px' }}
            />

            <h2 className="text-xl font-semibold">{usuario.nome}</h2>

            <p className="text-sm text-white/70">{usuario.email}</p>

            <button
              onClick={() => setMostrar(true)}
              className="
                mt-3 px-6 py-2 rounded-full
                bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]
                shadow-[0_0_20px_rgba(138,92,246,0.6)]
                hover:scale-105 transition
              "
            >
              Atualizar meus dados
            </button>
          </div>

          {/* PROGRESSO */}
          {!usuario.admin && userStats && (
            <>
              <h3 className="mt-8 mb-4 text-lg font-semibold text-white/90">
                Seu Progresso
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...baseProgressConfig, ...(userStats.temMounjaro ? [mounjaroCard] : [])].map(({ key, label, icon: Icon }, index) => {
                  const metric = userStats[key];
                  const percent = metric?.porcentagem ?? 0;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.15 }}
                      whileHover={{ scale: 1.03 }}
                      className="
                        rounded-xl
                        bg-white/5
                        border border-white/10
                        p-4
                        hover:bg-white/10
                        transition
                      "
                    >
                      <div className="flex items-center gap-2 text-[#8B5CF6] font-medium">
                        <Icon className="w-5 h-5" />
                        {label}
                      </div>

                      <p className="mt-2 text-sm text-white/70">
                        Você ainda não registrou hoje
                      </p>

                      <span className="text-xs text-[#8B5CF6]">
                        Vamos começar?
                      </span>

                      <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
        </div>
      </div>

      <EditUserModal
        mostrar={mostrar}
        fechar={() => setMostrar(false)}
        usuarioId={usuario.id}
        nome={usuario.nome}
        email={usuario.email}
        telefone={usuario.telefone}
        foto={usuario.foto}
        onSuccess={() => window.location.reload()}
      />

      <PostLoginModal
        isOpen={isPostLoginModalOpen}
        onCloseAction={() => setIsPostLoginModalOpen(false)}
        onFinishAction={() => window.location.reload()}
        usuarioId={usuario.id}
      />

      <ToastContainer />
    </main>
  );
}