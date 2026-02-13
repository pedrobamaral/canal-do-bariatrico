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
import { motion } from "framer-motion"

import Navbar from "@/components/Navbar"
import { HealthSurveyModal } from "@/components/others/HealthSurveyModal"

/* =========================
   TEMA MODERNO (DARK/GLASS)
========================= */
const THEME = {
  primary: "#8B5CF6",
  primaryDark: "#6D28D9",
  primarySoft: "rgba(139,92,246,0.25)",
  glass: "rgba(255,255,255,0.06)",
  glassSolid: "rgba(255,255,255,0.08)",
  border: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(139,92,246,0.6)",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.55)",
  textLabel: "#C4B5FD",
  inputBg: "rgba(255,255,255,0.08)",
  inputBorder: "rgba(255,255,255,0.15)",
}

/* =========================
   TIPOS
========================= */
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

type IntervencaoSelectValue =
  | ""
  | "dieta_treino"
  | "med_mounjaro"
  | "med_ozempic"
  | "med_topiramato"
  | "med_naltrexona_bupropiona"
  | "med_outro"
  | "cir_sleeve"
  | "cir_bypass"

/* =========================
   COMPONENTES REUTILIZÁVEIS
========================= */

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
    <div className="mb-7">
      <p className="text-sm font-semibold text-center mb-3" style={{ color: THEME.textLabel }}>
        {label}
      </p>

      <div className="relative h-[30px]">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeChange}
          className="slider-dark w-full"
          style={{
            background: `linear-gradient(to right, ${THEME.primary} 0%, ${THEME.primary} ${percentage}%, rgba(255,255,255,0.15) ${percentage}%, rgba(255,255,255,0.15) 100%)`,
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-1 mt-3">
        <div
          className="w-[90px] h-[34px] rounded-full flex items-center justify-center px-2"
          style={{ background: "rgba(255,255,255,0.1)", border: `1px solid ${THEME.border}` }}
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-full border-none outline-none bg-transparent text-center font-semibold text-white text-sm"
          />
        </div>
        <span className="text-xs" style={{ color: THEME.textMuted }}>{unit}</span>
      </div>
    </div>
  )
}

type ToggleProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between mb-4 py-2">
    <span className="text-white font-medium text-sm">{label}</span>
    <div
      onClick={() => onChange(!checked)}
      className="w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300"
      style={{ background: checked ? THEME.primary : "rgba(255,255,255,0.2)" }}
    >
      <div
        className="w-5 h-5 rounded-full bg-white absolute top-[2px] shadow transition-[left] duration-300"
        style={{ left: checked ? "calc(100% - 22px)" : "2px" }}
      />
    </div>
  </div>
)

