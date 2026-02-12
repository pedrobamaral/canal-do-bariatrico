"use client"

import React from "react"
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6"

const CORES = {
  roxoPrincipal: "#6F3CF6",
  pretoPrincipal: "#19191A",
}

const FONTES = {
  principal: "'Montserrat', 'Arial', sans-serif",
  secundaria: "sans-serif",
}

type Props = {
  isMobile: boolean
}

export default function CardsSection({ isMobile }: Props) {
  return (
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
            }}
          >
            <span className="arrow">
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
          <Image src="/images/endocrinologista.png" alt="Endocrinologista" fill style={{ objectFit: "cover" }} />
        </div>
      </div>

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
            }}
          >
            <span className="arrow">
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
          <Image src="/images/nutricionista.png" alt="Nutricionista" fill style={{ objectFit: "cover" }} />
        </div>
      </div>

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
            }}
          >
            <span className="arrow">
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
          <Image src="/images/cirurgiao.png" alt="Cirurgião bariátrico" fill style={{ objectFit: "cover" }} />
        </div>
      </div>

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
            BB Fit – Bruno & Barie
            <br />
            Plataforma de treino inteligente
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
            Acesse sua plataforma de treinos personalizada para potencializar seus resultados.
          </p>

          <div
            style={{
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div style={{ position: "relative", width: "100px", height: "50px" }}>
              <Image src="/images/hotmart.png" alt="Hotmart" fill style={{ objectFit: "contain" }} />
            </div>
          </div>

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
            }}
          >
            <span className="arrow">
              <FaArrowRight />
            </span>
            <span>ACESSAR PLATAFORMA DE TREINO</span>
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
          <Image src="/images/bbfit.png" alt="BB Fit" fill style={{ objectFit: "cover" }} />
        </div>
      </div>
    </div>
  )
}
