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

  static async pronunciarSilabasSincronizado(nomesDosArquivos, callbackPorSilaba, pausa = 1000) {
    for (let i = 0; i < nomesDosArquivos.length; i++) {
      const nomeArquivo = nomesDosArquivos[i];
      const letraInicial = nomeArquivo.charAt(0).toLowerCase();
      const caminho = `../../audios/audioSilabas/${letraInicial}/${nomeArquivo}.mp3`;

      // ⏱️ Mostra a sílaba no momento certo
      if (callbackPorSilaba) {
        callbackPorSilaba(i);
      }

      await ServicoDeAudio._tocarAudioAsync(caminho);

      // Pequena pausa entre as sílabas
      await new Promise(resolve => setTimeout(resolve, pausa));
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
