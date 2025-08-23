// Funções do Jogo da Forca extraídas de exemplo-jogo-forca-api.html

let palavras = [];
let tentativasMax = 6;
let palavra = "";
let dica = "";
let imagem = "";
let letrasDescobertas = [];
let tentativas = 0;
let letrasErradas = [];
let fimDeJogo = false;
let palavraAtual = null; // Guarda o objeto completo da palavra sorteada
let nivelAtual = 1;
let acertosNoNivel = 0;
const NIVEL_MAXIMO = 5;
let palavrasExibidas = []; // Armazena palavras já exibidas no nível atual
let pontosAluno = 0; // Pontos do aluno
let estadoAnterior = [];
let jogoFinalizado = false; // controla quando o aluno chegou no nível máximo
const TEMPO_REVELACAO = 2500; // Tempo de espera entre cada revelação de letra (em ms)

ServicoDeAudio.pronunciarPalavra(palavra); 

async function fetchPalavras() {
    try {
        const response = await fetch('http://localhost:3000/palavras');
        const data = await response.json();
        palavras = data.map(palavra => ({
            ...palavra,
            imagem: palavra.imagem.startsWith('http') ? palavra.imagem : `http://localhost:3000${palavra.imagem}`
        }));
        escolherPalavra();
    } catch (error) {
        alert('Erro ao buscar palavras da API');
    }
}

async function buscarPalavraAleatoriaDoNivel() {
    try {
        let tentativasSorteio = 0;
        let sorteada;
        const maxTentativas = 15; // Evita loop infinito

        do {
            const response = await fetch(`http://localhost:3000/palavras/aleatoria/${nivelAtual}`);
            if (!response.ok) throw new Error('Nenhuma palavra encontrada para este nível');
            sorteada = await response.json();
            tentativasSorteio++;
            if (tentativasSorteio > maxTentativas || palavrasExibidas.length > 20) {
                palavrasExibidas = [];
            }
        } while (palavrasExibidas.includes(sorteada.texto) && tentativasSorteio < maxTentativas);

        palavraAtual = sorteada;
        palavra = sorteada.texto.toUpperCase();
        dica = sorteada.dica;
        imagem = sorteada.imagem.startsWith('http') ? sorteada.imagem : `http://localhost:3000${sorteada.imagem}`;
        letrasDescobertas = palavra.split("").map(l => l === "-" ? "-" : "_");
        tentativas = 0;
        letrasErradas = [];
        fimDeJogo = false;
        atualizarForca();
        atualizarTela();
        document.getElementById('mensagem').style.display = 'none';
        document.getElementById('rewardImage').style.display = 'none';
        document.getElementById('popupParabens').style.display = 'none';

        palavrasExibidas.push(sorteada.texto);

    } catch (error) {
        alert('Erro ao buscar palavra do nível ' + nivelAtual + ': ' + error.message);
    }
}

function escolherPalavra() {
    buscarPalavraAleatoriaDoNivel();
}

function renderTeclado() {
    const teclado = document.getElementById('teclado');
    teclado.innerHTML = "";
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.textContent = letra;
        btn.disabled = fimDeJogo || letrasDescobertas.includes(letra) || letrasErradas.includes(letra);
        btn.onclick = () => tentarLetra(letra);
        teclado.appendChild(btn);
    });
}

