const missoesIniciais = [
  { id: 1, nome: 'Apollo 11', ano: 1969, agencia: 'NASA', status: 'Concluída' },
  { id: 2, nome: 'Voyager 1', ano: 1977, agencia: 'NASA', status: 'Em operação' },
  { id: 3, nome: 'Artemis II', ano: 2026, agencia: 'NASA', status: 'Planejada' },
  { id: 4, nome: 'Sputnik 1', ano: 1957, agencia: 'URSS', status: 'Concluída' },
  { id: 5, nome: 'Chandrayaan-3', ano: 2023, agencia: 'ISRO', status: 'Concluída' },
  { id: 6, nome: 'Hubble', ano: 1990, agencia: 'NASA/ESA', status: 'Em operação' },
];

// Array em memória usado pela aplicação (mutável).
const missoes = [];
let proximoId = 1;

function resetar() {
  missoes.length = 0;
  missoesIniciais.forEach((m) => missoes.push({ ...m }));
  proximoId = Math.max(...missoes.map((m) => m.id)) + 1;
}

function gerarId() {
  return proximoId++;
}

resetar();

module.exports = { missoes, resetar, gerarId };
