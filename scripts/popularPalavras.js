const { connect } = require('../dao/mongoConnection');
const path = require('path');

// Função para adicionar apenas palavras novas 
async function adicionarNovasPalavras() {
    try {
        console.log('Conectando ao MongoDB...');
        const db = await connect();
        const collection = db.collection('palavras');

        // Dados das palavras (Nível 2 - 7 letras) - COMENTADO
        /*
        const novasPalavras = [
            {
                texto: "morango",
                nivel: 2,
                dica: "Fruta vermelha com sementes por fora",
                silabas: ["mo", "ran", "go"],
                imagem: "/images/morango.png"
            },
            {
                texto: "caderno",
                nivel: 2,
                dica: "Usado para escrever na escola",
                silabas: ["ca", "der", "no"],
                imagem: "/images/caderno.png"
            },
            {
                texto: "camiseta",
                nivel: 2,
                dica: "Roupa usada na parte de cima do corpo",
                silabas: ["ca", "mi", "se", "ta"],
                imagem: "/images/camiseta.png"
            },
            {
                texto: "meninas",
                nivel: 2,
                dica: "Plural de menina",
                silabas: ["me", "ni", "nas"],
                imagem: "/images/meninas.png"
            },
            {
                texto: "garrafa",
                nivel: 2,
                dica: "Usada para armazenar líquidos",
                silabas: ["gar", "ra", "fa"],
                imagem: "/images/garrafa.png"
            },
            {
                texto: "telefone",
                nivel: 2,
                dica: "Aparelho usado para ligações",
                silabas: ["te", "le", "fo", "ne"],
                imagem: "/images/telefone.png"
            },
            {
                texto: "pipocas",
                nivel: 2,
                dica: "Comida popular no cinema",
                silabas: ["pi", "po", "cas"],
                imagem: "/images/pipocas.png"
            }
        ];
        */

        // Dados das palavras (Nível 3 - 10 letras)
        const novasPalavrasNivel3 = [
            {
                texto: "abacateiro",
                nivel: 3,
                dica: "Árvore que produz abacate",
                silabas: ["a", "ba", "ca", "tei", "ro"],
                imagem: "/images/abacateiro.png"
            },
            {
                texto: "passadeira",
                nivel: 3,
                dica: "Tapete comprido ou quem passa roupa",
                silabas: ["pas", "sa", "dei", "ra"],
                imagem: "/images/passadeira.png"
            },
            {
                texto: "girasol",
                nivel: 2,
                dica: "Flor que gira em direção ao sol",
                silabas: ["gi", "ras", "sol"],
                imagem: "/images/girasol.png"
            },
            {
                texto: "cavalheiro",
                nivel: 3,
                dica: "Homem educado e cortês",
                silabas: ["ca", "val", "hei", "ro"],
                imagem: "/images/cavalheiro.png"
            },
            {
                texto: "brincadeira",
                nivel: 3,
                dica: "Atividade lúdica de crianças",
                silabas: ["brin", "ca", "dei", "ra"],
                imagem: "/images/brincadeira.png"
            },
            {
                texto: "computador",
                nivel: 3,
                dica: "Máquina usada para processar dados",
                silabas: ["com", "pu", "ta", "dor"],
                imagem: "/images/computador.png"
            },
            {
                texto: "futebolista",
                nivel: 3,
                dica: "Pessoa que joga futebol",
                silabas: ["fu", "te", "bo", "lis", "ta"],
                imagem: "/images/futebolista.png"
            },
            {
                texto: "caminhantes",
                nivel: 3,
                dica: "Pessoas que caminham",
                silabas: ["ca", "mi", "nhan", "tes"],
                imagem: "/images/caminhantes.png"
            },
            {
                texto: "paralelepípedo",
                nivel: 4,
                dica: "Pedra usada em calçamento",
                silabas: ["pa", "ra", "le", "le", "pí", "pe", "do"],
                imagem: "/images/paralelepipedo.png"
            },
            {
                texto: "telefonema",
                nivel: 3,
                dica: "Ato de telefonar para alguém",
                silabas: ["te", "le", "fo", "ne", "ma"],
                imagem: "/images/telefonema.png"
            },
            {
                texto: "aniversario",
                nivel: 3,
                dica: "Data em que se comemora o nascimento",
                silabas: ["a", "ni", "ver", "sa", "ri", "o"],
                imagem: "/images/aniversario.png"
            },
            {
                texto: "bibliotecaria",
                nivel: 4,
                dica: "Profissional que trabalha em biblioteca",
                silabas: ["bi", "bli", "o", "te", "ca", "ria"],
                imagem: "/images/bibliotecaria.png"
            },
            {
                texto: "eletricista",
                nivel: 3,
                dica: "Profissional que trabalha com eletricidade",
                silabas: ["e", "le", "tri", "cis", "ta"],
                imagem: "/images/eletricista.png"
            },
            {
                texto: "matemático",
                nivel: 3,
                dica: "Especialista em matemática",
                silabas: ["ma", "te", "má", "ti", "co"],
                imagem: "/images/matematico.png"
            },
            {
                texto: "jornalista",
                nivel: 3,
                dica: "Profissional que trabalha com notícias",
                silabas: ["jor", "na", "lis", "ta"],
                imagem: "/images/jornalista.png"
            }
        ];

        // Verificar palavras que já existem
        const palavrasExistentes = await collection.find({}).toArray();
        const textosExistentes = palavrasExistentes.map(p => p.texto);

        // Filtrar apenas palavras que não existem
        const palavrasParaInserir = novasPalavrasNivel3.filter(palavra =>
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
    // Sempre adiciona novas palavras ao rodar o script
    adicionarNovasPalavras();
}

module.exports = { adicionarNovasPalavras }; 