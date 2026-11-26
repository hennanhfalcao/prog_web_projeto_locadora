# Locadora — Sistema de Locação de Veículos

Projeto prático da disciplina **Programação com Frameworks Web** (UNIPÊ).

Sistema web full stack para uma locadora: usuários autenticados cadastram e consultam veículos, registram locações, acompanham o histórico e registram devoluções. O backend é uma API REST em **Node.js + Express** com **Prisma ORM** e **MySQL**, autenticação por **JWT** e senhas com **bcrypt**. O frontend é uma aplicação **React** (Vite + TypeScript) que consome a API com **axios**.

## 👥 Integrantes

| Nome | Matrícula |
|---|---|
| HENNAN HEIM FALCÃO | 39699927 |

## ✨ Funcionalidades

**Usuários e autenticação**
- Cadastro com nome, e-mail e senha (senha armazenada como hash bcrypt).
- Login com retorno de token JWT; identificação do usuário logado e logout.
- Todas as operações de veículos e locações exigem `Authorization: Bearer <token>`.

**Veículos**
- Cadastro com validação de placa única (formatos `ABC1234` e Mercosul `ABC1D23`) e valor de diária positivo.
- Listagem com situação de disponibilidade e filtro por disponíveis/locados.
- Seleção de um veículo disponível para iniciar uma locação.

**Locações**
- Registro da locação com veículo escolhido e período informado; o usuário vem do token, nunca do corpo da requisição.
- Valor total calculado no backend: cada fração de 24 horas conta como uma diária completa.
- Histórico do usuário autenticado (ativas e finalizadas), com os dados do veículo.
- Finalização (devolução), registrando a data de devolução e liberando o veículo.

## 🧰 Tecnologias

| Camada | Tecnologias |
|---|---|
| Backend | Node.js, Express 5, Prisma ORM 7 (adapter MariaDB), MySQL 8, JWT (jsonwebtoken), bcrypt, zod, dotenv, nodemon |
| Frontend | React 19, TypeScript, Vite, React Router, axios, jwt-decode |
| Infra | Docker Compose (MySQL) — opcional |

## 📋 Requisitos

- **Node.js 20+** (desenvolvido com Node 24) e npm
- **MySQL 8**, de uma destas formas:
  - **Docker** com Docker Compose (o projeto já traz o `docker-compose.yml`), ou
  - um MySQL instalado localmente

## 🚀 Instalação e execução

### 1. Clonar o repositório

```bash
git clone https://github.com/hennanhfalcao/prog_web_projeto_locadora.git
cd prog_web_projeto_locadora
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env` e preencha os valores:

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexão usada pela CLI do Prisma (migrations e seed) | `mysql://root:SENHA@localhost:3306/locadora` |
| `DB_HOST` / `DB_PORT` | Endereço e porta do MySQL | `localhost` / `3306` |
| `DB_USER` / `DB_PASSWORD` | Usuário e senha do MySQL | `root` / `SENHA` |
| `DB_NAME` | Nome do banco | `locadora` |
| `PORT` | Porta da API | `3000` |
| `CORS_ORIGIN` | Endereço do frontend | `http://localhost:5173` |
| `JWT_SECRET` | Segredo para assinar os tokens (use um texto longo e aleatório) | — |
| `JWT_EXPIRES_IN` | Validade do token | `1h` |

> Para gerar um `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**Subir o banco de dados**

- **Com Docker:** o container usa `DB_PASSWORD` como senha do root e cria o banco `DB_NAME`.

  ```bash
  npm run db:up
  ```

- **Com MySQL local:** basta que o usuário configurado em `DB_USER` tenha permissão para criar bancos. As migrations criam as tabelas.

**Instalar dependências, criar as tabelas e popular com dados de exemplo**

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

**Iniciar a API**

```bash
npm run dev
```

A API fica disponível em `http://localhost:3000`.

### 3. Frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173`.

O `.env` do frontend tem apenas `VITE_API_URL`, o endereço da API (padrão `http://localhost:3000`).

## 🧪 Dados de exemplo

O seed (`npx prisma db seed`) limpa as tabelas e cria:

