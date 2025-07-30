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
            // Se já exibiu muitas palavras, limpa o array para permitir repetição
            if (tentativasSorteio > maxTentativas || palavrasExibidas.length > 20) {
                palavrasExibidas = [];
            }
        } while (palavrasExibidas.includes(sorteada.texto) && tentativasSorteio < maxTentativas);

        palavraAtual = sorteada;
        palavra = sorteada.texto.toUpperCase();
        dica = sorteada.dica;
        imagem = sorteada.imagem.startsWith('http') ? sorteada.imagem : `http://localhost:3000${sorteada.imagem}`;
        letrasDescobertas = palavra.split("").map(l => l === "-" ? "-" : "_"); // Traços já aparecem
        tentativas = 0; // Zera as tentativas do jogo
        letrasErradas = [];
        fimDeJogo = false;
        atualizarForca();
        atualizarTela();
        document.getElementById('mensagem').style.display = 'none';
        document.getElementById('rewardImage').style.display = 'none';
        document.getElementById('popupParabens').style.display = 'none';

        // Adiciona a palavra ao array de exibidas
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

    // Salva o estado antes de atualizar
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

    // Passa o estado anterior para comparar dentro de atualizarTela
    atualizarTela(letrasAntes);

    checarFimDeJogo();
}

function atualizarForca() {
    const img = document.getElementById('forca-img');
    if (tentativas === 0) img.src = '/imagemForca/forca.svg';
    else img.src = `/imagemForca/forca-${tentativas}.svg`;
}

function atualizarTela(letrasAntes = []) {
    const container = document.getElementById('wordDisplay');
    container.innerHTML = '';
    palavra.split("").forEach((letra, index) => {
        const span = document.createElement('span');
        span.id = `letra-${index}`;
        span.className = 'letra-jogo';
        span.textContent = letrasDescobertas[index];

        // Aplica zoom se essa letra foi revelada nesta rodada
        if (letrasDescobertas[index] !== "_" && letrasAntes[index] === "_") {
            span.classList.add('zoom');
            setTimeout(() => {
                span.classList.remove('zoom');
            }, 1300); // 0.3s de entrada + 2s de pausa
        }

        container.appendChild(span);
        container.append(' ');
    });

    document.getElementById('hint').textContent = `Dica: ${dica}`;
    renderTeclado();
}

function adicionarLetra(container, letra, index) {
    const span = document.createElement('span');
    span.id = `letra-${index}`;
    span.className = 'letra-jogo';
    span.textContent = letra;
    container.appendChild(span);
    container.append(' ');

    // Aplica o efeito de zoom
    span.classList.add('zoom');
    setTimeout(() => span.classList.remove('zoom'), 300); // ou ajuste para 1300 se quiser acompanhar o CSS
}

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
        }, 2000); // espera 1 segundo antes de mostrar o popup

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

function destacarSilabas() {
    if (!palavraAtual || !palavraAtual.silabas) {
        proximaPalavraOuNivel();
        return;
    }

    const wordDisplay = document.getElementById('wordDisplay');
    wordDisplay.innerHTML = ''; // Limpa o conteúdo anterior

    const silabas = palavraAtual.silabas;
    const tempoEntre = 1000; // tempo entre cada sílaba em ms

    silabas.forEach((s, index) => {
        setTimeout(() => {
            const span = document.createElement('span');
            span.textContent = s;
            span.style.color = '#764ba2';
            span.style.fontWeight = 'bold';
            span.style.fontSize = '1.3em';
            span.classList.add('zoom');

            wordDisplay.appendChild(span);

            // Adiciona separador "-" (exceto na última sílaba)
            if (index < silabas.length - 1) {
                const separador = document.createElement('span');
                separador.textContent = '-';
                separador.style.color = '#333';
                separador.style.fontSize = '1.2em';
                wordDisplay.appendChild(separador);
            }

            // Remove a classe de zoom após 0.6s (ou conforme sua transição)
            setTimeout(() => {
                span.classList.remove('zoom');
            }, 600);
        }, index * tempoEntre);
    });

    // Aguarda tempo total + 4s antes de avançar
    const tempoFinal = silabas.length * tempoEntre + 4000;
    setTimeout(() => {
        proximaPalavraOuNivel();
    }, tempoFinal);
}

function mostrarPopupNivel(nivel) {
    document.getElementById('popupNivelNumero').textContent = `Nível ${nivel}!`;
    document.getElementById('popupNivel').style.display = 'flex';

    // Tocar áudio de avanço de nível
    const audio = document.getElementById('audioAvancoNivel');
    if (audio) {
        audio.currentTime = 0; // Reinicia o áudio caso já tenha sido tocado antes
        audio.play();
    }

    setTimeout(() => {
        document.getElementById('popupNivel').style.display = 'none';
        escolherPalavra();
    }, 5000);
}

function atualizarHeaderAluno() {
    const headerNivel = document.getElementById('alunoNivel');
    const headerPontos = document.getElementById('alunoPontos');

    if (headerNivel) headerNivel.textContent = nivelAtual;
    if (headerPontos) headerPontos.textContent = pontosAluno;
}

function proximaPalavraOuNivel() {
    if (acertosNoNivel >= 3 && nivelAtual < NIVEL_MAXIMO) {
        nivelAtual++;
        acertosNoNivel = 0;
        atualizarHeaderAluno();
        mostrarPopupNivel(nivelAtual);
    } else {
        escolherPalavra();
    }
} 
