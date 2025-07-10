/**
 * @swagger
 * /alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     responses:
 *       200:
 *         description: Lista de alunos
 *   post:
 *     summary: Adiciona um novo aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               sobrenome:
 *                 type: string
 *               turma:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno adicionado
 * /alunos/buscar/{nome}:
 *   get:
 *     summary: Lista todos os alunos com o nome informado
 *     parameters:
 *       - in: path
 *         name: nome
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de alunos encontrados
 * /alunos/{id}:
 *   delete:
 *     summary: Deleta um aluno pelo ID
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

module.exports = router; 