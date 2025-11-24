"use client"
import React, { useState, useEffect } from "react"
import type * as ReactTypes from "react"
import Image from "next/image"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { FaCalculator } from "react-icons/fa"
import { AiFillShopping } from "react-icons/ai"
import "../globals.css"

const CORES = {
  roxoPrincipal: "#6F3CF6",
  roxoHover: "#5c2fe0",
  pretoPrincipal: "#19191A",
  cinzaIcone: "#6b6b6b",
}

const FONTES = {
  principal: "'Montserrat', 'Arial', sans-serif",
  secundaria: "sans-serif",
}

const SOMBRAS = {
  botao: "0 2px 8px rgba(111,60,246,0.12)",
}

type SliderProps = {
  label: string
  unit: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

/**
 * Slider com bolinha editável:
 * - arrasta no range
 * - digita o número dentro da bolinha
 */
const SliderInput: React.FC<SliderProps> = ({ label, unit, value, min, max, step, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100
  const [inputValue, setInputValue] = useState(String(value))

  // mantém o texto sempre sincronizado com o value vindo de fora
  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value)
    onChange(num)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // só deixa números
    const raw = e.target.value.replace(/\D/g, "")
    setInputValue(raw)

    if (raw === "") return

    const num = Number(raw)
    if (Number.isNaN(num)) return

    const clamped = Math.min(max, Math.max(min, num))
    onChange(clamped)
  }

  const handleInputBlur = () => {
    // se apagar tudo e sair do campo, volta para o valor atual
    if (inputValue === "") {
      setInputValue(String(value))
    } else {
      // garante clamp ao sair
      const num = Number(inputValue)
      const clamped = Math.min(max, Math.max(min, num))
      if (clamped !== value) onChange(clamped)
      setInputValue(String(clamped))
    }
  }

  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ marginBottom: "12px", textAlign: "center" }}>
        <span
          style={{
            color: CORES.roxoPrincipal,
            fontWeight: 600,
            fontSize: "0.95rem",
            fontFamily: FONTES.principal,
          }}
        >
          {label}
        </span>
      </div>

      <div style={{ position: "relative", height: "30px" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeChange}
          style={{
            WebkitAppearance: "none",
            appearance: "none",
            width: "100%",
            height: "3px",
            borderRadius: "999px",
            background: `linear-gradient(
              to right,
              ${CORES.roxoPrincipal} 0%,
              ${CORES.roxoPrincipal} ${percentage}%,
              #e4e1d6 ${percentage}%,
              #e4e1d6 100%
            )`,
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* AQUI CENTRALIZA NÚMERO + UNIDADE */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div
          style={{
            width: "90px",
            height: "32px",
            borderRadius: "999px",
            backgroundColor: "#e4e1d6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8px",
          }}
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              textAlign: "center",
              fontFamily: FONTES.principal,
              fontWeight: 600,
              color: CORES.pretoPrincipal,
              fontSize: "0.95rem",
            }}
          />
        </div>

        <span
          style={{
            color: CORES.cinzaIcone,
            fontSize: "0.8rem",
            fontFamily: FONTES.secundaria,
            marginTop: "-4px",
            textAlign: "center",
            width: "100%",
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  )
}

type ToggleProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => {
  const toggleStyle: ReactTypes.CSSProperties = {
    width: "48px",
    height: "24px",
    borderRadius: "12px",
    background: checked ? CORES.roxoPrincipal : "#ccc",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.3s",
    flexShrink: 0,
  }

  const circleStyle: ReactTypes.CSSProperties = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "white",
    position: "absolute",
    top: "2px",
    left: checked ? "calc(100% - 22px)" : "2px",
    transition: "left 0.3s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  }

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
  )
}

type DiabetesOption = "sem_diabetes" | "pre_diabetes" | "diabetes"

