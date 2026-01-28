import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('API URL configurada:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    console.log('Fazendo requisição para:', `${config.baseURL || ''}${config.url || ''}`);
    const token = localStorage.getItem('bari_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== USUARIOS ====================

// Enum para sexo - deve corresponder ao enum Prisma
export type SexoType = 'Masculino' | 'Feminino' | 'Outro';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  sexo?: SexoType;
  peso?: number;
  altura?: number;
  nascimento?: Date;
  massa_magra?: number;
  meta?: number;
  admin?: boolean;
  ativo?: boolean;
  dataCriacao?: Date;
  foto?: string;
}

export async function getAllUsers(): Promise<Usuario[]> {
  try {
    const response = await api.get('/usuarios');
    
    console.log('=== API - getAllUsers ===');
    console.log('response.data:', response.data);
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar usuários');
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<Usuario> {
  try {
    const response = await api.get(`/usuarios/${id}`);
    
    console.log('=== API - getUserById ===');
    console.log('response.data:', response.data);
    console.log('response.data.data:', response.data.data);
    console.log('response.data.data.telefone:', response.data.data?.telefone);
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao buscar usuário');
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<Usuario> {
  try {
    const token = localStorage.getItem('bari_token');
    if (!token) {
      throw new Error('Nenhum token encontrado');
    }
    
    // Decodifica o token para pegar o ID do usuário
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;
    
    return await getUserById(userId);
  } catch (error: any) {
    console.error('Erro ao buscar usuário atual:', error);
    throw error;
  }
}

export async function updateData(id: number, data: Partial<Usuario>) {
  try {
    console.log('=== updateData ===');
    console.log('Enviando para:', `/usuarios/${id}`);
    console.log('Tamanho total do payload:', JSON.stringify(data).length, 'bytes');
    
    const response = await api.patch(`/usuarios/${id}`, data);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('Response data.status:', response.data.status);
    console.log('Response data.message:', response.data.message);
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar usuário');
  } catch (error: any) {
    console.error('=== Erro ao atualizar usuário ===');
    console.error('Status:', error.response?.status);
    try {
      console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    } catch (e) {
      console.error('Data (raw):', error.response?.data);
    }
    console.error('Headers:', JSON.stringify(error.response?.headers || {}, null, 2));
    console.error('Message:', error.message);
    throw error;
  }
}

export async function updatePassword(id: number, senhaAtual: string, novaSenha: string) {
  try {
    const response = await api.patch(`/usuarios/${id}`, {
      senhaAtual,
      senha: novaSenha
    });
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao atualizar senha');
  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    await api.delete(`/usuarios/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}

export async function createUser(nome: string, email: string, senha: string, telefone?: string) {
  try {
    const response = await api.post('/usuarios', {
      nome,
      email,
      senha,
      telefone
    });
    
    if (response.data.status === 'sucesso') {
      return response.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

export async function loginUser(credentials: { email: string; senha: string }) {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Credenciais inválidas');
    } else if (error.request) {
      throw new Error('Servidor não respondeu. Verifique sua conexão.');
    } else {
      throw new Error('Erro ao fazer login');
    }
  }
}

// ==================== DIETA ====================

export async function createOrUpdateDieta(usuarioId: number, data: any) {
  try {
    const response = await api.post(`/dieta`, {
      usuarioId,
      ...data,
    });
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao salvar dieta');
  } catch (error: any) {
    console.error('Erro ao salvar dieta:', error);
    throw error;
  }
}

// ==================== MEDICAMENTOS ====================

export async function createOrUpdateMedicacao(usuarioId: number, data: any) {
  try {
    const response = await api.post(`/medicamentos/usuario/${usuarioId}`, data);
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao salvar medicamento');
  } catch (error: any) {
    console.error('Erro ao salvar medicamento:', error);
    throw error;
  }
}

// ==================== TREINO ====================

export async function createOrUpdateTreino(usuarioId: number, data: any) {
  try {
    const response = await api.post(`/treino`, {
      usuarioId,
      ...data,
    });
    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao salvar treino');
  } catch (error: any) {
    console.error('Erro ao salvar treino:', error);
    throw error;
  }
}

// ==================== PRODUTOS ====================
// Funções placeholder - implementar conforme necessário
export async function getProductsByUser(userId: number) {
  try {
    // TODO: Implementar endpoint no backend
    return [];
  } catch (error: any) {
    console.error('Erro ao buscar produtos do usuário:', error);
    return [];
  }
}

// ==================== LOJAS ====================
// Funções placeholder - implementar conforme necessário
export async function getStoresByUser(userId: number) {
  try {
    // TODO: Implementar endpoint no backend
    return [];
  } catch (error: any) {
    console.error('Erro ao buscar lojas do usuário:', error);
    return [];
  }
}

// ==================== AVALIAÇÕES ====================
// Funções placeholder - implementar conforme necessário
export async function getUserRatings(userId: number) {
  try {
    // TODO: Implementar endpoint no backend
    return [];
  } catch (error: any) {
    console.error('Erro ao buscar avaliações do usuário:', error);
    return [];
  }
}

// ==================== DIA0 ====================

export async function createDia0(usuarioId: number, data?: any) {
  try {
    const response = await api.post(`/dia0`, {
      idUsuario: usuarioId,
      quer_msg: true,
      iniciou_medicamento: false,
      dia0: new Date(),
      ...data,
    });
    
    if (response.data.status === 'sucesso' || response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao criar dia0');
  } catch (error: any) {
    console.error('Erro ao criar dia0:', error);
    throw error;
  }
}

// ==================== CICLO ====================

export async function createCiclo(usuarioId: number, dia0Id: number, data?: any) {
  try {
    const response = await api.post(`/ciclo`, {
      idUsuario: usuarioId,
      dia0Id: dia0Id,
      numCiclo: 1,
      ativoCiclo: true,
      mounjaro: data?.mounjaro || false,
      treino: true,
      dieta: true,
      agua: true,
      bioimpedancia: true,
      consulta: true,
      ...data,
    });
    
    if (response.data.status === 'sucesso' || response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao criar ciclo');
  } catch (error: any) {
    console.error('Erro ao criar ciclo:', error);
    throw error;
  }
}

export default api;
