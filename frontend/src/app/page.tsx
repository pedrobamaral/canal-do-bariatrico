"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa";

const sectionAnim = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function Home() {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <main ref={heroRef} className="bg-black text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="relative min-h-screen flex items-center">

        {/* Glow discreto */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-500/10 blur-[160px] rounded-full" />

        {/* Header */}
        <header className="absolute top-0 left-0 w-full z-20">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <span className="font-semibold tracking-wide">
              Canal da Barie
            </span>

            <div className="flex items-center gap-6">
              <button className="text-sm text-gray-300 hover:text-white transition">
                LOGIN
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-full text-sm font-semibold"
              >
                CADASTRE-SE
              </motion.button>
            </div>
          </div>
        </header>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-32 relative z-10">

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight">
              Sua Plataforma <br />
              de Saúde <span className="text-blue-400">Personalizada</span>
            </h1>

            <p className="mt-6 text-gray-400 max-w-md">
              Coleta inteligente de dados, calculadora avançada e
              acompanhamento personalizado em um único lugar.
            </p>

            <motion.button
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 25px rgba(168,85,247,0.35)",
              }}
              whileTap={{ scale: 0.96 }}
              className="mt-10 bg-purple-600 px-10 py-4 rounded-full font-semibold"
            >
              CONHEÇA MAIS
            </motion.button>
          </motion.div>

          {/* Personagem */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="absolute inset-0 bg-purple-500/10 blur-[140px] rounded-full" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Image
                src="/images/bari_padrao.png"
                alt="Barie"
                width={460}
                height={620}
                priority
              />
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ================= SOBRE O PROJETO ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-32 bg-black"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Sobre o Projeto
            </h2>
            <p className="text-gray-400 leading-relaxed">
              O Canal da Barie foi criado para transformar a forma como
              profissionais da saúde organizam dados, acompanham pacientes
              e tomam decisões, unindo tecnologia, simplicidade e design.
            </p>
          </div>

          {/* Vídeo vertical */}
          <div className="flex justify-center">
            <motion.div className="w-[260px] h-[460px] rounded-2xl overflow-hidden border border-white/10">
              <video
                src="/videoBari.mp4"
                className="w-full h-full object-cover"
                controls
                playsInline
              />
            </motion.div>
          </div>

        </div>
      </motion.section>

      {/* ================= IDEALIZADOR ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-32 bg-[#ebe7e4] text-black"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Sobre o Idealizador
          </h2>
          <p className="mt-2 text-gray-600">
            Conheça quem está por trás do Canal da Barie
          </p>

          <div className="mt-16 bg-white rounded-2xl shadow-lg p-12 max-w-3xl mx-auto">

            {/* Foto */}
            <div className="flex justify-center">
              <Image
                src="/images/rômulo.png"
                alt="Idealizador"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>

            <h3 className="mt-6 text-xl font-semibold">
              Rômulo Vidal
            </h3>
            <span className="text-purple-600 text-sm font-medium">
              Criador do Canal da Barie
            </span>

            <p className="mt-6 text-gray-600 leading-relaxed">
              Profissional com experiência em saúde e tecnologia,
              focado em criar soluções práticas que facilitem a
              rotina de profissionais e pacientes.
            </p>

            {/* Redes sociais */}
            <div className="mt-8 flex justify-center gap-4">
              {[FaLinkedinIn, FaInstagram, FaFacebookF].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-[#f4f1ec] flex items-center justify-center text-gray-700 hover:text-purple-600 transition"
                  href="#"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= PLANILHAS ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-32 bg-black"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">
              Planilhas de Treino Profissionais
            </h2>
            <p className="text-gray-400">
              Estruture treinos de forma prática com planilhas prontas
              e personalizáveis.
            </p>
            <button className="mt-8 bg-purple-600 px-8 py-4 rounded-full font-semibold">
              VER PLANILHAS
            </button>
          </div>

          <div className="h-64 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-600/20" />
        </div>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Canal da Barie. Todos os direitos reservados.
        </div>
      </footer>

    </main>
  );
}