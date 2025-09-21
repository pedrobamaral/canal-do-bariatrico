# Guia de Estilo e Padrões de Código - Backend (Nest.js, Prisma & TypeScript)

### 1. Comentário e Código

- Todo o código deve ser escrito em inglês, incluindo comentários, variáveis, funções, componentes etc
- Comentários devem preferencialmente explicar o "porquê" de lógicas complexas. 

### 2. Estrutura de Pastas (Padrão Nest.js)

A estrutura de pastas deve ser modular, onde cada funcionalidade de negócio (módulo) é autocontida.

MÓDULO === FUNCIONALIDADES(ex: Usuário, Produto, Adm, Estoque, Autenticação etc)

- `/prisma`: Contém o arquivo `schema.prisma` e os arquivos de migração.
    - `/migrations`
    - `schema.prisma`
- `/src`: Pasta raiz do código-fonte da aplicação.
    - `/common`: Módulos, decorators, guards e utilitários compartilhados pela aplicação.
    - `/[nome-do-modulo]`: Cada módulo de negócio terá sua própria pasta. (ex: `/users`, `/products`, `/auth`).
        - `/[nome-do-modulo].module.ts`: Definição do módulo (ex: `users.module.ts`).
        - `/[nome-do-modulo].controller.ts`: Lida com as rotas HTTP e a validação de entrada (ex: `users.controller.ts`).
        - `/[nome-do-modulo].service.ts`: Contém a lógica de negócio e a interação com o banco de dados (Prisma) (ex: `users.service.ts`).
        - `/dto`: Data Transfer Objects para validação de `request bodies`.
            - `create-[nome-do-modulo].dto.ts`
            - `update-[nome-do-modulo].dto.ts`
        - `/entities`: Entidades ou tipos relacionados ao módulo (opcional, pode ser inferido do Prisma).
    - `main.ts`: Arquivo de entrada da aplicação.
    - `app.module.ts`: O módulo raiz da aplicação.


### 3. Prisma e Banco de Dados

- **Schema (`schema.prisma`):**
    - **Nomes de Modelos:** `PascalCase` e no singular (ex: `model User`, `model Product`).
    - **Nomes de Campos:** `camelCase` (ex: `firstName`, `createdAt`).
    - **Relações:** Seja explícito sobre os nomes das relações usando o atributo `@relation("NomeDaRelacao")`.
- **Prisma Service:** Crie um serviço (`PrismaService`) que encapsule a instância do `PrismaClient` e o disponibilize para o resto da aplicação através de injeção de dependência.
- **Interação com o Banco:** Toda a comunicação com o banco de dados deve ser feita exclusivamente dentro dos **Services**. Controllers não devem interagir diretamente com o Prisma, para facilitar a compreensão e ajuste do código.

OBS: 'NPX PRISMA MIGRATE' - toda alteração/adição no Banco de Dados deve vir seguida desse comando no terminal. 
Alterações no Banco de Dados devem ser sinalizadas nos commits.

### 4. Padrões de Código (Nest.js)

- **DTOs (Data Transfer Objects):** Utilize classes com decorators dos pacotes `class-validator` e `class-transformer` para validar todos os dados de entrada (payloads de requisições). Isso garante que a lógica de negócio nos services receba dados já validados.
- **Services:** Devem conter a lógica de negócio principal. Eles são responsáveis por orquestrar as operações, chamar o Prisma Client e retornar os dados para os Controllers.
- **Controllers:** Devem ser o mais "magros" (thin) possível. Sua única responsabilidade é:
    1. Receber requisições HTTP.
    2. Validar os dados de entrada usando DTOs e Pipes.
    3. Chamar o método apropriado no Service.
    4. Retornar a resposta HTTP (com o status code correto).
- **Injeção de Dependência:** Utilize o sistema de injeção de dependência do Nest.js extensivamente. Declare dependências (como services) no construtor das classes.

### 5. Nomenclatura de Branches e Commits

- **Branches:**
    - `feature/nome-da-feature`
    - `bugfix/correcao-do-bug`
    - `refactor/melhoria-de-codigo`
- **Commits (Conventional Commits):**
    - `feat:` Adição de uma nova funcionalidade.
    - `fix:` Correção de um bug.
    - `feat/fix(DB):` Adição de uma nova funcionalidade OU correção de erros no BANCO DE DADOS(exigem 'prisma migrate')
    - `chore:` Tarefas de build, configuração de bibliotecas, etc.
    - `docs:` Alterações na documentação (ex: no README).
    - `refactor:` Refatoração de código. 



