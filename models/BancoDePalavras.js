const Palavra = require('./Palavra');

class BancoDePalavras {
  constructor() {
    this.palavras = [];
  }

  async carregarPalavrasDoMongo(palavraDAO) {
    this.palavras = await palavraDAO.buscarTodas();
  }

  getPalavrasPorNivel(nivel) {
    return this.palavras.filter(p => p.nivel === nivel);
  }

  getPalavraAleatoria(nivel) {
    const palavrasNivel = this.getPalavrasPorNivel(nivel);
    if (palavrasNivel.length === 0) return null;
    const idx = Math.floor(Math.random() * palavrasNivel.length);
    return palavrasNivel[idx];
  }
}

module.exports = BancoDePalavras; 