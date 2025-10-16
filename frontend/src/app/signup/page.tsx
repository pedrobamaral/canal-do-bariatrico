"use client";

import React, { useState, type ChangeEvent, type FormEvent } from "react";

/* Ícones inline */
type IconProps = { className?: string };

const EyeIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M12 5c-5 0-9.27 3.11-11 7 1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeSlashIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M2 4.27 3.28 3 21 20.72 19.73 22l-3.2-3.2A11.76 11.76 0 0 1 12 19c-5 0-9.27-3.11-11-7a13.39 13.39 0 0 1 4.21-5.03L2 4.27zM12 5c5 0 9.27 3.11 11 7a13.8 13.8 0 0 1-4.06 4.76l-2-2A5 5 0 0 0 9.24 8.06l-1.6-1.6A12.34 12.34 0 0 1 12 5z"/>
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
const FormInput: React.FC<FormInputProps> = ({ label, id, type = "text", value, onChange, required }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div style={{ marginBottom: "1rem" }}>
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
            padding: "12px 40px 12px 16px",
            borderRadius: "9999px",
            backgroundColor: "#F7F5E7",
            border: "none",
            color: "#111",
            fontSize: "14px",
            outline: "none"
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#444",
              background: "transparent",
              border: "none",
              cursor: "pointer"
            }}
          >
            {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </div>
  );
};

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "", email: "", password: "", confirmPassword: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Simulação de envio: " + JSON.stringify(formData, null, 2));
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: "440px",
      backgroundColor: "#111",
      borderRadius: "24px",
      padding: "48px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
    }}>
      <h2 style={{
        color: "white",
        fontSize: "1.75rem",
        fontWeight: 700,
        textAlign: "center",
        marginBottom: "2rem",
        letterSpacing: "0.05em"
      }}>CRIE SUA CONTA</h2>

      <form onSubmit={handleSubmit}>
        <FormInput id="name" label="Nome" type="text" value={formData.name} onChange={handleChange} required />
        <FormInput id="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
        <FormInput id="password" label="Senha" type="password" value={formData.password} onChange={handleChange} required />
        <FormInput id="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} required />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "9999px",
            backgroundColor: "#7B3EF2",
            color: "white",
            border: "none",
            fontWeight: 600,
            letterSpacing: "0.05em",
            cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#692ed9")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#7B3EF2")}
        >
          ENTRAR
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#D2D2D2", fontSize: "0.9rem" }}>
        Já possui uma conta?{" "}
        <a href="/login" style={{ color: "#7B3EF2", textDecoration: "none", fontWeight: 500 }}>Login</a>
      </p>
    </div>
  );
};

const SignUpPage: React.FC = () => {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFBEF",
      padding: "2rem"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "3rem",
        maxWidth: "1100px",
        width: "100%"
      }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <SignUpForm />
        </div>

        {/* Placeholder para imagem futura */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#aaa",
          fontStyle: "italic"
        }}>
          <p>Imagem da bari</p>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;