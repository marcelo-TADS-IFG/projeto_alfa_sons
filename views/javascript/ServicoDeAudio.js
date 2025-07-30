class ServicoDeAudio {
  static _audio = null;

  static pronunciarPalavra(palavra) {
    const caminho = (`../../audios/audioPalavras/palavrasN_${nivelAtual}/${palavra}.mp3`);
    ServicoDeAudio._tocarAudio(caminho);
  }

  static _tocarAudio(caminho) {
    if (ServicoDeAudio._audio) {
      ServicoDeAudio._audio.pause();
      ServicoDeAudio._audio.currentTime = 0;
    }
    ServicoDeAudio._audio = new Audio(caminho);
    ServicoDeAudio._audio.play().catch(err => {
      console.warn("Erro ao tocar áudio:", err);
    });
  }
}

export default ServicoDeAudio;
