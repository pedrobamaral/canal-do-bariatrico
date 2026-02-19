"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

// Ícones
import { FaUserMd, FaCalculator, FaShoppingBag } from "react-icons/fa"
import { IoLogOutOutline } from "react-icons/io5"
import { IoPerson } from "react-icons/io5"

// ✅ Mobile menu icons
import { FiMenu, FiX } from "react-icons/fi"
import { FiEdit2, FiUser } from "react-icons/fi"
import { MdCalculate } from "react-icons/md"

const CORES = {
  roxoPrincipal: "#6F3CF6",
  roxoHover: "#5c2fe0",
  roxoClaro: "#C9B5FF",
  pretoPrincipal: "#19191A",
  azulHover: "#62B4FF",
  vermelhoHover: "#FF3B5C",
}

export default function Navbar() {
  const [userId, setUserId] = useState<number | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  const checkAuth = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("bari_token") : null

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUserId(payload.sub)
        if (payload.admin === true || payload.role === "admin") setIsAdmin(true)
        else setIsAdmin(false)
      } catch (err) {
        console.error("Erro ao decodificar token:", err)
        setUserId(null)
        setIsAdmin(false)
      }
      try {
        const raw = localStorage.getItem("bari_user")
        if (raw) {
          const userObj = JSON.parse(raw)
          if (userObj?.admin === true || userObj?.role === "admin") setIsAdmin(true)
        }
      } catch (e) {
        // ignore
      }
    } else {
      setUserId(null)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    checkAuth()

    window.addEventListener("auth-changed", checkAuth)
    window.addEventListener("focus", checkAuth)

    return () => {
      window.removeEventListener("auth-changed", checkAuth)
      window.removeEventListener("focus", checkAuth)
    }
  }, [pathname])

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

    setUserId(null)
    setIsAdmin(false)

    window.dispatchEvent(new Event("auth-changed"))

    router.push("/")
    router.refresh()
  }

  const iconBaseStyle =
    "text-white hover:text-[#6D28D9] transition-colors cursor-pointer"

  return (
    <header className="fixed top-0 z-50 w-full h-12 overflow-visible bg-transparent shadow-md font-['Montserrat']">
      {/* ✅ Container interno (desktop intacto) */}
      <div className="h-full w-full flex items-center justify-between pr-4">
        {/* --- LADO ESQUERDO: LOGO --- */}
        <div className="h-full flex items-center pl-4 pr-4 shrink-0" style={{ borderBottomRightRadius: "30px" }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center">
              <Image
                src="/images/newBarieIcon.png"
                alt="New Barie Icon"
                width={72}
                height={72}
                className="w-14 h-14 md:w-18 md:h-18 object-contain"
                priority
              />
            </div>

            <div className="flex items-center ml-3 min-w-0">
              <p className="hidden sm:flex items-center gap-2 text-sm font-semibold leading-tight">
                <span className="text-white">Seu Progresso.</span>
                <span style={{ color: CORES.roxoClaro }}>Sem bagunça.</span>
                <span style={{ color: CORES.roxoPrincipal }}>Sem achismo.</span>
              </p>
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

            {/* ✅ LOGADO (Navbar assume usuário autenticado) */}
              <>

                <Link href="/shop" aria-label="Shop">
                  <FaShoppingBag size={22} className={iconBaseStyle} />
                </Link>

                <Link href="/calculator" aria-label="Calculadora">
                  <FaCalculator size={22} className={iconBaseStyle} />
                </Link>

                <Link href={userId ? `/userPage/${userId}` : "/userPage"} aria-label="Meu Perfil">
                  <IoPerson size={26} className="text-white hover:text-[#6D28D9] transition-colors cursor-pointer" />
                </Link>

                {isAdmin && (
                  <Link href="/pacientes" aria-label="Médico">
                    <FaUserMd size={24} className={iconBaseStyle} />
                  </Link>
                )}

                <div className="h-6 w-px bg-gray-700 mx-2" />

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair"
                  style={{ background: "transparent", border: "none", padding: 0 }}
                >
                  <IoLogOutOutline size={26} className="text-white hover:text-red-400 transition-colors cursor-pointer" />
                </button>
              </>
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
              <FiMenu size={22} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Overlay (mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={[
          "fixed right-0 top-0 z-[70] h-full w-[260px] bg-[#D9D9D9] shadow-xl transition-transform md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-end p-3">
          <button type="button" aria-label="Fechar menu" onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-[#6F3CF6]">
            <FiX size={22} />
          </button>
        </div>

        {/* Menu items (mobile) - always for logged users */}
        <nav className="flex flex-col gap-4 px-6 pt-2 text-[#6F3CF6]">
          <Link href={userId ? `/userPage/${userId}` : "/userPage"} onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <FiUser size={28} />
            <span className="font-medium text-lg">Perfil de Usuário</span>
          </Link>

          <Link href="/calculator" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
            <MdCalculate size={28} />
            <span className="font-medium text-lg">Calculadora</span>
          </Link>

          {isAdmin && (
            <Link href="/pacientes" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <FaUserMd size={28} />
              <span className="font-medium text-lg">Pacientes</span>
            </Link>
          )}

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
        </nav>
      </aside>
    </header>
  )
}
