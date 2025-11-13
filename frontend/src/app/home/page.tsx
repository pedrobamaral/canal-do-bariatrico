"use client";

import Image from "next/image";
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { FaCalculator } from "react-icons/fa6";
import { AiFillShopping } from "react-icons/ai";



// =============================================================================
// 1. CONSTANTES DE ESTILO
// =============================================================================

const CORES = {
  roxoPrincipal: "#6F3CF6",
  roxoHover: "#5c2fe0",
  roxoClaro: "#8e6ff7",
  cremeFundo: "#FFFBEF",
  cremeInput: "#F3EFDD",
  cremeCard: "#FFF7E0",
  pretoPrincipal: "#19191A",
  cinzaTexto: "#CACACA",
  cinzaIcone: "#6b6b6b",
  erro: "#ff4d4f",
};

const FONTES = {
  principal: "'Montserrat', 'Arial', sans-serif",
  secundaria: "sans-serif",
};

const SOMBRAS = {
  cardPrincipal: "0 20px 60px rgba(0,0,0,0.38)",
  inputInterna: "inset 0 0 0 1px rgba(0,0,0,0.08)",
  botao: "0 2px 8px rgba(111,60,246,0.12)",
};

// =============================================================================
// 2. COMPONENTES UTILITÁRIOS
// =============================================================================

type IconProps = { className?: string; color?: string };

// Ícone de Sacola (Placeholder)
const BagIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={color}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zm0 4h12l1 2H5l1-2zm1 4v8h10v-8H7z" />
  </svg>
);

// Ícone de Calculadora (Placeholder)
const CalculatorIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={color}>
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-8 16H7v-4h4v4zm0-6H7v-4h4v4zm6 6h-4v-4h4v4zm0-6h-4v-4h4v4z" />
  </svg>
);

// Ícone de Seta para Baixo (para o Dropdown)
const ChevronDownIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill={color}>
    <path d="M7 10l5 5 5-5z" />
  </svg>
);

// Componente Slider Estilizado
type SliderProps = {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

const SliderInput: React.FC<SliderProps> = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            color: CORES.roxoPrincipal,
            fontWeight: 600,
            fontSize: "1.1rem",
            fontFamily: FONTES.principal,
          }}
        >
          {label}
        </span>
        <span
          style={{
            color: CORES.roxoPrincipal,
            fontWeight: 700,
            fontSize: "1.2rem",
            fontFamily: FONTES.principal,
          }}
        >
          {value} {unit}
        </span>
      </div>

      <div style={{ position: "relative", height: "30px" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            WebkitAppearance: "none",
            appearance: "none",
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            background: `linear-gradient(to right, ${CORES.roxoPrincipal} 0%, ${CORES.roxoPrincipal} ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`,
            outline: "none",
            opacity: 0.9,
            transition: "opacity .2s",
            cursor: "pointer",
            // Estilo do "thumb" (o círculo)
            ["--thumb-size" as any]: "24px",
            ["--thumb-color" as any]: CORES.roxoPrincipal,
            ["--thumb-shadow" as any]: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          // Adicionando estilos específicos para o thumb via CSS inline (limitado, mas seguindo o padrão)
          // O estilo do thumb é complexo de fazer apenas com style inline, mas vamos simular o trilho preenchido.
          // O thumb em si será o padrão do navegador, mas o trilho preenchido já dá o efeito visual.
        />
        {/* Placeholder visual para o thumb, se necessário, mas o input[type=range] é o foco */}
      </div>
      <div style={{ textAlign: "center", marginTop: "8px", color: CORES.cinzaIcone, fontSize: "0.9rem" }}>
        {unit}
      </div>
    </div>
  );
};

// Componente Toggle Estilizado
type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  const toggleStyle: React.CSSProperties = {
    width: "48px",
    height: "24px",
    borderRadius: "12px",
    background: checked ? CORES.roxoPrincipal : "#ccc",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.3s",
    flexShrink: 0,
  };

  const circleStyle: React.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "white",
    position: "absolute",
    top: "2px",
    left: checked ? "calc(100% - 22px)" : "2px",
    transition: "left 0.3s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        padding: "8px 0",
      }}
    >
      <span
        style={{
          color: CORES.pretoPrincipal,
          fontWeight: 500,
          fontSize: "1rem",
          fontFamily: FONTES.secundaria,
        }}
      >
        {label}
      </span>
      <div onClick={() => onChange(!checked)} style={toggleStyle}>
        <div style={circleStyle} />
      </div>
    </div>
  );
};

