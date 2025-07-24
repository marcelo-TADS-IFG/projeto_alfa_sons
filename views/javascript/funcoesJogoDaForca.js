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

function pronunciarPalavra(texto) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    }
}

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
    palavra.split("").forEach((l, i) => {
        // Compara sem acento
        if (removerAcentos(l.toUpperCase()) === letra.toUpperCase()) {
            letrasDescobertas[i] = l; // Revela a letra original (com acento)
            acertou = true;
        }
    });
    if (!acertou) {
        tentativas++;
        letrasErradas.push(letra);
        atualizarForca();
    }
    atualizarTela();
    checarFimDeJogo();
}

function atualizarForca() {
    const img = document.getElementById('forca-img');
    if (tentativas === 0) img.src = '/imagemForca/forca.svg';
    else img.src = `/imagemForca/forca-${tentativas}.svg`;
}

function atualizarTela() {
    document.getElementById('wordDisplay').textContent = letrasDescobertas.join(" ");
    document.getElementById('hint').textContent = `Dica: ${dica}`;
    renderTeclado();
}

function checarFimDeJogo() {
    const mensagem = document.getElementById('mensagem');
    const rewardImg = document.getElementById('rewardImage');
    if (!letrasDescobertas.includes("_")) {
        mensagem.style.display = 'none';
        rewardImg.style.display = 'none';
        pronunciarPalavra(palavra);
        document.getElementById('popupImagem').src = imagem;
        document.getElementById('popupPalavra').textContent = palavra;
        document.getElementById('popupParabens').style.display = 'flex';
        fimDeJogo = true;
        acertosNoNivel++;
        
        // Adiciona pontos por acerto
        pontosAluno += 10;
        atualizarHeaderAluno();
        
        // Animação especial do dado quando acerta
        const dado = document.querySelector('.icon');
        if (dado) {
            dado.style.animation = 'dado-spin 1s ease-in-out';
            setTimeout(() => {
                dado.style.animation = 'dado-bounce 2s ease-in-out infinite';
            }, 1000);
        }
        setTimeout(() => {
            document.getElementById('popupParabens').style.display = 'none';
            destacarSilabas();
        }, 4000);
    } else if (tentativas >= tentativasMax) {
        // Esconde mensagens anteriores
        mensagem.style.display = 'none';
        rewardImg.style.display = 'none';
        
        // Mostra o modal de fim de jogo
        document.getElementById('palavraCorreta').textContent = palavra;
        document.getElementById('modalFimDeJogo').style.display = 'flex';
        fimDeJogo = true;
        
        setTimeout(() => {
            document.getElementById('modalFimDeJogo').style.display = 'none';
            escolherPalavra();
        }, 4000);
    }
}

function destacarSilabas() {
    if (!palavraAtual || !palavraAtual.silabas) {
        proximaPalavraOuNivel();
        return;
    }
    const wordDisplay = document.getElementById('wordDisplay');
    wordDisplay.innerHTML = palavraAtual.silabas.map(s => `<span style="color:#764ba2;font-weight:bold;font-size:1.3em;">${s}</span>`).join('<span style="color:#333;font-size:1.2em;">-</span>');
    setTimeout(() => {
        proximaPalavraOuNivel();
    }, 7000);
}

function mostrarPopupNivel(nivel) {
    document.getElementById('popupNivelNumero').textContent = `Nível ${nivel}!`;
    document.getElementById('popupNivel').style.display = 'flex';
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