| Usuário | E-mail | Senha |
|---|---|---|
| Ana Souza | `ana@locadora.com` | `123456` |
| Bruno Lima | `bruno@locadora.com` | `123456` |

- 6 veículos (Argo, Polo, Onix, Corolla, Creta e Compass);
- Ana: 1 locação finalizada (Argo) e 1 ativa (Polo);
- Bruno: 1 locação ativa (Corolla).

Logo, Polo e Corolla começam indisponíveis. Rode o seed novamente para restaurar o estado inicial antes de uma demonstração.

## 🔌 Rotas da API

| Método | Rota | Autenticação | Descrição | Sucesso |
|---|---|---|---|---|
| `POST` | `/usuarios` | — | Cadastra usuário `{nome, email, senha}` | `201` |
| `POST` | `/login` | — | Autentica `{email, senha}` e retorna `{token, usuario}` | `200` |
| `GET` | `/usuarios/me` | Bearer | Dados do usuário autenticado | `200` |
| `GET` | `/veiculos` | Bearer | Lista veículos; filtro opcional `?disponivel=true\|false` | `200` |
| `GET` | `/veiculos/:id` | Bearer | Consulta um veículo | `200` |
| `POST` | `/veiculos` | Bearer | Cadastra veículo `{marca, modelo, placa, ano, valorDiaria}` | `201` |
| `POST` | `/locacoes` | Bearer | Registra locação `{veiculoId, dataInicio, dataPrevistaDevolucao}` | `201` |
| `GET` | `/locacoes` | Bearer | Histórico de locações do usuário autenticado | `200` |
| `GET` | `/locacoes/:id` | Bearer | Consulta uma locação própria | `200` |
| `PATCH` | `/locacoes/:id/finalizar` | Bearer | Registra a devolução | `200` |

**Respostas de erro**

| Código | Situação | Formato |
|---|---|---|
| `400` | Dados inválidos (validação zod ou regra de datas) | `{"errors":[{"campo","message"}]}` ou `{"error"}` |
| `401` | Token ausente, inválido ou expirado; credenciais incorretas | `{"error"}` |
| `403` | Acesso a locação de outro usuário | `{"error"}` |
| `404` | Veículo ou locação inexistente | `{"error"}` |
| `409` | E-mail ou placa duplicados; veículo indisponível; locação já finalizada | `{"error"}` |

**Exemplo de uso com curl**

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@locadora.com","senha":"123456"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s "http://localhost:3000/veiculos?disponivel=true" -H "Authorization: Bearer $TOKEN"

curl -s -X POST http://localhost:3000/locacoes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"veiculoId":3,"dataInicio":"2026-12-01T10:00:00Z","dataPrevistaDevolucao":"2026-12-03T12:00:00Z"}'
```

> Os ids são gerados pelo banco; consulte `GET /veiculos` para obter o `veiculoId` correto.

## 🗂️ Estrutura do projeto

```
backend/
├── prisma/
│   ├── schema.prisma          modelos Usuario, Veiculo, Locacao e enum StatusLocacao
│   ├── migrations/            migrations versionadas
│   └── seed.js                dados de exemplo
├── prisma.config.js           configuração da CLI do Prisma
├── docker-compose.yml         MySQL para desenvolvimento
└── src/
    ├── index.js               configuração do Express e registro das rotas
    ├── databases/prisma.js    PrismaClient com adapter MariaDB
    ├── routes/                mapeamento dos endpoints
    ├── controllers/           entrada e resposta HTTP
    ├── services/              validações e regras de negócio
    ├── middlewares/           authMiddleware (JWT) e validarSchema (zod)
    ├── schemas/               schemas zod de validação de entrada
    ├── errors/                ApiError e erros de domínio com status HTTP
    └── utils/                 JWT, conversão de id e resposta de erro

