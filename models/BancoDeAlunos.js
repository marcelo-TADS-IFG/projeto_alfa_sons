import Aluno from './Aluno.js';

class BancoDeAlunos {
    constructor() {
        this.alunos = [];
    }

    carregarAlunosDoBanco() {
        // Implementação futura: carregar alunos de um banco de dados
    }

    buscarPorNome(nome) {
        return this.alunos.find(aluno => aluno.nome === nome);
    }

    adicionarAluno(aluno) {
        this.alunos.push(aluno);
    }
}

export default BancoDeAlunos; 