import React, { FormEvent, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaPen,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaLock,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import EditUserPass from "./UpdatePassModal";

interface EditUserModalProps {
  mostrar: boolean;
  fechar: () => void;
  usuarioId: number;
  nome: string;
  email: string;
  telefone?: string;
  foto?: string | null;
  onSuccess?: () => void;
}

export default function EditUserModal({
  mostrar,
  fechar,
  usuarioId,
  nome: nomeProp,
  email: emailProp,
  telefone: telefoneProp,
  foto: fotoProp,
  onSuccess,
}: EditUserModalProps) {
  const [name, setName] = useState(nomeProp || "");
  const [email, setEmail] = useState(emailProp || "");
  const [telefone, setTelefone] = useState(telefoneProp || "");
  const [imagePreview, setImagePreview] = useState<string>(fotoProp || "/images/defaultAvatar.jpg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarModalPass, setMostrarPass] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mostrar) {
      setName(nomeProp || "");
      setEmail(emailProp || "");
      setTelefone(telefoneProp || "");
      setImagePreview(fotoProp || "/images/defaultAvatar.jpg");
      setImageFile(null);
    }
  }, [mostrar, nomeProp, emailProp, telefoneProp, fotoProp]);

  const handleClose = () => {
    if (loading) return;
    fechar();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx 20MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result));
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nome", name);
      formData.append("email", email);
      formData.append("telefone", telefone);
      if (imageFile) formData.append("avatar", imageFile);

      const res = await fetch(`/api/users/${usuarioId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro ao atualizar usuário");
      }

      toast.success("Perfil atualizado");
      onSuccess?.();
      fechar();
    } catch (err: any) {
      const msg = err?.message || "Erro ao atualizar";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${usuarioId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar conta");
      toast.success("Conta deletada");
      // optional: redirect or call onSuccess
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao deletar conta");
    } finally {
      setLoading(false);
    }
  };

  if (!mostrar) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Overlay */}
        <div onClick={handleClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 40, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl p-8 text-white"
          style={{
            background: "rgba(20,15,35,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Fechar */}
          <button onClick={handleClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition">
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div className="relative flex justify-center -mt-20 mb-4">
            <div className="relative">
              <img src={imagePreview} alt="avatar" className="w-24 h-24 rounded-full object-cover border-2 border-[#8B5CF6]" />

              <label htmlFor="avatar-input" className="absolute bottom-0 right-0 bg-[#8B5CF6] p-2 rounded-full cursor-pointer hover:scale-105 transition">
                <FaPen className="text-white text-sm" />
              </label>

              <input id="avatar-input" ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-center mb-6">Editar perfil</h2>

          {/* Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            {[
              { value: name, set: setName, icon: FaUser, placeholder: "Nome", type: "text" },
              { value: email, set: setEmail, icon: FaEnvelope, placeholder: "Email", type: "email" },
              { value: telefone, set: setTelefone, icon: FaPhoneAlt, placeholder: "Telefone", type: "tel" },
            ].map(({ value, set, icon: Icon, placeholder, type }, i) => (
              <div key={i} className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={value}
                  onChange={(e: any) => set(e.target?.value ?? e)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full rounded-full bg-white/5 border border-white/10 px-4 py-3 pl-11 text-white placeholder-white/40 focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            ))}

            {/* Botões */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-medium bg-gradient-to-r from-[#6A38F3] to-[#8B5CF6] hover:scale-105 transition disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>

              <button type="button" onClick={() => setMostrarPass(true)} className="w-full py-3 rounded-full border border-white/20 hover:bg-white/10 transition flex items-center justify-center gap-2">
                <FaLock /> Alterar senha
              </button>

              <button type="button" onClick={handleDelete} className="w-full py-3 rounded-full border border-red-500/40 text-red-400 hover:bg-red-500/20 transition flex items-center justify-center gap-2">
                <FaTrash /> Deletar conta
              </button>
            </div>
          </form>

          <EditUserPass mostrar={mostrarModalPass} voltar={() => setMostrarPass(false)} usuarioId={usuarioId} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}