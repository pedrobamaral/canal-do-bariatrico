"use client";

import Image from "next/image";
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

/* Tipos */
type FormInputProps = {
  label: string;
  id: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

type SignUpFormData = {
  name: string;
  email: string;
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
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.password) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não conferem!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: formData.name,
            email: formData.email,
            senha: formData.password,
          }),
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setError(data.message || "Erro ao cadastrar usuário");
        return;
      }

      setSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => (window.location.href = "/login"), 1000);
    } catch (error) {
      console.error(error);
      setError("Erro ao conectar com o servidor");
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
        <FormInput id="name" label="Nome" type="text" value={formData.name} onChange={handleChange} required />
        <FormInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
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
          {loading ? "Enviando..." : "ENTRAR"}
        </button>
      </form>

      {error && (
        <p style={{ textAlign: "center", color: "#ff4d4f", marginTop: "16px", fontSize: "1rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ textAlign: "center", color: "#4CAF50", marginTop: "16px", fontSize: "1rem" }}>
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
        <a
          href="/login"
          style={{
            color: "#6F3CF6",
            textDecoration: "underline",
            fontWeight: 700,
            letterSpacing: "0.02em",
            fontSize: "1.01rem",
          }}
          tabIndex={0}
        >
          Login
        </a>
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
