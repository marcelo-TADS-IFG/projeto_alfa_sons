class Palavra {
  constructor({ texto, nivel, dica, imagem, silabas, audio_silabas, onomatopeias}) {
    this.texto = texto;
    this.nivel = nivel;
    this.dica = dica;
    this.imagem = imagem;
    this.silabas = silabas;
    this.audio_silabas = audio_silabas; 
    this.onomatopeias = onomatopeias; // novo campo
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

  getOnomatopeias() {
    return this.onomatopeias;
  }
}

module.exports = Palavra;