export default function Home() {
  const [peso, setPeso] = useState(80)
  const [altura, setAltura] = useState(170)
  const [idade, setIdade] = useState(35)
  const [fumante, setFumante] = useState(false)
  const [diabetes, setDiabetes] = useState<DiabetesOption>("sem_diabetes")
  const [intervencaoData, setIntervencaoData] = useState({
    tipo: "Bypass Gástrico",
  })
  const [isMobile, setIsMobile] = useState(false)
  const [metric, setMetric] = useState<"peso" | "imc">("peso")

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const chartData = [
    { month: 3, weight: 108, min: 102, max: 114 },
    { month: 12, weight: 85, min: 78, max: 92 },
    { month: 24, weight: 75, min: 68, max: 82 },
    { month: 60, weight: 72, min: 65, max: 79 },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "#F3EFDD" }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", position: "relative" }}>
              <Image src="/images/barienavbar.png" alt="Logo da BARI" fill style={{ objectFit: "contain" }} priority />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  color: "#62B4FF",
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "48px",
            }}
          >
            {/* SLOT 1 */}
            <div style={{ width: "32px", display: "flex", justifyContent: "center" }}>
              <AiFillShopping size={32} color="white" />
            </div>

            {/* SLOT 2 */}
            <div style={{ width: "32px", display: "flex", justifyContent: "center" }}>
              <FaCalculator size={26} color="white" />
            </div>

            {/* SLOT 3 */}
            <div style={{ width: "80px", display: "flex", justifyContent: "center" }}>
              <a
                href="/login"
                style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                LOGIN
              </a>
            </div>

            {/* SLOT 4 */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <a href="/cadastro" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: CORES.roxoPrincipal,
                    color: "white",
                    border: "none",
                    borderRadius: "999px",
                    padding: "8px 28px",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    boxShadow: SOMBRAS.botao,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = CORES.roxoHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = CORES.roxoPrincipal)}
                >
                  CADASTRE-SE
                </button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main
        style={{
          minHeight: "100vh",
          padding: "100px 24px 40px 24px",
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
          {/* Esquerda – Paciente & Intervenção */}
          <div style={{ flex: "2", minWidth: "350px" }}>
            <div>
              <label
                style={{
                  color: CORES.roxoPrincipal,
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: FONTES.principal,
                  display: "block",
                  marginBottom: "8px",
                  paddingLeft: "32px",
                  textAlign: "left",
                }}
              >
                Paciente
              </label>

              <div
                style={{
                  background: "white",
                  borderRadius: "24px",
                  border: `1px solid ${CORES.roxoPrincipal}`,
                  padding: "32px",
                  marginBottom: "24px",
                }}
              >
                <SliderInput label="Peso" unit="kg" value={peso} min={40} max={200} step={1} onChange={setPeso} />
                <SliderInput label="Altura" unit="cm" value={altura} min={100} max={220} step={1} onChange={setAltura} />
                <SliderInput label="Idade" unit="anos" value={idade} min={18} max={80} step={1} onChange={setIdade} />

                <div style={{ marginTop: "32px" }}>
                  <Toggle label="Fumante" checked={fumante} onChange={setFumante} />

                  <div style={{ marginTop: "16px" }}>
                    <label
                      style={{
                        color: CORES.roxoPrincipal,
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        fontFamily: FONTES.principal,
                        display: "block",
                        marginBottom: "8px",
                        textAlign: "left",
                      }}
                    >
                      Diabetes tipo 2
                    </label>

                    <div className="pill-select-wrapper">
                      <select
                        className="pill-select"
                        value={diabetes}
                        onChange={(e) => setDiabetes(e.target.value as DiabetesOption)}
                      >
                        <option value="sem_diabetes">Sem diabetes</option>
                        <option value="pre_diabetes">Pré-diabetes</option>
                        <option value="diabetes">Diabetes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                style={{
                  color: CORES.roxoPrincipal,
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: FONTES.principal,
                  display: "block",
                  marginBottom: "8px",
                  paddingLeft: "32px",
                  textAlign: "left",
                }}
              >
                Intervenção
              </label>

              <div
                style={{
                  background: "white",
                  borderRadius: "24px",
                  border: `1px solid ${CORES.roxoPrincipal}`,
                  padding: "32px",
                }}
              >
                <div style={{ marginBottom: 0 }}>
                  <label
                    style={{
                      color: CORES.roxoPrincipal,
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      fontFamily: FONTES.principal,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Tipo de Cirurgia
                  </label>
                  <div className="pill-select-wrapper">
                    <select
                      className="pill-select"
                      value={intervencaoData.tipo}
                      onChange={(e) => setIntervencaoData({ ...intervencaoData, tipo: e.target.value })}
                    >
                      <option>Bypass Gástrico</option>
                      <option>Sleeve Gastrectomia</option>
                      <option>Banda Gástrica</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direita – Gráfico */}
          <div style={{ flex: "1", minWidth: "350px", alignSelf: "flex-start" }}>
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                border: `1px solid ${CORES.roxoPrincipal}`,
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: "600px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  gap: "16px",
                }}
              >
                <h2
                  style={{
                    color: CORES.roxoPrincipal,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    fontFamily: FONTES.principal,
                  }}
                >
                  Trajetória de Peso Prevista
                </h2>
                <div style={{ maxWidth: 180, width: "100%" }}>
                  <div className="pill-select-wrapper">
                    <select
                      className="pill-select"
                      value={metric}
                      onChange={(e) => setMetric(e.target.value as "peso" | "imc")}
                    >
                      <option value="peso">Peso (kg)</option>
                      <option value="imc">IMC</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minHeight: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6F3CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6F3CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
                    <XAxis
                      dataKey="month"
                      label={{ value: "Meses após cirurgia", position: "insideBottomRight", offset: -10 }}
                      stroke={CORES.cinzaIcone}
                    />
                    <YAxis
                      label={{
                        value: metric === "peso" ? "Peso (kg)" : "IMC",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      stroke={CORES.cinzaIcone}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: `1px solid ${CORES.roxoPrincipal}`,
                        borderRadius: "8px",
                        color: CORES.pretoPrincipal,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="weight"
                      stroke={CORES.roxoPrincipal}
                      strokeWidth={2}
                      fill="url(#colorWeight)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <button
                style={{
                  width: "100%",
                  height: "54px",
                  borderRadius: "32px",
                  background: CORES.roxoPrincipal,
                  color: "white",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: SOMBRAS.botao,
                  transition: "background 0.2s",
                  marginTop: "24px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = CORES.roxoHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = CORES.roxoPrincipal)}
              >
                Consegui Resultados
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${CORES.roxoPrincipal};
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(111, 60, 246, 0.4);
          margin-top: -9px;
        }

        input[type='range']::-webkit-slider-thumb:active {
          cursor: grabbing;
          box-shadow: 0 0 12px rgba(111, 60, 246, 0.6);
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${CORES.roxoPrincipal};
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(111, 60, 246, 0.4);
        }

        input[type='range']::-moz-range-track {
          height: 3px;
          border-radius: 999px;
          background: transparent;
        }

        .pill-select-wrapper {
          position: relative;
          display: inline-block;
          width: 100%;
        }

        .pill-select {
          width: 100%;
          border-radius: 999px;
          border: 2px solid ${CORES.roxoPrincipal};
          padding: 8px 32px 8px 16px;
          font-family: ${FONTES.secundaria};
          font-weight: 600;
          font-size: 0.9rem;
          color: ${CORES.pretoPrincipal};
          background-color: white;
          cursor: pointer;
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .pill-select-wrapper::after {
          content: '▾';
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          color: ${CORES.pretoPrincipal};
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
