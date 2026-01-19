'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPageIndex() {
  const router = useRouter();

  useEffect(() => {
    // Migração: converter authToken antigo para bari_token se necessário
    const authToken = localStorage.getItem('authToken');
    const bariToken = localStorage.getItem('bari_token');
    
    if (authToken && !bariToken) {
      localStorage.setItem('bari_token', authToken);
      localStorage.removeItem('authToken');
    }
    
    // Tenta pegar o ID do usuário logado do token
    const token = localStorage.getItem('bari_token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.sub;
        
        if (userId) {
          router.replace(`/userPage/${userId}`);
        } else {
          router.replace('/login');
        }
      } catch (err) {
        console.error('Token inválido:', err);
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-center text-gray-600">Redirecionando...</p>
    </div>
  );
}
