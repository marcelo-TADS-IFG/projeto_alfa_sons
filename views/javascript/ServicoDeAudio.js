class ServicoDeAudio {
  static _audio = null;

  static _normalizar(palavra) {
    return palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  static pronunciarPalavra(palavra) {
    const palavraNormalizada = ServicoDeAudio._normalizar(palavra);
    const caminho = (`../../audios/audioPalavras/palavrasN_${nivelAtual}/${palavraNormalizada}.mp3`);
    ServicoDeAudio._tocarAudio(caminho);
  }

  static pronunciarSilabas(silabas) {
    const silabasNormalizadas = silabas.map(s => ServicoDeAudio._normalizar(s));
    ServicoDeAudio._tocarSilabasEmSequencia(silabasNormalizadas);
  }

  static async _tocarSilabasEmSequencia(silabas) {
    for (const silaba of silabas) {
      const inicial = silaba[0].toLowerCase();
      const caminho = `../../audios/silabas/${inicial}/${silaba}.mp3`;

      await ServicoDeAudio._tocarAudioAsync(caminho);
    }
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

  static _tocarAudioAsync(caminho) {
    return new Promise((resolve) => {
      if (ServicoDeAudio._audio) {
        ServicoDeAudio._audio.pause();
        ServicoDeAudio._audio.currentTime = 0;
      }

      const audio = new Audio(caminho);
      ServicoDeAudio._audio = audio;

      audio.onended = () => resolve();
      audio.onerror = () => {
        console.warn("Erro ao tocar áudio:", caminho);
        resolve(); // Continua mesmo com erro
      };

      audio.play().catch(err => {
        console.warn("Erro ao iniciar reprodução:", err);
        resolve();
      });
    });
  }
}

export default ServicoDeAudio;
