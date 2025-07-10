const { connect } = require('../dao/mongoConnection.js');
const { ObjectId } = require('mongodb');
const Aluno = require('../models/Aluno.js');

async function listarAlunos() {
    const db = await connect();
    return db.collection('alunos').find().toArray();
}

async function adicionarAluno(alunoData) {
    const db = await connect();
    const aluno = new Aluno(alunoData.nome, alunoData.sobrenome, alunoData.turma);
    return db.collection('alunos').insertOne({
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        turma: aluno.turma
    });
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

module.exports = {
    listarAlunos,
    adicionarAluno,
    buscarAlunosPorNome,
    deletarAlunoPorId
}; 