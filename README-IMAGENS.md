# Sistema de Imagens - Alfa Sons

Este documento explica como usar o sistema de imagens no projeto Alfa Sons.

## 📋 Visão Geral

O sistema permite salvar URLs de imagens no MongoDB, que são exibidas como recompensa quando o aluno completa uma palavra corretamente no jogo. As imagens são hospedadas localmente na pasta `images` e servidas pelo Express.

## 🎯 Como Funciona

1. **Imagens**: Hospedadas na pasta `images` do projeto
2. **Backend**: Salva URLs das imagens no MongoDB
3. **Express**: Serve as imagens como arquivos estáticos
4. **Jogo**: Exibe a imagem quando o aluno acerta a palavra

## 📁 Arquivos Criados

- `exemplo-imagem-base64.html` - Exemplo de conversão de imagem para Base64 (legado)
- `exemplo-jogo-imagem.html` - Exemplo de jogo com imagem de recompensa
- `images/` - Pasta para armazenar imagens do projeto
- `scripts/popularPalavras.js` - Script para popular banco com palavras e URLs de imagens

## 🚀 Como Usar

### 1. Adicionar Imagens ao Projeto

1. Coloque suas imagens na pasta `images/` na raiz do projeto
2. Use nomes descritivos: `lobo.png`, `gato.png`, `casa.png`, etc.
3. Formatos suportados: PNG, JPG, SVG, GIF, WebP

### 2. Enviar Palavra com URL da Imagem para API

```javascript
const palavra = {
    texto: "lobo",
    nivel: 1,
    dica: "É um animal que uiva",
    imagem: "/images/lobo.png", // URL da imagem
    silabas: ["lo", "bo"]
};

const response = await fetch('http://localhost:3000/palavras', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(palavra)
});
```

### 3. Exibir Imagem no Jogo

```javascript
// Quando o aluno acerta a palavra
if (respostaCorreta) {
    const rewardImage = document.getElementById('rewardImage');
    rewardImage.src = palavra.imagem; // URL da imagem
    rewardImage.style.display = 'block';
}
```

## 📊 Popular Banco com Dados de Exemplo

### Populando sem imagens (null)

```bash
node scripts/popularPalavras.js --sem-imagens
```

### Populando com URLs de imagens

```bash
node scripts/popularPalavras.js
```

### Populando com URLs personalizadas

```bash
node scripts/popularPalavras.js --urls
```

**Nota**: Para usar imagens, coloque-as na pasta `images/` com os nomes:
- lobo.png
- gato.png
- casa.png
- bola.png
- mesa.png

## 📝 Estrutura da Palavra no MongoDB

```json
{
    "_id": ObjectId("..."),
    "texto": "lobo",
    "nivel": 1,
    "dica": "É um animal que uiva",
    "imagem": "/images/lobo.png",
    "silabas": ["lo", "bo"]
}
```

## ⚙️ Configuração do Express

O Express está configurado para servir arquivos estáticos da pasta `images`:

```javascript
// Em app.js
app.use('/images', express.static('images'));
```

Isso permite que as imagens sejam acessadas via URLs como:
- `http://localhost:3000/images/lobo.png`
- `http://localhost:3000/images/gato.png`

## ⚠️ Considerações Importantes

### Vantagens da Nova Abordagem
- **Performance**: URLs são mais leves que Base64
- **Cache**: Navegadores podem fazer cache das imagens
- **Manutenção**: Mais fácil de gerenciar e atualizar imagens
- **Escalabilidade**: Melhor para projetos com muitas imagens

### Tamanho das Imagens
- **Recomendado**: Máximo 200x200 pixels para imagens pequenas
- **Formato**: PNG, JPG, SVG, GIF, WebP
- **Otimização**: Comprima as imagens para melhor performance

### Estrutura de URLs
- **Padrão**: `/images/nome-da-imagem.extensao`
- **Exemplo**: `/images/lobo.png`
- **Flexível**: Pode usar subpastas se necessário

## 🎮 Exemplo de Uso no Jogo

1. Adicione imagens na pasta `images/`
2. Execute o script para popular o banco
3. Abra `exemplo-jogo-imagem.html` para ver o jogo funcionando
4. Use o Swagger em `http://localhost:3000/api-docs` para testar a API

## 🔧 Configuração

### Dependências
O sistema usa apenas módulos nativos do Node.js:
- `express.static` - Para servir arquivos estáticos
- `fs` - Para verificar existência de arquivos (se necessário)

### Estrutura de Pastas
```
src/
├── images/              # Pasta para imagens do projeto
│   ├── lobo.png
│   ├── gato.png
│   └── ...
├── scripts/
│   └── popularPalavras.js
├── exemplo-imagem-base64.html  # (legado)
└── exemplo-jogo-imagem.html
```

## 🐛 Troubleshooting

### Erro: "Imagem não encontrada"
- Verifique se a imagem existe na pasta `images/`
- Confirme se o nome do arquivo está correto na URL
- Verifique se o Express está servindo arquivos estáticos

### Erro: "URL inválida"
- Certifique-se de que a URL começa com `/images/`
- Verifique se não há espaços ou caracteres especiais no nome do arquivo

### Imagem não aparece no jogo
- Verifique se a URL está sendo salva corretamente no banco
- Confirme se o campo `imagem` está sendo retornado pela API
- Teste a URL diretamente no navegador: `http://localhost:3000/images/lobo.png`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se as imagens estão na pasta `images/`
2. Teste as URLs diretamente no navegador
3. Use o Swagger para testar a API
4. Verifique se o MongoDB está rodando
5. Confirme se o Express está servindo arquivos estáticos

## 🔄 Migração de Base64 para URLs

Se você estava usando Base64 anteriormente:

1. **Extraia as imagens** dos dados Base64
2. **Salve-as na pasta `images/`** com nomes descritivos
3. **Atualize o banco** para usar URLs em vez de Base64
4. **Teste** se as imagens estão sendo exibidas corretamente

### Script para migração (se necessário)

```javascript
// Exemplo de como migrar Base64 para URLs
const palavras = await collection.find({}).toArray();

for (const palavra of palavras) {
    if (palavra.imagem && palavra.imagem.startsWith('data:image/')) {
        // Converter Base64 para arquivo
        const buffer = Buffer.from(palavra.imagem.split(',')[1], 'base64');
        const fileName = `${palavra.texto}.png`;
        fs.writeFileSync(`images/${fileName}`, buffer);
        
        // Atualizar no banco
        await collection.updateOne(
            { _id: palavra._id },
            { $set: { imagem: `/images/${fileName}` } }
        );
    }
}
``` 