// Variáveis auxiliares
let selectedAlunoData = null;
let searchTimeout = null;
const API_BASE_URL = "https://edu-forca.onrender.com";

// Cadastro de alunos
document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const turma = document.getElementById('turma').value;

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
    document.getElementById('letsPlayEffect').style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/alunos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, sobrenome, turma })
        });

        if (response.ok) {
            const alunoCriado = await response.json();
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('cadastroForm').reset();

            // Efeito "Let's Play"
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
                document.getElementById('letsPlayEffect').style.display = 'flex';
                setTimeout(() => {
                    document.getElementById('letsPlayEffect').style.display = 'none';
                    const alunoParam = encodeURIComponent(JSON.stringify(alunoCriado));
                    window.location.href = 'jogoForca.html?aluno=' + alunoParam;
                }, 2000);
            }, 1200);
        } else {
            document.getElementById('errorMessage').style.display = 'block';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('errorMessage').style.display = 'block';
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
});

// Botão para abrir a tela de seleção de aluno
document.getElementById('btnAbrirSelecaoAluno').addEventListener('click', function () {
    const width = 900;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
        'selecaoAluno.html',
        '_blank',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
});

// Botão visitante
document.getElementById('btnVisitante').addEventListener('click', function () {
    window.location.href = '/html/jogoForca.html?visitante=1';
});
