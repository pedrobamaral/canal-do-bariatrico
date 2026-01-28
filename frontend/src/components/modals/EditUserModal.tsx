'use client';
import { deleteUser, updateData } from "@/api/api";
import { FormEvent, useState, ChangeEvent } from "react";
import React from "react";
import { FaPhoneAlt, FaEnvelope, FaLock, FaPen, FaTimes, FaTrash, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import EditUserPass from "./UpdatePassModal";
import { useRouter } from "next/navigation";

// Função de formatação de telefone
const formatPhoneNumber = (value: string) => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, "");
  
  // Limita a 11 dígitos (DDD + 9 números)
  const limited = numbers.slice(0, 11);

  // Aplica a formatação (XX) XXXXX-XXXX
  if (limited.length > 10) {
    return limited.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (limited.length > 6) {
    return limited.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (limited.length > 2) {
    return limited.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
  } else {
    return limited.replace(/^(\d*)/, "($1");
  }
};

interface EditUserModalProps {
    mostrar: boolean;
    fechar: () => void;
    foto: string | undefined | null;
    usuarioId: number;
    nome?: string;
    email?: string;
    telefone?: string;
    onSuccess: () => void;
}

export default function EditUserModal({mostrar, fechar, foto, usuarioId, nome, email: emailProp, telefone: telefoneProp, onSuccess}: EditUserModalProps) {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [mostrarModalPass, setMostrarPass] = useState(false)

    // Atualizar preview da imagem quando a foto do usuário mudar ou quando um arquivo for selecionado
    React.useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (foto) {
            setImagePreview(foto);
        } else {
            setImagePreview("/images/defaultAvatar.jpg");
        }
    }, [foto, selectedFile]);

    // Carregar dados do usuário quando o modal abre
    React.useEffect(() => {
        if (mostrar) {
            console.log('Carregando dados do usuário:', { nome, emailProp, telefoneProp });
            setName(nome || '');
            setEmail(emailProp || '');
            // Formatar telefone ao carregar
            const formattedPhone = telefoneProp ? formatPhoneNumber(telefoneProp) : '';
            setTelefone(formattedPhone);
            setSelectedFile(null);
        }
    }, [mostrar, nome, emailProp, telefoneProp]);


    const compressAndConvertImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Redimensionar para no máximo 400x400
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 400;
                    
                    if (width > height) {
                        if (width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Erro ao processar imagem'));
                        return;
                    }
                    
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Converter para base64 com qualidade reduzida (0.7 = 70%)
                    const base64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(base64);
                };
                
                img.onerror = () => reject(new Error('Erro ao carregar imagem'));
                img.src = e.target?.result as string;
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsDataURL(file);
        });
    }

    const handleClose = () => {
        setName('');
        setEmail('');
        setTelefone('');
        setSelectedFile(null);
        fechar();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
        }
    };

    const handleTelefoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setTelefone(formatted);
    };

    const handleUpdate = async (e:FormEvent) => {
        e.preventDefault();

        if (!name && !email && !telefone && !selectedFile) {
            console.log("Nenhum dado preenchido");
            toast.warn('Por favor, preencha algum campo.');
            return;
        }

        setLoading(true);

        try {
            let fotoBase64 = null;

            if (selectedFile) {
                toast.info('Comprimindo imagem...');
                fotoBase64 = await compressAndConvertImage(selectedFile);
                console.log('Tamanho da imagem comprimida:', (fotoBase64.length / 1024).toFixed(2), 'KB');
            }

            const data: any = {};
            if (name.trim()) data.nome = name;
            if (email.trim()) data.email = email;
            if (telefone.trim()) {
                // Remove símbolos para enviar apenas números
                const phoneNumbers = telefone.replace(/\D/g, "");
                data.telefone = phoneNumbers;
            }
            if (fotoBase64) data.foto = fotoBase64;

            console.log("Enviando dados para update:", data);

            await updateData(usuarioId, data);

            toast.success('Dados atualizados com sucesso!');
            onSuccess(); 
            handleClose();

        } catch (err:any) {
            console.error(err);
            const message = err?.response?.data?.message || "Erro ao atualizar dados!";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Tem certeza que deseja deletar a conta? Isso é permanente e vai apagar todos os dados do usuário!")) return;

        try {
            await deleteUser(usuarioId);
            toast.warning('Usuário deletado com sucesso!');
            localStorage.removeItem('bari_token');
            localStorage.removeItem('bari_user');
            window.dispatchEvent(new Event('auth-changed'));
            router.push('/');
        } catch (err:any) {
            toast.error("Erro ao deletar");
        }
    }   

    if (!mostrar) return null;

    return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#EDEDED] rounded-lg p-8 max-w-md w-full text-center shadow-lg relative">

                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl cursor-pointer">
                        <FaTimes />
                    </button>

                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <img
                            src={imagePreview}
                            alt="Foto"
                            className="w-24 h-24 rounded-full object-cover"
                            onError={(e) => { e.currentTarget.src = "/images/bari_padrao.png"; }}
                        />
                        
                        <label 
                            htmlFor="avatar-input"
                            className="absolute bottom-0 right-0 bg-black p-2 rounded-full border text-white hover:brightness-90 cursor-pointer transition flex items-center justify-center z-10"
                        >
                            <FaPen />
                        </label>
                        
                        <input 
                            id="avatar-input"
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </div>

                    <form onSubmit={handleUpdate}>
                        <div className="relative mb-4">
                            <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Nome" className="bg-white text-[#2f2f2f] rounded-full border border-transparent p-2 pl-10 w-full focus:border-laranja focus:outline-none"/>
                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text" />
                        </div>
                        <div className="relative mb-4">
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="bg-white text-[#2f2f2f] rounded-full p-2 pl-10 w-full border border-transparent focus:border-laranja focus:outline-none"/>
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-text" />
                        </div>
                        <div className="relative mb-4">
                            <input value={telefone} onChange={handleTelefoneChange} type="tel" placeholder="Telefone" className="bg-white text-[#2f2f2f] rounded-full p-2 pl-10 w-full border border-transparent focus:border-laranja focus:outline-none"/>
                            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text" />
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            <button type="submit" disabled={loading} className="p-3 rounded-full font-sans tracking-wider text-[#6A38F3] border border-[#6A38F3] hover:bg-[#6A38F3] hover:text-white transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50">
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                            
                            <button onClick={handleDelete} type="button" className="p-3 rounded-full font-sans tracking-wider text-[#6A38F3] border border-[#6A38F3] hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                                <FaTrash /> Deletar Conta
                            </button>
                            
                            <button onClick={() => setMostrarPass(true)} type="button" className="p-3 rounded-full font-sans tracking-wider text-[#6A38F3] border border-[#6A38F3] hover:bg-blue-500 hover:text-white transition cursor-pointer flex items-center justify-center gap-2">
                                <FaLock /> Alterar Senha
                            </button>
                        </div>
                    </form>    
                </div>
                <EditUserPass mostrar={mostrarModalPass} voltar={() => setMostrarPass(false)} usuarioId={usuarioId} />
            </div>
    );
}