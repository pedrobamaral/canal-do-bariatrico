import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json(); // { email, senha }

  const upstream = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message || "Falha no login." },
      { status: upstream.status }
    );
  }

  // Backend Nest retornou { access_token }
  const res = NextResponse.json({ ok: true });

  // Grava cookie HttpOnly com o token
  res.cookies.set("auth_token", data.access_token, {
    httpOnly: true,
    secure: false,       // EM PRODUÇÃO (https) troque para true
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return res;
}
