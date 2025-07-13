const { connect } = require('../dao/mongoConnection');
const path = require('path');

// Dados de exemplo para popular o banco
const palavrasExemplo = [
    {
        texto: "lobo",
        nivel: 1,
        dica: "É um animal que uiva",
        silabas: ["lo", "bo"],
        // URL da imagem que será servida pelo Express
        imagem: "/images/lobo.png"
    },
    {
        texto: "gato",
        nivel: 1,
        dica: "Animal doméstico que mia",
        silabas: ["ga", "to"],
        imagem: "/images/gato.png"
    },
    {
        texto: "casa",
        nivel: 1,
        dica: "Lugar onde moramos",
        silabas: ["ca", "sa"],
        imagem: "/images/casa.png"
    },
    {
        texto: "bola",
        nivel: 1,
        dica: "Objeto redondo para brincar",
        silabas: ["bo", "la"],
        imagem: "/images/bola.png"
    },
    {
        texto: "mesa",
        nivel: 1,
        dica: "Móvel para colocar coisas",
        silabas: ["me", "sa"],
        imagem: "/images/mesa.png"
    }
];

async function popularPalavras() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Limpar coleção existente
        console.log('Limpando coleção existente...');
        await collection.deleteMany({});

        // Inserir palavras no banco
        console.log('Inserindo palavras no banco...');
        const resultado = await collection.insertMany(palavrasExemplo);

        console.log(`✅ ${resultado.insertedCount} palavras inseridas com sucesso!`);
        console.log('Palavras inseridas:');
        palavrasExemplo.forEach(palavra => {
            console.log(`- ${palavra.texto} (Nível ${palavra.nivel}) - Imagem: ${palavra.imagem}`);
        });

        console.log('\n📁 Próximos passos:');
        console.log('1. Crie uma pasta "images" na raiz do projeto');
        console.log('2. Adicione as imagens: lobo.png, gato.png, casa.png, bola.png, mesa.png');
        console.log('3. Configure o Express para servir arquivos estáticos da pasta images');

    } catch (error) {
        console.error('❌ Erro ao popular palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Função para popular com URLs personalizadas
async function popularComURLsPersonalizadas() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Limpar coleção existente
        console.log('Limpando coleção existente...');
        await collection.deleteMany({});

        // Dados com URLs personalizadas
        const palavrasComURLs = [
            {
                texto: "lobo",
                nivel: 1,
                dica: "É um animal que uiva",
                silabas: ["lo", "bo"],
                imagem: "/images/lobo.png"
            },
            {
                texto: "gato",
                nivel: 1,
                dica: "Animal doméstico que mia",
                silabas: ["ga", "to"],
                imagem: "/images/gato.png"
            },
            {
                texto: "casa",
                nivel: 1,
                dica: "Lugar onde moramos",
                silabas: ["ca", "sa"],
                imagem: "/images/casa.png"
            },
            {
                texto: "bola",
                nivel: 1,
                dica: "Objeto redondo para brincar",
                silabas: ["bo", "la"],
                imagem: "/images/bola.png"
            },
            {
                texto: "mesa",
                nivel: 1,
                dica: "Móvel para colocar coisas",
                silabas: ["me", "sa"],
                imagem: "/images/mesa.png"
            }
        ];

        // Inserir palavras no banco
        console.log('Inserindo palavras no banco...');
        const resultado = await collection.insertMany(palavrasComURLs);

        console.log(`✅ ${resultado.insertedCount} palavras inseridas com sucesso!`);
        console.log('Palavras inseridas:');
        palavrasComURLs.forEach(palavra => {
            console.log(`- ${palavra.texto} (Nível ${palavra.nivel}) - Imagem: ${palavra.imagem}`);
        });

    } catch (error) {
        console.error('❌ Erro ao popular palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Função para popular sem imagens (apenas com null)
async function popularSemImagens() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Limpar coleção existente
        console.log('Limpando coleção existente...');
        await collection.deleteMany({});

        // Dados sem imagens
        const palavrasSemImagens = palavrasExemplo.map(palavra => ({
            texto: palavra.texto,
            nivel: palavra.nivel,
            dica: palavra.dica,
            silabas: palavra.silabas,
            imagem: null
        }));

        // Inserir palavras no banco
        console.log('Inserindo palavras no banco...');
        const resultado = await collection.insertMany(palavrasSemImagens);

        console.log(`✅ ${resultado.insertedCount} palavras inseridas com sucesso!`);
        console.log('Palavras inseridas:');
        palavrasSemImagens.forEach(palavra => {
            console.log(`- ${palavra.texto} (Nível ${palavra.nivel}) - Imagem: ${palavra.imagem}`);
        });

        console.log('\n📝 As imagens foram definidas como null.');
        console.log('Você pode atualizar manualmente no banco ou usar a API para adicionar as URLs das imagens.');

    } catch (error) {
        console.error('❌ Erro ao popular palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Executar o script
if (require.main === module) {
    const usarURLs = process.argv.includes('--urls');
    const semImagens = process.argv.includes('--sem-imagens');
    
    if (semImagens) {
        console.log('📝 Populando sem imagens (null)...');
        popularSemImagens();
    } else if (usarURLs) {
        console.log('🖼️ Populando com URLs de imagens...');
        popularComURLsPersonalizadas();
    } else {
        console.log('🖼️ Populando com URLs padrão de imagens...');
        popularPalavras();
    }
}

module.exports = { popularPalavras, popularComURLsPersonalizadas, popularSemImagens }; 