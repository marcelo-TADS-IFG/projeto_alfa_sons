class ServicoDeAudio {
  static _audio = null;
  static _cacheOnomatopeias = {}; // cache de áudios pré-carregados

  static _normalizar(palavra) {
    return palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  static pronunciarPalavra(palavra) {
    const palavraNormalizada = ServicoDeAudio._normalizar(palavra);
    const caminho = (`../../audios/audioPalavras/palavrasN_${nivelAtual}/${palavraNormalizada}.mp3`);
    ServicoDeAudio._tocarAudio(caminho);
  }

  // 🔹 Pré-carregar os áudios de onomatopeias
  static async preloadOnomatopeias(listaOnomatopeias) {

    for (const token of listaOnomatopeias) {
      const caminho = `../../audios/onomatopeias/${token}.mp3`;

      if (!ServicoDeAudio._cacheOnomatopeias[token]) {
        const audio = new Audio(caminho);
        audio.preload = "auto";

        // força carregamento
        await new Promise(resolve => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => resolve(); // continua mesmo se falhar
        });

        ServicoDeAudio._cacheOnomatopeias[token] = audio;
      }
    }
  }

  static async pronunciarSilabasSincronizado(nomesDosArquivos, callbackPorSilaba, pausa = 200) {
    for (let i = 0; i < nomesDosArquivos.length; i++) {
      const nomeArquivo = nomesDosArquivos[i];
      const letraInicial = nomeArquivo.charAt(0).toLowerCase();
      const caminho = `../../audios/audioSilabas/${letraInicial}/${nomeArquivo}.mp3`;

      if (callbackPorSilaba) {
        callbackPorSilaba(i);
      }

      await ServicoDeAudio._tocarAudioAsync(caminho);

      if (pausa > 0) {
        await new Promise(resolve => setTimeout(resolve, pausa));
      }
    }
  }

  static async pronunciarLetras(onomatopeias, callbackPorLetra, pausa = 200) {
    for (let i = 0; i < onomatopeias.length; i++) {
      const token = onomatopeias[i];
      let audio = ServicoDeAudio._cacheOnomatopeias[token];

      // se não estiver no cache, cria na hora
      if (!audio) {
        const caminho = `../../audios/onomatopeias/${token}.mp3`;
        audio = new Audio(caminho);
        audio.preload = "auto";
        ServicoDeAudio._cacheOnomatopeias[token] = audio;
      }

      if (callbackPorLetra) {
        callbackPorLetra(i);
      }

      await ServicoDeAudio._tocarAudioExistenteAsync(audio);

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
        playAudio();
      } else {
        audio.oncanplaythrough = playAudio;
      }

      audio.onended = () => resolve();
      audio.onerror = () => resolve();
    });
  }

  // 🔹 Versão para tocar áudio já carregado do cache
  static _tocarAudioExistenteAsync(audio) {
    return new Promise(resolve => {
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.warn("Erro ao tocar áudio do cache:", err);
        resolve();
      });
      audio.onended = () => resolve();
    });
  }
}

export default ServicoDeAudio;