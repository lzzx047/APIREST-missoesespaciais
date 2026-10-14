

## 1. Identificação

- **Aluno:** _(LUIZ FERNANDO MARQUES )_
- **Curso:** _(TEC INFORMATICA PARA INTERNET)_
- **Unidade Curricular:** Desenvolver Serviços Web

## 2. Descrição do Projeto

API REST em Node.js/Express para cadastrar, consultar, atualizar e remover missões espaciais (dados em memória), com consulta à foto astronômica do dia da NASA (APOD), testes automatizados com Jest e Supertest e documentação interativa em Swagger (OpenAPI 3.0).

## 3. Tecnologias Utilizadas

- Node.js
- Express
- Jest
- Supertest
- Swagger (swagger-ui-express e swagger-jsdoc)
- JSON
- Axios (consumo da API APOD da NASA)
- dotenv (variáveis de ambiente)

## 4. Como Clonar o Projeto

```bash
git clone URL_DO_REPOSITORIO
cd NOME_DO_REPOSITORIO
```

## 5. Como Instalar as Dependências

```bash
npm install
```

## 6. Como Executar o Projeto

Antes de executar, copie `.env.example` para `.env` e informe a `NASA_API_KEY` (chave gratuita em https://api.nasa.gov). Sem a chave, a API usa `DEMO_KEY`, com limite de uso reduzido.

```bash
cp .env.example .env
npm start
```

- API: http://localhost:3000
- Swagger UI: http://localhost:3000/api-docs

### Estrutura de pastas

```
.
├── src/
│   ├── app.js                    # criação do app Express (sem abrir porta)
│   ├── server.js                 # inicialização do servidor
│   ├── data/missoes.js           # array em memória + função resetar()
│   ├── routes/
│   │   ├── missoes.routes.js     # CRUD de missões
│   │   └── apod.routes.js        # rota /apod
│   ├── services/nasa.service.js  # chamada ao axios isolada
│   └── docs/swagger.js           # configuração OpenAPI
├── tests/
│   ├── missoes.test.js
│   └── apod.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 7. Como Executar os Testes

```bash
npm test
```

Os testes (Jest + Supertest) cobrem:

- `GET /status`, e o CRUD de `/missoes` com cenários de sucesso e erro (200, 201, 204, 400, 404), além de verificar o `Content-Type` JSON;
- rota inexistente retornando 404 em JSON e Swagger UI em `/api-docs`;
- `GET /apod` com `axios` simulado via `jest.mock('axios')`: sucesso, repasse de `date`, `date` inválido sem chamar o axios, 400/429 da NASA, 502 (rede ou resposta inválida) e 504 (timeout `ECONNABORTED`).

Cada teste é independente: `beforeEach` restaura o array de missões ao estado inicial.

## 8. Documentação dos Endpoints

Todas as respostas de erro seguem o formato `{ "erro": "mensagem" }`.

### GET /status
- **Objetivo:** verificar o funcionamento da API.
- **Resposta:** `{ "status": "ok" }`
- **Status:** 200

### GET /missoes
- **Objetivo:** listar todas as missões.
- **Requisição:** `GET /missoes`
- **Resposta:**
```json
[{ "id": 1, "nome": "Apollo 11", "ano": 1969, "agencia": "NASA", "status": "Concluída" }]
```
- **Status:** 200

### GET /missoes/{id}
- **Objetivo:** buscar uma missão pelo ID.
- **Requisição:** `GET /missoes/1`
- **Resposta:**
```json
{ "id": 1, "nome": "Apollo 11", "ano": 1969, "agencia": "NASA", "status": "Concluída" }
```
- **Status:** 200, 404

### POST /missoes
- **Objetivo:** cadastrar uma nova missão (todos os campos obrigatórios; `ano` deve ser inteiro).
- **Requisição:**
```json
{ "nome": "Artemis III", "ano": 2027, "agencia": "NASA", "status": "Planejada" }
```
- **Resposta:**
```json
{ "id": 7, "nome": "Artemis III", "ano": 2027, "agencia": "NASA", "status": "Planejada" }
```
- **Status:** 201, 400

### PUT /missoes/{id}
- **Objetivo:** atualizar uma missão existente.
- **Requisição:** `PUT /missoes/3`
```json
{ "nome": "Artemis III", "ano": 2027, "agencia": "NASA", "status": "Em preparação" }
```
- **Resposta:**
```json
{ "id": 3, "nome": "Artemis III", "ano": 2027, "agencia": "NASA", "status": "Em preparação" }
```
- **Status:** 200, 400, 404

### DELETE /missoes/{id}
- **Objetivo:** remover uma missão.
- **Requisição:** `DELETE /missoes/2`
- **Resposta:** sem corpo.
- **Status:** 204, 404

### GET /apod
- **Objetivo:** foto astronômica do dia (NASA APOD). A chamada é feita pelo servidor e a chave nunca é exposta.
- **Parâmetro opcional:** `date` (`YYYY-MM-DD`). Exemplos: `GET /apod` e `GET /apod?date=2024-01-15`
- **Resposta:**
```json
{
  "date": "2024-01-15",
  "title": "Título da imagem",
  "explanation": "Texto explicativo sobre a imagem do dia.",
  "media_type": "image",
  "url": "https://apod.nasa.gov/apod/image/exemplo.jpg",
  "hdurl": "https://apod.nasa.gov/apod/image/exemplo_hd.jpg",
  "copyright": "Nome do autor"
}
```
(`hdurl` e `copyright` são omitidos quando a NASA não os envia.)
- **Status:** 200, 400, 429, 502, 504

### GET /api-docs
- **Objetivo:** Swagger UI com todos os endpoints documentados.

## 9. Evidências

### Testes (`npm test`)

_(inserir captura de tela aqui: `docs/evidencias/npm-test.png`)_

### Swagger UI (`/api-docs`)

_(inserir captura de tela aqui: `docs/evidencias/swagger.png`)_
