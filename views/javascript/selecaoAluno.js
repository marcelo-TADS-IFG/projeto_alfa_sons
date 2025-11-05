let selectedAlunoData = null;
let searchTimeout = null;
const API_BASE_URL = "https://edu-forca.onrender.com";

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

    // Debounce (500ms para evitar conflito entre requisições)
    searchTimeout = setTimeout(async () => {
        try {

            const response = await fetch(`${API_BASE_URL}/alunos/buscar/${encodeURIComponent(searchTerm)}`);


            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

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
            const suggestionsDiv = document.getElementById('searchSuggestions');
            suggestionsDiv.innerHTML = '<div class="no-results">Erro ao buscar alunos</div>';
            suggestionsDiv.style.display = 'block';
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }, 500);
});

// Selecionar aluno
function selectAluno(aluno) {
    selectedAlunoData = aluno;

    // Garante que o _id existe
    if (!selectedAlunoData._id) {
        alert("Erro: aluno retornado sem _id. Verifique o backend.");
        return;
    }

    document.getElementById('searchAluno').value = `${aluno.nome} ${aluno.sobrenome}`;
    document.getElementById('searchSuggestions').style.display = 'none';

    // Mostrar seção do aluno selecionado
    document.getElementById('alunoInfo').textContent =
        `${aluno.nome} ${aluno.sobrenome} - Turma: ${aluno.turma}`;
    document.getElementById('selectedAlunoSection').style.display = 'block';
    document.getElementById('btnExcluirAluno').disabled = false;
}

// Botão iniciar jogo
document.getElementById('btnIniciarJogo').addEventListener('click', function () {
    if (selectedAlunoData) {
        const alunoParam = encodeURIComponent(JSON.stringify(selectedAlunoData));
        const letsPlayEffect = document.getElementById("letsPlayEffect");

        // Mostra o efeito
        letsPlayEffect.style.display = "flex";

        // Depois de 2,5 segundos, redireciona
        setTimeout(() => {
            letsPlayEffect.style.display = "none";
            window.location.href = 'jogoForca.html?aluno=' + alunoParam;
        }, 2500);
    }
});

// Botão atualizar aluno
document.getElementById('btnAtualizarAluno').addEventListener('click', function () {
    if (selectedAlunoData) {
        document.getElementById('updateNome').value = selectedAlunoData.nome;
        document.getElementById('updateSobrenome').value = selectedAlunoData.sobrenome;
        document.getElementById('updateTurma').value = selectedAlunoData.turma;
        document.getElementById('modalUpdate').style.display = 'flex';
    }
});

// Cancelar atualização
document.getElementById('btnCancelUpdate').addEventListener('click', function () {
    document.getElementById('modalUpdate').style.display = 'none';
});

// Salvar atualização
document.getElementById('btnSaveUpdate').addEventListener('click', async function (e) {
    e.preventDefault();
    if (selectedAlunoData) {
        const updatedAluno = {
            nome: document.getElementById('updateNome').value.trim(),
            sobrenome: document.getElementById('updateSobrenome').value.trim(),
            turma: document.getElementById('updateTurma').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/alunos/${selectedAlunoData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAluno)
            });

            if (response.ok) {
                selectedAlunoData = { ...selectedAlunoData, ...updatedAluno };

                document.getElementById('alunoInfo').textContent =
                    `${selectedAlunoData.nome} ${selectedAlunoData.sobrenome} - Turma: ${selectedAlunoData.turma}`;

                document.getElementById('modalUpdate').style.display = 'none';

                // Mostra mensagem personalizada
                const feedback = document.getElementById('feedbackUpdate');
                feedback.style.display = 'block';

                // Esconde após 2.5s
                setTimeout(() => {
                    feedback.style.display = 'none';
                }, 2500);
            }
            else {
                alert('Erro ao atualizar aluno.');
            }
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            alert('Erro ao atualizar aluno.');
        }
    }
});

// Botão voltar
document.getElementById('btnVoltar').addEventListener('click', function () {
    window.close();
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
            const response = await fetch(`${API_BASE_URL}/alunos/${selectedAlunoData._id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
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
