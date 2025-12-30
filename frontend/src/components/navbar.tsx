"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCalculator } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi"; // ✅ NOVO ÍCONE

const CORES = {
  roxoPrincipal: "#6F3CF6",
  roxoHover: "#5c2fe0",
  pretoPrincipal: "#19191A",
  azulHover: "#62B4FF",
  vermelhoHover: "#FF3B5C",
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : null;
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: CORES.pretoPrincipal,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO + TEXTO */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "40px", height: "40px", position: "relative" }}>
            <Image
              src="/images/barienavbar.png"
              alt="Logo da BARI"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#62B4FF",
                fontSize: "1.2rem",
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              BARIE
            </span>
            <span
              style={{
                color: "white",
                fontSize: "0.75rem",
                opacity: 0.8,
                lineHeight: 1.2,
              }}
            >
              Calculadora de Perda de Peso com
              <br />
              Bariátrica ou Canetinhas Emagrecedoras
            </span>
          </div>
        </div>

        {/* MENU / AÇÕES */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
          }}
        >
          {/* ✅ CALCULADORA — SEMPRE VISÍVEL */}
          <Link href="/" style={{ textDecoration: "none" }}>
            <FaCalculator
              size={28}
              color="white"
              style={{
                transition: "color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = CORES.azulHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "white")
              }
            />
          </Link>

          {/* ❌ NÃO LOGADO */}
          {!isLoggedIn && (
            <>
              <Link
                href="/login"
                style={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
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
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = CORES.roxoHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = CORES.roxoPrincipal)
                  }
                >
                  CADASTRE-SE
                </button>
              </Link>
            </>
          )}

          {/* ✅ LOGADO */}
          {isLoggedIn && (
            <>
              {/* Usuário */}
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <FaUser
                  size={28}
                  color="white"
                  style={{
                    transition: "color 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = CORES.azulHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "white")
                  }
                />
              </Link>

              {/* ✅ NOVO LOGOUT */}
              <FiLogOut
                size={32}
                color="white"
                style={{
                  transition: "color 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = CORES.vermelhoHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "white")
                }
                onClick={handleLogout}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
