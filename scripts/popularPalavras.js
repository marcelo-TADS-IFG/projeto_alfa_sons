const { connect } = require('../dao/mongoConnection');
const path = require('path');

// Dados de exemplo para popular o banco
const palavrasExemplo = [
    
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
    },
    {
        texto: "dama",
        nivel: 1,
        dica: "Jogo de tabuleiro",
        silabas: ["da", "ma"],
        imagem: "/images/dama.png"
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
            },
            {
                texto: "dama",
                nivel: 1,
                dica: "Jogo de tabuleiro",
                silabas: ["da", "ma"],
                imagem: "/images/dama.png"
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

// Função para adicionar apenas novas palavras (sem deletar existentes)
async function adicionarNovasPalavras() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Dados das novas palavras (Nível 2 - 7 letras)
        const novasPalavras = [
            {
                texto: "amarelo",
                nivel: 2,
                dica: "Cor do sol e das bananas",
                silabas: ["a", "ma", "re", "lo"],
                imagem: "/images/amarelo.png"
            },
            {
                texto: "cachorro",
                nivel: 2,
                dica: "Animal doméstico que late",
                silabas: ["ca", "chor", "ro"],
                imagem: "/images/cachorro.png"
            },
            {
                texto: "janela",
                nivel: 2,
                dica: "Abertura na parede para ver fora",
                silabas: ["ja", "ne", "la"],
                imagem: "/images/janela.png"
            },
            {
                texto: "livro",
                nivel: 1,
                dica: "Objeto com páginas para ler",
                silabas: ["li", "vro"],
                imagem: "/images/livro.png"
            },
            {
                texto: "carro",
                nivel: 1,
                dica: "Veículo com quatro rodas",
                silabas: ["car", "ro"],
                imagem: "/images/carro.png"
            }
        ];

        // Verificar palavras que já existem
        const palavrasExistentes = await collection.find({}).toArray();
        const textosExistentes = palavrasExistentes.map(p => p.texto);
        
        // Filtrar apenas palavras que não existem
        const palavrasParaInserir = novasPalavras.filter(palavra => 
            !textosExistentes.includes(palavra.texto)
        );

        if (palavrasParaInserir.length === 0) {
            console.log('ℹ️ Todas as palavras já existem no banco!');
            return;
        }

        // Inserir apenas as novas palavras
        console.log(`Inserindo ${palavrasParaInserir.length} novas palavras no banco...`);
        const resultado = await collection.insertMany(palavrasParaInserir);

        console.log(`✅ ${resultado.insertedCount} palavras inseridas com sucesso!`);
        console.log('Novas palavras inseridas:');
        palavrasParaInserir.forEach(palavra => {
            console.log(`- ${palavra.texto} (Nível ${palavra.nivel}) - Imagem: ${palavra.imagem}`);
        });

        console.log(`\n📊 Total de palavras no banco: ${palavrasExistentes.length + resultado.insertedCount}`);

    } catch (error) {
        console.error('❌ Erro ao adicionar palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Executar o script
if (require.main === module) {
    const usarURLs = process.argv.includes('--urls');
    const semImagens = process.argv.includes('--sem-imagens');
    const adicionarNovas = process.argv.includes('--adicionar');
    
    if (adicionarNovas) {
        console.log('➕ Adicionando apenas novas palavras (sem deletar existentes)...');
        adicionarNovasPalavras();
    } else if (semImagens) {
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

module.exports = { popularPalavras, popularComURLsPersonalizadas, popularSemImagens, adicionarNovasPalavras }; 