function removerAcentos(letra) {
    return letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function tentarLetra(letra) {
    if (fimDeJogo) return;
    let acertou = false;

    const letrasAntes = [...letrasDescobertas];

    palavra.split("").forEach((l, i) => {
        if (removerAcentos(l.toUpperCase()) === letra.toUpperCase()) {
            letrasDescobertas[i] = l;
            acertou = true;
        }
    });

    if (!acertou) {
        tentativas++;
        letrasErradas.push(letra);
        atualizarForca();
    }

    atualizarTela(letrasAntes);
    checarFimDeJogo();
}

function atualizarForca() {
    const img = document.getElementById('forca-img');
    if (tentativas === 0) img.src = '/imagemForca/forca.svg';
    else img.src = `/imagemForca/forca-${tentativas}.svg`;
}

async function atualizarTela(letrasAntes = []) {
    const container = document.getElementById('wordDisplay');
    container.innerHTML = '';

    // Sempre renderiza o teclado
    renderTeclado();

    // Renderiza a palavra com "_" ou letras já conhecidas
    palavra.split("").forEach((_, index) => {
        const span = document.createElement('span');
        span.id = `letra-${index}`;
        span.className = 'letra-jogo';
        span.textContent = letrasAntes[index] !== "_" ? letrasDescobertas[index] : "_";
        container.appendChild(span);
        container.append(' ');
    });

    // Descobre quais letras foram reveladas nessa jogada
    const novasLetras = palavra
        .split("")
        .map((letra, index) => ({ letra, index }))
        .filter(({ index }) => letrasDescobertas[index] !== "_" && letrasAntes[index] === "_");

    if (novasLetras.length > 0) {
        travarTeclado();

        for (let i = 0; i < novasLetras.length; i++) {
            const { letra, index } = novasLetras[i];
            const span = document.getElementById(`letra-${index}`);

            // Revela a letra na tela
            span.textContent = letrasDescobertas[index];
            span.classList.add('zoom');

            // 🎵 toca a onomatopeia específica dessa posição
            if (palavraAtual.onomatopeias && palavraAtual.onomatopeias[index]) {
                const onomatopeia = palavraAtual.onomatopeias[index];
                const caminho = `../../audios/onomatopeias/${onomatopeia}.mp3`;
                await ServicoDeAudio._tocarAudioAsync(caminho);
            }

            // Mantém efeito antes de ir para próxima
            await new Promise(resolve => setTimeout(resolve, TEMPO_REVELACAO));
            span.classList.remove('zoom');
        }

        liberarTeclado();
    }

    document.getElementById('hint').textContent = `Dica: ${dica}`;
}

/*
async function atualizarTela(letrasAntes = []) {
    const container = document.getElementById('wordDisplay');
    container.innerHTML = '';

    // Sempre renderiza o teclado
    renderTeclado();

    // Renderiza a palavra com "_" ou letras já conhecidas
    palavra.split("").forEach((_, index) => {
        const span = document.createElement('span');
        span.id = `letra-${index}`;
        span.className = 'letra-jogo';
        span.textContent = letrasAntes[index] !== "_" ? letrasDescobertas[index] : "_";
        container.appendChild(span);
        container.append(' ');
    });

    // Descobre quais letras foram reveladas nessa jogada
    const novasLetras = palavra
        .split("")
        .map((letra, index) => ({ letra, index }))
        .filter(({ index }) => letrasDescobertas[index] !== "_" && letrasAntes[index] === "_");

    if (novasLetras.length > 0) {
        travarTeclado();

        // Vamos chamar pronunciarLetras e usar o callback para aplicar os efeitos visuais
        await ServicoDeAudio.pronunciarLetras(
            novasLetras.map(n => n.letra).join(""), // passa apenas as letras novas
            (i) => {
                const { index } = novasLetras[i];
                const span = document.getElementById(`letra-${index}`);
                if (span) {
                    span.textContent = letrasDescobertas[index];
                    span.classList.add('zoom');

                    // Remove o efeito depois do tempo de revelação
                    setTimeout(() => {
                        span.classList.remove('zoom');
                    }, TEMPO_REVELACAO);
                }
            },
            TEMPO_REVELACAO // pausa entre cada letra
        );

        liberarTeclado();
    }

    document.getElementById('hint').textContent = `Dica: ${dica}`;
}*/

// Bloqueia o teclado sem mudar a cor
function travarTeclado() {
    const teclado = document.getElementById('teclado');
    if (teclado) teclado.classList.add('teclado-bloqueado');
}

// Libera o teclado
function liberarTeclado() {
    const teclado = document.getElementById('teclado');
    if (teclado) teclado.classList.remove('teclado-bloqueado');
}

//apos cada tentativa, checa se o jogo terminou
function checarFimDeJogo() {
    const mensagem = document.getElementById('mensagem');
    const rewardImg = document.getElementById('rewardImage');

    if (!letrasDescobertas.includes("_")) {
        mensagem.style.display = 'none';
        rewardImg.style.display = 'none';


        // Espera 1 segundo antes de mostrar o popup
        setTimeout(() => {
            ServicoDeAudio.pronunciarPalavra(palavra); // fala imediatamente

            document.getElementById('popupImagem').src = imagem;
            document.getElementById('popupPalavra').textContent = palavra;
            document.getElementById('popupParabens').style.display = 'flex';

            // Animação especial do dado
            const dado = document.querySelector('.icon');
            if (dado) {
                dado.style.animation = 'dado-spin 1s ease-in-out';
                setTimeout(() => {
                    dado.style.animation = 'dado-bounce 2s ease-in-out infinite';
                }, 1000);
            }

            // Esconde o popup após 5s
            setTimeout(() => {
                document.getElementById('popupParabens').style.display = 'none';
                destacarSilabas();
            }, 5000);
        }, 5000); // espera 5 segundo antes de mostrar o popup

        fimDeJogo = true;
        acertosNoNivel++;
        pontosAluno += 10;
        atualizarHeaderAluno();
    } else if (tentativas >= tentativasMax) {
        mensagem.style.display = 'none';
        rewardImg.style.display = 'none';
    
        document.getElementById('palavraCorreta').textContent = palavra;
        document.getElementById('modalFimDeJogo').style.display = 'flex';
        fimDeJogo = true;
    
        // 🎵 Toca o som de fim de jogo
        const audioFim = document.getElementById('audioFimDeJogo');
        if (audioFim) {
            audioFim.currentTime = 0;
            audioFim.play().catch(err => console.warn("Erro ao tocar áudio de fim de jogo:", err));
        }
    
        setTimeout(() => {
            document.getElementById('modalFimDeJogo').style.display = 'none';
            escolherPalavra();
        }, 5000);
    }
    
}

async function destacarSilabas() {
    if (!palavraAtual || !palavraAtual.silabas || !palavraAtual.audio_silabas) {
        if (!jogoFinalizado) proximaPalavraOuNivel();
        return;
    }

    const wordDisplay = document.getElementById('wordDisplay');
    wordDisplay.innerHTML = '';

    const silabas = palavraAtual.silabas;

    const mostrarSilaba = (i) => {
        const s = silabas[i];
        const span = document.createElement('span');
        span.textContent = s;
        span.style.color = '#764ba2';
        span.style.fontWeight = 'bold';
        span.style.fontSize = '1.3em';
        span.classList.add('zoom');
        wordDisplay.appendChild(span);

        if (i < silabas.length - 1) {
            const separador = document.createElement('span');
            separador.textContent = '-';
            separador.style.color = '#333';
            separador.style.fontSize = '1.2em';
            wordDisplay.appendChild(separador);
        }

        setTimeout(() => {
            span.classList.remove('zoom');
        }, 600);
    };

    await ServicoDeAudio.pronunciarSilabasSincronizado(palavraAtual.audio_silabas, mostrarSilaba, 500);

    setTimeout(() => {
        if (!jogoFinalizado) proximaPalavraOuNivel();
    }, 3000);
}

function mostrarPopupNivel(nivel) {
    document.getElementById('popupNivelNumero').textContent = `Nível ${nivel}!`;
    document.getElementById('popupNivel').style.display = 'flex';

    const audio = document.getElementById('audioAvancoNivel');
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }

    setTimeout(() => {
        document.getElementById('popupNivel').style.display = 'none';
        if (!jogoFinalizado) escolherPalavra();
    }, 5000);
}

