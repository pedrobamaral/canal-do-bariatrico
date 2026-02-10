// app/page.tsx (ou o arquivo da sua Home)
"use client"

import React, { useEffect, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"

// ✅ Navbar nova
import Navbar from "@/components/Navbar"

// ✅ Modais
import { HealthSurveyModal } from "@/components/modals/HealthSurveyModal"
import { PostLoginModal, PostLoginData } from "@/components/modals/PostLoginModal"
import { getUserById } from "@/api/api"

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

  useEffect(() => setInputValue(String(value)), [value])

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "")
    setInputValue(raw)
    if (raw === "") return
    const num = Number(raw)
    if (Number.isNaN(num)) return
    onChange(Math.min(max, Math.max(min, num)))
  }

  const handleInputBlur = () => {
    if (inputValue === "") {
      setInputValue(String(value))
      return
    }
    const num = Number(inputValue)
    const clamped = Math.min(max, Math.max(min, num))
    if (clamped !== value) onChange(clamped)
    setInputValue(String(clamped))
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
  const toggleStyle: React.CSSProperties = {
    width: "48px",
    height: "24px",
    borderRadius: "12px",
    background: checked ? CORES.roxoPrincipal : "#ccc",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.3s",
    flexShrink: 0,
  }

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
  weight: number
  imc: number
}

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

  const pesoIdeal = 25 * alturaM2
  const excessoPeso = Math.max(peso - pesoIdeal, 0)

  let aPlateau: number
  let k: number
  let ewl60Base: number

  if (tipoCirurgia === "Bypass Gástrico") {
    aPlateau = 0.75
    k = 0.2095362
    ewl60Base = 0.7
  } else if (tipoCirurgia === "Sleeve Gastrectomia") {
    aPlateau = 0.62
    k = 0.2204662
    ewl60Base = 0.55
  } else {
    aPlateau = 0.5
    k = 0.1702752
    ewl60Base = 0.45
  }

  const ewl24Base = aPlateau * (1 - Math.exp(-k * 24))

  let fatorRisco = 1
  if (idade >= 60) fatorRisco -= 0.1
  else if (idade >= 50) fatorRisco -= 0.05

  if (fumante) fatorRisco -= 0.05

  if (diabetes === "diabetes") fatorRisco -= 0.08
  else if (diabetes === "pre_diabetes") fatorRisco -= 0.04

  fatorRisco = Math.min(1.05, Math.max(0.7, fatorRisco))

  const data: ChartPoint[] = []

  for (let mes = 0; mes <= 60; mes++) {
    let ewlBruta: number

    if (mes <= 24) {
      ewlBruta = aPlateau * (1 - Math.exp(-k * mes))
    } else {
      const t = (mes - 24) / (60 - 24)
      ewlBruta = ewl24Base - (ewl24Base - ewl60Base) * t
    }

    let ewlAjustada = ewlBruta * fatorRisco
    ewlAjustada = Math.min(0.95, Math.max(0, ewlAjustada))

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

// ✅ 1 SELECT com optgroup
type IntervencaoSelectValue =
  | ""
  | "dieta_treino"
  | "med_mounjaro"
  | "med_ozempic" // ✅ ADICIONADO
  | "med_topiramato"
  | "med_naltrexona_bupropiona"
  | "med_outro"
  | "cir_sleeve"
  | "cir_bypass"

function mapSelectToTipoCirurgia(v: IntervencaoSelectValue): string {
  if (v === "cir_sleeve") return "Sleeve Gastrectomia"
  if (v === "cir_bypass") return "Bypass Gástrico"
  return "Outra Intervenção"
}

export default function Calculator() {
  const [peso, setPeso] = useState(80)
  const [altura, setAltura] = useState(170)
  const [idade, setIdade] = useState(35)
  const [fumante, setFumante] = useState(false)
  const [diabetes, setDiabetes] = useState<DiabetesOption>("sem_diabetes")

  const [intervencaoData, setIntervencaoData] = useState<{
    value: IntervencaoSelectValue
    medicamentoOutro: string
    tipoCirurgia: string
  }>({
    value: "",
    medicamentoOutro: "",
    tipoCirurgia: "Outra Intervenção",
  })

  const [isMobile, setIsMobile] = useState(false)
  const [metric, setMetric] = useState<"peso" | "imc">("peso")
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [usuarioId, setUsuarioId] = useState<number | undefined>(undefined)

  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)
  const [isPostLoginModalOpen, setIsPostLoginModalOpen] = useState(false)

  const handleConseguiResultados = () => {
    setIsHealthModalOpen(true)
  }

  const handleHealthSurveyClose = () => {
    setIsHealthModalOpen(false)
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    setChartData(
      calcularTrajetoria({
        peso,
        altura,
        idade,
        fumante,
        diabetes,
        tipoCirurgia: intervencaoData.tipoCirurgia,
      })
    )
  }, [peso, altura, idade, fumante, diabetes, intervencaoData.tipoCirurgia])

  // Abre o modal pós-login automaticamente se o usuário não preencheu os dados
  useEffect(() => {
    const token = localStorage.getItem("bari_token")
    if (!token) return

    // Decodifica o token para pegar o ID do usuário
    const checkUserData = async () => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const userId = payload.sub
        setUsuarioId(userId)

        // Busca os dados do usuário para verificar se já preencheu os dados obrigatórios
        const userData = await getUserById(userId)
        
        // Verifica se os campos obrigatórios estão preenchidos
        const hasRequiredData = userData.peso && userData.altura && userData.sexo && userData.meta
        
        if (!hasRequiredData) {
          setIsPostLoginModalOpen(true)
        }
      } catch (error) {
        console.error('Erro ao verificar dados do usuário:', error)
      }
    }

    checkUserData()
  }, [])

  const handlePostLoginFinish = (data: PostLoginData) => {
    setIsPostLoginModalOpen(false)
  }

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
        <div style={{ maxWidth: "1200px", width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "30px",
            }}
          >
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
                  <SliderInput label="Peso" unit="kg" value={peso} min={25} max={300} step={1} onChange={setPeso} />
                  <SliderInput label="Altura" unit="cm" value={altura} min={100} max={230} step={1} onChange={setAltura} />
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

              {/* ✅ INTERVENÇÃO: 1 SELECT */}
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

                  <div style={{ marginBottom: intervencaoData.value === "med_outro" ? "14px" : 0 }}>
                    <div className="pill-select-wrapper">
                      <select
                        className="pill-select"
                        value={intervencaoData.value}
                        onChange={(e) => {
                          const v = e.target.value as IntervencaoSelectValue
                          setIntervencaoData((prev) => ({
                            ...prev,
                            value: v,
                            medicamentoOutro: v === "med_outro" ? prev.medicamentoOutro : "",
                            tipoCirurgia: mapSelectToTipoCirurgia(v),
                          }))
                        }}
                      >
                        <option value="" disabled>
                          Selecione...
                        </option>

                        <option value="dieta_treino">Dieta e Treino</option>

                        <optgroup label="Canetinhas Emagrecedoras">
                          <option value="med_mounjaro">Mounjaro</option>
                          <option value="med_ozempic">Ozempic</option> {/* ✅ ADICIONADO */}
                          <option value="med_topiramato">Topiramato</option>
                          <option value="med_naltrexona_bupropiona">Naltrexona + bupropiona</option>
                          <option value="med_outro">Outro</option>
                        </optgroup>

                        <optgroup label="Cirurgia Bariátrica">
                          <option value="cir_sleeve">Sleeve</option>
                          <option value="cir_bypass">Bypass</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  {intervencaoData.value === "med_outro" && (
                    <div className="pill-select-wrapper">
                      <input
                        className="pill-input"
                        value={intervencaoData.medicamentoOutro}
                        onChange={(e) =>
                          setIntervencaoData((prev) => ({
                            ...prev,
                            medicamentoOutro: e.target.value,
                          }))
                        }
                        placeholder="Escreva o nome da medicação"
                      />
                    </div>
                  )}
                </div>

                <div
                  style={{
                    marginTop: "14px",
                    color: CORES.roxoPrincipal,
                    fontFamily: FONTES.secundaria,
                    fontSize: "0.95rem",
                    lineHeight: 1.3,
                  }}
                >
                  <b>Obs:</b> Informações autorreferidas pelo paciente, sem caráter de prescrição ou recomendação médica.
                  Tanto a bariátrica quanto os medicamentos precisam de dieta e treino para resultados a longo prazo
                </div>
              </div>
            </div>

            <div style={{ minWidth: "350px", height: "100%", alignSelf: "stretch" }}>
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
                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CORES.roxoPrincipal} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CORES.roxoPrincipal} stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid strokeDasharray="3 3" stroke="#d0d0d0" />
                      <XAxis
                        dataKey="month"
                        label={{ value: "Meses após cirurgia", position: "insideBottomRight", offset: -10 }}
                        stroke={CORES.cinzaIcone}
                        tickCount={7}
                        domain={[0, 60]}
                        type="number"
                      />
                      <YAxis
                        label={{ value: metric === "peso" ? "Peso (kg)" : "IMC", angle: -90, position: "insideLeft" }}
                        stroke={CORES.cinzaIcone}
                        allowDecimals={false}
                      />

                      <Tooltip
                        formatter={(value: number | undefined) =>
                          value !== undefined
                            ? metric === "peso"
                              ? `${value.toFixed(1)} kg`
                              : `${value.toFixed(1)} kg/m²`
                            : ""
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
                  onMouseEnter={(e) => (e.currentTarget.style.background = CORES.roxoHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = CORES.roxoPrincipal)}
                  onClick={() => setIsHealthModalOpen(true)}
                >
                  Conseguir Resultados
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HealthSurveyModal isOpen={isHealthModalOpen} onClose={handleHealthSurveyClose} usuarioId={usuarioId} />

      <PostLoginModal
        isOpen={isPostLoginModalOpen}
        onCloseAction={() => setIsPostLoginModalOpen(false)}
        onFinishAction={handlePostLoginFinish}
        onFillAdditionalInfoAction={() => {
        }}
        usuarioId={usuarioId}
      />

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

        .pill-input {
          width: 100%;
          border-radius: 999px;
          border: 2px solid ${CORES.roxoPrincipal};
          padding: 8px 16px;
          font-family: ${FONTES.secundaria};
          font-weight: 600;
          font-size: 0.9rem;
          color: ${CORES.pretoPrincipal};
          background-color: white;
          outline: none;
        }

        .pill-input::placeholder {
          color: ${CORES.cinzaIcone};
          font-weight: 500;
        }

        a:hover .arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  )
}
