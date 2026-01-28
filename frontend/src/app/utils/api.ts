// src/app/utils/api.ts
import axios, { AxiosError } from "axios";

/**
 * ✅ API unificada (API 1 + API 2)
 * - BaseURL com fallback
 * - Token helpers (bari_token/token/access_token)
 * - Interceptor Bearer
 * - Errors padronizados
 * - Mantém funções antigas (aliases) pra não quebrar imports
 */

// ✅ BaseURL via .env do front (com fallback)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// (se quiser logar, pode manter)
if (typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.log("API URL configurada:", API_URL);
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// -------------------- TOKEN HELPERS (compat) --------------------
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

  // seta no axios pra requests imediatas
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearToken() {
  if (typeof window === "undefined") return;
  for (const key of TOKEN_KEYS) localStorage.removeItem(key);
  delete api.defaults.headers.common.Authorization;
}

// ✅ Interceptor: anexa Bearer automaticamente em todas as requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("Fazendo requisição para:", (config.baseURL ?? "") + (config.url ?? ""));
    }

    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

// ✅ Decodificar JWT (sem lib) pra pegar payload.sub
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

// ==================== USUÁRIOS (tipo da API 1) ====================
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  sexo?: string;
  peso?: number;
  altura?: number;
  Nascimento?: Date;
  massa_magra?: number;
  meta?: string;
  admin?: boolean;
  ativo?: boolean;
  dataCriacao?: Date;
  foto?: string;
}

// --------- Helpers de resposta (API 1 às vezes vem {status, data}) ----------
function unwrapData<T = any>(respData: any): T {
  // API 1: { status: 'sucesso', data: ... }
  if (respData && typeof respData === "object" && "status" in respData) {
    if (respData.status === "sucesso") return respData.data as T;
    throw new Error(respData.message || "Erro na requisição.");
  }
  // API 2: retorna direto response.data
  return respData as T;
}

// -------------------- USERS --------------------
export async function createUser(
  nome: string,
  email: string,
  senha: string,
  telefone?: string
) {
  try {
    const response = await api.post("/usuarios", { nome, email, senha, telefone });
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao criar usuário.");
  }
}

// API 2 (mantido)
export async function getUser() {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar usuários.");
  }
}

// API 1 (mantido)
export async function getUserById(id: number): Promise<Usuario> {
  try {
    const response = await api.get(`/usuarios/${id}`);

    // logs úteis do seu código antigo
    console.log("=== API - getUserById ===");
    console.log("response.data:", response.data);
    console.log("response.data.data:", (response.data as any)?.data);
    console.log("response.data.data.telefone:", (response.data as any)?.data?.telefone);

    return unwrapData<Usuario>(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar usuário:", error);
    throwNiceError(error, "Erro ao buscar usuário.");
  }
}

// Alias antigo da API 2
export async function getIdUser(id: string) {
  try {
    const response = await api.get("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao buscar usuário.");
  }
}

// API 1 (mantido)
export async function updateData(id: number, data: Partial<Usuario>) {
  try {
    console.log("=== updateData ===");
    console.log("Enviando para:", `/usuarios/${id}`);
    console.log("Tamanho total do payload:", JSON.stringify(data).length, "bytes");

    const response = await api.patch(`/usuarios/${id}`, data);

    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    console.log("Response data.status:", (response.data as any)?.status);
    console.log("Response data.message:", (response.data as any)?.message);

    return unwrapData(response.data);
  } catch (error: any) {
    console.error("=== Erro ao atualizar usuário ===");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    throwNiceError(error, "Erro ao atualizar usuário.");
  }
}

// API 2 (mantido) — alias compatível
export async function patchUser(id: string, data?: Record<string, any>) {
  try {
    const response = await api.patch("/usuarios/" + id, data ?? {});
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao atualizar usuário.");
  }
}

// API 1 (mantido)
export async function updatePassword(id: number, senhaAtual: string, novaSenha: string) {
  try {
    const response = await api.patch(`/usuarios/${id}`, {
      senhaAtual,
      senha: novaSenha,
    });

    return unwrapData(response.data);
  } catch (error: any) {
    console.error("Erro ao atualizar senha:", error);
    throwNiceError(error, "Erro ao atualizar senha.");
  }
}

// API 1 e API 2 (mantido)
export async function deleteUser(id: string) {
  try {
    const response = await api.delete("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
    throwNiceError(error, "Erro ao deletar usuário.");
  }
}

// ✅ Compat: deleteUser por number (API 1 antiga)
export async function deleteUserById(id: number) {
  try {
    await api.delete(`/usuarios/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    throwNiceError(error, "Erro ao deletar usuário.");
  }
}

// -------------------- AUTH --------------------
export async function loginUser(credentials: { email: string; senha: string }) {
  try {
    const response = await api.post("/auth/login", credentials);

    const token = response.data?.access_token;
    if (token) setToken(token); // ✅ não quebra nada e melhora (API 1 não fazia)

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

// ✅ getCurrentUser unificado:
// - tenta /auth/me (API 2)
// - se não existir / falhar, faz fallback pelo token -> /usuarios/:id (API 1)
export async function getCurrentUser(): Promise<any> {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error: any) {
    // fallback (token decode)
    try {
      const userId = getUserIdFromToken();
      return await getUserById(userId);
    } catch (e) {
      console.error("Erro ao buscar usuário:", error);
      throwNiceError(error, "Erro ao buscar usuário logado.");
    }
  }
}

// ==================== PLACEHOLDERS (API 1) ====================
export async function getProductsByUser(userId: number) {
  try {
    // TODO: Implementar endpoint no backend
    return [];
  } catch (error: any) {
    console.error("Erro ao buscar produtos do usuário:", error);
    return [];
  }
}

export async function getStoresByUser(userId: number) {
  try {
    // TODO: Implementar endpoint no backend
    return [];
  } catch (error: any) {
    console.error("Erro ao buscar lojas do usuário:", error);
    return [];
  }
}

export async function getUserRatings(userId: number) {
  try {
    // TODO: Implementar endpoint no backend
    return [];
  } catch (error: any) {
    console.error("Erro ao buscar avaliações do usuário:", error);
    return [];
  }
}

// -------------------- (SEU CÓDIGO ANTIGO - MANTIDO) --------------------
export async function createProduto(
  Nome: string,
  imgNutricional: string,
  Imagem: string,
  descricao: string,
  preco: number
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

export async function createPagamento(metodo: string, carrinho: number, valor: number) {
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

export async function createCarrinho(metodo: string, carrinho: number, valor: number) {
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
