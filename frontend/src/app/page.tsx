"use client"
import React, { useState, useEffect } from "react"
import type * as ReactTypes from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6"
import "./globals.css"
import Navbar from "../components/navbar"

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
 * Slider com bolinha editável
 */
const SliderInput: React.FC<SliderProps> = ({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const percentage = ((value - min) / (max - min)) * 100
  const [inputValue, setInputValue] = useState(String(value))

  useEffect(() => {
    setInputValue(String(value))
  }, [value])

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = Number(e.target.value)
    onChange(num)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    setInputValue(raw)

    if (raw === "") return

    const num = Number(raw)
    if (Number.isNaN(num)) return

    const clamped = Math.min(max, Math.max(min, num))
    onChange(clamped)
  }

  const handleInputBlur = () => {
    if (inputValue === "") {
      setInputValue(String(value))
    } else {
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

      {/* Número + unidade centralizados */}
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

type ChartPoint = {
  month: number
  weight: number // kg
  imc: number // kg/m²
}

/**
 * Lógica do calculo da trajetória de peso
 */
type TrajectoryParams = {
  peso: number
  altura: number
  idade: number
  fumante: boolean
  diabetes: DiabetesOption
  tipoCirurgia: string
}

function calcularTrajetoria({
  peso,
  altura,
  idade,
  fumante,
  diabetes,
  tipoCirurgia,
}: TrajectoryParams): ChartPoint[] {
  const alturaM = altura / 100
  const alturaM2 = alturaM * alturaM

  // Peso ideal (IMC 25)
  const pesoIdeal = 25 * alturaM2
  const excessoPeso = Math.max(peso - pesoIdeal, 0)

  /**
   * Curvas base de %EWL por tipo de cirurgia
   * Modelo:
   *  - Até 24 meses: EWL(m) = a * (1 - e^(-k * m))  (queda rápida e desacelerando)
   *  - De 24 a 60 meses: pequeno reganho fisiológico (EWL cai de a_24 para ewl60)
   */
  let aPlateau: number
  let k: number
  let ewl60Base: number

  if (tipoCirurgia === "Bypass Gástrico") {
    // ~35% em 3m, ~70% em 12m, ~75% em 24m, ~70% em 60m
    aPlateau = 0.75
    k = 0.2095362
    ewl60Base = 0.70
  } else if (tipoCirurgia === "Sleeve Gastrectomia") {
    // ~30% em 3m, ~58% em 12m, ~62% em 24m, ~55% em 60m
    aPlateau = 0.62
    k = 0.2204662
    ewl60Base = 0.55
  } else {
    // Banda / outros – mais conservador
    // ~20% em 3m, ~45% em 12m, ~50% em 24m, ~45% em 60m
    aPlateau = 0.5
    k = 0.1702752
    ewl60Base = 0.45
  }

  // %EWL no mês 24 usando a curva exponencial
  const ewl24Base = aPlateau * (1 - Math.exp(-k * 24))

  // Ajuste de risco (idade, fumo, diabetes) aplicado em TODOS os meses
  let fatorRisco = 1

  if (idade >= 60) {
    fatorRisco -= 0.10
  } else if (idade >= 50) {
    fatorRisco -= 0.05
  }

  if (fumante) {
    fatorRisco -= 0.05
  }

  if (diabetes === "diabetes") {
    fatorRisco -= 0.08
  } else if (diabetes === "pre_diabetes") {
    fatorRisco -= 0.04
  }

  // Limita o fator de risco para não ficar absurdo
  fatorRisco = Math.min(1.05, Math.max(0.7, fatorRisco))

  const data: ChartPoint[] = []

  // Gera ponto mês a mês de 0 a 60 usando a fórmula contínua
  for (let mes = 0; mes <= 60; mes++) {
    let ewlBruta: number

    if (mes <= 24) {
      // queda principal – curva exponencial
      ewlBruta = aPlateau * (1 - Math.exp(-k * mes))
    } else {
      // reganho fisiológico gradual entre 24 e 60 meses
      const t = (mes - 24) / (60 - 24) // 0 em 24m, 1 em 60m
      const ewl60 = ewl60Base
      ewlBruta = ewl24Base - (ewl24Base - ewl60) * t
    }

    // Aplica o fator de risco em TODOS os meses
    let ewlAjustada = ewlBruta * fatorRisco

    // Segurança: nunca passar de 95% de EWL nem ficar negativo
    ewlAjustada = Math.min(0.95, Math.max(0, ewlAjustada))

    // Peso previsto: peso inicial – excesso de peso perdido
    const pesoPerdido = excessoPeso * ewlAjustada
    const pesoPrevisto = peso - pesoPerdido
    const imcPrevisto = pesoPrevisto / alturaM2

    data.push({
      month: mes,
      weight: Number(pesoPrevisto.toFixed(1)),
      imc: Number(imcPrevisto.toFixed(1)),
    })
  }

  return data
}

/* COMPONENTE PRINCIPAL */

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

  const [chartData, setChartData] = useState<ChartPoint[]>([])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const data = calcularTrajetoria({
      peso,
      altura,
      idade,
      fumante,
      diabetes,
      tipoCirurgia: intervencaoData.tipo,
    })
    setChartData(data)
  }, [peso, altura, idade, fumante, diabetes, intervencaoData.tipo])

  return (
    <div style={{ minHeight: "100vh", background: "#F3EFDD" }}>
      <Navbar />

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
          }}
        >
          {/* GRID PRINCIPAL (paciente + gráfico) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "30px",
            }}
          >
            {/* Esquerda – Paciente & Intervenção */}
            <div
              style={{
                minWidth: "350px",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
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
                  }}
                >
                  <SliderInput
                    label="Peso"
                    unit="kg"
                    value={peso}
                    min={25}
                    max={300}
                    step={1}
                    onChange={setPeso}
                  />
                  <SliderInput
                    label="Altura"
                    unit="cm"
                    value={altura}
                    min={100}
                    max={230}
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
                    <Toggle
                      label="Fumante"
                      checked={fumante}
                      onChange={setFumante}
                    />

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
                          onChange={(e) =>
                            setDiabetes(e.target.value as DiabetesOption)
                          }
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

              {/* Intervenção logo abaixo */}
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
                  {/* Título central */}
                  <div style={{ textAlign: "center", marginBottom: "22px" }}>
                    <label
                      style={{
                        color: CORES.roxoPrincipal,
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        fontFamily: FONTES.principal,
                        display: "block",
                        marginBottom: "0px",
                      }}
                    >
                      Tipo de Intervenção
                    </label>
                  </div>

                  {/* 1) Bariátrica (mantém funcionando) */}
                  <div style={{ marginBottom: "18px" }}>
                    <div className="pill-select-wrapper">
                      <select
                        className="pill-select"
                        value={intervencaoData.tipo}
                        onChange={(e) =>
                          setIntervencaoData({
                            ...intervencaoData,
                            tipo: e.target.value,
                          })
                        }
                      >
                        <option>Bypass Gástrico</option>
                        <option>Sleeve Gastrectomia</option>
                        <option>Banda Gástrica</option>
                      </select>
                    </div>
                  </div>

                  {/* 2) Medicamentos (só aparece, sem opções por enquanto) */}
                  <div style={{ marginBottom: "18px" }}>
                    <div className="pill-select-wrapper">
                      <select className="pill-select" disabled>
                        <option>Medicamentos (pedir informarções pro Rômulo)</option>
                      </select>
                    </div>
                  </div>

                  {/* 3) Dieta e Treino (só aparece, sem opções por enquanto) */}
                  <div style={{ marginBottom: 0 }}>
                    <div className="pill-select-wrapper">
                      <select className="pill-select" disabled>
                        <option>Dieta e Treino (pedir informarções pro Rômulo)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Obs abaixo do card */}
                <div
                  style={{
                    marginTop: "14px",
                    color: CORES.roxoPrincipal,
                    fontFamily: FONTES.secundaria,
                    fontSize: "0.95rem",
                    lineHeight: 1.3,
                  }}
                >
                  <b>Obs:</b> Informações autorreferidas pelo paciente, sem caráter
                  de prescrição ou recomendação médica. Tanto a bariátrica quanto os
                  medicamentos precisam de dieta e treino para resultados a longo prazo
                </div>
              </div>
            </div>


            {/* Direita – Gráfico */}
            <div
              style={{
                minWidth: "350px",
                height: "100%",
                alignSelf: "stretch",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "24px",
                  border: `1px solid ${CORES.roxoPrincipal}`,
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  minHeight: "400px",
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
                        onChange={(e) =>
                          setMetric(e.target.value as "peso" | "imc")
                        }
                      >
                        <option value="peso">Peso (kg)</option>
                        <option value="imc">IMC</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, minHeight: "300px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorMain"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CORES.roxoPrincipal}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CORES.roxoPrincipal}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
                      <XAxis
                        dataKey="month"
                        label={{
                          value: "Meses após cirurgia",
                          position: "insideBottomRight",
                          offset: -10,
                        }}
                        stroke={CORES.cinzaIcone}
                        tickCount={7}
                        // Força o eixo a começar em 0 e ir até 60
                        domain={[0, 60]}
                        type="number"
                      />
                      <YAxis
                        label={{
                          value: metric === "peso" ? "Peso (kg)" : "IMC",
                          angle: -90,
                          position: "insideLeft",
                        }}
                        stroke={CORES.cinzaIcone}
                        allowDecimals={false}
                      />
                      <Tooltip
                        formatter={(value: number) =>
                          metric === "peso"
                            ? `${value.toFixed(1)} kg`
                            : `${value.toFixed(1)} kg/m²`
                        }
                        labelFormatter={(label) => `Mês ${label}`}
                        contentStyle={{
                          backgroundColor: "white",
                          border: `1px solid ${CORES.roxoPrincipal}`,
                          borderRadius: "8px",
                          color: CORES.pretoPrincipal,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={metric === "peso" ? "weight" : "imc"}
                        stroke={CORES.roxoPrincipal}
                        strokeWidth={2}
                        fill="url(#colorMain)"
                        dot={false}
                        activeDot={{ r: 4 }}
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = CORES.roxoHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = CORES.roxoPrincipal)
                  }
                >
                  Consegui Resultados
                </button>
              </div>
            </div>
          </div>

          {/* SEÇÃO DE CARDS (consulta médica, bioimpedância...) */}
          <div
            style={{
              maxWidth: "1200px",
              width: "100%",
              marginTop: "60px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "32px",
            }}
          >
            {/* CARD 1 - Endocrinologia */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "28px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: FONTES.principal,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: CORES.pretoPrincipal,
                    margin: 0,
                    marginBottom: "8px",
                  }}
                >
                  Atendimento Médico em Endocrinologia
                </h3>

                <p
                  style={{
                    margin: 0,
                    marginBottom: "16px",
                    fontFamily: FONTES.secundaria,
                    fontSize: "0.95rem",
                    color: "#555555",
                  }}
                >
                  Receba prescrição medicamentosa adequada ao seu objetivo
                </p>

                <a
                  style={{
                    fontFamily: FONTES.principal,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: CORES.roxoPrincipal,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    transition: "color 0.2s, text-decoration 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = CORES.roxoHover
                    e.currentTarget.style.textDecoration = "underline"
                    const arrow = e.currentTarget.querySelector(
                      "span"
                    ) as HTMLSpanElement | null
                    if (arrow) arrow.style.transform = "translateX(4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = CORES.roxoPrincipal
                    e.currentTarget.style.textDecoration = "none"
                    const arrow = e.currentTarget.querySelector(
                      "span"
                    ) as HTMLSpanElement | null
                    if (arrow) arrow.style.transform = "translateX(0)"
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      transition: "transform 0.2s",
                    }}
                  >
                    <FaArrowRight />
                  </span>
                  <span>AGENDAR UMA CONSULTA</span>
                </a>
              </div>

              <div
                style={{
                  width: "78px",
                  height: "78px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/images/endocrinologista.jpg"
                  alt="Endocrinologista"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* CARD 3 - Nutricional */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "28px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: FONTES.principal,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: CORES.pretoPrincipal,
                    margin: 0,
                    marginBottom: "8px",
                  }}
                >
                  Atendimento Nutricional
                </h3>

                <p
                  style={{
                    margin: 0,
                    marginBottom: "16px",
                    fontFamily: FONTES.secundaria,
                    fontSize: "0.95rem",
                    color: "#555555",
                  }}
                >
                  Receba um plano alimentar adequado ao seu objetivo.
                </p>

                <a
                  style={{
                    fontFamily: FONTES.principal,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: CORES.roxoPrincipal,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    transition: "color 0.2s, text-decoration 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = CORES.roxoHover
                    e.currentTarget.style.textDecoration = "underline"
                    const arrow = e.currentTarget.querySelector(
                      "span"
                    ) as HTMLSpanElement | null
                    if (arrow) arrow.style.transform = "translateX(4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = CORES.roxoPrincipal
                    e.currentTarget.style.textDecoration = "none"
                    const arrow = e.currentTarget.querySelector(
                      "span"
                    ) as HTMLSpanElement | null
                    if (arrow) arrow.style.transform = "translateX(0)"
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      transition: "transform 0.2s",
                    }}
                  >
                    <FaArrowRight />
                  </span>
                  <span>AGENDAR UMA CONSULTA</span>
                </a>
              </div>

              <div
                style={{
                  width: "78px",
                  height: "78px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/images/nutricionista.webp"
                  alt="Nutricionista"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* CARD 4 - Cirurgia Bariátrica */}
            <div
              style={{
                background: "white",
                borderRadius: "24px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                padding: "28px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",

                ...(isMobile
                  ? {}
                  : {
                    gridColumn: "1 / -1",
                    justifySelf: "center",
                    width: "100%",
                    maxWidth: "584px",
                  }),
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: FONTES.principal,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: CORES.pretoPrincipal,
                    margin: 0,
                    marginBottom: "8px",
                  }}
                >
                  Atendimento Médico em Cirurgia Bariátrica
                </h3>

                <p
                  style={{
                    margin: 0,
                    marginBottom: "16px",
                    fontFamily: FONTES.secundaria,
                    fontSize: "0.95rem",
                    color: "#555555",
                  }}
                >
                  Receba orientações médicas relacionadas à cirurgia.
                </p>

                <a
                  style={{
                    fontFamily: FONTES.principal,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: CORES.roxoPrincipal,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    transition: "color 0.2s, text-decoration 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = CORES.roxoHover
                    e.currentTarget.style.textDecoration = "underline"
                    const arrow = e.currentTarget.querySelector(
                      "span"
                    ) as HTMLSpanElement | null
                    if (arrow) arrow.style.transform = "translateX(4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = CORES.roxoPrincipal
                    e.currentTarget.style.textDecoration = "none"
                    const arrow = e.currentTarget.querySelector(
                      "span"
                    ) as HTMLSpanElement | null
                    if (arrow) arrow.style.transform = "translateX(0)"
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      transition: "transform 0.2s",
                    }}
                  >
                    <FaArrowRight />
                  </span>
                  <span>AGENDAR UMA CONSULTA</span>
                </a>
              </div>

              <div
                style={{
                  width: "78px",
                  height: "78px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/images/cirurgiao.jpeg"
                  alt="Cirurgião bariátrico"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
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
