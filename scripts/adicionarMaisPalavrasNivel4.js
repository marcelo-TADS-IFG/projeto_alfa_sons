const { connect } = require('../dao/mongoConnection');

// Novas palavras para o nível 4 (todas com 13 letras)
const novasPalavrasNivel4 = [
    
    {
        texto: "desorganizado",
        nivel: 4,
        dica: "Que não é organizado",
        silabas: ["de", "sor", "ga", "ni", "za", "do"],
        imagem: "/images/desorganizado.png"
    },
    {
        texto: "brinquedoteca",
        nivel: 4,
        dica: "Espaço de diversão infantil",
        silabas: ["brin", "que", "do", "te", "ca"],
        imagem: "/images/brinquedoteca.png"
    },
    {
        texto: "papagaiarada",
        nivel: 4,
        dica: "Grupo de papagaios barulhentos",
        silabas: ["pa", "pa", "ga", "i", "a", "ra", "da"],
        imagem: "/images/papagaiarada.png"
    },
    {
        texto: "salvador-bahia",
        nivel: 4,
        dica: "Capital do estado da Bahia",
        silabas: ["sal", "va", "dor", "-", "ba", "hi", "a"],
        imagem: "/images/salvador-bahia.png"
    },
    {
        texto: "encaracolando",
        nivel: 4,
        dica: "Ato de enrolar em forma de caracol",
        silabas: ["en", "ca", "ra", "co", "lan", "do"],
        imagem: "/images/encaracolando.png"
    },
    {
        texto: "desaparecidos",
        nivel: 4,
        dica: "Que sumiram, não estão presentes",
        silabas: ["de", "sa", "pa", "re", "ci", "dos"],
        imagem: "/images/desaparecidos.png"
    },
    {
        texto: "brontossauro",
        nivel: 4,
        dica: "Dinossauro herbívoro gigante",
        silabas: ["bron", "tos", "sau", "ro"],
        imagem: "/images/brontossauro.png"
    },
    {
        texto: "espantalhinho",
        nivel: 4,
        dica: "Versão pequena de um boneco que afasta aves",
        silabas: ["es", "pan", "ta", "lhi", "nho"],
        imagem: "/images/espantalhinho.png"
    },
    {
        texto: "caminhoneiros",
        nivel: 4,
        dica: "Profissionais que dirigem caminhões",
        silabas: ["ca", "mi", "nho", "nei", "ros"],
        imagem: "/images/caminhoneiros.png"
    },
    {
        texto: "abobrinha-verde",
        nivel: 4,
        dica: "Legume muito usado em sopas e refogados",
        silabas: ["a", "bo", "bri", "nha", "-", "ver", "de"],
        imagem: "/images/abobrinha-verde.png"
    },
    {
        texto: "pindamonhangaba",
        nivel: 4,
        dica: "Cidade do interior de São Paulo",
        silabas: ["pin", "da", "mon", "han", "ga", "ba"],
        imagem: "/images/pindamonhangaba.png"
    },
    {
        texto: "borboletinhas",
        nivel: 4,
        dica: "Diminutivo de borboletas",
        silabas: ["bor", "bo", "le", "ti", "nhas"],
        imagem: "/images/borboletinhas.png"
    },
    {
        texto: "observatório",
        nivel: 4,
        dica: "Lugar onde se observam estrelas e planetas",
        silabas: ["ob", "ser", "va", "tó", "ri", "o"],
        imagem: "/images/observatorio.png"
    },
];

async function adicionarMaisPalavrasNivel4() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Buscar palavras já existentes
        const palavrasExistentes = await collection.find({ nivel: 4 }).toArray();
        const textosExistentes = palavrasExistentes.map(p => p.texto.toLowerCase());

        // Filtrar apenas as novas palavras que ainda não existem
        const palavrasParaInserir = novasPalavrasNivel4.filter(palavra =>
            !textosExistentes.includes(palavra.texto.toLowerCase())
        );

        if (palavrasParaInserir.length === 0) {
            console.log('ℹ️ Todas as novas palavras já existem no banco!');
            return;
        }

        // Inserir apenas as novas palavras
        console.log(`Inserindo ${palavrasParaInserir.length} novas palavras no banco...`);
        const resultado = await collection.insertMany(palavrasParaInserir);

        console.log(`✅ ${resultado.insertedCount} palavras inseridas com sucesso!`);
        palavrasParaInserir.forEach(palavra => {
            console.log(`- ${palavra.texto} (Nível ${palavra.nivel}) - Imagem: ${palavra.imagem}`);
        });

        // Exibir total atualizado
        const total = await collection.countDocuments({ nivel: 4 });
        console.log(`\n📊 Total de palavras no nível 4: ${total}`);

    } catch (error) {
        console.error('❌ Erro ao adicionar palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Executar o script
if (require.main === module) {
    adicionarMaisPalavrasNivel4();
}

module.exports = { adicionarMaisPalavrasNivel4 }; 