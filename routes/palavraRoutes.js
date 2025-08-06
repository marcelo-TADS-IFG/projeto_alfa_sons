const express = require('express');
const router = express.Router();
const palavraController = require('../controllers/palavraController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Palavra:
 *       type: object
 *       required:
 *         - texto
 *         - nivel
 *         - dica
 *         - imagem
 *         - silabas
 *       properties:
 *         _id:
 *           type: string
 *         texto:
 *           type: string
 *         nivel:
 *           type: integer
 *         dica:
 *           type: string
 *         imagem:
 *           type: string
 *           description: Caminho ou URL da imagem (exemplo /images/lobo.png)
 *         silabas:
 *           type: array
 *           items:
 *             type: string
 *         audio_silabas:
 *           type: array
 *           items:
 *             type: string
 *           description: "Lista com os nomes dos arquivos de áudio das sílabas (ex: ['lo.mp3', 'bo_f.mp3'])"
 * /palavras:
 *   get:
 *     summary: Lista todas as palavras
 *     tags:
 *       - Palavras
 *     responses:
 *       200:
 *         description: Lista de todas as palavras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Palavra'
 *   post:
 *     summary: Cadastra uma nova palavra
 *     tags:
 *       - Palavras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Palavra'
 *     responses:
 *       201:
 *         description: Palavra adicionada!
 *       400:
 *         description: Dados inválidos
 * /palavras/nivel/{nivel}:
 *   get:
 *     summary: Lista palavras por nível
 *     tags:
 *       - Palavras
 *     parameters:
 *       - in: path
 *         name: nivel
 *         required: true
 *         schema:
 *           type: integer
 *         description: Nível da palavra
 *     responses:
 *       200:
 *         description: Lista de palavras do nível
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Palavra'
 * /palavras/aleatoria/{nivel}:
 *   get:
 *     summary: Busca uma palavra aleatória por nível
 *     tags:
 *       - Palavras
 *     parameters:
 *       - in: path
 *         name: nivel
 *         required: true
 *         schema:
 *           type: integer
 *         description: Nível da palavra
 *     responses:
 *       200:
 *         description: Palavra aleatória encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Palavra'
 *       404:
 *         description: Nenhuma palavra encontrada para este nível
 * /palavras/{id}:
 *   patch:
 *     summary: Atualiza uma palavra pelo ID
 *     tags:
 *       - Palavras
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
 *               texto:
 *                 type: string
 *               nivel:
 *                 type: integer
 *               dica:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 description: Caminho ou URL da imagem (exemplo /images/lobo.png)
 *               silabas:
 *                 type: array
 *                 items:
 *                   type: string
 *               audio_silabas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Lista com os nomes dos arquivos de áudio das sílabas (ex: ['lo.mp3', 'bo_f.mp3'])"
 *     responses:
 *       200:
 *         description: Palavra atualizada com sucesso!
 *       400:
 *         description: ID inválido ou nenhum campo para atualizar
 *       404:
 *         description: Palavra não encontrada
 *   delete:
 *     summary: Excluir uma palavra pelo ID
 *     tags:
 *       - Palavras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Palavra deletada com sucesso
 *       404:
 *         description: Palavra não encontrada
 */

// Listar todas as palavras
router.get('/', palavraController.listarPalavras);

// Buscar palavras por nível
router.get('/nivel/:nivel', palavraController.buscarPorNivel);

// Buscar palavra aleatória por nível
router.get('/aleatoria/:nivel', palavraController.buscarAleatoriaPorNivel);

// Criar nova palavra
router.post('/', palavraController.criarPalavra);

// Atualizar palavra
router.patch('/:id', palavraController.atualizarPalavra);

// Deletar palavra
router.delete('/:id', palavraController.deletarPalavra);

module.exports = router; 