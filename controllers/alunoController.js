/*const { connect } = require('../dao/mongoConnection.js');
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
}; */

// controllers/alunoController.js
const Aluno = require('../models/Aluno');
const alunoDAO = require('../dao/alunoDAO'); // caso tenha métodos separados de DAO

// Listar todos os alunos
const listarAlunos = async (req, res) => {
    try {
        const alunos = await alunoDAO.listarAlunos();
        res.json(alunos);
    } catch (err) {
        console.error('Erro ao listar alunos:', err);
        res.status(500).json({ error: 'Erro ao listar alunos.' });
    }
};

// Adicionar novo aluno
const adicionarAluno = async (req, res) => {
    try {
        const { nome, sobrenome, turma } = req.body;

        if (!nome || !sobrenome || !turma) {
            return res.status(400).json({ error: 'Campos obrigatórios: nome, sobrenome e turma' });
        }

        const novoAluno = new Aluno(nome, sobrenome, turma);
        const alunoCriado = await alunoDAO.adicionarAluno(novoAluno);

        res.status(201).json(alunoCriado);
    } catch (err) {
        console.error('Erro ao adicionar aluno:', err);
        res.status(400).json({ error: 'Erro ao adicionar aluno.' });
    }
};

const buscarAlunosPorNome = async (req, res) => {
    try {
        const termo = req.params.nome; // 👈 agora usa o mesmo nome da rota
        if (!termo || termo.trim() === '') {
            return res.status(400).json({ error: 'Termo de busca inválido.' });
        }

        const alunos = await alunoDAO.buscarAlunosPorNome(termo);
        res.json(alunos);
    } catch (err) {
        console.error('Erro ao buscar alunos:', err);
        res.status(500).json({ error: 'Erro ao buscar alunos.' });
    }
};

// Deletar aluno por ID
const deletarAlunoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await alunoDAO.deletarAlunoPorId(id);

        if (resultado?.deletedCount === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        res.json({ message: 'Aluno deletado com sucesso.' });
    } catch (err) {
        console.error('Erro ao deletar aluno:', err);
        res.status(500).json({ error: 'Erro ao deletar aluno.' });
    }
};

// Atualizar pontos e nível (opcional)
const atualizarProgressoAluno = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const resultado = await alunoDAO.atualizarProgressoAluno(id, dados);

        if (resultado?.noUpdate) {
            return res.status(400).json({ error: 'Nenhum dado válido para atualizar.' });
        }

        if (resultado?.invalidId) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        res.json({ message: 'Progresso do aluno atualizado com sucesso.' });
    } catch (err) {
        console.error('Erro ao atualizar progresso do aluno:', err);
        res.status(500).json({ error: 'Erro ao atualizar progresso do aluno.' });
    }
};

module.exports = {
    listarAlunos,
    adicionarAluno,
    buscarAlunosPorNome,
    deletarAlunoPorId,
    atualizarProgressoAluno
};