frontend/src/
├── api/api.ts                 instância do axios com interceptors
├── services/                  AuthService, VeiculoService, LocacaoService
├── types/                     interfaces TypeScript
├── components/                PrivateRoute, LoginRoute, Logout, Menu, Mensagem
├── pages/                     Login, Cadastro, ListarVeiculos, CadastrarVeiculo, NovaLocacao, MinhasLocacoes
└── utils/                     autenticação (jwt), mensagens de erro e formatação
```

## 🧠 Decisões de implementação

**Camadas (Route → Controller → Service → Prisma).** As rotas apenas associam método e caminho a middlewares e controllers. Os controllers extraem dados da requisição (`request.user`, `request.body`, `request.params`) e definem o status da resposta. Os services concentram as regras de negócio e o acesso ao banco via Prisma. Erros de negócio são classes que estendem `ApiError` e carregam o status HTTP; `responderErro` converte-os em resposta e transforma falhas inesperadas em `500` sem expor detalhes internos.

**Validação em duas etapas.** O middleware `validarSchema` usa zod para validar o formato da entrada (tipos, tamanhos, formato de e-mail e placa), normalizar dados (e-mail em minúsculas, placa em maiúsculas sem hífen) e descartar campos não previstos. Regras que dependem do estado do banco, como unicidade e disponibilidade, ficam nos services.

**Autenticação.** O login compara a senha com `bcrypt.compare` e gera um JWT (HS256) com o id do usuário no `subject`. O `authMiddleware` valida o formato `Bearer <token>`, a assinatura e a expiração, e preenche `request.user`. E-mail inexistente e senha incorreta retornam a mesma mensagem. Consultas de usuário usam `select` sem o campo `senha`, de modo que o hash nunca é retornado.

**Dono da locação.** O `usuarioId` da locação vem sempre de `request.user.id`. Consulta e finalização verificam se a locação pertence ao usuário autenticado e retornam `403` caso contrário; a listagem filtra por `usuarioId`.

**Disponibilidade e concorrência.** O registro da locação acontece dentro de `prisma.$transaction`: primeiro `veiculo.updateMany({ where: { id, disponivel: true }, data: { disponivel: false } })`, depois `locacao.create`. Como o `UPDATE` é condicional e o MySQL bloqueia a linha durante a escrita, apenas uma requisição concorrente obtém `count = 1`; as demais recebem `count = 0`, lançam `VeiculoIndisponivelError` (`409`) e a transação é desfeita. A finalização segue a mesma ideia com `locacao.updateMany({ where: { id, status: "ATIVA" } })`, impedindo finalizar duas vezes, e libera o veículo na mesma transação. Em teste com 10 requisições simultâneas para o mesmo veículo, houve 1 sucesso e 9 conflitos.

**Cálculo do valor.** `quantidadeDiarias = Math.ceil((dataPrevistaDevolucao - dataInicio) / 24h)` e `valorTotal = valorDiaria × quantidadeDiarias`, calculados com o tipo `Decimal` do Prisma para evitar erros de arredondamento. Valores monetários são armazenados como `DECIMAL(10,2)`.

**Datas.** A data prevista de devolução deve ser posterior à data de início, e a data de início não pode ser anterior ao dia atual. O veículo fica indisponível a partir do registro da locação.

**Preservação do histórico.** Não há exclusão de veículos ou locações. As chaves estrangeiras usam `ON DELETE RESTRICT`, impedindo remover usuários ou veículos que possuam locações.

**Unicidade.** E-mail e placa possuem `@unique` no schema (índice único no MySQL). Os services verificam a duplicidade antes de gravar e também tratam o erro `P2002` do Prisma, cobrindo cadastros simultâneos.

**Frontend.** Os formulários são controlados (`useState` com `value` e `onChange`) e enviados por `handleSubmit`, que chama `event.preventDefault()` e o service correspondente. Após cada operação, a interface exibe mensagem de sucesso ou o erro retornado pela API e recarrega os dados (por exemplo, `carregarVeiculos()` na `NovaLocacao` e `carregarLocacoes()` em `MinhasLocacoes`). O interceptor de requisição do axios adiciona o token a todas as chamadas, e o de resposta redireciona ao login quando a API retorna `401`. O `PrivateRoute` protege as telas, mas a autorização efetiva é sempre verificada pelo backend.

**Sem comentários no código.** Por exigência do projeto, o código-fonte não contém comentários; as explicações estão neste README.
