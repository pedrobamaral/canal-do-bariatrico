"use client"

import Image from "next/image"
import Navbar from "@/components/Navbar"

export default function Page() {
  return (
    <>
      <Navbar />
      
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <Image
        src="/images/barieShop.jpeg"
        alt="Background"
        fill
        priority
        quality={100}
        unoptimized
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Conteúdo */}
      <div className="relative z-10 flex min-h-screen items-center justify-end px-6 md:px-16">
        {/* Card */}
        <div
          className="
              w-full max-w-xl
              rounded-3xl
              bg-white/10
              backdrop-blur-xl
              border border-white/20
              shadow-[0_0_60px_rgba(111,60,246,0.25)]
              p-8 md:p-10
              text-white
            "
        >
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Seu compromisso <br /> já começou.
          </h1>

          <p className="mt-3 text-white/80 text-base md:text-lg">
            Ative agora seu acompanhamento completo.
          </p>

          {/* Lista */}
          <ul className="mt-6 space-y-4 text-sm md:text-base">
            <li className="flex items-start gap-3">
              <span className="text-[#6F3CF6] text-lg">✓</span>
              <span>
                <strong className="text-[#6F3CF6]">
                  Plano alimentar, treino e ajustes personalizados
                </strong>{" "}
                com base nos seus check-ins.
              </span>
            </li>

            <li className="flex items-center gap-3">
              <span className="text-[#6F3CF6] text-lg">✓</span>
              <span className="text-[#6F3CF6] font-medium">
                Sete dias gratuitos.
              </span>
            </li>

            <li className="flex items-center gap-3">
              <span className="text-[#6F3CF6] text-lg">✓</span>
              <span>Depois, o plano segue mensal.</span>
            </li>

            <li className="flex items-center gap-3">
              <span className="text-[#6F3CF6] text-lg">✓</span>
              <span>Cancelamento livre.</span>
            </li>
          </ul>

          {/* Botão */}
          <a
            href="https://hotmart.com/pt-br"
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-8 inline-block w-full text-center
              rounded-full
              bg-gradient-to-r from-[#6F3CF6] to-[#5c2fe0]
              py-4
              text-lg font-semibold
              text-white
              shadow-[0_0_30px_rgba(111,60,246,0.6)]
              transition
              hover:scale-[1.02]
              hover:shadow-[0_0_45px_rgba(111,60,246,0.9)]
              active:scale-[0.98]
            "
          >
            Começar teste gratuito
          </a>
        </div>
      </div>
      </main>
    </>
  )
}