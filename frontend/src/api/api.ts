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
    console.error('Data:', error.response?.data);
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

export default api;
