# Projeto Alfa Sons

Jogo da Forca Educacional com Progressão de Dificuldade

## Descrição
O Alfa Sons é um jogo da forca voltado para o público infantil, com progressão de dificuldade, apoio sonoro e reforço fonológico, inspirado no método das onomatopeias de Sandra Puliezi.

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
models/         # Classes de dados (Aluno, BancoDeAlunos)
controllers/    # Lógica de negócio (alunoController)
dao/            # Conexão com o MongoDB
routes/         # Rotas Express (alunoRoutes)
views/          # (Para componentes React)
app.js          # Arquivo principal do servidor
```

## Autor
Marcelo - TADS IFG 