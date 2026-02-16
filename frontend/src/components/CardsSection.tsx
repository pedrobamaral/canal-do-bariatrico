"use client"

import React from "react"
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6"

export default function CardsSection() {
  return (
    <div className="container mt-16 grid gap-8 md:grid-cols-2">
      {[{
        title: 'Atendimento Médico em Endocrinologia',
        desc: 'Receba prescrição medicamentosa adequada ao seu objetivo',
        img: '/images/endocrinologista.png'
      }, {
        title: 'Atendimento Nutricional',
        desc: 'Receba um plano alimentar adequado ao seu objetivo.',
        img: '/images/nutricionista.png'
      }, {
        title: 'Atendimento Médico em Cirurgia Bariátrica',
        desc: 'Receba orientações médicas relacionadas à cirurgia.',
        img: '/images/cirurgiao.png'
      }, {
        title: 'BB Fit – Bruno & Barie',
        desc: 'Acesse sua plataforma de treinos personalizada para potencializar seus resultados.',
        img: '/images/bbfit.png'
      }].map((card) => (
        <article key={card.title} className="bg-white rounded-2xl shadow-md p-6 flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[#19191A] mb-2">{card.title}</h3>
            <p className="text-gray-600 mb-3">{card.desc}</p>
            <a className="inline-flex items-center gap-2 text-[#6F3CF6] font-bold">
              <FaArrowRight />
              <span>AGENDAR UMA CONSULTA</span>
            </a>
          </div>

          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={card.img} alt={card.title} width={96} height={96} className="object-cover w-full h-full" />
          </div>
        </article>
      ))}
    </div>
  )
}
