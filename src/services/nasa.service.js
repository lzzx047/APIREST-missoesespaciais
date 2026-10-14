const axios = require('axios');

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const TIMEOUT_MS = 5000;

class ErroNasa extends Error {
  constructor(status, mensagem) {
    super(mensagem);
    this.status = status;
  }
}

async function buscarApod(date) {
  const params = { api_key: process.env.NASA_API_KEY || 'DEMO_KEY' };
  if (date) params.date = date;

  let resposta;
  try {
    resposta = await axios.get(NASA_APOD_URL, { params, timeout: TIMEOUT_MS });
  } catch (err) {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new ErroNasa(504, 'A NASA não respondeu dentro do tempo limite.');
    }
    if (err.response) {
      const status = err.response.status;
      if (status === 429) {
        throw new ErroNasa(429, 'Limite de requisições da chave da NASA atingido.');
      }
      if (status === 400) {
        const msg = err.response.data && err.response.data.msg;
        throw new ErroNasa(400, msg || 'Data rejeitada pela NASA.');
      }
    }
    throw new ErroNasa(502, 'Falha ao consultar a API da NASA.');
  }

  const dados = resposta && resposta.data;
  if (!dados || typeof dados !== 'object' || !dados.date || !dados.title || !dados.url) {
    throw new ErroNasa(502, 'Resposta inesperada da API da NASA.');
  }

  const resultado = {
    date: dados.date,
    title: dados.title,
    explanation: dados.explanation,
    media_type: dados.media_type,
    url: dados.url,
  };
  // hdurl e copyright nem sempre existem (ex.: vídeos)
  if (dados.hdurl) resultado.hdurl = dados.hdurl;
  if (dados.copyright) resultado.copyright = dados.copyright;
  return resultado;
}

module.exports = { buscarApod, ErroNasa };
