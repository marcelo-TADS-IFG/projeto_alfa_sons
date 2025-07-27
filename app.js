const express = require('express');
const cors = require('cors');
const path = require('path');
const alunoRoutes = require('./routes/alunoRoutes');
const palavraRoutes = require('./routes/palavraRoutes'); // Adicione esta linha
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/imagemForca', express.static(path.join(__dirname, 'imagemForca')));
app.use('/audios', express.static(path.join(__dirname, 'audios')));

app.use(express.static('src'));
app.use(express.static(path.join(__dirname, 'views')));

// Rota para servir a tela de cadastro como página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'html', 'cadastroAlunos.html'));
});

// Rota para seleção de aluno
app.get('/selecao', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'html', 'selecaoAluno.html'));
});

// Sirva as pastas estáticas:
app.use('/html', express.static(path.join(__dirname, 'views/html')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/javascript', express.static(path.join(__dirname, 'views/javascript')));

// Rota para o jogo da forca
app.get('/jogo', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'html', 'jogoForca.html'));
});

app.use('/alunos', alunoRoutes);
app.use('/palavras', palavraRoutes); // Adicione esta linha

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Alunos',
      version: '1.0.0',
      description: 'API para gerenciamento de alunos',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rotas com comentários Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
}); 