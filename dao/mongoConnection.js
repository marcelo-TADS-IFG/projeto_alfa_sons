require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let db = null;

async function connect() {
    if (db) return db;
    console.log("📡 URL recebida:", url); // <-- adicione esta linha temporária
    const client = new MongoClient(url);
    await client.connect();
    console.log("🔗 Conectado a:", client.s.url);
    db = client.db(dbName);
    console.log(`✅ Conectado ao banco ${dbName}`);
    return db;
}

module.exports = { connect };
