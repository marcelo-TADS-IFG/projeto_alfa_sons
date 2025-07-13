class Palavra {
  constructor({ texto, nivel, dica, imagem, silabas }) {
    this.texto = texto;
    this.nivel = nivel;
    this.dica = dica;
    this.imagem = imagem;
    this.silabas = silabas;
  }

  getTexto() {
    return this.texto;
  }

  getNivel() {
    return this.nivel;
  }

  getDica() {
    return this.dica;
  }

  getImagem() {
    return this.imagem;
  }

  getSilabas() {
    return this.silabas;
  }
}

module.exports = Palavra; 