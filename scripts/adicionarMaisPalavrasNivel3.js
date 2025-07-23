const { connect } = require('../dao/mongoConnection');

// Novas palavras para o nível 3
const novasPalavrasNivel3 = [
    {
        texto: "cientista",
        nivel: 3,
        dica: "Pessoa que faz pesquisas e experimentos",
        silabas: ["ci", "en", "tis", "ta"],
        imagem: "/images/cientista.png"
    },
    {
        texto: "montanhista",
        nivel: 3,
        dica: "Pessoa que escala montanhas",
        silabas: ["mon", "ta", "nhis", "ta"],
        imagem: "/images/montanhista.png"
    }
];

async function adicionarMaisPalavrasNivel3() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Buscar palavras já existentes
        const palavrasExistentes = await collection.find({ nivel: 3 }).toArray();
        const textosExistentes = palavrasExistentes.map(p => p.texto.toLowerCase());

        // Filtrar apenas as novas palavras que ainda não existem
        const palavrasParaInserir = novasPalavrasNivel3.filter(palavra =>
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
        const total = await collection.countDocuments({ nivel: 3 });
        console.log(`\n📊 Total de palavras no nível 3: ${total}`);

    } catch (error) {
        console.error('❌ Erro ao adicionar palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Executar o script
if (require.main === module) {
    adicionarMaisPalavrasNivel3();
}

module.exports = { adicionarMaisPalavrasNivel3 }; 