/* =========================
   LÓGICA DE CÁLCULO (INALTERADA)
========================= */
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

  let aPlateau: number, k: number, ewl60Base: number

  if (tipoCirurgia === "Bypass Gástrico") {
    aPlateau = 0.75; k = 0.2095362; ewl60Base = 0.7
  } else if (tipoCirurgia === "Sleeve Gastrectomia") {
    aPlateau = 0.62; k = 0.2204662; ewl60Base = 0.55
  } else {
    aPlateau = 0.5; k = 0.1702752; ewl60Base = 0.45
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

function mapSelectToTipoCirurgia(v: IntervencaoSelectValue): string {
  if (v === "cir_sleeve") return "Sleeve Gastrectomia"
  if (v === "cir_bypass") return "Bypass Gástrico"
  return "Outra Intervenção"
}

/* =========================
   TOOLTIP CUSTOMIZADA
========================= */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  const dataKey = payload[0].dataKey
  return (
    <div
      className="rounded-xl px-4 py-2 text-sm shadow-lg"
      style={{
        background: "rgba(30,20,50,0.95)",
        border: `1px solid ${THEME.primary}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <p className="text-white/60 text-xs">Mês {label}</p>
      <p className="text-white font-semibold">
        {dataKey === "weight" ? `${val.toFixed(1)} kg` : `${val.toFixed(1)} kg/m²`}
      </p>
    </div>
  )
}

/* =========================
   PÁGINA PRINCIPAL
========================= */
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

  const [metric, setMetric] = useState<"peso" | "imc">("peso")
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [usuarioId, setUsuarioId] = useState<number | undefined>(undefined)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)

  const handleConseguiResultados = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://hotmart.com/pt-br"
    }
  }

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

  /* ── CARD GLASS helper ── */
  const glassCard = "rounded-3xl p-8 backdrop-blur-xl"
  const glassStyle = { background: THEME.glassSolid, border: `1px solid ${THEME.border}` }

  return (
    <main className="relative min-h-screen text-white">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/fundoAcad.jpeg')" }}
      />
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <Navbar />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ════════════════════════════════
              COLUNA ESQUERDA — CONTROLES
          ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* --- Paciente --- */}
            <div>
              <h3 className="text-sm font-bold mb-2 pl-8" style={{ color: THEME.textLabel }}>
                Paciente
              </h3>
              <div className={glassCard} style={glassStyle}>
                <SliderInput label="Peso" unit="kg" value={peso} min={25} max={300} step={1} onChange={setPeso} />
                <SliderInput label="Altura" unit="cm" value={altura} min={100} max={230} step={1} onChange={setAltura} />
                <SliderInput label="Idade" unit="anos" value={idade} min={18} max={80} step={1} onChange={setIdade} />

                <div className="mt-6">
                  <Toggle label="Fumante" checked={fumante} onChange={setFumante} />

                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-2" style={{ color: THEME.textLabel }}>
                      Diabetes tipo 2
                    </label>
                    <select
                      value={diabetes}
                      onChange={(e) => setDiabetes(e.target.value as DiabetesOption)}
                      className="select-glass w-full"
                    >
                      <option value="sem_diabetes">Sem diabetes</option>
                      <option value="pre_diabetes">Pré-diabetes</option>
                      <option value="diabetes">Diabetes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Intervenção --- */}
            <div>
              <h3 className="text-sm font-bold mb-2 pl-8" style={{ color: THEME.textLabel }}>
                Intervenção
              </h3>
              <div className={glassCard} style={glassStyle}>
                <label className="block text-sm font-semibold text-center mb-4" style={{ color: THEME.textLabel }}>
                  Tipo de Intervenção
                </label>

                <select
                  className="select-glass w-full"
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
                  <option value="" disabled>Selecione...</option>
                  <option value="dieta_treino">Dieta e Treino</option>
                  <optgroup label="Canetinhas Emagrecedoras">
                    <option value="med_mounjaro">Mounjaro</option>
                    <option value="med_ozempic">Ozempic</option>
                    <option value="med_topiramato">Topiramato</option>
                    <option value="med_naltrexona_bupropiona">Naltrexona + bupropiona</option>
                    <option value="med_outro">Outro</option>
                  </optgroup>
                  <optgroup label="Cirurgia Bariátrica">
                    <option value="cir_sleeve">Sleeve</option>
                    <option value="cir_bypass">Bypass</option>
                  </optgroup>
                </select>

                {intervencaoData.value === "med_outro" && (
                  <input
                    className="input-glass w-full mt-3"
                    value={intervencaoData.medicamentoOutro}
                    onChange={(e) =>
                      setIntervencaoData((prev) => ({
                        ...prev,
                        medicamentoOutro: e.target.value,
                      }))
                    }
                    placeholder="Nome da medicação"
                  />
                )}
              </div>

              <p className="mt-3 text-xs leading-snug px-2" style={{ color: THEME.textMuted }}>
                <strong className="text-white/70">Obs:</strong> Informações autorreferidas pelo paciente, sem caráter
                de prescrição ou recomendação médica. Tanto a bariátrica quanto os medicamentos precisam de dieta e
                treino para resultados a longo prazo.
              </p>
            </div>
          </motion.div>

          {/* ════════════════════════════════
              COLUNA DIREITA — GRÁFICO
          ════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <div
              className={`${glassCard} flex flex-col h-full min-h-[550px]`}
              style={glassStyle}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <h2 className="text-lg font-bold" style={{ color: THEME.textLabel }}>
                  Trajetória de Peso Prevista
                </h2>

                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as "peso" | "imc")}
                  className="select-glass"
                  style={{ minWidth: "140px" }}
                >
                  <option value="peso">Peso (kg)</option>
                  <option value="imc">IMC</option>
                </select>
              </div>

              {/* Chart */}
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.45} />
                        <stop offset="95%" stopColor={THEME.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis
                      dataKey="month"
                      stroke="rgba(255,255,255,0.35)"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      label={{
                        value: "Meses após intervenção",
                        position: "insideBottomRight",
                        offset: -15,
                        fill: "rgba(255,255,255,0.4)",
                        fontSize: 11,
                      }}
                      tickCount={7}
                      domain={[0, 60]}
                      type="number"
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.35)"
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                      label={{
                        value: metric === "peso" ? "Peso (kg)" : "IMC",
                        angle: -90,
                        position: "insideLeft",
                        fill: "rgba(255,255,255,0.4)",
                        fontSize: 11,
                      }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={metric === "peso" ? "weight" : "imc"}
                      stroke={THEME.primary}
                      strokeWidth={2.5}
                      fill="url(#areaGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: THEME.primary, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <HealthSurveyModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        usuarioId={usuarioId}
      />

      {/* ═══ CSS Global para componentes ═══ */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slider-dark {
          -webkit-appearance: none;
          appearance: none;
          height: 3px;
          border-radius: 999px;
          outline: none;
          cursor: pointer;
        }

        .slider-dark::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(139,92,246,0.25);
          margin-top: -9px;
        }

        .slider-dark::-webkit-slider-thumb:active {
          cursor: grabbing;
          box-shadow: 0 0 16px rgba(139,92,246,0.6);
        }

        .slider-dark::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: grab;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(139,92,246,0.25);
        }

        .slider-dark::-moz-range-track {
          height: 3px;
          border-radius: 999px;
          background: transparent;
        }

        .select-glass {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 32px 8px 16px;
          font-weight: 600;
          font-size: 0.875rem;
          color: white;
          background-color: rgba(255,255,255,0.08);
          cursor: pointer;
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          transition: border-color 0.2s;
        }

        .select-glass:focus {
          border-color: rgba(139,92,246,0.6);
        }

        .select-glass option,
        .select-glass optgroup {
          background: #1a1028;
          color: white;
        }

        .input-glass {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.875rem;
          color: white;
          background-color: rgba(255,255,255,0.08);
          outline: none;
          transition: border-color 0.2s;
        }

        .input-glass:focus {
          border-color: rgba(139,92,246,0.6);
        }

        .input-glass::placeholder {
          color: rgba(255, 255, 255, 0.35);
          font-weight: 500;
        }
      `}} />
    </main>
  )
}
