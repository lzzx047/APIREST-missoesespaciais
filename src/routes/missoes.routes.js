const express = require('express');
const dados = require('../data/missoes');

const router = express.Router();

function validarMissao(body) {
  const erros = [];
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Corpo da requisição inválido.'];
  }
  const { nome, ano, agencia, status } = body;
  if (typeof nome !== 'string' || nome.trim() === '') erros.push('nome é obrigatório (texto não vazio)');
  if (!Number.isInteger(ano)) erros.push('ano é obrigatório (número inteiro)');
  if (typeof agencia !== 'string' || agencia.trim() === '') erros.push('agencia é obrigatória (texto não vazio)');
  if (typeof status !== 'string' || status.trim() === '') erros.push('status é obrigatório (texto não vazio)');
  return erros;
}

function buscarIndice(idParam) {
  if (!/^\d+$/.test(idParam)) return -1;
  const id = Number(idParam);
  return dados.missoes.findIndex((m) => m.id === id);
}

/**
 * @openapi
 * /missoes:
 *   get:
 *     summary: Lista todas as missões espaciais
 *     tags: [Missões]
 *     responses:
 *       200:
 *         description: Lista de missões
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Missao'
 */
router.get('/', (req, res) => {
  res.status(200).json(dados.missoes);
});

/**
 * @openapi
 * /missoes/{id}:
 *   get:
 *     summary: Busca uma missão pelo ID
 *     tags: [Missões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da missão
 *         example: 1
 *     responses:
 *       200:
 *         description: Missão encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Missao'
 *       404:
 *         description: Missão não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) return res.status(404).json({ erro: 'Missão não encontrada.' });
  res.status(200).json(dados.missoes[indice]);
});

/**
 * @openapi
 * /missoes:
 *   post:
 *     summary: Cadastra uma nova missão
 *     tags: [Missões]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MissaoEntrada'
 *     responses:
 *       201:
 *         description: Missão criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Missao'
 *       400:
 *         description: Campos obrigatórios ausentes ou inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', (req, res) => {
  const erros = validarMissao(req.body);
  if (erros.length) return res.status(400).json({ erro: erros.join('; ') });

  const { nome, ano, agencia, status } = req.body;
  const nova = { id: dados.gerarId(), nome: nome.trim(), ano, agencia: agencia.trim(), status: status.trim() };
  dados.missoes.push(nova);
  res.status(201).json(nova);
});

/**
 * @openapi
 * /missoes/{id}:
 *   put:
 *     summary: Atualiza uma missão existente
 *     tags: [Missões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da missão
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MissaoEntrada'
 *     responses:
 *       200:
 *         description: Missão atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Missao'
 *       400:
 *         description: Campos obrigatórios ausentes ou inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       404:
 *         description: Missão não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.put('/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) return res.status(404).json({ erro: 'Missão não encontrada.' });

  const erros = validarMissao(req.body);
  if (erros.length) return res.status(400).json({ erro: erros.join('; ') });

  const { nome, ano, agencia, status } = req.body;
  const atual = dados.missoes[indice];
  const atualizada = { ...atual, nome: nome.trim(), ano, agencia: agencia.trim(), status: status.trim(), id: atual.id };
  dados.missoes[indice] = atualizada;
  res.status(200).json(atualizada);
});

/**
 * @openapi
 * /missoes/{id}:
 *   delete:
 *     summary: Remove uma missão
 *     tags: [Missões]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da missão
 *         example: 2
 *     responses:
 *       204:
 *         description: Missão removida (sem corpo)
 *       404:
 *         description: Missão não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.delete('/:id', (req, res) => {
  const indice = buscarIndice(req.params.id);
  if (indice === -1) return res.status(404).json({ erro: 'Missão não encontrada.' });
  dados.missoes.splice(indice, 1);
  res.status(204).send();
});

module.exports = router;