function atualizarHeaderAluno() {
    const headerNivel = document.getElementById('alunoNivel');
    const headerPontos = document.getElementById('alunoPontos');

    if (headerNivel) headerNivel.textContent = nivelAtual;
    if (headerPontos) headerPontos.textContent = pontosAluno;
}

function mostrarPopupFinal() {
    jogoFinalizado = true;
    const popup = document.getElementById('popupFinal');
    popup.style.display = 'flex';

    const audio = document.getElementById('audioFinal'); 
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}

function reiniciarJogo() {
    document.getElementById('popupFinal').style.display = 'none';
    nivelAtual = 1;
    acertosNoNivel = 0;
    pontosAluno = 0;
    jogoFinalizado = false;
    atualizarHeaderAluno();
    escolherPalavra();
}

function sairJogo() {
    document.getElementById('popupSair').style.display = 'flex';
}

function confirmarSair() {
    window.location.href = 'cadastroAlunos.html';
}

function proximaPalavraOuNivel() {
    if (acertosNoNivel >= 16 && nivelAtual < NIVEL_MAXIMO) {
        nivelAtual++;
        acertosNoNivel = 0;
        atualizarHeaderAluno();
        mostrarPopupNivel(nivelAtual);
    } else if (acertosNoNivel >= 3 && nivelAtual === NIVEL_MAXIMO) {
        mostrarPopupFinal();
    } else {
        if (!jogoFinalizado) escolherPalavra();
    }
}
