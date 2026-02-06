# Guia de Estilo e Padrões de Código - Frontend (Next.js & TypeScript)

### 1. Comentário e Código

- Todo o código deve ser escrito em inglês, incluindo comentários, variáveis, funções, componentes etc
- Comentários devem preferencialmente explicar o "porquê" de lógicas complexas. Evitar comentar o "o que" o código faz(como o Léo já dizia, somos todos programadores)
- Prefira código legível e explícito a código compacto.
- Utilize `// TODO:` para funcionalidades planejadas(Ex: Calculadora Implementação) e `// FIXME:` para bugs conhecidos que precisam de correção.

### 2. Estrutura de Pastas (Next.js com App Router)

A estrutura de pastas deve seguir as convenções do Next.js para organização e roteamento.

- `/app`: Contém todas as rotas da aplicação.
    - `/(routes)`: Grupos de rotas para organização (ex: `(auth)`, `(platform)`).
    - `/[dynamic-route]`: Rotas dinâmicas.
    - `/api`: Rotas de API do backend Next.js.
    - `layout.tsx`: Layout principal da aplicação.
    - `page.tsx`: A página principal (homepage).
    - `globals.css`: Estilos globais.
- `/components`: Componentes React reutilizáveis.
    - `/ui`: Componentes de UI puros e genéricos (Button, Input, Card).
    - `/forms`: Componentes específicos para formulários.
    - `/layout`: Componentes de estrutura (Header, Footer, Sidebar).
- `/lib`: Funções utilitárias, helpers e integrações com APIs externas.
    - `utils.ts`: Funções genéricas.
    - `api.ts`: Funções para fazer fetch de dados da API do Nest.js.
- `/hooks`: Hooks customizados (ex: `useUser`, `useCart`).
- `/styles`: Arquivos de estilização que não são globais (se não usar Tailwind CSS).
- `/types` ou `/interfaces`: Definições de tipos e interfaces globais do TypeScript (ex: `user.ts`, `product.ts`).

### 3. Componentes e Tipagem (TypeScript)

- **Props:** As props de cada componente devem ser definidas usando uma `interface` ou `type` no mesmo arquivo do componente.
    ```typescript
    interface UserProfileProps {
      userId: string;
      userName: string;
    }

    export default function UserProfile({ userId, userName }: UserProfileProps) {
      // ...
    }
    ```

### 4. Estilização

- **Variáveis de CSS:** Cores, fontes e espaçamentos devem ser definidos como variáveis CSS no arquivo `globals.css` para serem reutilizadas em todo o projeto.

### 5. Nomenclatura de Branches e Commits

- **Branches:**
    - `feature/nome-da-feature`
    - `bugfix/correcao-do-bug`
    - `refactor/melhoria-de-codigo`
'   Tentar criar branches com propósito e não criar várias para uma issue/tarefa que você deva resolver. Lembrando, Branch não é COMMIT.

- **Commits (Conventional Commits):**
    - `feat:` Adição de uma nova funcionalidade.
    - `fix:` Correção de um bug.
    - `chore:` Tarefas de build, configuração de bibliotecas, etc (ex: `eas.json`, `babel.config.js`).
    - `docs:` Alterações na documentação.
    - `style:` Alterações de formatação do código, a forma como ele esta escrita.
    - `refactor:` Refatoração de código, não corrige e nem adicione nada, serve como uma otimização.

### 6. Imports e Alias

- Use o alias `@/` para todos os imports internos (aponta para a pasta `src/`).
- Ordene imports em blocos: (1) React/Next (2) libs externas (3) internos (4) assets/styles. O ESLint já roda `simple-import-sort`.
- Remova imports não usados — o ESLint está configurado para apontar/remover quando possível.

### 7. Checklist para PR (Frontend)

- **Lint:** `npm run lint` (sem warnings de `no-console` e sem erros críticos).
- **Build:** `npm run build` (garantir que a build Next não quebrou o fluxo afetado).
- **Fluxo testado:** Confirme manualmente o fluxo afetado no `dev` (ex: login, cadastro, navegação).
- **Commits claros:** Use mensagens pequenas e descritivas (ex.: `refactor: padroniza imports do modal PostLoginModal`).

Seguindo estas regras ajudamos a manter o projeto consistente e fácil de manter até o MVP.