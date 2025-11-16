// -------------------- Importação do Serviço de Áudio --------------------
import ServicoDeAudio from '../../javascript/ServicoDeAudio.js';
window.ServicoDeAudio = ServicoDeAudio; // Disponibiliza globalmente

// -------------------- Variáveis globais controladas --------------------
window.nivelAtual = 1;
window.acertosNoNivel = 0;
window.pontosAluno = window.pontosAluno ?? 0; // Se vier do backend, mantém; se não, inicia com 0
window.palavra = window.palavra ?? "";        // Palavra atual do jogo

// -------------------- Função utilitária para remover acentos --------------------
function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// -------------------- Recupera aluno da query string --------------------
function getAlunoFromQuery() {
    const params = new URLSearchParams(window.location.search);

    if (!params.has('aluno')) return null;

    try {
        return JSON.parse(decodeURIComponent(params.get('aluno')));
    } catch (e) {
        console.warn('Erro ao decodificar aluno:', e);
        return null;
    }
}

// -------------------- Exibe informações do aluno --------------------
function atualizarHeaderDoAluno(aluno) {
    const header = document.getElementById('headerAluno');
    if (!aluno || !header) return;

    header.style.display = 'block';
    document.getElementById('alunoNome').textContent = `${aluno.nome} ${aluno.sobrenome}`;
    document.getElementById('alunoTurma').textContent = aluno.turma;
    document.getElementById('alunoNivel').textContent = window.nivelAtual;
    document.getElementById('alunoPontos').textContent = window.pontosAluno;
}

// -------------------- Modal Sair --------------------
function configurarModalSair() {
    const btnSair = document.getElementById('btnSair');
    const modalSair = document.getElementById('modalSair');
    const btnConfirmarSair = document.getElementById('btnConfirmarSair');
    const btnCancelarSair = document.getElementById('btnCancelarSair');
    const modalSairPontos = document.getElementById('modalSairPontos');
    const modalSairNivel = document.getElementById('modalSairNivel');

    if (!btnSair || !modalSair) return;

    // Abrir o modal
    btnSair.onclick = () => {
        modalSairPontos.textContent = pontosAluno;  // ✔ valores reais
        modalSairNivel.textContent = nivelAtual;    // ✔ valores reais
        modalSair.style.display = 'flex';
    };

    // Fechar sem sair
    if (btnCancelarSair) {
        btnCancelarSair.onclick = () => modalSair.style.display = 'none';
    }

    // Confirmar saída
    if (btnConfirmarSair) {
        btnConfirmarSair.onclick = () => {
            window.location.href = '/html/cadastroAlunos.html';
        };
    }
}

// -------------------- Processamento de clique no teclado --------------------
function processarCliqueTeclado(botao) {
    if (typeof verificarLetra !== 'function') {
        console.error("Função verificarLetra() não encontrada!");
        return;
    }

    const letra = removerAcentos(botao.textContent.toUpperCase());
    const palavraNormalizada = removerAcentos(window.palavra.toUpperCase());

    // Feedback visual
    if (palavraNormalizada.includes(letra)) {
        botao.classList.add('correct');
    } else {
        botao.classList.add('wrong');
    }

    verificarLetra(letra);
    botao.disabled = true;
}

// -------------------- Ativa teclado virtual --------------------
function configurarTeclado() {
    const botoes = document.querySelectorAll('.teclado button');
    if (!botoes.length) return;

    botoes.forEach(botao => {
        botao.addEventListener('click', () => processarCliqueTeclado(botao));

        // Touchscreen
        botao.addEventListener('touchstart', () => botao.classList.add('touch-active'));
        botao.addEventListener('touchend', () => {
            setTimeout(() => botao.classList.remove('touch-active'), 150);
        });
    });
}

// -------------------- Inicialização do Jogo --------------------
window.onload = () => {
    // Verifica se função escolherPalavra existe
    if (typeof escolherPalavra !== 'function') {
        console.error("Função escolherPalavra() não encontrada!");
    } else {
        escolherPalavra();
    }

    // Carrega e exibe dados do aluno
    const aluno = getAlunoFromQuery();
    atualizarHeaderDoAluno(aluno);

    // Inicializar UI
    configurarModalSair();
    configurarTeclado();
};
