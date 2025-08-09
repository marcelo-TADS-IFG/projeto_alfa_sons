# Projeto Alfa Sons

Jogo da Forca Educacional com Progressão de Dificuldade

## Descrição
O EduForca é um jogo da forca voltado para o público infantil, com progressão de dificuldade, apoio sonoro e reforço fonológico, inspirado no método das onomatopeias de Sandra Puliezi.

## Funcionalidades
- Cadastro e gerenciamento de alunos
- Jogo da forca com dicas, imagens e separação silábica
- Progressão automática de níveis
- API RESTful documentada com Swagger
- Integração com MongoDB

## Tecnologias Utilizadas
- Node.js
- Express
- MongoDB
- Swagger (documentação da API)
- React (frontend, em desenvolvimento)

## Como rodar o projeto
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   node app.js
   ```
3. Acesse a documentação da API:
   [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Estrutura de Pastas
```
app.js                      # Arquivo principal do servidor
package.json                # Dependências do projeto
controllers/                # Lógica de negócio (alunoController, palavraController)
dao/                        # Conexão e acesso ao MongoDB (mongoConnection, palavraDAO)
models/                     # Classes de dados (Aluno, Palavra, BancoDeAlunos, BancoDePalavras)
routes/                     # Rotas Express (alunoRoutes, palavraRoutes)
scripts/                    # Scripts utilitários para popular/adicionar palavras
views/
  ├── html/                 # Páginas HTML do frontend (cadastroAlunos, selecaoAluno, jogoForca, etc)
  ├── css/                  # Arquivos de estilo CSS
  └── javascript/           # Scripts JS do frontend (funcoesJogoDaForca, ServicoDeAudio)
images/                     # Imagens de recompensa exibidas no jogo
imagemForca/                # Imagens da forca (forca.svg, forca-1.svg, ...)
audios/                     # Áudios do jogo (palavras, sílabas, letras, efeitos)
.vscode/                    # Configurações do VS Code
README.md                   # Documentação principal do projeto
README-IMAGENS.md           # Documentação sobre o sistema
```

## Autor
Marcelo - TADS IFG 