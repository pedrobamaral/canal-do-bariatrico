// app/cadastro/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { createUser } from "@/api/api";

// ✅ Navbar (aparece SÓ no mobile)
import Navbar from "@/components/Navbar";

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
const formatPhoneNumber = (value: string, countryCode = "+55") => {
  const numbers = value.replace(/\D/g, "");
  const codeDigits = countryCode.replace(/\D/g, "");

  let local = numbers;
  if (codeDigits && numbers.startsWith(codeDigits)) {
    local = numbers.slice(codeDigits.length);
  }

  const limited = local.slice(-11);

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

/* Tipos */
type FormInputProps = {
  label: string;
  id: string;
  type?: "text" | "email" | "password" | "tel";
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  maxLength?: number;
};

type SignUpFormData = {
  name: string;
  email: string;
  pais: string;
  codPais: string;
  telefone: string;
  password: string;
  confirmPassword: string;
};

/* Dados de países com códigos e bandeiras */
type PaisInfo = {
  codigo: string;
  bandeira: string;
};

const PAISES_CODIGOS: Record<string, PaisInfo> = {
  Brasil: { codigo: "+55", bandeira: "🇧🇷" },
  "Estados Unidos": { codigo: "+1", bandeira: "🇺🇸" },
  Canadá: { codigo: "+1", bandeira: "🇨🇦" },
  Portugal: { codigo: "+351", bandeira: "🇵🇹" },
  Espanha: { codigo: "+34", bandeira: "🇪🇸" },
  França: { codigo: "+33", bandeira: "🇫🇷" },
  Itália: { codigo: "+39", bandeira: "🇮🇹" },
  Alemanha: { codigo: "+49", bandeira: "🇩🇪" },
  "Reino Unido": { codigo: "+44", bandeira: "🇬🇧" },
  Austrália: { codigo: "+61", bandeira: "🇦🇺" },
  Argentina: { codigo: "+54", bandeira: "🇦🇷" },
  Chile: { codigo: "+56", bandeira: "🇨🇱" },
  México: { codigo: "+52", bandeira: "🇲🇽" },
  Colômbia: { codigo: "+57", bandeira: "🇨🇴" },
  Peru: { codigo: "+51", bandeira: "🇵🇪" },
  Outro: { codigo: "+55", bandeira: "🌍" },
};

/* Input com toggle de senha */
const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  maxLength,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
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
    pais: "Brasil",
    codPais: "+55",
    telefone: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedPaisInfo, setSelectedPaisInfo] = useState<PaisInfo>(PAISES_CODIGOS["Brasil"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === "pais") {
      const paisInfo = PAISES_CODIGOS[value];
      setFormData((prev) => ({
        ...prev,
        pais: value,
        codPais: paisInfo.codigo,
        telefone: formatPhoneNumber(prev.telefone || "", paisInfo.codigo),
      }));
      setSelectedPaisInfo(paisInfo);
    } else if (id === "telefone") {
      const country = selectedPaisInfo?.codigo || formData.codPais || "+55";
      setFormData((prev) => ({ ...prev, [id]: formatPhoneNumber(value, country) }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.email || !formData.password || !formData.telefone) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    const rawPhone = formData.telefone.replace(/\D/g, "");
    const countryCodeDigits =
      selectedPaisInfo?.codigo.replace(/\D/g, "") || formData.codPais.replace(/\D/g, "");
    const localDigits = rawPhone.startsWith(countryCodeDigits)
      ? rawPhone.slice(countryCodeDigits.length)
      : rawPhone;

    if (localDigits.length < 10) {
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
      const phoneNumbers = formData.telefone.replace(/\D/g, "");
      const countryCode = selectedPaisInfo.codigo.replace(/\D/g, "");
      const phoneWithCountryCode = phoneNumbers.startsWith(countryCode)
        ? phoneNumbers
        : `${countryCode}${phoneNumbers}`;

      const response = await createUser(formData.name, formData.email, formData.password, phoneWithCountryCode);

      if (response && response.status === "sucesso") {
        setSuccess("Cadastro realizado! Redirecionando para o login...");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setError(response?.message || "Erro ao cadastrar usuário. Verifique os dados.");
      }
    } catch (error: any) {
      console.error(error);
      setError(error?.message || "Erro desconhecido ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="authCard"
      style={{
        width: "100%",
        maxWidth: "530px",
        background: "#19191A",
        borderRadius: "36px",
        padding: "48px 50px 40px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.38)",
      }}
      role="form"
      aria-labelledby="signup-title"
    >
      <h2
        id="signup-title"
        className="authTitle"
        style={{
          color: "#fff",
          fontSize: "2.25rem",
          fontWeight: 800,
          textAlign: "center",
          marginBottom: "2rem",
          letterSpacing: "0.09em",
          fontFamily: "'Montserrat', 'Arial', sans-serif",
        }}
      >
        CRIE SUA CONTA
      </h2>

      <form onSubmit={handleSubmit} autoComplete="off">
        <FormInput id="name" label="Nome Completo" type="text" value={formData.name} onChange={handleChange} required />
        <FormInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="telefone" className="sr-only">
            Telefone
          </label>
          <div style={{ display: "flex", gap: "0" }}>
            <select
              id="pais"
              value={formData.pais}
              onChange={handleChange}
              style={{
                height: "54px",
                padding: "0 8px",
                borderRadius: "32px 0 0 32px",
                background: "#F3EFDD",
                border: "none",
                color: "#19191A",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s",
                minWidth: "90px",
                maxWidth: "110px",
              }}
              onFocus={(e) => (e.currentTarget.style.background = "#e8e3d3")}
              onBlur={(e) => (e.currentTarget.style.background = "#F3EFDD")}
            >
              {Object.keys(PAISES_CODIGOS).map((pais) => (
                <option key={pais} value={pais}>
                  {PAISES_CODIGOS[pais].bandeira} {PAISES_CODIGOS[pais].codigo}
                </option>
              ))}
            </select>

            <input
              id="telefone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={formData.telefone}
              onChange={handleChange}
              required
              maxLength={15}
              style={{
                flex: 1,
                height: "54px",
                padding: "0 16px",
                borderRadius: "0 32px 32px 0",
                background: "#F3EFDD",
                border: "none",
                color: "#19191A",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "24px",
                transition: "background 0.2s",
                minWidth: 0,
              }}
              onFocus={(e) => (e.currentTarget.style.background = "#e8e3d3")}
              onBlur={(e) => (e.currentTarget.style.background = "#F3EFDD")}
            />
          </div>
        </div>

        <FormInput id="password" label="Senha" type="password" value={formData.password} onChange={handleChange} required />
        <FormInput
          id="confirmPassword"
          label="Confirmar Senha"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

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
          {loading ? "Cadastrando..." : "CRIAR CONTA"}
        </button>
      </form>

      {error && <p style={{ textAlign: "center", color: "#ff4d4f", marginTop: "16px", fontSize: "0.9rem" }}>{error}</p>}
      {success && (
        <p style={{ textAlign: "center", color: "#4CAF50", marginTop: "16px", fontSize: "0.9rem" }}>{success}</p>
      )}

      <p style={{ textAlign: "center", marginTop: "22px", color: "#CACACA", fontSize: "1.02rem" }}>
        Já possui uma conta?{" "}
        <Link href="/login" style={{ color: "#6F3CF6", textDecoration: "underline", fontWeight: 700 }}>
          Login
        </Link>
      </p>
    </div>
  );
};

/* Página */
const SignUpPage: React.FC = () => {
  return (
    <>
      <div className="mobileOnlyNav">
        <Navbar />
      </div>

      <main
        className="signupMain"
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
          className="signupWrap"
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
          <div className="formCol" style={{ flex: "0 1 530px", display: "flex", justifyContent: "flex-end" }}>
            <SignUpForm />
          </div>

          <div
            className="imageCol"
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
              style={{ objectFit: "contain", objectPosition: "58% center", transform: "scale(1.15)" }}
              priority
            />
          </div>
        </div>
      </main>

      <style jsx>{`
        .mobileOnlyNav {
          display: none;
        }

        @media (max-width: 1024px) {
          .mobileOnlyNav {
            display: block;
          }

          .signupMain {
            padding: 100px 24px 40px 24px !important;
            align-items: flex-start !important;
          }

          .signupWrap {
            flex-direction: column !important;
            gap: 0 !important;
            width: 100% !important;
            max-width: 520px !important;
            margin: 0 auto !important;
          }

          .formCol {
            flex: 1 1 auto !important;
            width: 100% !important;
            justify-content: center !important;
          }

          .imageCol {
            display: none !important;
          }

          .authCard {
            max-width: 420px !important;
            margin: 0 auto !important;
          }

          /* ✅ TÍTULO: 1 LINHA (SÓ MOBILE) */
          .authTitle {
            white-space: nowrap !important;
            font-size: 1.15rem !important;
            letter-spacing: 0.03em !important;
            line-height: 1.1 !important;
            margin-bottom: 1.2rem !important;
            font-weight: 900 !important;
          }
        }

        @media (max-width: 480px) {
          .authCard {
            max-width: 360px !important;
            padding: 44px 28px 34px !important;
            border-radius: 34px !important;
          }

          .authTitle {
            font-size: 1.05rem !important;
            letter-spacing: 0.025em !important;
          }
        }
      `}</style>
    </>
  );
};

export default SignUpPage;