// =============================================================================
// 3. COMPONENTES DE LAYOUT (Header)
// =============================================================================

const Header: React.FC = () => {
  const linkStyle: React.CSSProperties = {
    color: "white",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "0 12px",
    cursor: "pointer",
    transition: "color 0.2s",
  };

  const buttonStyle: React.CSSProperties = {
    background: CORES.roxoPrincipal,
    color: "white",
    border: "none",
    borderRadius: "24px",
    padding: "10px 20px",
    fontWeight: 800,
    fontSize: "0.9rem",
    letterSpacing: "0.04em",
    cursor: "pointer",
    boxShadow: SOMBRAS.botao,
    transition: "background 0.2s",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: CORES.pretoPrincipal,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Esquerda: Logo e Textos */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Logo Placeholder */}
          <div style={{ width: "40px", height: "40px", position: "relative" }}>
            <Image
              src="/images/logo_bari.png" // Usando o caminho sugerido
              alt="Logo da BARI"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontWeight: 800,
                fontFamily: FONTES.principal,
                lineHeight: 1.2,
              }}
            >
              BARIE
            </span>
            <span
              style={{
                color: "white",
                fontSize: "0.75rem",
                fontFamily: FONTES.secundaria,
                opacity: 0.8,
                lineHeight: 1.2,
              }}
            >
              Calculadora de Perda de Peso com
              <br />
              Bariátrica ou Canetinhas Emagrecedoras
            </span>
          </div>
        </div>

        {/* Direita: Ícones e Botões */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <AiFillShopping size={26} color="white" />
            <FaCalculator size={26} color="white" />
    <a
      href="/login"
      style={linkStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = CORES.roxoPrincipal)}
      onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
    >
      LOGIN
    </a>
    <button
      style={buttonStyle}
      onMouseEnter={(e) => (e.currentTarget.style.background = CORES.roxoHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = CORES.roxoPrincipal)}
    >
      CADASTRE-SE
    </button>
    </div>
      </div>
    </header>
  );
};

// =============================================================================
// 4. COMPONENTES DE LAYOUT (Cards) - Placeholder para a próxima fase
// =============================================================================

// ... (CardPaciente, CardIntervencao, CardGrafico virão aqui)

// =============================================================================
// 5. PÁGINA PRINCIPAL
// =============================================================================

