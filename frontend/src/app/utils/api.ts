// src/app/utils/api.ts
import axios, { AxiosError } from "axios";

// ✅ BaseURL via .env do front
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// -------------------- TOKEN HELPERS --------------------
const TOKEN_KEYS = ["bari_token", "token", "access_token"];

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  for (const key of TOKEN_KEYS) {
    const v = localStorage.getItem(key);
    if (v && v.trim()) return v;
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;

  // grava em todas (não quebra telas antigas que leem "token")
  for (const key of TOKEN_KEYS) localStorage.setItem(key, token);

  // e já seta no axios pra requests imediatas (além do interceptor)
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  if (typeof window === "undefined") return;
  for (const key of TOKEN_KEYS) localStorage.removeItem(key);
  delete api.defaults.headers.common.Authorization;
}

// ✅ Anexa Bearer automaticamente em todas as requests (se tiver token)
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

function throwNiceError(error: unknown, fallback: string): never {
  const err = error as AxiosError<any>;

  if (err?.response) {
    const msg = err.response.data?.message || fallback;
    throw new Error(typeof msg === "string" ? msg : fallback);
  }
  if (err?.request) {
    throw new Error("Servidor não respondeu. Verifique sua conexão.");
  }
  throw new Error(fallback);
}

// ✅ DECODAR JWT (sem lib) pra pegar o id (payload.sub)
function decodeJwtPayload(token: string): any {
  const part = token.split(".")[1];
  if (!part) throw new Error("Token JWT inválido.");

  const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const json = atob(padded);

  return JSON.parse(json);
}

export function getUserIdFromToken(): number {
  const token = getToken();
  if (!token) throw new Error("Nenhum token encontrado.");

  const payload = decodeJwtPayload(token);
  const sub = payload?.sub;

  const id = typeof sub === "string" ? parseInt(sub, 10) : sub;
  if (!Number.isFinite(id)) {
    throw new Error("JWT não contém um 'sub' válido (id do usuário).");
  }
  return id;
}

// -------------------- USERS --------------------
export async function createUser(nome: string, email: string, senha: string) {
  try {
    const response = await api.post("/usuarios", { nome, email, senha });
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar usuário.");
  }
}

export async function getUser() {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar usuários.");
  }
}

export async function getIdUser(id: string) {
  try {
    const response = await api.get("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar usuário.");
  }
}

export async function patchUser(id: string, data?: Record<string, any>) {
  try {
    const response = await api.patch("/usuarios/" + id, data ?? {});
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao atualizar usuário.");
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await api.delete("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao deletar usuário.");
  }
}

// -------------------- AUTH --------------------
export async function loginUser(credentials: { email: string; senha: string }) {
  try {
    const response = await api.post("/auth/login", credentials);

    const token = response.data?.access_token;
    if (!token) throw new Error("Login não retornou access_token.");

    // ✅ garante token salvo (em todas as chaves) e já setado no axios
    setToken(token);

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Credenciais inválidas");
    } else if (error.request) {
      throw new Error("Servidor não respondeu. Verifique sua conexão.");
    } else {
      throw new Error("Erro ao fazer login");
    }
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throwNiceError(error, "Erro ao buscar usuário logado.");
  }
}

// -------------------- (SEU CÓDIGO ANTIGO - NÃO MEXI) --------------------
export async function createProduto(
  Nome: string,
  imgNutricional: string,
  Imagem: string,
  descricao: string,
  preco: number,
) {
  try {
    const response = await api.post("/usuarios", {
      nome: Nome,
      Imagem,
      imgNutricional,
      descricao,
      preco,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar produto.");
  }
}

export async function getProduto() {
  try {
    const response = await api.get("/produto");
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar produtos.");
  }
}

export async function getIdProduto(id: string) {
  try {
    const response = await api.get("/produto/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar produto.");
  }
}

export async function patchProduto(id: string) {
  try {
    const response = await api.put("/produto/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao atualizar produto.");
  }
}

export async function deleteProduto(id: string) {
  try {
    const response = await api.delete("/produto/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao deletar produto.");
  }
}

export async function createPagamento(
  metodo: string,
  carrinho: number,
  valor: number,
) {
  try {
    const response = await api.post("/usuarios", {
      metodo,
      carrinho: { connect: { id: carrinho } },
      valor,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar pagamento.");
  }
}

export async function getPagamento() {
  try {
    const response = await api.get("/pagamentos");
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar pagamentos.");
  }
}

export async function getIdPagamento(id: string) {
  try {
    const response = await api.get("/pagamentos/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar pagamento.");
  }
}

export async function patchPagamento(id: string) {
  try {
    const response = await api.patch("/pagamentos/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao atualizar pagamento.");
  }
}

export async function deletePagamento(id: string) {
  try {
    const response = await api.delete("/pagamentos/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao deletar pagamento.");
  }
}

export async function createCarrinho(
  metodo: string,
  carrinho: number,
  valor: number,
) {
  try {
    const response = await api.post("/usuarios", {
      metodo,
      carrinho: { connect: { id: carrinho } },
      valor,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar carrinho.");
  }
}

// -------------------- HealthSurvey: Sistema/Dia0/Ciclo --------------------
export async function createSistema(dto: { idUsuario: number }) {
  try {
    const response = await api.post("/sistema", dto);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar sistema.");
  }
}

export async function createDia0(dto: {
  idUsuario: number;
  quer_msg?: boolean;
  iniciou_medicamento?: boolean;
  dia_iniciar_med?: string;
  dia1?: string;
  dia0?: string;
}) {
  try {
    const response = await api.post("/dia0", dto);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar Dia0.");
  }
}

export async function createCiclo(dto: {
  idUsuario: number;
  dia0Id: number;
  numCiclo?: number;
  ativoCiclo?: boolean;
}) {
  try {
    const response = await api.post("/ciclo", dto);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar ciclo.");
  }
}

export default api;
