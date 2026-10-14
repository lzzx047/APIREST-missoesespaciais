const express = require('express');
const nasaService = require('../services/nasa.service');

const router = express.Router();

function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const d = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

/**
 * @openapi
 * /apod:
 *   get:
 *     summary: Foto astronômica do dia (NASA APOD)
 *     description: Consulta a API APOD da NASA pelo servidor (a chave nunca é exposta ao cliente).
 *     tags: [NASA APOD]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato YYYY-MM-DD. Se omitida, retorna o APOD do dia.
 *         example: '2024-01-15'
 *     responses:
 *       200:
 *         description: Dados da imagem ou vídeo do dia
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Apod'
 *       400:
 *         description: Data em formato inválido ou rejeitada pela NASA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       429:
 *         description: Limite de requisições da chave da NASA atingido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       502:
 *         description: Falha ou resposta inesperada da NASA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       504:
 *         description: A NASA não respondeu dentro do tempo limite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/', async (req, res) => {
  const { date } = req.query;

  if (date !== undefined && (typeof date !== 'string' || !dataValida(date))) {
    return res.status(400).json({ erro: 'Parâmetro date inválido. Use o formato YYYY-MM-DD.' });
  }

  try {
    const apod = await nasaService.buscarApod(date);
    res.status(200).json(apod);
  } catch (err) {
    const status = err instanceof nasaService.ErroNasa ? err.status : 502;
    const erro = err instanceof nasaService.ErroNasa ? err.message : 'Falha ao consultar a API da NASA.';
    res.status(status).json({ erro });
  }
});

module.exports = router;
