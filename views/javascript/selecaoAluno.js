let selectedAlunoData = null;
let searchTimeout = null;

// Busca de alunos (com debounce)
document.getElementById('searchAluno').addEventListener('input', function (e) {
    const searchTerm = e.target.value.trim();

    // Limpar timeout anterior
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Esconder sugestões se o campo estiver vazio
    if (searchTerm.length === 0) {
        document.getElementById('searchSuggestions').style.display = 'none';
        return;
    }

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';

    // Debounce (300ms)
    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`http://localhost:3000/alunos/buscar/${encodeURIComponent(searchTerm)}`);
            const alunos = await response.json();

            const suggestionsDiv = document.getElementById('searchSuggestions');
            suggestionsDiv.innerHTML = '';

            if (alunos.length > 0) {
                alunos.forEach(aluno => {
                    const item = document.createElement('div');
                    item.className = 'suggestion-item';
                    item.textContent = `${aluno.nome} ${aluno.sobrenome} - Turma: ${aluno.turma}`;
                    item.onclick = () => selectAluno(aluno);
                    suggestionsDiv.appendChild(item);
                });
                suggestionsDiv.style.display = 'block';
            } else {
                suggestionsDiv.innerHTML = '<div class="no-results">Nenhum aluno encontrado</div>';
                suggestionsDiv.style.display = 'block';
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            document.getElementById('searchSuggestions').innerHTML = '<div class="no-results">Erro ao buscar alunos</div>';
            document.getElementById('searchSuggestions').style.display = 'block';
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }, 300);
});

// Selecionar aluno
function selectAluno(aluno) {
    selectedAlunoData = aluno;
    document.getElementById('searchAluno').value = `${aluno.nome} ${aluno.sobrenome}`;
    document.getElementById('searchSuggestions').style.display = 'none';

    // Mostrar seção do aluno selecionado
    document.getElementById('alunoInfo').textContent = `${aluno.nome} ${aluno.sobrenome} - Turma: ${aluno.turma}`;
    document.getElementById('selectedAlunoSection').style.display = 'block';
    document.getElementById('btnExcluirAluno').disabled = false;
}

// Botão iniciar jogo
document.getElementById('btnIniciarJogo').addEventListener('click', function () {
    if (selectedAlunoData) {
        const alunoParam = encodeURIComponent(JSON.stringify(selectedAlunoData));
        window.location.href = 'jogoForca.html?aluno=' + alunoParam;
    }
});

// Botão voltar
document.getElementById('btnVoltar').addEventListener('click', function () {
    window.close(); // Fecha a aba atual
});

// Botão excluir aluno
document.getElementById('btnExcluirAluno').addEventListener('click', function () {
    if (selectedAlunoData) {
        document.getElementById('modalMessage').textContent =
            `Tem certeza que deseja excluir o aluno: ${selectedAlunoData.nome} ${selectedAlunoData.sobrenome}?`;
        document.getElementById('modalConfirm').style.display = 'flex';
    }
});

// Modal: cancelar
document.getElementById('btnConfirmNo').addEventListener('click', function () {
    document.getElementById('modalConfirm').style.display = 'none';
});

// Modal: confirmar exclusão
document.getElementById('btnConfirmYes').addEventListener('click', async function () {
    if (selectedAlunoData) {
        try {
            const response = await fetch(`http://localhost:3000/alunos/${selectedAlunoData._id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                // Feedback visual
                document.getElementById('feedbackExclusao').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('feedbackExclusao').style.display = 'none';
                }, 1800);
                selectedAlunoData = null;
                document.getElementById('selectedAlunoSection').style.display = 'none';
                document.getElementById('searchAluno').value = '';
            } else {
                alert('Erro ao excluir aluno.');
            }
        } catch (error) {
            alert('Erro ao excluir aluno.');
        } finally {
            document.getElementById('modalConfirm').style.display = 'none';
        }
    }
});

// Esconder sugestões quando clicar fora
document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container')) {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
});

// Foco no campo de busca ao carregar a página
window.addEventListener('load', function () {
    document.getElementById('searchAluno').focus();
    document.getElementById('btnExcluirAluno').disabled = true;
});
