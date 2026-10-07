// Sinais exibidos na lista. Limiares de referência simples, só para destacar valores na tela:
// pressão ≥ 140/90 mmHg, colesterol total ≥ 190 mg/dL, FC de repouso fora de 50–100 bpm, SpO₂ < 95%.
export const MEDIDAS = [
  {
    chave: 'pressao',
    rotulo: 'Pressão',
    cor: 'var(--dado-pressao)',
    unidade: 'mmHg',
    valor: (p) => `${p.pressaoSistolica}/${p.pressaoDiastolica}`,
    fora: (p) => (p.pressaoSistolica >= 140 || p.pressaoDiastolica >= 90 ? 'acima' : null),
  },
  {
    chave: 'colesterol',
    rotulo: 'Colesterol',
    cor: 'var(--dado-colesterol)',
    unidade: 'mg/dL',
    valor: (p) => p.colesterolTotal,
    fora: (p) => (p.colesterolTotal >= 190 ? 'acima' : null),
  },
  {
    chave: 'fc',
    rotulo: 'FC repouso',
    cor: 'var(--dado-fc)',
    unidade: 'bpm',
    valor: (p) => p.fcRepouso,
    fora: (p) => (p.fcRepouso > 100 ? 'acima' : p.fcRepouso < 50 ? 'abaixo' : null),
  },
  {
    chave: 'spo2',
    rotulo: 'SpO₂',
    cor: 'var(--dado-spo2)',
    unidade: '%',
    valor: (p) => p.saturacaoO2,
    fora: (p) => (p.saturacaoO2 < 95 ? 'abaixo' : null),
  },
]
