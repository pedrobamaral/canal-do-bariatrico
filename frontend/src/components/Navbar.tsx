"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { IoPerson } from "react-icons/io5"

// Ícones
import { FaUserMd, FaCalculator } from "react-icons/fa"
import { IoLogOutOutline } from "react-icons/io5"

// ✅ Mobile menu icons
import { FiMenu, FiX } from "react-icons/fi"
import { FiEdit2, FiUser } from "react-icons/fi"
import { MdCalculate } from "react-icons/md"

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
  const [mobileOpen, setMobileOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const checkAuth = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("bari_token") : null

    if (token) {
      setIsLoggedIn(true)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
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

    window.addEventListener("auth-changed", checkAuth)
    window.addEventListener("focus", checkAuth)

    const interval = setInterval(() => {
      const token = localStorage.getItem("bari_token")
      const currentlyLoggedIn = token !== null

      if (isLoggedIn !== currentlyLoggedIn) {
        checkAuth()
      }
    }, 1000)

    return () => {
      window.removeEventListener("auth-changed", checkAuth)
      window.removeEventListener("focus", checkAuth)
      clearInterval(interval)
    }
  }, [pathname, isLoggedIn])

  // ✅ fecha drawer ao trocar de rota
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // ✅ trava scroll quando drawer abre (mobile)
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

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
    <header className="fixed top-0 z-50 w-full h-16 overflow-visible bg-black shadow-md font-['Montserrat']">
      {/* ✅ Container interno (desktop intacto) */}
      <div className="h-full w-full flex items-center justify-between pr-8">
        {/* --- LADO ESQUERDO: LOGO --- */}
        <div
          className="h-full bg-black flex items-center pl-6 pr-8 shrink-0"
          style={{ borderBottomRightRadius: "30px" }}
        >
          {/* group227 à esquerda, bari_icon à direita */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center">
              <Image
                src="/images/bari_icon.png"
                alt="Barie icon"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <div className="flex items-center" aria-hidden>
              <Image
                src="/logo.svg"
                alt="Group 227"
                width={400}
                height={260}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* ✅ LADO DIREITO */}
        <div className="flex-1 flex items-center justify-end">
          {/* ========================= */}
          {/* ✅ DESKTOP (NÃO MUDA NADA) */}
          {/* ========================= */}
          <div className="hidden md:flex items-center gap-6 whitespace-nowrap">
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

                <Link
                  href={userId ? `/userPage/${userId}` : "/userPage"}
                  aria-label="Meu Perfil"
                >
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
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <IoLogOutOutline
                    size={26}
                    className="text-white hover:text-red-400 transition-colors cursor-pointer"
                  />
                </button>
              </>
            )}
          </div>

          {/* ========================= */}
          {/* ✅ MOBILE (NOVO) */}
          {/* ========================= */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileOpen(true)}
              className="p-2"
            >
              <FiMenu size={26} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Overlay (mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ✅ Drawer (mobile) */}
      <aside
        className={[
          "fixed right-0 top-0 z-[70] h-full w-[260px] bg-[#D9D9D9] shadow-xl transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-end p-3">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-[#6F3CF6]"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Menu items (mobile) */}
        <nav className="flex flex-col gap-4 px-6 pt-2 text-[#6F3CF6]">
          {!isLoggedIn ? (
            <>
              <Link
                href="/cadastro"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <FiEdit2 size={28} />
                <span className="font-medium text-lg">Cadastro</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <FiUser size={28} />
                <span className="font-medium text-lg">Login</span>
              </Link>

              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <MdCalculate size={28} />
                <span className="font-medium text-lg">Calculadora</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href={userId ? `/userPage/${userId}` : "/userPage"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <FiUser size={28} />
                <span className="font-medium text-lg">Perfil de Usuário</span>
              </Link>

              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <MdCalculate size={28} />
                <span className="font-medium text-lg">Calculadora</span>
              </Link>

              <Link
                href="/pacientes"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <FaUserMd size={28} />
                <span className="font-medium text-lg">Pacientes</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
                className="mt-2 flex items-center gap-3 text-left"
              >
                <IoLogOutOutline size={28} />
                <span className="font-medium text-lg">Sair</span>
              </button>
            </>
          )}
        </nav>
      </aside>
    </header>
  )
}
