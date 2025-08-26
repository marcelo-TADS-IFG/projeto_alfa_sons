const Palavra = require('../models/Palavra');
const palavraDAO = require('../dao/palavraDAO');
// Removi a importação de isValidImageBase64 pois não é mais necessária

const listarPalavras = async (req, res) => {
  try {
    const palavras = await palavraDAO.buscarTodas();
    res.json(palavras);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar palavras.' });
  }
};

const buscarPorNivel = async (req, res) => {
  const nivel = parseInt(req.params.nivel);
  try {
    const palavras = await palavraDAO.buscarPorNivel(nivel);
    res.json({
      quantidade: palavras.length,
      palavras: palavras
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar palavras por nível.' });
  }
};

const buscarAleatoriaPorNivel = async (req, res) => {
  const nivel = parseInt(req.params.nivel);
  try {
    const palavra = await palavraDAO.buscarAleatoriaPorNivel(nivel);
    if (palavra) res.json(palavra);
    else res.status(404).json({ error: 'Nenhuma palavra encontrada para este nível.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar palavra aleatória.' });
  }
};

const criarPalavra = async (req, res) => {
  try {
    const { texto, nivel, dica, imagem, silabas, audio_silabas, onomatopeias} = req.body;

    // Validar campos obrigatórios
    if (!texto || !nivel || !dica || !silabas) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: texto, nivel, dica, silabas' 
      });
    }

    // Cria a nova palavra com ou sem áudio e onomatopeias
    const novaPalavra = new Palavra({ 
      texto, 
      nivel, 
      dica, 
      imagem,
      silabas, 
      audio_silabas, 
      onomatopeias, 
    });

    const palavraCriada = await palavraDAO.criar(novaPalavra);
    res.status(201).json(palavraCriada);
  } catch (err) {
    console.error('Erro ao criar palavra:', err);
    res.status(400).json({ error: 'Erro ao criar palavra.' });
  }
};

/*
const atualizarPalavra = async (req, res) => {
  const id = req.params.id;
  try {
    const palavraAtualizada = await palavraDAO.atualizar(id, req.body);
    if (palavraAtualizada) res.json(palavraAtualizada);
    else res.status(404).json({ error: 'Palavra não encontrada.' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar palavra.' });
  }
};*/

const atualizarPalavra = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      texto,
      nivel,
      dica,
      imagem,
      silabas,
      audio_silabas,
      onomatopeias
    } = req.body;

    // validação básica: todos os campos obrigatórios
    if (!texto || !nivel || !dica || !silabas) {
      return res.status(400).json({
        error: "Campos obrigatórios: texto, nivel, dica, silabas"
      });
    }

    const dadosAtualizados = {
      texto,
      nivel,
      dica,
      imagem,
      silabas,
      audio_silabas,
      onomatopeias
    };

    const resultado = await palavraDAO.atualizar(id, dadosAtualizados);

    if (!resultado) {
      return res.status(404).json({ error: "Palavra não encontrada" });
    }

    res.status(200).json({ message: "Palavra atualizada com sucesso!", palavra: resultado });
  } catch (err) {
    console.error("Erro ao atualizar palavra:", err);
    res.status(400).json({ error: "Erro ao atualizar palavra." });
  }
};

const deletarPalavra = async (req, res) => {
  const id = req.params.id;
  try {
    const resultado = await palavraDAO.deletar(id);
    if (resultado) res.json({ message: 'Palavra deletada com sucesso.' });
    else res.status(404).json({ error: 'Palavra não encontrada.' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao deletar palavra.' });
  }
};

module.exports = {
  listarPalavras,
  buscarPorNivel,
  buscarAleatoriaPorNivel,
  criarPalavra,
  atualizarPalavra,
  deletarPalavra
}; 