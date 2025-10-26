require('dotenv').config();
const { MongoClient } = require('mongodb');

// Certifique-se de que a variável do Render se chama MONGODB_URI
const url = process.env.MONGODB_URI; 
// E que a variável DB_NAME no Render contém apenas o nome do banco
const dbName = process.env.DB_NAME; 

console.log("Todas as variáveis de ambiente:");
console.log("MONGODB_URI:", url ? "Definida" : "Não Definida"); // Evita mostrar a string completa no log
console.log("DB_NAME:", dbName);

let db = null;

async function connect() {
    if (db) return db;
    if (!url) {
        console.error("❌ MONGODB_URI não está definida! Verifique as variáveis de ambiente do Render.");
        // Não use process.exit(1) em um módulo, a menos que seja estritamente necessário no ponto de entrada.
        // É melhor lançar um erro.
        throw new Error("MONGODB_URI é obrigatória para a conexão com o banco de dados.");
    }
    
    // O MongoClient usa a URL e o método client.db(dbName) especifica a base de dados
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        console.log("🔗 Conexão estabelecida com sucesso.");
        db = client.db(dbName);
        console.log(`✅ Conectado ao banco ${dbName}`);
        return db;
    } catch (error) {
        console.error("❌ Erro ao conectar ao MongoDB Atlas:", error.message);
        throw error;
    }
}

module.exports = { connect };
