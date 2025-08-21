// -------------------- Importação do Serviço de Áudio --------------------
import ServicoDeAudio from '../../javascript/ServicoDeAudio.js';
window.ServicoDeAudio = ServicoDeAudio; // Disponibiliza globalmente

// -------------------- Variáveis globais do jogo --------------------
window.nivelAtual = 1;
window.acertosNoNivel = 0;
window.pontosAluno = window.pontosAluno ?? 0;

const botoes = document.querySelectorAll('.teclado button');

// -------------------- Função utilitária para remover acentos --------------------
function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// -------------------- Inicialização do jogo --------------------
window.onload = () => {
    if (typeof escolherPalavra === 'function') {
        escolherPalavra(); // Função do funcoesJogoDaForca.js
    } else {
        console.error('Função escolherPalavra() não encontrada!');
    }
};

// -------------------- Recupera aluno da query string --------------------
function getAlunoFromQuery() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('aluno')) {
        try {
            return JSON.parse(decodeURIComponent(params.get('aluno')));
        } catch (e) {
            console.warn('Erro ao decodificar aluno:', e);
            return null;
        }
    }
    return null;
}

const aluno = getAlunoFromQuery();
if (aluno) {
    document.getElementById('headerAluno').style.display = 'block';
    document.getElementById('alunoNome').textContent = `${aluno.nome} ${aluno.sobrenome}`;
    document.getElementById('alunoTurma').textContent = aluno.turma;
    document.getElementById('alunoNivel').textContent = window.nivelAtual;
    document.getElementById('alunoPontos').textContent = window.pontosAluno;
}

// -------------------- Botão Sair --------------------
const btnSair = document.getElementById('btnSair');
const modalSair = document.getElementById('modalSair');
const btnConfirmarSair = document.getElementById('btnConfirmarSair');
const btnCancelarSair = document.getElementById('btnCancelarSair');
const modalSairPontos = document.getElementById('modalSairPontos');
const modalSairNivel = document.getElementById('modalSairNivel');

if (btnSair) {
    btnSair.addEventListener('click', () => {
        modalSairPontos.textContent = window.pontosAluno;
        modalSairNivel.textContent = window.nivelAtual;
        modalSair.style.display = 'flex';
    });
}

if (btnCancelarSair) {
    btnCancelarSair.addEventListener('click', () => modalSair.style.display = 'none');
}

if (btnConfirmarSair) {
    btnConfirmarSair.addEventListener('click', () => {
        window.location.href = '/html/cadastroAlunos.html';
    });
}

// -------------------- Teclado interativo (desktop + touchscreen) --------------------
botoes.forEach(botao => {
    // Evento click (desktop)
    botao.addEventListener('click', () => {
        if (typeof verificarLetra === 'function') {
            const letraEscolhida = removerAcentos(botao.textContent.toUpperCase());
            const palavraNormalizada = removerAcentos(palavra.toUpperCase()); // variável 'palavra' vem do jogo

            if (palavraNormalizada.includes(letraEscolhida)) {
                botao.classList.add('correct'); // feedback visual
            } else {
                botao.classList.add('wrong'); // feedback visual
            }

            verificarLetra(letraEscolhida); 
        }

        botao.disabled = true; // desabilita após o uso
    });

    // Eventos touch (tablet/smartphone)
    botao.addEventListener('touchstart', () => botao.classList.add('touch-active'));
    botao.addEventListener('touchend', () => {
        setTimeout(() => botao.classList.remove('touch-active'), 150);
    });
});
