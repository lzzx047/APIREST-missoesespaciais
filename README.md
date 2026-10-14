API de Missões Espaciais

1. Identificação

Aluno: Luiz Fernando Marques

Curso: Técnico em Informática para Internet

Unidade Curricular: Desenvolver Serviços Web

2. Sobre o projeto

Este projeto foi desenvolvido para praticar a criação de uma API REST usando Node.js e Express.

A API permite cadastrar, consultar, atualizar e excluir missões espaciais. Os dados das missões ficam armazenados em memória, ou seja, não são salvos em um banco de dados.

Também foi adicionada uma rota que consulta a foto astronômica do dia da NASA (APOD). O projeto conta com testes automatizados usando Jest e Supertest e uma documentação dos endpoints feita com Swagger.

3. Tecnologias utilizadas

As principais tecnologias e ferramentas utilizadas foram:

Node.js: execução do JavaScript no servidor.

Express: criação das rotas da API.

Jest: execução dos testes automatizados.

Supertest: testes das requisições HTTP.

Swagger: documentação da API.

JSON: formato dos dados enviados e recebidos.

Axios: comunicação com a API da NASA.

dotenv: configuração das variáveis de ambiente.

4. Como baixar o projeto

Para baixar o projeto, abra o terminal e execute os comandos abaixo. Substitua a URL pelo endereço do repositório no GitHub.

git clone URL_DO_REPOSITORIO
cd NOME_DO_REPOSITORIO

5. Instalando as dependências

Depois de entrar na pasta do projeto, execute:

npm install

Esse comando instala os pacotes necessários para o funcionamento da API.

6. Como executar a API

Antes de iniciar, é necessário configurar a chave de acesso da NASA.

Crie um arquivo .env com base no .env.example e informe sua chave na variável NASA_API_KEY. A chave gratuita pode ser obtida no site NASA API.

Caso não tenha uma chave própria, o projeto utiliza a DEMO_KEY, que possui um limite menor de requisições.

Com tudo configurado, inicie o servidor:

npm start

Depois de iniciar, os endereços para acessar o projeto são:

API: http://localhost:3000

Documentação Swagger: http://localhost:3000/api-docs

Estrutura de pastas

.
├── src/
│   ├── app.js
│   ├── server.js
│   ├── data/
│   │   └── missoes.js
│   ├── routes/
│   │   ├── missoes.routes.js
│   │   └── apod.routes.js
│   ├── services/
│   │   └── nasa.service.js
│   └── docs/
│       └── swagger.js
├── tests/
│   ├── missoes.test.js
│   └── apod.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md

Cada arquivo tem uma função no projeto. As rotas cuidam das requisições, o serviço da NASA faz a comunicação com a API externa e a pasta tests contém os testes automatizados.

7. Executando os testes

Para executar os testes, utilize o comando:

npm test

Os testes verificam se as rotas estão funcionando corretamente, incluindo situações em que uma requisição dá certo ou apresenta algum erro.

Entre os cenários testados estão:

Verificação do funcionamento da API pela rota /status.

Cadastro, consulta, atualização e exclusão de missões.

Validação dos dados enviados nas requisições.

Respostas para missões que não existem e rotas inválidas.

Retorno dos dados no formato JSON.

Funcionamento da documentação Swagger.

Consulta à API da NASA, incluindo erros de conexão, datas inválidas, limite de requisições e tempo de espera excedido.

Nos testes da rota /apod, o Axios é simulado para que seja possível verificar as respostas sem depender de uma chamada real à NASA.

Também é feita uma restauração dos dados das missões antes de cada teste, evitando que um teste interfira no resultado de outro.

8. Endpoints da API

Abaixo estão as rotas disponíveis e suas principais funções.

As respostas de erro seguem o formato:

{
  "erro": "mensagem"
}

GET /status

Verifica se a API está funcionando.

Resposta esperada:

{
  "status": "ok"
}

Código HTTP: 200

GET /missoes

Retorna a lista de missões cadastradas.

Exemplo de resposta:

[
  {
    "id": 1,
    "nome": "Apollo 11",
    "ano": 1969,
    "agencia": "NASA",
    "status": "Concluída"
  }
]

Código HTTP: 200

GET /missoes/{id}

Busca uma missão pelo seu ID.

Exemplo de requisição: GET /missoes/1

Código HTTP: 200 se a missão for encontrada ou 404 se ela não existir.

POST /missoes

Cadastra uma nova missão. Todos os campos são obrigatórios, e o ano precisa ser um número inteiro.

Exemplo de corpo da requisição:

{
  "nome": "Artemis III",
  "ano": 2027,
  "agencia": "NASA",
  "status": "Planejada"
}

Código HTTP: 201 se o cadastro for realizado ou 400 se os dados forem inválidos.

PUT /missoes/{id}

Atualiza os dados de uma missão existente.

Exemplo de requisição: PUT /missoes/3

{
  "nome": "Artemis III",
  "ano": 2027,
  "agencia": "NASA",
  "status": "Em preparação"
}

Código HTTP: 200 se a atualização der certo, 400 para dados inválidos ou 404 se a missão não existir.

DELETE /missoes/{id}

Remove uma missão pelo ID.

Exemplo de requisição: DELETE /missoes/2

Se a exclusão for realizada, a API retorna uma resposta sem conteúdo.

Código HTTP: 204 se a missão for removida ou 404 se ela não existir.

GET /apod

Consulta a foto astronômica do dia disponibilizada pela NASA.

A rota também aceita o parâmetro opcional date, para consultar uma data específica no formato AAAA-MM-DD.

Exemplos de requisição:

GET /apod

GET /apod?date=2024-01-15

Exemplo de resposta:

{
  "date": "2024-01-15",
  "title": "Título da imagem",
  "explanation": "Texto explicativo sobre a imagem do dia.",
  "media_type": "image",
  "url": "https://apod.nasa.gov/apod/image/exemplo.jpg",
  "hdurl": "https://apod.nasa.gov/apod/image/exemplo_hd.jpg",
  "copyright": "Nome do autor"
}

Os campos hdurl e copyright podem não aparecer na resposta, dependendo dos dados enviados pela NASA.

A chave de acesso fica no servidor e não é enviada diretamente ao usuário.

Códigos HTTP: 200 para sucesso, 400 para data inválida, 429 para limite de requisições, 502 para falhas na comunicação ou respostas inválidas e 504 para tempo de espera excedido.

GET /api-docs

Abre a documentação interativa da API, onde é possível consultar as rotas e testar as requisições pelo Swagger UI.

9. Evidências do projeto

Nesta parte serão adicionadas capturas de tela para mostrar o funcionamento dos testes e da documentação.

Testes automatizados

Captura de tela da execução do comando npm test, mostrando o resultado dos testes.

Arquivo: docs/evidencias/npm-test.png

Documentação Swagger

Captura de tela da documentação aberta no navegador pelo endereço /api-docs.

Arquivo: docs/evidencias/swagger.png

10. Considerações finais

O desenvolvimento deste projeto ajudou a praticar a criação de APIs com Node.js e Express, o uso de rotas HTTP e o tratamento de erros.

Também foi possível trabalhar com testes automatizados, documentação com Swagger e integração com uma API externa, utilizando os dados da NASA.

O projeto reúne, na prática, alguns dos principais conteúdos estudados na unidade curricular Desenvolver Serviços Web.