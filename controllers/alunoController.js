const { connect } = require('../dao/mongoConnection.js');
const { ObjectId } = require('mongodb');
const Aluno = require('../models/Aluno.js');

async function listarAlunos() {
    const db = await connect();
    return db.collection('alunos').find().toArray();
}

async function adicionarAluno(alunoData) {
    const db = await connect();
    // Cria o aluno já com pontos e nível padrão (ou use os valores recebidos, se desejar)
    const aluno = new Aluno(alunoData.nome, alunoData.sobrenome, alunoData.turma);
    const result = await db.collection('alunos').insertOne({
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        turma: aluno.turma,
        pontos: aluno.pontos,
        nivel: aluno.nivel
    });
    // Retorna o aluno criado, incluindo o _id gerado pelo MongoDB
    return {
        _id: result.insertedId,
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        turma: aluno.turma,
        pontos: aluno.pontos,
        nivel: aluno.nivel
    };
}

// Buscar todos os alunos que contenham o termo informado em nome, sobrenome ou turma (ignorando maiúsculas/minúsculas e espaços extras)
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

module.exports = {
    listarAlunos,
    adicionarAluno,
    buscarAlunosPorNome,
    deletarAlunoPorId,
    atualizarProgressoAluno
}; 