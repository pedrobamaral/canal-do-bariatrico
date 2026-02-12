"use client";

import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight, Check, Instagram, Youtube, Mail } from "lucide-react";

/**
 * Barie - Home Page (Single File)
 * Design: Minimalismo Corporativo Moderno com Acentos Energéticos
 * Cores: Preto (#0A0A0A), Branco (#FFFFFF), Verde Neon (#6F3CF6)
 * Tipografia: Montserrat Bold para títulos, Inter para corpo
 */

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
    { id: 2, image: "/images/foto3.jpeg" },
    { id: 3, image: "/images/foto4.jpeg" },
    { id: 4, image: "/images/foto5.jpeg" },
    { id: 5, image: "/images/foto6.jpeg" },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const navItems = [
    { label: "PLANOS", href: "#planos" },
    { label: "AFILIADOS", href: "#" },
  ];

  const benefits = [
    "Planilhas de treino novas a cada 5 semanas",
    "Vídeos para auxiliar a execução",
    "Esclarecimento de dúvidas",
    "Assinatura recorrente",
    "Cancele quando quiser",
    "Garantia de 7 dias",
  ];

  const femaleImageUrl = "https://private-us-east-1.manuscdn.com/sessionFile/NMdcTLVfnPvBEzwbd5md7f/sandbox/DCbHCeJtRIyvSK5Noj7zK2-img-3_1770925076000_na1fn_ZmVtYWxlLWZpdG5lc3Mtc2VjdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvTk1kY1RMVmZuUHZCRXp3YmQ1bWQ3Zi9zYW5kYm94L0RDYkhDZUp0Ukl5dlNLNU5vajd6SzItaW1nLTNfMTc3MDkyNTA3NjAwMF9uYTFmbl9abVZ0WVd4bExXWnBkRzVsYzNNdGMyVmpkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=WMHDQdmYJqiJaTXgQGodLOy6XG7kp6LP55YERFeq-hPYBpfdY1UTodQldbHYZ6xJ0ZZOuVqjw86vdszC4x1P1yv-TDPdztiW7UhH4mlktyiysREgrQPmK8sxMFtm-4Ija5CAWjm5bk3vA2vbUELsuoRw8kEsXB1--6hbDU9-iPuEolaU7WHOu-DzUTRGO1YPi3sTIWAtov~hxS9bOA18apD6Sg~me-dNGLuzw5bf7cMrvM6KcOmJaesYTGJQMpy-xzKu~7RvYPewlkxmqkqa4ENpXFQDd9RMGZqKKoMtPop5zj6yRLbNG9JGzfHTbtVr7yvF8ZD9nKrN3emvylc07A__";

  const maleImageUrl = "https://private-us-east-1.manuscdn.com/sessionFile/NMdcTLVfnPvBEzwbd5md7f/sandbox/DCbHCeJtRIyvSK5Noj7zK2-img-4_1770925080000_na1fn_bWFsZS1maXRuZXNzLXNlY3Rpb24.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvTk1kY1RMVmZuUHZCRXp3YmQ1bWQ3Zi9zYW5kYm94L0RDYkhDZUp0Ukl5dlNLNU5vajd6SzItaW1nLTRfMTc3MDkyNTA4MDAwMF9uYTFmbl9iV0ZzWlMxbWFYUnVaWE56TFhObFkzUnBiMjQucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=kUCUE4mEaK1fhtF1tD6Ih-HUS2qIWF-ThctpJQfE9nJIGea97bwQK8BwDyKHQUq6lPoj63xDiZauxUf-We1x5ETJ6Zq1gO6BchRalQEpyK8OnZe39wO58GAbIpEpcJTAyvp~nzAbJ8UTlhWRtQcIzZeHMiY~O54SR64AV4gyjyFEX9dBLsPooav8K-7t08EqKYbviJ2TJrci2gQSzwWCCV5w8iOLuaAudaNmL9YglHcA5Y0lWi48Bwnghv~2GSSBwPPTtR4qeFlVV2lLj7KhOKCt6iIWprvxpfCIXetXI5oxT3V3E12BiN2HwghDSbQji18~-BZkOxpFz0ZxtweBIA__";

  const methodologyPoints = [
    "Check in diário em menos de um minuto. Você registra água, treino, medicação e sono. Simples e personalizado.",
    "Acompanhamento com seu médico. Os dados guiam ajustes reais na sua estratégia.",
    "Treino dentro da sua rotina. Nada de padrão de influencer. Constância possível.",
    "Clareza do que está travando. Você entende o padrão e corrige.",
    "Menos força de vontade. Mais organização com ciência."
  ];

  return (
    <main ref={heroRef} className="bg-[#0A0A0A] text-white overflow-hidden">
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
          <div className="flex items-center gap-3">
            <img src="/images/bari_icon.png" alt="Barie" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
            <img src="/images/Group%20227.svg" alt="Group 227" className="h-6 md:h-8 lg:h-10 object-contain" />
          </div>

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
          <nav className="md:hidden bg-[#1A1A1A] border-t border-[#333333]">
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
        style={{
          backgroundImage: "url('/images/heroBarie.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

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

      {/* ================= PARTNERS SECTION ================= */}
      <section className="bg-[#0A0A0A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#6F3CF6] to-transparent mt-16" />
        </div>
      </section>

      {/* ================= METHODOLOGY SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
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
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#6F3CF6]">
                <img src="/images/cellBarie.jpeg" alt="Metodologia Barie" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Animated text divider */}
          <div className="mt-20 text-center">
            <p className="text-2xl font-bold text-[#6F3CF6]/50 tracking-widest overflow-hidden">
              <span className="inline-block animate-pulse">
                Barie - Barie - Barie - Barie - Barie
              </span>
            </p>
          </div>
        </div>
      </motion.section>

      {/* ================= TRANSFORMATIONS SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#0A0A0A] py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">MUDANÇAS REAIS VIVIDAS POR</h2>
            <p className="text-3xl md:text-4xl font-bold">
              <span className="text-[#6F3CF6]">MAIS DE 150 MIL ALUNOS!</span>
            </p>
            <p className="text-gray-300 mt-6 text-lg">
              Está esperando o que para mudar de rotina e{" "}
              <span className="text-[#6F3CF6] font-bold">liberar todo o seu potencial?</span>
            </p>
          </div>

          {/* Slider */}
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div className="w-full h-64 md:h-80 lg:h-96 bg-[#0A0A0A] p-4 flex items-center justify-center">
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

      {/* ================= PLANS SECTION ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-[#0A0A0A] py-20 md:py-32"
        id="planos"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Escolha seu plano</h2>
            <p className="text-gray-300 text-lg">
              Em casa ou na academia, dê o primeiro passo em direção a uma{" "}
              <span className="text-[#6F3CF6] font-bold">vida mais saudável e feliz hoje mesmo!</span>
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Female Plan */}
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img src={femaleImageUrl} alt="Plano Feminino" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#FF006E] flex items-center justify-center font-bold text-white">♀</div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 uppercase">Plataforma de Treinos Online para Mulheres</h3>

              <p className="text-sm font-semibold text-gray-400 mb-6 uppercase">Plano Mensal e Trimestral</p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-[#FF006E]" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider bg-[#FF006E] text-white hover:shadow-lg hover:shadow-[#FF006E]/50">
                SAIBA MAIS →
              </button>
            </div>

            {/* Male Plan */}
            <div className="group">
              <div className="relative overflow-hidden rounded-lg mb-6">
                <img src={maleImageUrl} alt="Plano Masculino" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center font-bold text-white">♂</div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 uppercase">Plataforma de Treinos Online para Homens</h3>

              <p className="text-sm font-semibold text-gray-400 mb-6 uppercase">Plano Mensal e Trimestral</p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-[#0066FF]" />
                    <span className="text-sm text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider bg-[#0066FF] text-white hover:shadow-lg hover:shadow-[#0066FF]/50">
                SAIBA MAIS →
              </button>
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
        className="bg-[#0A0A0A] py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#1A1A1A] rounded-full text-[#6F3CF6] font-bold text-sm uppercase mb-6">
              #SAÚDE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ASSUMA O CONTROLE</h2>
            <p className="text-3xl md:text-4xl font-bold">
              <span className="text-[#6F3CF6]">DE SUA SAÚDE!</span>
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
        className="bg-[#0A0A0A] py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-lg overflow-hidden">
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "linear-gradient(135deg, rgba(10, 10, 10, 0.7) 0%, rgba(0, 255, 136, 0.1) 100%)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 py-20 md:py-32 px-8 md:px-16 text-center">
              <span className="inline-block px-4 py-2 bg-[#1A1A1A] rounded-full text-[#6F3CF6] font-bold text-sm uppercase mb-6">
                Consultoria Personalizada
              </span>

              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">SEU TREINO, DO SEU JEITO!</h2>

              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Você terá um plano de treino adaptado às suas necessidades, rotina e nível de condicionamento físico.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 font-bold text-lg rounded-lg transition-all duration-300 uppercase tracking-wider bg-[#6F3CF6] text-[#0A0A0A] hover:shadow-lg hover:shadow-[#6F3CF6]/50"
              >
                COMEÇAR AGORA →
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#6F3CF6] to-transparent mt-16" />
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
                <div className="w-10 h-10 bg-[#6F3CF6] rounded-full flex items-center justify-center">
                  <span className="text-[#0A0A0A] font-bold text-lg">CB</span>
                </div>
                <span className="text-xl font-bold text-[#6F3CF6]">Barie</span>
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
                  <a href="#planos" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Planos
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Sobre Nós
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#6F3CF6] transition-colors text-sm">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="font-bold text-white uppercase text-sm">Siga-nos</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#6F3CF6] hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-[#0A0A0A] rounded-full flex items-center justify-center text-[#6F3CF6] hover:bg-[#6F3CF6] hover:text-[#0A0A0A] transition-all duration-300"
                >
                  <Youtube size={20} />
                </a>
                <a
                  href="mailto:suporte@saomiguelito.com"
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
              <span className="font-semibold">Aviso Importante:</span> O acompanhamento médico é imprescindível para a segurança do(a) comprador(a).
            </p>
            <p>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}