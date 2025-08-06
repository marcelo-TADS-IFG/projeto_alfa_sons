class Palavra {
  constructor({ texto, nivel, dica, silabas, audio_silabas, imagem }) {
    this.texto = texto;
    this.nivel = nivel;
    this.dica = dica;
    this.silabas = silabas;
    this.audio_silabas = audio_silabas; // novo campo
    this.imagem = imagem;
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

  getAudioSilabas() {
    return this.audio_silabas;
  }
}

module.exports = Palavra;
