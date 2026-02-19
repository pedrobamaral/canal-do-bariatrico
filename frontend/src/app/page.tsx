"use client";

import { MdArrowOutward } from "react-icons/md";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight, Check, Instagram, Youtube, Mail } from "lucide-react";

const sectionAnim = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [imc, setImc] = useState<number | null>(null);
  const heroRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // IMC Calculator
  const calculateIMC = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const imcValue = weightInKg / (heightInMeters * heightInMeters);
      setImc(parseFloat(imcValue.toFixed(2)));
    }
  };

  const getIMCCategory = (value: number) => {
    if (value < 18.5) return "Abaixo do peso";
    if (value < 25) return "Peso normal";
    if (value < 30) return "Sobrepeso";
    return "Obesidade";
  };

  const getIMCColor = (value: number) => {
    if (value < 18.5) return "text-blue-400";
    if (value < 25) return "text-green-400";
  if (value < 30) return "text-yellow-400";
  return "text-red-400";
};

  // Slider (local images from public/images)
  const slides = [
    { id: 1, image: "/images/foto1.png" },
    { id: 2, image: "/images/foto2.png" },
    { id: 3, image: "/images/foto3.png" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const navItems = [
    { label: "JÁ SOU ALUNO", href: "#" },
  ];

  const benefits = [
    "Suas informações ficam organizadas no seu perfil. Check ins, treino, alimentação, medicação e evolução de peso.",
    "Nada se perde.",
    "Você e o profissional enxergam o que funciona e o que precisa ajustar.",
    "O acompanhamento deixa de ser memória e tentativa. E passa a ser contínuo, estruturado e baseado em dados reais.",
    "Tratamento sério precisa de registro. Não de achismo.",
  ];

  const methodologyPoints = [
    "Check in diário em menos de um minuto. Você registra água, treino, medicação e sono. Simples e personalizado.",
    "Acompanhamento com seu médico. Os dados guiam ajustes reais na sua estratégia.",
    "Treino dentro da sua rotina. Nada de padrão de influencer. Constância possível.",
    "Clareza do que está travando. Você entende o padrão e corrige.",
    "Menos força de vontade. Mais organização com ciência."
  ];

  return (
    <main id="home" ref={heroRef} className="bg-[#0A0A0A] text-white overflow-hidden">
      {/* ================= HEADER ================= */}
      <header
        className={`fixed w-full top-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-[#0A0A0A] border-b border-[#333333] bg-opacity-95 backdrop-blur-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 cursor-pointer">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
                <img src={'/images/newBarieIcon.png'} alt="Barie" className="w-full h-full object-cover" />
              </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-white hover:text-[#6F3CF6] group transition-colors duration-300 relative"
              >
                <span className="inline-block relative">
                  {item.label}
                  <span className="absolute left-0 -bottom-1 h-[2px] bg-[#6F3CF6] w-0 group-hover:w-full transition-all duration-300" />
                </span>
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-block">
              <span className="inline-block px-4 py-2 text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                ENTRAR
              </span>
            </Link>

            <Link href="/cadastro" className="hidden sm:inline-block px-6 py-2 border-2 border-[#6F3CF6] text-[#6F3CF6] font-bold rounded-lg hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300">
              CADASTRE-SE
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-[#6F3CF6]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-[#ffff] border-t border-[#333333]">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-semibold text-white hover:text-[#6F3CF6] group transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="inline-block relative">
                    {item.label}
                    <span className="absolute left-0 -bottom-1 h-[2px] bg-[#6F3CF6] w-0 group-hover:w-full transition-all duration-300" />
                  </span>
                </a>
              ))}
              <a href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full px-6 py-2 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all text-center">
                ENTRAR
              </a>

              <button className="w-full px-6 py-2 border-2 border-[#6F3CF6] text-[#6F3CF6] font-bold rounded-lg hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all">
                CANAL DA BARIE
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/cinematicBarie.MP4" type="video/mp4" />
        </video>

        {/* Dark Overlay with gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight font-bebas"
          >
            SEU CORPO MUDA QUANDO VOCÊ MUDA O SISTEMA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-8"
          >
            Emagrecer não é força de vontade
            <span className="block text-[#6F3CF6] font-bold mt-2">É estratégia aplicada todos os dias</span>
          </motion.p>

          <Link href="/cadastro" className="inline-block">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider bg-[#6F3CF6] text-[#0A0A0A] hover:shadow-lg hover:shadow-[#6F3CF6]/50 inline-flex items-center"
            >
              CADASTRE-SE
              <MdArrowOutward className="inline-block ml-2" />
            </motion.span>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce text-[#6F3CF6]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ================= METHODOLOGY SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        id="metodologia"
        className="bg-[#0A0A0A] py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-bold text-[#6F3CF6] uppercase tracking-widest">Método Barie</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-white">Barie organiza seu emagrecimento com ciência e simplicidade</h2>

              <div className="space-y-4">
                {methodologyPoints.map((point, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 bg-[#6F3CF6] rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex items-center justify-center">
              <div className="rounded-lg overflow-hidden border-2 border-[#6F3CF6] p-0 flex items-center justify-center">
                <img src="/images/cellBarie.jpeg" alt="Metodologia Barie" className="w-full h-full object-cover object-center block rounded-lg" />
              </div>
            </div>
          </div>
          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#6F3CF6] to-transparent mt-16" />
        </div>
      </motion.section>

      {/* ================= TRANSFORMATIONS SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        id="resultados"
        className="bg-[#0A0A0A] py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">RESULTADO NÃO É SORTE.</h2>
            <p className="text-3xl md:text-4xl font-bold">
              <span className="text-[#6F3CF6]">É SISTEMA ORGANIZADO.</span>
            </p>
            <p className="text-gray-300 mt-6 text-lg">
              Treino possível dentro da sua rotina. Estratégia alimentar inteligente. Ajuste médico quando necessário.
            </p>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div className="w-full h-64 md:h-80 lg:h-96 bg-[#0A0A0A] flex items-center justify-center cursor-zoom-in">
                  <img src={slides[currentSlide].image} alt={`Transformação ${currentSlide + 1}`} className="max-h-full max-w-full object-contain" />
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#6F3CF6]/80 hover:bg-[#6F3CF6] text-[#0A0A0A] p-3 rounded-full transition-all duration-300"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-[#6F3CF6]/80 hover:bg-[#6F3CF6] text-[#0A0A0A] p-3 rounded-full transition-all duration-300"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-[#6F3CF6] w-8" : "bg-[#333333] hover:bg-[#6F3CF6]/50"
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#6F3CF6] to-transparent mt-16" />
        </div>
      </motion.section>

      {/* Lightbox modal for slider images */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            aria-label="Fechar"
            className="absolute top-6 right-6 text-white text-2xl z-60"
            onClick={() => setLightboxOpen(false)}
          >
            ✕
          </button>

          <div className="max-w-6xl w-full max-h-[96vh] flex items-center justify-center gap-6">
            <button
              className="hidden md:flex items-center justify-center p-4 text-white text-3xl"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Anterior"
            >
              ‹
            </button>

            <div className="flex-1 flex items-center justify-center">
              <img
                src={slides[currentSlide].image}
                alt={`Transformação ${currentSlide + 1}`}
                className="max-h-[92vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="flex flex-col gap-2 items-end">
              <button
                className="hidden md:flex items-center justify-center p-4 text-white text-3xl"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                aria-label="Próximo"
              >
                ›
              </button>

              <a
                href={slides[currentSlide].image}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 underline"
                onClick={(e) => e.stopPropagation()}
              >
                Abrir original
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= PLANS SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#0A0A0A] py-20 md:py-32"
        id="acompanhamento"
      >
        <div className="max-w-7xl mx-auto px-4">

          {/* Plan — image on LEFT, content on RIGHT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative flex justify-center">
              <div className="max-w-xs md:max-w-sm rounded-lg overflow-hidden border-2 border-[#6F3CF6]">
                <img src="/images/acompanhamento.jpeg" alt="Plataforma de Treinos Online" className="w-full h-auto object-contain" />
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-bold text-[#6F3CF6] uppercase tracking-widest">Acompanhamento</span>
              </div>

              <h3 className="text-4xl md:text-5xl font-bold text-white">Sistema de Acompanhamento Inteligente</h3>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 bg-[#6F3CF6] rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-300 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#6F3CF6] to-transparent mt-16" />
        </div>
      </motion.section>

      {/* ================= IMC CALCULATOR SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        id="calculadora"
        className="bg-[#0A0A0A] py-12 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#1A1A1A] rounded-full text-[#6F3CF6] font-bold text-sm uppercase mb-6">
              #SAÚDE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ASSUMA O CONTROLE</h2>
            <p className="text-3xl md:text-4xl font-bold">
              <span className="text-[#6F3CF6]">DA SUA SAÚDE!</span>
            </p>
          </div>

          {/* Calculator */}
          <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="space-y-6">
              {/* Height Input */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase">Altura</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Sua altura"
                    min="125"
                    max="225"
                    className="flex-1 px-4 py-3 bg-[#1A1A1A] border-2 border-[#333333] rounded-lg text-white placeholder-gray-500 focus:border-[#6F3CF6] focus:outline-none transition-colors"
                  />
                  <span className="text-gray-400 font-semibold">cm.</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Insira um valor entre 125 e 225.</p>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-bold text-white mb-2 uppercase">Peso</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Seu peso"
                    min="10.0"
                    max="500.0"
                    step="0.1"
                    className="flex-1 px-4 py-3 bg-[#1A1A1A] border-2 border-[#333333] rounded-lg text-white placeholder-gray-500 focus:border-[#6F3CF6] focus:outline-none transition-colors"
                  />
                  <span className="text-gray-400 font-semibold">kg.</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Insira um valor entre 10,0 e 500,0</p>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateIMC}
                className="w-full px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider bg-[#6F3CF6] text-[#0A0A0A] hover:shadow-lg hover:shadow-[#6F3CF6]/50"
              >
                Calcular o IMC →
              </button>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-[#1A1A1A] rounded-lg p-6 border-2 border-[#6F3CF6]">
                <p className="text-gray-300 leading-relaxed">
                  Use nossa calculadora de IMC para determinar seu Índice de Massa Corporal, um indicador crucial de sua saúde e condicionamento físico geral.
                </p>
              </div>

              {/* Result */}
              {imc && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#1A1A1A] rounded-lg p-6 border-2 border-[#6F3CF6]"
                >
                  <p className="text-sm text-gray-400 mb-2 uppercase">Seu IMC</p>
                  <p className={`text-5xl font-bold mb-2 ${getIMCColor(imc)}`}>{imc}</p>
                  <p className="text-lg text-[#6F3CF6] font-semibold">{getIMCCategory(imc)}</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#6F3CF6] to-transparent mt-16" />
        </div>
      </motion.section>

      {/* ================= CONSULTATION SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        id="projeto"
        className="bg-[#0A0A0A] py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-lg overflow-hidden">
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.6) 80%), url('/images/barieFitClub.jpeg')",
                backgroundBlendMode: "multiply",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />

            {/* Content */}
            <div className="relative z-10 py-20 md:py-32 px-8 md:px-16 text-center">
              <span className="inline-block px-4 py-2 bg-[#1A1A1A] rounded-full text-[#6F3CF6] font-bold text-sm uppercase mb-6">
                CHECK IN DIÁRIO COM MÉTODO
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">MENOS MOTIVAÇÃO. MAIS SISTEMA.</h2>

              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Treino adaptado à sua rotina real. Organização alimentar inteligente. Ajuste clínico quando indicado. Sem milagre. Com método.
              </p>

              <Link href="/cadastro" className="inline-block">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider bg-[#6F3CF6] text-[#0A0A0A] hover:shadow-lg hover:shadow-[#6F3CF6]/50"
                >
                  <span>MEU PROJETO DE SAÚDE</span>
                  <MdArrowOutward className="shrink-0" />
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1A1A1A] border-t border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">Barie</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transformando vidas através de treinos personalizados e metodologia comprovada.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-white uppercase text-sm">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#metodologia" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Método
                  </a>
                </li>
                <li>
                  <a href="#resultados" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Resultados
                  </a>
                </li>
                <li>
                  <a href="#acompanhamento" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Acompanhamento
                  </a>
                </li>
                <li>
                  <a href="#calculadora" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Calculadora
                  </a>
                </li>
                <li>
                  <a href="#projeto" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Projeto
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-white uppercase text-sm">Siga-nos</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/eusoubarie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#6F3CF6] hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://youtube.com/@canaldabarie?si=PFE3ytUhaCaW9dWZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube"
                  className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#6F3CF6] hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="https://www.tiktok.com/@eusoubarie"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#6F3CF6] hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  <FaTiktok size={20} />
                </a>
                <a
                  href="canaldabari@gmail.com"
                  className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#6F3CF6] hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#333333] mb-8" />

          {/* Bottom Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Legal Links */}
            <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-[#6F3CF6] transition-colors">
                Políticas de Privacidade
              </a>
              <span className="hidden md:inline">•</span>
              <a href="#" className="hover:text-[#6F3CF6] transition-colors">
                Termos e Condições
              </a>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center md:text-right">
              <p>© {new Date().getFullYear()} Barie. Todos os direitos reservados.</p>
            </div>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-[#333333] text-center text-sm text-gray-400 space-y-2">
            <p>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}