const HomePage: React.FC = () => {
  // Lógica de estado principal
  const [peso, setPeso] = useState(80);
  const [altura, setAltura] = useState(170);
  const [idade, setIdade] = useState(35);
  const [fumante, setFumante] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [tipoIntervencao, setTipoIntervencao] = useState("Cirurgia"); // Valor Inicial

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize(); // já calcula na primeira renderização
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Placeholder para os cards
  const CardPaciente: React.FC = () => (
    <div
      style={{
        background: CORES.cremeCard,
        borderRadius: "24px",
        border: `1px solid ${CORES.roxoPrincipal}`,
        padding: "32px",
        marginBottom: "24px",
      }}
    >
      <h3
        style={{
          color: CORES.roxoPrincipal,
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "24px",
          fontFamily: FONTES.principal,
        }}
      >
        Paciente
      </h3>
      <SliderInput
        label="Peso"
        unit="kg"
        value={peso}
        min={40}
        max={200}
        step={1}
        onChange={setPeso}
      />
      <SliderInput
        label="Altura"
        unit="cm"
        value={altura}
        min={100}
        max={220}
        step={1}
        onChange={setAltura}
      />
      <SliderInput
        label="Idade"
        unit="anos"
        value={idade}
        min={18}
        max={80}
        step={1}
        onChange={setIdade}
      />
      <div style={{ marginTop: "32px" }}>
        <Toggle label="Fumante" checked={fumante} onChange={setFumante} />
        <Toggle label="Diabetes" checked={diabetes} onChange={setDiabetes} />
      </div>
    </div>
  );

  const CardIntervencao: React.FC = () => (
    <div
      style={{
        background: CORES.cremeCard,
        borderRadius: "24px",
        border: `1px solid ${CORES.roxoPrincipal}`,
        padding: "32px",
      }}
    >
      <h3
        style={{
          color: CORES.roxoPrincipal,
          fontSize: "1.5rem",
          fontWeight: 700,
          marginBottom: "24px",
          fontFamily: FONTES.principal,
        }}
      >
        Intervenção
      </h3>
      <h4
        style={{
          color: CORES.roxoPrincipal,
          fontSize: "1.2rem",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: "20px",
          fontFamily: FONTES.principal,
        }}
      >
        Tipo de Intervenção
      </h4>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#E4E4E8",
            borderRadius: "50px",
            padding: "12px 30px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            position: "relative",
            minWidth: "280px",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onClick={() =>
            setTipoIntervencao(
              tipoIntervencao === "Cirurgia" ? "Medicamento" : "Cirurgia"
            )
          }
        >
          <span
            style={{
              color: CORES.pretoPrincipal,
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            {tipoIntervencao}
          </span>
          <ChevronDownIcon className="w-5 h-5" color={CORES.pretoPrincipal} />
        </div>
      </div>
      <p
        style={{
          color: CORES.roxoPrincipal,
          fontSize: "0.9rem",
          textAlign: "left",
          marginTop: "20px",
        }}
      >
        Obs: A Tirzepatida é comercializada com o nome de “Mounjaro” e a
        Semaglutida é comercializada com o nome de “Ozempic”
      </p>
    </div>
  );

  const CardGrafico: React.FC = () => {
    const buttonStyle: React.CSSProperties = {
      width: "100%",
      height: "54px",
      borderRadius: "32px",
      background: CORES.roxoPrincipal,
      color: "#fff",
      border: "none",
      fontWeight: 800,
      letterSpacing: "0.04em",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: SOMBRAS.botao,
      transition: "background .2s",
      outline: "none",
      marginTop: "24px",
    };

    return (
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          border: `1px solid ${CORES.roxoPrincipal}`,
          padding: "32px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <select
            style={{
              padding: "8px 16px",
              borderRadius: "16px",
              border: `1px solid ${CORES.roxoPrincipal}`,
              background: "white",
              color: CORES.pretoPrincipal,
              fontWeight: 600,
              fontSize: "1rem",
              appearance: "none",
              cursor: "pointer",
            }}
          >
            <option>Weight</option>
            <option>BMI</option>
          </select>
        </div>

        {/* Placeholder do Gráfico */}
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            minHeight: "300px",
            padding: "20px 0",
          }}
        >
          {/* Simulação do Gráfico (Eixos e Área) */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderLeft: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
              position: "relative",
            }}
          >
            {/* Eixo Y Label */}
            <div
              style={{
                position: "absolute",
                left: "-40px",
                top: "50%",
                transform: "rotate(-90deg) translateY(-50%)",
                fontSize: "0.8rem",
                color: CORES.cinzaIcone,
              }}
            >
              Weight (kg)
            </div>

            {/* Área do Gráfico (Simulação da Curva) */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "10%",
                width: "80%",
                height: "60%",
                background: "rgba(144, 238, 144, 0.3)", // Light Green
                borderRadius: "10px 10px 0 0",
                opacity: 0.7,
              }}
            />

            {/* Eixo X Label */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.8rem",
                color: CORES.cinzaIcone,
              }}
            >
              Months after surgery
            </div>
          </div>
        </div>

        <button
          style={buttonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.background = CORES.roxoHover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = CORES.roxoPrincipal)}
        >
          Consegui Resultados
        </button>
      </div>
    );
  };

  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "100vh",
          background: CORES.cremeFundo,
          padding: "100px 24px 40px 24px", // Padding superior para compensar o header fixo
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
            style={{
                maxWidth: "1200px",
                width: "100%",
                display: "flex",
                gap: "30px",
                flexDirection: isMobile ? "column" : "row",
            }}
>

          {/* Coluna Esquerda: Paciente e Intervenção */}
          <div style={{ flex: "2", minWidth: "350px" }}>
            <CardPaciente />
            <CardIntervencao />
          </div>

          {/* Coluna Direita: Gráfico/Resultados */}
          <div style={{ flex: "1", minWidth: "350px" }}>
            <CardGrafico />
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;