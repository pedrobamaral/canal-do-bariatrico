'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { getUserById, getUserAdherenceStats, UserAdherenceStats, getUserFotos, saveUserFotos } from "@/api/api";
import EditUserModal from "@/components/modals/EditUserModal";
import PostLoginModal from "@/components/modals/PostLoginModal";
import { toast, ToastContainer } from "react-toastify";

import {
  HiOutlineClipboardList,
  HiOutlineLightningBolt,
} from "react-icons/hi";

import { IoWaterOutline } from "react-icons/io5";
import { FaPills, FaPenAlt, FaCamera, FaArrowRight, FaTrash, FaImages, FaTimes } from "react-icons/fa";

export type Usuario = {
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

const mounjaroCard = { key: 'mounjaro' as const, label: "Caneta Emagrecedora", icon: FaPenAlt };
const manipuladoCard = { key: 'manipulado' as const, label: "Manipulado", icon: FaPills };

/* ═══ FOTOS COMPARATIVAS ═══ */
type FotoAngulo = 'costas' | 'frente' | 'lado';
type FotoMomento = 'antes' | 'depois';
type FotoKey = `${FotoAngulo}_${FotoMomento}`;

const ANGULOS: { key: FotoAngulo; label: string }[] = [
  { key: 'costas', label: 'Costas' },
  { key: 'frente', label: 'Frente' },
  { key: 'lado', label: 'Lado' },
];

/* Silhuetas SVG inline para cada ângulo */
const Silhouette: React.FC<{ angulo: FotoAngulo; className?: string }> = ({ angulo, className }) => {
  const common = "opacity-30";
  if (angulo === 'costas') {
    return (
      <svg viewBox="0 0 80 120" className={`${common} ${className}`} fill="currentColor">
        <ellipse cx="40" cy="16" rx="12" ry="14" />
        <rect x="28" y="30" width="24" height="4" rx="2" />
        <path d="M24 34 C20 36, 16 50, 18 64 L22 64 L24 42 Z" />
        <path d="M56 34 C60 36, 64 50, 62 64 L58 64 L56 42 Z" />
        <path d="M28 34 L28 80 C28 84, 30 86, 32 88 L32 110 L38 110 L38 86 L42 86 L42 110 L48 110 L48 88 C50 86, 52 84, 52 80 L52 34 Z" />
      </svg>
    );
  }
  if (angulo === 'frente') {
    return (
      <svg viewBox="0 0 80 120" className={`${common} ${className}`} fill="currentColor">
        <ellipse cx="40" cy="16" rx="12" ry="14" />
        <rect x="28" y="30" width="24" height="4" rx="2" />
        <path d="M24 34 C20 36, 14 48, 16 62 L22 62 L26 42 Z" />
        <path d="M56 34 C60 36, 66 48, 64 62 L58 62 L54 42 Z" />
        <path d="M28 34 L28 78 C28 82, 30 84, 32 86 L32 110 L38 110 L38 84 L42 84 L42 110 L48 110 L48 86 C50 84, 52 82, 52 78 L52 34 Z" />
      </svg>
    );
  }
  // lado
  return (
    <svg viewBox="0 0 80 120" className={`${common} ${className}`} fill="currentColor">
      <ellipse cx="40" cy="16" rx="11" ry="14" />
      <path d="M36 30 L44 30 L48 34 L48 80 C48 84, 46 86, 44 88 L44 110 L38 110 L38 86 L36 86 L36 110 L30 110 L30 88 C28 86, 26 84, 26 80 L26 34 Z" />
      <path d="M48 36 C54 38, 58 48, 56 60 L50 58 L48 40 Z" />
    </svg>
  );
};

/* Comprime imagem via canvas. Redimensiona se necessário e ajusta qualidade JPEG. */
function compressImage(file: File, maxWidth = 1200, maxSizeMB = 1): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;

        // Redimensiona mantendo proporção
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        // Tenta qualidades decrescentes até ficar abaixo do limite
        let quality = 0.85;
        let result = canvas.toDataURL('image/jpeg', quality);

        while (result.length > maxSizeMB * 1024 * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(result);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/* Componente de slot de foto */
const PhotoSlot: React.FC<{
  angulo: FotoAngulo;
  momento: FotoMomento;
  foto: string | null;
  onUpload: (base64: string) => void;
  onRemove: () => void;
}> = ({ angulo, momento, foto, onUpload, onRemove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx 20MB)");
      return;
    }
    try {
      const compressed = await compressImage(file, 1200, 1);
      onUpload(compressed);
    } catch {
      toast.error("Erro ao processar imagem");
    }
    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        data-driver={`photo-${angulo}-${momento}`}
        onClick={() => !foto && inputRef.current?.click()}
        className={`
          relative w-28 h-36 md:w-[120px] md:h-[140px] rounded-xl flex flex-col items-center justify-center
          transition-all duration-200 group overflow-hidden
          ${foto
            ? "border border-[#8B5CF6]/40"
            : "border-2 border-dashed border-white/20 hover:border-[#8B5CF6]/50 cursor-pointer"
          }
        `}
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {foto ? (
          <>
            <img src={foto} alt={`${angulo} ${momento}`} className="w-full h-full object-cover rounded-xl" />
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaTrash className="w-2.5 h-2.5 text-white" />
            </button>
          </>
        ) : (
          <>
            <div className="relative w-14 h-14 flex items-center justify-center">
              <Silhouette angulo={angulo} className="w-full h-full text-white" />
              <FaCamera className="absolute bottom-0 right-0 w-4 h-4 text-white/50" />
            </div>
            <span className="text-[10px] text-white/40 mt-1">Envie sua foto</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

export default function UserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userStats, setUserStats] = useState<UserAdherenceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mostrar, setMostrar] = useState(false);
  const [isPostLoginModalOpen, setIsPostLoginModalOpen] = useState(false);
  const [isFotoModalOpen, setIsFotoModalOpen] = useState(false);

  /* ── Fotos comparativas (persistidas no banco de dados) ── */
  const [fotos, setFotos] = useState<Record<FotoKey, string | null>>({
    costas_antes: null, costas_depois: null,
    frente_antes: null, frente_depois: null,
    lado_antes: null, lado_depois: null,
  });

  const updateFoto = useCallback(async (key: FotoKey, value: string | null) => {
    setFotos(prev => ({ ...prev, [key]: value }));
    const userId = Number(id);
    const ok = await saveUserFotos(userId, { [key]: value });
    if (!ok) {
      toast.error("Erro ao salvar foto");
      // Reverte em caso de falha
      setFotos(prev => ({ ...prev, [key]: prev[key] }));
    }
  }, [id]);

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

          const fotosData = await getUserFotos(user.id);
          if (fotosData) setFotos(fotosData as Record<FotoKey, string | null>);
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

  // start photos tour (runs after post-login modal completes)
  const startPhotosTour = async () => {
    if (typeof window === 'undefined') return;
    const seen = localStorage.getItem('bari_photos_tour_shown');
    if (seen) return;

    // don't open the modal yet — highlight the fotos card first
    setTimeout(async () => {
      console.log('startPhotosTour: initializing tour');
      try {
        // inject driver.js stylesheet from CDN if not present and wait for it to load
        const cssId = 'driverjs-cdn-css';
        let link: HTMLLinkElement | null = null;
        if (typeof document !== 'undefined' && !document.getElementById(cssId)) {
          link = document.createElement('link');
          link.id = cssId;
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/driver.js/dist/driver.min.css';
          document.head.appendChild(link);

          // wait for stylesheet to load (or timeout)
          await new Promise<void>((resolve) => {
            let done = false;
            const finish = () => { if (!done) { done = true; resolve(); } };
            link!.onload = finish;
            link!.onerror = finish;
            // safety timeout
            setTimeout(finish, 700);
          });
        }

        const mod = await import('driver.js');
        console.log('startPhotosTour: driver.js loaded');
        const DriverCtor: any = mod.default || mod;
        const driver: any = new DriverCtor({
          opacity: 0.7,
          closeBtnText: 'Fechar',
          nextBtnText: 'Próximo',
          prevBtnText: 'Anterior',
        });

        driver.defineSteps([
          {
            element: '[data-driver="fotos-card"]',
            popover: {
              title: 'Suas Fotos',
              description: 'Aqui você pode enviar suas fotos de antes e depois para acompanhar a evolução.',
              position: 'bottom'
            }
          },
          {
            element: '[data-driver="photo-costas-antes"]',
            popover: {
              title: 'Envie a foto - Costas (Antes)',
              description: 'Clique ou toque aqui para enviar sua foto do ângulo Costas (Antes).',
              position: 'right'
            }
          },
          {
            element: '[data-driver="photo-frente-antes"]',
            popover: {
              title: 'Envie a foto - Frente (Antes)',
              description: 'Faça o upload da foto frontal.',
              position: 'right'
            }
          },
          {
            element: '[data-driver="photo-lado-antes"]',
            popover: {
              title: 'Envie a foto - Lado (Antes)',
              description: 'Por fim, envie a foto do lado.',
              position: 'right'
            }
          }
        ]);

        localStorage.setItem('bari_photos_tour_shown', '1');
        // start highlighting the fotos card first
        driver.start();
        console.log('startPhotosTour: driver started');

        // when user moves to next step, open the photos modal so subsequent steps are visible
        try { driver.on('next', () => setIsFotoModalOpen(true)); } catch {}

        try { driver.on('stop', () => setIsFotoModalOpen(false)); } catch {}
        try { driver.on('reset', () => setIsFotoModalOpen(false)); } catch {}
        try { driver.on('complete', () => setIsFotoModalOpen(false)); } catch {}
      } catch (err) {
        console.error('Driver tour failed', err);
      }
    }, 400);
  };

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
      <div className="relative z-10 flex justify-center pt-20 md:pt-28 pb-12 md:pb-24 px-4">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Purple glow */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[42%] w-[90vw] max-w-[520px] h-[40vw] max-h-[320px] rounded-[22px] filter blur-2xl z-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(138,92,246,0.45), rgba(111,60,246,0.12) 40%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md rounded-2xl p-4 sm:p-6"
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
              className="w-24 h-24 rounded-full object-cover border-2 border-[#8B5CF6] -mt-16 md:-mt-20"
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setIsFotoModalOpen(true)}
                  data-driver="fotos-card"
                  className="
                    rounded-xl
                    bg-white/5
                    border border-white/10
                    p-4
                    hover:bg-white/10
                    transition
                    cursor-pointer
                  "
                >
                  <div className="flex items-center gap-2 text-[#8B5CF6] font-medium">
                    <FaImages className="w-5 h-5" />
                    Suas Fotos
                  </div>

                  <p className="mt-2 text-sm text-white/70">
                    Compare seu antes e depois
                  </p>

                  <span className="text-xs text-[#8B5CF6]">
                    Toque para abrir
                  </span>

                  <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((Object.values(fotos).filter(Boolean).length / 6) * 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6]"
                    />
                  </div>
                </motion.div>

                {[...baseProgressConfig, ...(userStats.temMounjaro ? [mounjaroCard] : []), ...(userStats.temManipulado ? [manipuladoCard] : [])].map(({ key, label, icon: Icon }, index) => {
                  const metric = userStats[key];
                  const percent = metric?.porcentagem ?? 0;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 1) * 0.15 }}
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

      {/* ═══ MODAL SUAS FOTOS ═══ */}
      {isFotoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFotoModalOpen(false)}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(20,15,35,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setIsFotoModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-center text-white/90 mb-6">
              Suas Fotos
            </h3>

            <div className="space-y-6">
              {ANGULOS.map(({ key: angulo, label }) => (
                <div key={angulo}>
                  <div className="flex items-center gap-4">
                    <div className="w-16 shrink-0 text-sm font-semibold text-white/70 text-right">
                      {label}
                    </div>

                    <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-[#8B5CF6]">Antes</span>
                        <PhotoSlot
                          angulo={angulo}
                          momento="antes"
                          foto={fotos[`${angulo}_antes`]}
                          onUpload={(b64) => updateFoto(`${angulo}_antes`, b64)}
                          onRemove={() => updateFoto(`${angulo}_antes`, null)}
                        />
                      </div>

                      <FaArrowRight className="text-white/30 w-4 h-4 mt-5 shrink-0" />

                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-bold text-[#8B5CF6]">Depois</span>
                        <PhotoSlot
                          angulo={angulo}
                          momento="depois"
                          foto={fotos[`${angulo}_depois`]}
                          onUpload={(b64) => updateFoto(`${angulo}_depois`, b64)}
                          onRemove={() => updateFoto(`${angulo}_depois`, null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

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
        onFinishAction={() => {
          setIsPostLoginModalOpen(false);
          // start the photos tour after the user completes post-login
          startPhotosTour();
        }}
        usuarioId={usuario.id}
        usuario={usuario}
      />

      <ToastContainer />
    </main>
  );
}