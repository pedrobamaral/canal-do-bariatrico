"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// Ícones (mantive os seus do protótipo)
import { FaUserMd, FaCalculator, FaUser } from "react-icons/fa"
import { IoNutritionSharp, IoLogOutOutline } from "react-icons/io5"
import { RiUser3Fill } from "react-icons/ri"

const CORES = {
  roxoPrincipal: "#6F3CF6",
  roxoHover: "#5c2fe0",
  pretoPrincipal: "#19191A",
  azulHover: "#62B4FF",
  vermelhoHover: "#FF3B5C",
}

export default function HeaderTeste() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    window.location.href = "/"
  }

  const iconBaseStyle =
    "text-white hover:text-[#62B4FF] transition-colors cursor-pointer"

  return (
    <header className="fixed top-0 z-50 w-full h-20 bg-black shadow-md font-['Montserrat']">
      {/* ✅ Container interno pra controlar layout e evitar “espremido” */}
      <div className="h-full w-full flex items-center justify-between pr-8">
        {/* --- LADO ESQUERDO: LOGO --- */}
        <div
          className="h-full bg-black flex items-center pl-8 pr-8 shrink-0"
          style={{ borderBottomRightRadius: "30px" }}
        >
          <div className="relative w-[320px] h-11 min-w-0">
            <Image
              src="/imagens/logo.png"
              alt="Logo BARIE"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* ✅ LADO DIREITO: agora ocupa o espaço restante e alinha no fim */}
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center gap-6 whitespace-nowrap">
            {/* ✅ DESLOGADO */}
            {!isLoggedIn && (
              <>
                <Link href="/" aria-label="Calculadora">
                  <FaCalculator size={24} className={iconBaseStyle} />
                </Link>

                {/* LOGIN: hover azul igual protótipo */}
                <Link
                  href="/login"
                  style={{
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                    fontFamily: "Montserrat, sans-serif",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = CORES.azulHover)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                >
                  LOGIN
                </Link>

                {/* CADASTRE-SE: hover fica branco (igual protótipo) */}
                <Link href="/cadastro" style={{ textDecoration: "none" }}>
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
                      transition: "background 0.2s, color 0.2s",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "white"
                      e.currentTarget.style.color = CORES.pretoPrincipal
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = CORES.roxoPrincipal
                      e.currentTarget.style.color = "white"
                    }}
                  >
                    CADASTRE-SE
                  </button>
                </Link>
              </>
            )}

            {/* ✅ LOGADO */}
            {isLoggedIn && (
              <>
                <Link href="#" aria-label="Médico">
                  <FaUserMd size={24} className={iconBaseStyle} />
                </Link>

                <Link href="#" aria-label="Dieta">
                  <IoNutritionSharp size={24} className={iconBaseStyle} />
                </Link>

                <Link href="#" aria-label="Treino">
                  <FaUser size={22} className={iconBaseStyle} />
                </Link>

                <Link href="/" aria-label="Calculadora">
                  <FaCalculator size={22} className={iconBaseStyle} />
                </Link>

                <Link href="/dashboard" aria-label="Meu Perfil">
                  <RiUser3Fill
                    size={26}
                    className="text-[#62B4FF] hover:text-white transition-colors cursor-pointer"
                  />
                </Link>

                <div className="h-6 w-px bg-gray-700 mx-2" />

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair"
                  style={{ background: "transparent", border: "none", padding: 0 }}
                >
                  <IoLogOutOutline
                    size={26}
                    className="text-white hover:text-red-400 transition-colors cursor-pointer"
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
