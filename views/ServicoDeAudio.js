class ServicoDeAudio {
  static _voices = [];
  static _ready = false;
  static _init() {
    if (ServicoDeAudio._ready) return;
    // Carrega as vozes e define a flag de pronto
    window.speechSynthesis.onvoiceschanged = () => {
      ServicoDeAudio._voices = window.speechSynthesis.getVoices();
      ServicoDeAudio._ready = true;
    };
    // Força o carregamento das vozes
    ServicoDeAudio._voices = window.speechSynthesis.getVoices();
    if (ServicoDeAudio._voices.length > 0) ServicoDeAudio._ready = true;
  }

  static _getVozPortugues() {
    let voz = ServicoDeAudio._voices.find(v => v.lang === 'pt-BR');
    if (!voz) voz = ServicoDeAudio._voices.find(v => v.lang === 'pt-PT');
    if (!voz) voz = ServicoDeAudio._voices.find(v => v.lang && v.lang.startsWith('pt'));
    if (!voz) voz = ServicoDeAudio._voices[0];
    return voz;
  }

  static pronunciarLetra(letra) {
    ServicoDeAudio._falar(letra);
  }

  static pronunciarPalavra(palavra) {
    ServicoDeAudio._falar(palavra);
  }



  static pronunciarSilabas(silabas) {
    if (Array.isArray(silabas)) {
      ServicoDeAudio._falar(silabas.join(' '));
    }
  }

  static _falar(texto) {
    ServicoDeAudio._init();
    if ('speechSynthesis' in window) {
      if (!ServicoDeAudio._ready) {
        setTimeout(() => ServicoDeAudio._falar(texto), 200);
        return;
      }
      window.speechSynthesis.cancel(); // Cancela qualquer fala anterior
      const utterance = new SpeechSynthesisUtterance(texto);
      const voz = ServicoDeAudio._getVozPortugues();
      if (voz) {
        utterance.voice = voz;
        utterance.lang = voz.lang;
      } else {
        utterance.lang = 'pt-BR';
      }
      utterance.rate = 0.9; // Mais devagar
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Seu navegador não suporta síntese de voz.');
    }
  }
}

export default ServicoDeAudio;