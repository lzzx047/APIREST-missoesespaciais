const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Missões Espaciais',
      version: '1.0.0',
      description:
        'API REST para gerenciamento de missões espaciais, com integração à NASA APOD.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    components: {
      schemas: {
        Missao: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Apollo 11' },
            ano: { type: 'integer', example: 1969 },
            agencia: { type: 'string', example: 'NASA' },
            status: { type: 'string', example: 'Concluída' },
          },
        },
        MissaoEntrada: {
          type: 'object',
          required: ['nome', 'ano', 'agencia', 'status'],
          properties: {
            nome: { type: 'string', example: 'Artemis III' },
            ano: { type: 'integer', example: 2027 },
            agencia: { type: 'string', example: 'NASA' },
            status: { type: 'string', example: 'Planejada' },
          },
        },
        Apod: {
          type: 'object',
          properties: {
            date: { type: 'string', example: '2024-01-15' },
            title: { type: 'string', example: 'Título da imagem' },
            explanation: { type: 'string', example: 'Texto explicativo sobre a imagem do dia.' },
            media_type: { type: 'string', example: 'image' },
            url: { type: 'string', example: 'https://apod.nasa.gov/apod/image/exemplo.jpg' },
            hdurl: { type: 'string', example: 'https://apod.nasa.gov/apod/image/exemplo_hd.jpg' },
            copyright: { type: 'string', example: 'Nome do autor' },
          },
        },
        Erro: {
          type: 'object',
          properties: { erro: { type: 'string', example: 'Mensagem de erro' } },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../app.js'), path.join(__dirname, '../routes/*.js')],
};

module.exports = swaggerJsdoc(options);
