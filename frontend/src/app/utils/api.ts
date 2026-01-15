import axios from "axios";

const BACK_URL = process.env.BACK_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: BACK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createUser(nome: string, email: string, senha: string) {
    try {
    const response = await api.post("/usuarios", 
        {nome:nome,
        email:email,
        senha:senha }); //resto é opcional ou tem inicializacao default
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUser() {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getIdUser(id: string) {
    try {
    const response = await api.get("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// testar quando mesclar cm a branch backend
export async function patchUser(id: string) {
    try {
    const response = await api.patch("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(id: string) {
    try {
    const response = await api.delete("/usuarios/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function loginUser(credentials: { email: string; senha: string }) {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Erro do servidor (400, 401, 500, etc)
      throw new Error(error.response.data?.message || 'Credenciais inválidas');
    } else if (error.request) {
      // Sem resposta do servidor
      throw new Error('Servidor não respondeu. Verifique sua conexão.');
    } else {
      throw new Error('Erro ao fazer login');
    }
  }
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('bari_token');
    if (!token) {
      throw new Error('Nenhum token encontrado');
    }
    
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}

//analisar connect cm o carrinho depois
export async function createProduto(Nome: string, imgNutricional: string, Imagem: string, 
    descricao: string, preco: number
) {
    try {
    const response = await api.post("/usuarios", 
        {nome:Nome,
        Imagem:Imagem,
        imgNutricional:imgNutricional,
        descricao:descricao,
        preco:preco
    }); //resto é opcional ou tem inicializacao default
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProduto() {
  try {
    const response = await api.get('/produto');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getIdProduto(id: string) {
    try {
    const response = await api.get("/produto/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// testar quando mesclar cm a branch backend
// alguma MULA escreveu PUT ao inves de PATCH
// Talvez tenhamos que mudar porque o PUT
// supostamente muda tudo do BD e não só oq vc quer
export async function patchProduto(id: string) {
    try {
    const response = await api.put("/produto/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProduto(id: string) {
    try {
    const response = await api.delete("/produto/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// EXIGE TESTE COM O CRUD (incompleto)
// tem o connect pq tem que criar o pagamento atraves do carrinho
export async function createPagamento(metodo: string, 
    carrinho:number, valor: number
) {
    try {
    const response = await api.post("/usuarios", 
        {metodo:metodo,
        carrinho: {connect: {id: carrinho}},
        valor:valor
    }); //resto é opcional ou tem inicializacao default
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPagamento() {
  try {
    const response = await api.get('/pagamentos');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getIdPagamento(id: string) {
  try {
    const response = await api.get('/pagamentos/' + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function patchPagamento(id: string) {
    try {
    const response = await api.patch("/pagamentos/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePagamento(id: string) {
    try {
    const response = await api.delete("/pagamentos/" + id);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// EXIGE TESTE COM O CRUD (incompleto)
// também exige aprendizado com o crud
// esses connects ficaram um pouco confusos
export async function createCarrinho(metodo: string, 
    carrinho:number, valor: number
) {
    try {
    const response = await api.post("/usuarios", 
        {metodo:metodo,
        carrinho: {connect: {id: carrinho}},
        valor:valor
    }); //resto é opcional ou tem inicializacao default
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

/* Se precisar buscar user por email
export async function emailUser(email: string) {
    
}
*/

export default api