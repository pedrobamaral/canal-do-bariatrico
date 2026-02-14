import axios from 'axios';

const webhookN8nMain = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WEBHOOK_N8N_MAIN,
  headers: {
    'Content-Type': 'application/json',
  },
});

webhookN8nMain.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_JWT_WEBHOOK_N8N_MAIN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface finishedPostModal{
    nome: string; 
    idUsuario: number; 
    telefone: string;
    meta: number; 
}

export async function postFinishedPostLoginModal(data: finishedPostModal): Promise<any> {
  try {
    const response = await webhookN8nMain.post('/', data);

    
    if (response.data.status === 'sucesso') {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Erro ao comunicar com webhook:');
  } catch (error: any) {
    console.error('Erro ao comunicar com webhook:', error);
    throw error;
  }
}