const { connect } = require('../dao/mongoConnection.js');
const { ObjectId } = require('mongodb');
const Aluno = require('../models/Aluno');

// Listar todos os alunos
async function listarAlunos() {
    const db = await connect();
    return db.collection('alunos').find().toArray();
}

// Adicionar um novo aluno
async function adicionarAluno(alunoData) {
    const db = await connect();

    // Cria o aluno usando o modelo Aluno
    const aluno = new Aluno(alunoData.nome, alunoData.sobrenome, alunoData.turma);

    const result = await db.collection('alunos').insertOne({
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        turma: aluno.turma,
        pontos: aluno.pontos, // caso queira manter
        nivel: aluno.nivel    // caso queira manter
    });

    return {
        _id: result.insertedId,
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        turma: aluno.turma,
        pontos: aluno.pontos,
        nivel: aluno.nivel
    };
}

// Buscar alunos por nome, sobrenome ou turma (case insensitive)
async function buscarAlunosPorNome(termo) {
    const db = await connect();
    const termoNormalizado = termo.trim().replace(/\s+/g, ' ');
    const regex = new RegExp(termoNormalizado, 'i');

    return db.collection('alunos').find({
        $or: [
            { nome: { $regex: regex } },
            { sobrenome: { $regex: regex } },
            { turma: { $regex: regex } }
        ]
    }).toArray();
}

// Deletar aluno pelo ID
async function deletarAlunoPorId(id) {
    const db = await connect();
    if (!ObjectId.isValid(id)) {
        return { invalidId: true };
    }
    return db.collection('alunos').deleteOne({ _id: new ObjectId(id) });
}

// Atualizar pontos e nível do aluno
async function atualizarProgressoAluno(id, dados) {
    const db = await connect();
    if (!ObjectId.isValid(id)) {
        return { invalidId: true };
    }

    const update = {};
    if (typeof dados.pontos === 'number') update.pontos = dados.pontos;
    if (typeof dados.nivel === 'number') update.nivel = dados.nivel;

    if (Object.keys(update).length === 0) return { noUpdate: true };

    const result = await db.collection('alunos').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );

    return result;
}

// Atualizar dados básicos do aluno (nome, sobrenome e turma)
async function atualizarAluno(id, dados) {
    const db = await connect();
    if (!ObjectId.isValid(id)) {
        return { invalidId: true };
    }

    const update = {};
    if (typeof dados.nome === 'string' && dados.nome.trim() !== '') {
        update.nome = dados.nome.trim();
    }
    if (typeof dados.sobrenome === 'string' && dados.sobrenome.trim() !== '') {
        update.sobrenome = dados.sobrenome.trim();
    }
    if (typeof dados.turma === 'string' && dados.turma.trim() !== '') {
        update.turma = dados.turma.trim();
    }

    if (Object.keys(update).length === 0) return { noUpdate: true };

    const result = await db.collection('alunos').updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    );

    return result;
}

module.exports = {
    listarAlunos,
    adicionarAluno,
    buscarAlunosPorNome,
    deletarAlunoPorId,
    atualizarProgressoAluno,
    atualizarAluno   // novo método
};
