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

  static async pronunciarSilabasSincronizado(nomesDosArquivos, callbackPorSilaba, pausa = 200) {
    for (let i = 0; i < nomesDosArquivos.length; i++) {
      const nomeArquivo = nomesDosArquivos[i];
      const letraInicial = nomeArquivo.charAt(0).toLowerCase();
      const caminho = `../../audios/audioSilabas/${letraInicial}/${nomeArquivo}.mp3`;

      // Mostra a sílaba no display
      if (callbackPorSilaba) {
        callbackPorSilaba(i);
      }

      // Aguarda o áudio terminar
      await ServicoDeAudio._tocarAudioAsync(caminho);

      // Pausa mínima antes da próxima sílaba
      if (pausa > 0) {
        await new Promise(resolve => setTimeout(resolve, pausa));
      }
    }
  }

  static async pronunciarLetras(onomatopeias, callbackPorLetra, pausa = 200) {
  for (let i = 0; i < onomatopeias.length; i++) {
    const token = onomatopeias[i];
    const caminho = `../../audios/onomatopeias/${token}.mp3`;

    // Callback para destacar a letra atual na tela
    if (callbackPorLetra) {
      callbackPorLetra(i);
    }

    // Aguarda o áudio da letra/token terminar
    await ServicoDeAudio._tocarAudioAsync(caminho);

    // Pequena pausa entre os sons (opcional)
    if (pausa > 0) {
      await new Promise(resolve => setTimeout(resolve, pausa));
    }
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
      const audio = new Audio(caminho);
      audio.preload = "auto";

      const playAudio = () => {
        audio.play().catch(err => {
          console.warn("Erro ao iniciar reprodução:", err);
          resolve();
        });
      };

      if (audio.readyState >= 4) {
        // já carregado
        playAudio();
      } else {
        audio.oncanplaythrough = playAudio;
      }

      audio.onended = () => resolve();
      audio.onerror = () => {
        console.warn("Erro ao tocar áudio:", caminho);
        resolve(); // continua mesmo com erro
      };
    });
  }

}

export default ServicoDeAudio;