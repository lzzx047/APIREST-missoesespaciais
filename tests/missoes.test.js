const request = require('supertest');
const app = require('../src/app');
const dados = require('../src/data/missoes');

beforeEach(() => {
  dados.resetar();
});

const JSON_CT = /application\/json/;

describe('GET /status', () => {
  it('retorna 200 e { status: "ok" }', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /missoes', () => {
  it('retorna 200 e um array com pelo menos 5 itens', async () => {
    const res = await request(app).get('/missoes');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(5);
  });
});

describe('GET /missoes/:id', () => {
  it('retorna 200 com a missão correta', async () => {
    const res = await request(app).get('/missoes/1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toEqual({ id: 1, nome: 'Apollo 11', ano: 1969, agencia: 'NASA', status: 'Concluída' });
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app).get('/missoes/9999');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 404 para ID não numérico', async () => {
    const res = await request(app).get('/missoes/abc');
    expect(res.status).toBe(404);
  });
});

describe('POST /missoes', () => {
  const nova = { nome: 'Artemis III', ano: 2027, agencia: 'NASA', status: 'Planejada' };

  it('retorna 201 e a missão criada com id', async () => {
    const res = await request(app).post('/missoes').send(nova);
    expect(res.status).toBe(201);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toMatchObject(nova);
    expect(typeof res.body.id).toBe('number');

    const lista = await request(app).get('/missoes');
    expect(lista.body.some((m) => m.id === res.body.id)).toBe(true);
  });

  it('retorna 400 com dados inválidos', async () => {
    const res = await request(app).post('/missoes').send({ nome: '', ano: 'abc' });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 400 quando o corpo está vazio', async () => {
    const res = await request(app).post('/missoes').send();
    expect(res.status).toBe(400);
  });

  it('retorna 400 para JSON malformado', async () => {
    const res = await request(app)
      .post('/missoes')
      .set('Content-Type', 'application/json')
      .send('{ nome: ');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(JSON_CT);
  });
});

describe('PUT /missoes/:id', () => {
  const atualizacao = { nome: 'Artemis III', ano: 2027, agencia: 'NASA', status: 'Em preparação' };

  it('retorna 200 com a missão atualizada', async () => {
    const res = await request(app).put('/missoes/3').send(atualizacao);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toEqual({ id: 3, ...atualizacao });
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app).put('/missoes/9999').send(atualizacao);
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(JSON_CT);
  });

  it('retorna 400 com dados inválidos', async () => {
    const res = await request(app).put('/missoes/3').send({ nome: 'X' });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch(JSON_CT);
  });
});

describe('DELETE /missoes/:id', () => {
  it('retorna 204 e a missão não é mais encontrada', async () => {
    const res = await request(app).delete('/missoes/2');
    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    const busca = await request(app).get('/missoes/2');
    expect(busca.status).toBe(404);
  });

  it('retorna 404 para ID inexistente', async () => {
    const res = await request(app).delete('/missoes/9999');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(JSON_CT);
  });
});

describe('Rota inexistente e documentação', () => {
  it('retorna 404 em JSON para rota não encontrada', async () => {
    const res = await request(app).get('/rota-inexistente');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(JSON_CT);
    expect(res.body).toHaveProperty('erro');
  });

  it('serve o Swagger UI em /api-docs', async () => {
    const res = await request(app).get('/api-docs/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/html/);
  });
});
