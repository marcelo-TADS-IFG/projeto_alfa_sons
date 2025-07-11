/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     tags:
 *       - Alunos
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   sobrenome:
 *                     type: string
 *                   turma:
 *                     type: string
 *                   pontos:
 *                     type: integer
 *                   nivel:
 *                     type: integer
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags:
 *       - Alunos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - sobrenome
 *               - turma
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João
 *               sobrenome:
 *                 type: string
 *                 example: Silva
 *               turma:
 *                 type: string
 *                 example: 5A
 *     responses:
 *       201:
 *         description: Aluno adicionado!
 *       400:
 *         description: Dados inválidos
 * /alunos/buscar/{nome}:
 *   get:
 *     summary: Busca alunos pelo nome, sobrenome ou turma
 *     tags:
 *       - Alunos
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *         description: Termo de busca (nome, sobrenome ou turma)
 *     responses:
 *       200:
 *         description: Lista de alunos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   sobrenome:
 *                     type: string
 *                   turma:
 *                     type: string
 *                   pontos:
 *                     type: integer
 *                   nivel:
 *                     type: integer
 * /alunos/{id}:
 *   patch:
 *     summary: Atualiza pontos e nível do aluno
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pontos:
 *                 type: integer
 *                 example: 10
 *               nivel:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Progresso do aluno atualizado com sucesso!
 *       400:
 *         description: ID inválido ou nenhum campo para atualizar
 *       404:
 *         description: Aluno não encontrado ou dados iguais
 *   delete:
 *     summary: Excluir um aluno pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

// Listar todos os alunos
router.get('/', async (req, res) => {
    const alunos = await alunoController.listarAlunos();
    res.json(alunos);
});

// Adicionar um novo aluno
router.post('/', async (req, res) => {
    const novoAluno = req.body;
    await alunoController.adicionarAluno(novoAluno);
    res.status(201).send('Aluno adicionado!');
});

// Buscar todos os alunos com o nome informado (lista)
router.get('/buscar/:nome', async (req, res) => {
    const alunos = await alunoController.buscarAlunosPorNome(req.params.nome);
    res.json(alunos);
});

// Deletar aluno pelo ID
router.delete('/:id', async (req, res) => {
    const resultado = await alunoController.deletarAlunoPorId(req.params.id);
    if (resultado.invalidId) {
        return res.status(400).send('ID inválido');
    }
    if (resultado.deletedCount === 1) {
        res.send('Aluno deletado com sucesso!');
    } else {
        res.status(404).send('Aluno não encontrado');
    }
});

// Atualizar pontos e nível do aluno
router.patch('/:id', async (req, res) => {
    const resultado = await alunoController.atualizarProgressoAluno(req.params.id, req.body);
    if (resultado.invalidId) {
        return res.status(400).send('ID inválido');
    }
    if (resultado.noUpdate) {
        return res.status(400).send('Nenhum campo para atualizar');
    }
    if (resultado.modifiedCount === 1) {
        res.send('Progresso do aluno atualizado com sucesso!');
    } else {
        res.status(404).send('Aluno não encontrado ou dados iguais');
    }
});

module.exports = router; 