"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { IoPerson } from "react-icons/io5";

// Ícones (mantive os seus do protótipo)
import { FaUserMd, FaCalculator, FaUser } from "react-icons/fa"
import { IoLogOutOutline } from "react-icons/io5"

const CORES = {
  roxoPrincipal: "#6F3CF6",
  roxoHover: "#5c2fe0",
  pretoPrincipal: "#19191A",
  azulHover: "#62B4FF",
  vermelhoHover: "#FF3B5C",
}

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const checkAuth = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("bari_token") : null
    
    if (token) {
      setIsLoggedIn(true)
      
      // Decodifica o token para pegar o ID do usuário
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserId(payload.sub)
      } catch (err) {
        console.error("Erro ao decodificar token:", err)
        setUserId(null)
      }
    } else {
      setIsLoggedIn(false)
      setUserId(null)
    }
  }

  useEffect(() => {
    checkAuth()

    // Atualiza quando login/logout "avisar" (mesma aba)
    window.addEventListener("auth-changed", checkAuth)

    // Atualiza ao voltar o foco pra aba (extra segurança)
    window.addEventListener("focus", checkAuth)

    // Verifica periodicamente se o token ainda existe
    const interval = setInterval(() => {
      const token = localStorage.getItem("bari_token");
      const currentlyLoggedIn = token !== null;
      
      if (isLoggedIn !== currentlyLoggedIn) {
        checkAuth();
      }
    }, 1000);

    return () => {
      window.removeEventListener("auth-changed", checkAuth)
      window.removeEventListener("focus", checkAuth)
      clearInterval(interval);
    }
  }, [pathname, isLoggedIn])

  const handleLogout = () => {
    localStorage.removeItem("bari_token")
    localStorage.removeItem("bari_user")
    
    setIsLoggedIn(false)
    setUserId(null)

    window.dispatchEvent(new Event("auth-changed"))

    router.push("/")
    router.refresh()
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
              src="/images/logo.png"
              alt="Logo BARIE"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* ✅ LADO DIREITO */}
        <div className="flex-1 flex items-center justify-end">
          <div className="flex items-center gap-6 whitespace-nowrap">
            {/* ✅ DESLOGADO */}
            {!isLoggedIn && (
              <>
                <Link href="/" aria-label="Calculadora">
                  <FaCalculator size={24} className={iconBaseStyle} />
                </Link>

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
                <Link href="/pacientes" aria-label="Médico">
                  <FaUserMd size={24} className={iconBaseStyle} />
                </Link>

                <Link href="/calculator" aria-label="Calculadora">
                  <FaCalculator size={22} className={iconBaseStyle} />
                </Link>

                <Link href={userId ? `/userPage/${userId}` : "/userPage"} aria-label="Meu Perfil">
                  <IoPerson
                    size={26}
                    className="text-white hover:text-[#62B4FF] transition-colors cursor-pointer"
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
