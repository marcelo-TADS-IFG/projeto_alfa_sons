const { connect } = require('../dao/mongoConnection');

// Novas palavras para o nível 5 (todas com 16 letras)
const novasPalavrasNivel5 = [
    {
        texto: "desproporcional",
        nivel: 5,
        dica: "Falta de proporção",
        silabas: ["des", "pro", "por", "cio", "nal",],
        imagem: "/images/desproporcional.png"
    },
    {
        texto: "autodeterminacao",
        nivel: 5,
        dica: "Capacidade de tomar decisões por conta própria",
        silabas: ["au", "to", "de", "ter", "mi", "na", "ção"],
        imagem: "/images/autodeterminacao.png"
    },
    {
        texto: "incompreensível",
        nivel: 5,
        dica: "Aquilo que não se entende facilmente",
        silabas: ["in", "com", "pre", "en", "sí", "vel"],
        imagem: "/images/incompreensivel.png"
    },
    {
        texto: "liquidificadores",
        nivel: 5,
        dica: "Eletrodomésticos usados para bater alimentos",
        silabas: ["li", "qui", "di", "fi", "ca", "do", "res"],
        imagem: "/images/liquidificadores.png"
    },
    {
        texto: "desencorajamento",
        nivel: 5,
        dica: "Ato de tirar o ânimo de alguém",
        silabas: ["de", "sen", "co", "ra", "ja", "men", "to"],
        imagem: "/images/desencorajamento.png"
    },
    {
        texto: "responsabilidades",
        nivel: 5,
        dica: "Deveres ou obrigações",
        silabas: ["res", "pon", "sa", "bi", "li", "da", "des"],
        imagem: "/images/responsabilidades.png"
    },
    {
        texto: "reconfiguracões",
        nivel: 5,
        dica: "Novas formas de configuração",
        silabas: ["re", "con", "fi", "gu", "ra", "ções"],
        imagem: "/images/reconfiguracoes.png"
    },
    {
        texto: "desenvolvimento",
        nivel: 5,
        dica: "Processo de crescimento ou progresso",
        silabas: ["de", "sen", "vol", "vi", "men", "to"],
        imagem: "/images/desenvolvimento.png"
    },
    {
        texto: "eletroeletrônico",
        nivel: 5,
        dica: "Equipamento que envolve componentes elétricos e eletrônicos",
        silabas: ["e", "le", "tro", "e", "le", "trô", "ni", "co"],
        imagem: "/images/eletroeletronico.png"
    },
    {
        texto: "sustentabilidade",
        nivel: 5,
        dica: "Capacidade de suprir necessidades sem esgotar recursos naturais",
        silabas: ["sus", "ten", "ta", "bi", "li", "da", "de"],
        imagem: "/images/sustentabilidade.png"
    },
    {
        texto: "confraternizacao",
        nivel: 5,
        dica: "Encontro para celebrar com amigos ou colegas",
        silabas: ["con", "fra", "ter", "ni", "za", "ção"],
        imagem: "/images/confraternizacao.png"
    },
    {
        texto: "videoconferência",
        nivel: 5,
        dica: "Reunião feita por vídeo entre pessoas em locais diferentes",
        silabas: ["vi", "de", "o", "con", "fe", "rên", "ci", "a"],
        imagem: "/images/videoconferencia.png"
    },
    {
        texto: "congestionamento",
        nivel: 5,
        dica: "Acúmulo de veículos que causa lentidão no trânsito",
        silabas: ["con", "ges", "ti", "o", "na", "men", "to"],
        imagem: "/images/congestionamento.png"
    },
    {
        texto: "estrategicamente",
        nivel: 5,
        dica: "De maneira planejada e com foco em alcançar objetivos",
        silabas: ["es", "tra", "te", "gi", "ca", "men", "te"],
        imagem: "/images/estrategicamente.png"
    },
    {
        texto: "intercontinental",
        nivel: 5,
        dica: "Que envolve dois ou mais continentes",
        silabas: ["in", "ter", "con", "ti", "nen", "tal"],
        imagem: "/images/intercontinental.png"
    }
];

async function adicionarMaisPalavrasNivel5() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Buscar palavras já existentes
        const palavrasExistentes = await collection.find({ nivel: 5 }).toArray();
        const textosExistentes = palavrasExistentes.map(p => p.texto.toLowerCase());

        // Filtrar apenas as novas palavras que ainda não existem
        const palavrasParaInserir = novasPalavrasNivel5.filter(palavra =>
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
        const total = await collection.countDocuments({ nivel: 5 });
        console.log(`\n📊 Total de palavras no nível 5: ${total}`);

    } catch (error) {
        console.error('❌ Erro ao adicionar palavras:', error);
    } finally {
        process.exit(0);
    }
}

// Executar o script
if (require.main === module) {
    adicionarMaisPalavrasNivel5();
}

module.exports = { adicionarMaisPalavrasNivel5 }; 