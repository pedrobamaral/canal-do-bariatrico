"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, type ChangeEvent, type FormEvent } from "react";

/* Ícones inline */
type IconProps = { className?: string };

const EyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12 5c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeSlashIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M2 4.27 3.28 3 21 20.72 19.73 22l-3.2-3.2A11.76 11.76 0 0 1 12 19c-5 0-9.27-3.11-11-7a13.39 13.39 0 0 1 4.21-5.03L2 4.27zM12 5c5 0 9.27 3.11 11 7a13.8 13.8 0 0 1-4.06 4.76l-2-2A5 5 0 0 0 9.24 8.06l-1.6-1.6A12.34 12.34 0 0 1 12 5z" />
  </svg>
);

/* --- Função de Máscara de Telefone --- */
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

/* Tipos */
type FormInputProps = {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "tel"; 
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number; // Adicionado para limitar caracteres
};

type SignUpFormData = {
  name: string;
  email: string;
  telefone: string; 
  password: string;
  confirmPassword: string;
};

/* Input com toggle de senha */
const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  maxLength
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={inputType}
          placeholder={label}
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          style={{
            width: "100%",
            height: "54px",
            padding: "0 52px 0 22px",
            borderRadius: "32px",
            background: "#F3EFDD",
            border: "none",
            color: "#19191A",
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "24px",
            letterSpacing: "0.01em",
            outline: isPassword ? "2px solid #6F3CF6" : "none",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
            transition: "outline .2s",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            style={{
              position: "absolute",
              right: "17px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6b6b6b",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

/* Card do formulário */
const SignUpForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Manipulador de mudança com lógica especial para telefone
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === "telefone") {
      setFormData((prev) => ({ ...prev, [id]: formatPhoneNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    // Validações básicas
    if (!formData.name || !formData.email || !formData.password || !formData.telefone) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    // --- VALIDAÇÃO DE TELEFONE ---
    // Remove símbolos para contar apenas números
    const rawPhone = formData.telefone.replace(/\D/g, "");
    if (rawPhone.length < 10) {
      setError("Por favor, preencha o telefone corretamente: (DD) XXXXX-XXXX");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem!");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          senha: formData.password,
          // Envia apenas os números (limpos) para o banco
          telefone: rawPhone 
        }),
      });

      const data = await response.json().catch(() => ({})); 

      if (!response.ok) {
        setError(data.message || "Erro ao cadastrar usuário. Verifique os dados.");
        return;
      }

      setSuccess("Cadastro realizado! Redirecionando para o login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (error) {
      console.error(error);
      setError("Erro de conexão. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "530px",
        background: "#19191A",
        borderRadius: "36px",
        padding: "56px 60px 44px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.38)",
      }}
      role="form"
      aria-labelledby="signup-title"
    >
      <h2
        id="signup-title"
        style={{
          color: "#fff",
          fontSize: "2.25rem",
          fontWeight: 800,
          textAlign: "center",
          marginBottom: "2.5rem",
          letterSpacing: "0.09em",
          fontFamily: "'Montserrat', 'Arial', sans-serif",
        }}
      >
        CRIE SUA CONTA
      </h2>

      <form onSubmit={handleSubmit} autoComplete="off">
        <FormInput id="name" label="Nome Completo" type="text" value={formData.name} onChange={handleChange} required />
        <FormInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
        
        {/* Input de Telefone com Máscara */}
        <FormInput 
          id="telefone" 
          label="Telefone: (XX) XXXXX-XXXX" 
          type="tel" 
          value={formData.telefone} 
          onChange={handleChange} 
          required
          maxLength={15} // Limita tamanho visual da máscara
        />
        
        <FormInput id="password" label="Senha" type="password" value={formData.password} onChange={handleChange} required />
        <FormInput id="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} required />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: "54px",
            borderRadius: "32px",
            background: loading ? "#8e6ff7" : "#6F3CF6",
            color: "#fff",
            border: "none",
            fontWeight: 800,
            letterSpacing: "0.04em",
            fontSize: "1rem",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(111,60,246,0.12)",
            transition: "background .2s",
            outline: "none",
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#5c2fe0")}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#6F3CF6")}
        >
          {loading ? "Cadastrando..." : "CADASTRAR"}
        </button>
      </form>

      {error && (
        <p style={{ textAlign: "center", color: "#ff4d4f", marginTop: "16px", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ textAlign: "center", color: "#4CAF50", marginTop: "16px", fontSize: "0.9rem" }}>
          {success}
        </p>
      )}

      <p
        style={{
          textAlign: "center",
          marginTop: "22px",
          color: "#CACACA",
          fontSize: "1.02rem",
          fontFamily: "'Montserrat', 'Arial', sans-serif",
        }}
      >
        Já possui uma conta?{" "}
        <Link
          href="/login"
          style={{
            color: "#6F3CF6",
            textDecoration: "underline",
            fontWeight: 700,
            letterSpacing: "0.02em",
            fontSize: "1.01rem",
          }}
        >
          Login
        </Link>
      </p>
    </div>
  );
};

/* Página */
const SignUpPage: React.FC = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFFBEF",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "46px",
          maxWidth: "1330px",
          width: "100%",
        }}
      >
        <div style={{ flex: "0 1 530px", display: "flex", justifyContent: "flex-end" }}>
          <SignUpForm />
        </div>

        <div
          style={{
            flex: "0 1 700px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            height: "628px",
            transform: "translateX(29px)",
          }}
        >
          <Image
            src="/images/bari_academia.png"
            alt="Imagem da Bari na academia"
            fill
            style={{
              objectFit: "contain",
              objectPosition: "58% center",
              transform: "scale(1.15)",
            }}
            priority
          />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;