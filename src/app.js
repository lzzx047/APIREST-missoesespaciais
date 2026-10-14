require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const missoesRoutes = require('./routes/missoes.routes');
const apodRoutes = require('./routes/apod.routes');

const app = express();

app.use(express.json());

/**
 * @openapi
 * /status:
 *   get:
 *     summary: Verifica o funcionamento da API
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: API em funcionamento
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/missoes', missoesRoutes);
app.use('/apod', apodRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Tratamento de erros (ex.: JSON malformado)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;
