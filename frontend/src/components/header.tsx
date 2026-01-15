"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"

// Ícones (react-icons)
import { FaUserMd, FaCalculator, FaUser } from "react-icons/fa"
import { IoNutritionSharp, IoLogOutOutline } from "react-icons/io5"
import { RiUser3Fill } from "react-icons/ri"
import { HiOutlineSquares2X2 } from "react-icons/hi2"

type HeaderProps = {
  variant?: "public" | "app"
}

export default function HeaderTeste({ variant = "app" }: HeaderProps) {
  const iconBase =
    "text-white hover:text-[#62B4FF] transition-colors cursor-pointer"

  return (
    <header className="fixed top-0 z-50 w-full h-20 bg-[#0B0B0C] flex items-center justify-between pr-8 shadow-md font-['Montserrat']">
      {/* LEFT: logo area */}
      <div
        className="h-full bg-[#0B0B0C] flex items-center pl-8 pr-8"
        style={{ borderBottomRightRadius: 30 }}
      >
        <div className="relative w-[260px] h-11">
          <Image
            src="/imagens/logo.png"
            alt="Logo BARIE"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      </div>

      {/* RIGHT */}
      {variant === "public" ? (
        <div className="flex items-center gap-6">
          {/* ícone “grid” do protótipo */}
          <Link href="#" aria-label="Menu">
            <HiOutlineSquares2X2 size={22} className={iconBase} />
          </Link>

          <Link
            href="/login"
            className="text-white text-sm font-semibold hover:text-[#62B4FF] transition-colors"
          >
            LOGIN
          </Link>

          <Link
            href="/cadastro"
            className="bg-white text-[#6F3CF6] font-extrabold text-xs px-6 py-2 rounded-full border border-[#EAEAEA] shadow-sm hover:bg-[#F5F5F5] transition-colors"
          >
            CADASTRE-SE
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* 1. Médico */}
          <Link href="#" aria-label="Médico">
            <FaUserMd size={22} className={iconBase} />
          </Link>

          {/* 2. Dieta */}
          <Link href="#" aria-label="Dieta">
            <IoNutritionSharp size={22} className={iconBase} />
          </Link>

          {/* 3. Treino / corpo */}
          <Link href="#" aria-label="Treino">
            <FaUser size={20} className={iconBase} />
          </Link>

          {/* 4. Calculadora */}
          <Link href="#" aria-label="Calculadora">
            <FaCalculator size={20} className={iconBase} />
          </Link>

          {/* 5. Usuário (destacado) */}
          <Link href="#" aria-label="Meu Perfil">
            <RiUser3Fill
              size={24}
              className="text-[#62B4FF] hover:text-white transition-colors cursor-pointer"
            />
          </Link>

          {/* Separador */}
          <div className="h-6 w-px bg-[#2A2A2A] mx-2" />

          {/* Logout */}
          <Link href="/login" aria-label="Sair">
            <IoLogOutOutline
              size={24}
              className="text-white hover:text-red-400 transition-colors cursor-pointer"
            />
          </Link>
        </div>
      )}
    </header>
  )
}
