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
 *           description: "Caminho ou URL da imagem (ex: /images/lobo.png)"
 *         silabas:
 *           type: array
 *           items:
 *             type: string
 *         audio_silabas:
 *           type: array
 *           items:
 *             type: string
 *           description: "Lista com os nomes dos arquivos de áudio das sílabas (ex: ['lo_d.mp3', 'bo_f.mp3'])"
 *         onomatopeias:
 *           type: array
 *           items:
 *             type: string
 *           description: "Lista de sons/letras para reforço fonético (ex: ['l', 'o', 'b', 'o_f'])"
 *
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
 *           example:
 *             texto: "abacateiro"
 *             nivel: 3
 *             dica: "Árvore que produz abacate"
 *             imagem: "/images/abacateiro.png"
 *             silabas: ["a", "ba", "ca", "tei", "ro"]
 *             audio_silabas: ["a_d", "ba_d", "ca_d", "tei_f", "ro_f"]
 *             onomatopeias: ["a", "b", "a", "c", "a", "t", "e_f", "i", "r", "o_f"]
 *     responses:
 *       201:
 *         description: Palavra adicionada!
 *       400:
 *         description: Dados inválidos
 *
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
 *         description: "Nível da palavra"
 *     responses:
 *       200:
 *         description: Lista de palavras do nível
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Palavra'
 *
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
 *         description: "Nível da palavra"
 *     responses:
 *       200:
 *         description: Palavra aleatória encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Palavra'
 *       404:
 *         description: Nenhuma palavra encontrada para este nível
 *
 * /palavras/{id}:
 *   put:
 *     summary: Atualiza todos os atributos de uma palavra pelo ID
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
 *             $ref: '#/components/schemas/Palavra'
 *           example:
 *             texto: "abacateiro"
 *             nivel: 3
 *             dica: "Fruta rica em nutrientes"
 *             imagem: "/images/abacateiro.png"
 *             silabas: ["a", "ba", "ca", "tei", "ro"]
 *             audio_silabas: ["a_d", "ba_d", "ca_d", "tei_f", "ro_f"]
 *             onomatopeias: ["a", "b", "a", "c", "a", "t", "e_f", "i", "r", "o_f"]
 *     responses:
 *       200:
 *         description: Palavra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 palavra:
 *                   $ref: '#/components/schemas/Palavra'
 *       400:
 *         description: Erro de validação ou atualização
 *       404:
 *         description: Palavra não encontrada
 *
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
 *         description: "Palavra deletada com sucesso"
 *       404:
 *         description: "Palavra não encontrada"
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