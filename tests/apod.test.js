jest.mock('axios');

const axios = require('axios');
const request = require('supertest');
const app = require('../src/app');

const JSON_CT = /application\/json/;

const respostaNasa = {
  date: '2024-01-15',
  title: 'Título da imagem',
  explanation: 'Texto explicativo sobre a imagem do dia.',
  media_type: 'image',
  url: 'https://apod.nasa.gov/apod/image/exemplo.jpg',
  hdurl: 'https://apod.nasa.gov/apod/image/exemplo_hd.jpg',
  copyright: 'Nome do autor',
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('GET /apod', () => {
  it('retorna 200 e os campos esperados quando o axios responde com sucesso', async () => {
    axios.get.mockResolvedValue({ data: respostaNasa });

    const res = await request(app).get('/apod');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toEqual(respostaNasa);
    expect(axios.get).toHaveBeenCalledTimes(1);
    const [url, config] = axios.get.mock.calls[0];
    expect(url).toBe('https://api.nasa.gov/planetary/apod');
    expect(config.timeout).toBe(5000);
    expect(config.params).toHaveProperty('api_key');
  });

  it('não quebra na ausência de hdurl e copyright (vídeo)', async () => {
    const video = {
      date: '2024-01-16',
      title: 'Vídeo do dia',
      explanation: 'Um vídeo.',
      media_type: 'video',
      url: 'https://www.youtube.com/embed/abc',
    };
    axios.get.mockResolvedValue({ data: video });

    const res = await request(app).get('/apod');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(video);
    expect(res.body).not.toHaveProperty('hdurl');
    expect(res.body).not.toHaveProperty('copyright');
  });

  it('repassa o parâmetro date ao axios quando informado', async () => {
    axios.get.mockResolvedValue({ data: respostaNasa });

    const res = await request(app).get('/apod?date=2024-01-15');
    expect(res.status).toBe(200);
    expect(axios.get.mock.calls[0][1].params.date).toBe('2024-01-15');
  });

  it('retorna 400 para date em formato inválido, sem chamar o axios', async () => {
    const res = await request(app).get('/apod?date=15-01-2024');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('retorna 400 para data inexistente no calendário, sem chamar o axios', async () => {
    const res = await request(app).get('/apod?date=2024-02-31');
    expect(res.status).toBe(400);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('retorna 400 quando a NASA rejeita a data', async () => {
    axios.get.mockRejectedValue({ response: { status: 400, data: { msg: 'Date must be between Jun 16, 1995 and today.' } } });

    const res = await request(app).get('/apod?date=1990-01-01');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 429 quando o limite da chave da NASA é atingido', async () => {
    axios.get.mockRejectedValue({ response: { status: 429 } });

    const res = await request(app).get('/apod');
    expect(res.status).toBe(429);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 502 quando o axios rejeita com erro de rede', async () => {
    axios.get.mockRejectedValue(Object.assign(new Error('Network Error'), { code: 'ERR_NETWORK' }));

    const res = await request(app).get('/apod');
    expect(res.status).toBe(502);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 502 quando a NASA responde com erro 500', async () => {
    axios.get.mockRejectedValue({ response: { status: 500 } });

    const res = await request(app).get('/apod');
    expect(res.status).toBe(502);
  });

  it('retorna 502 quando a resposta da NASA é inválida', async () => {
    axios.get.mockResolvedValue({ data: 'resposta inesperada' });

    const res = await request(app).get('/apod');
    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 504 quando ocorre timeout (ECONNABORTED)', async () => {
    axios.get.mockRejectedValue(Object.assign(new Error('timeout of 5000ms exceeded'), { code: 'ECONNABORTED' }));

    const res = await request(app).get('/apod');
    expect(res.status).toBe(504);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });
});
