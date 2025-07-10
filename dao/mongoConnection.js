const { MongoClient } = require('mongodb');

//const url = 'mongodb://localhost:27017';
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'alfa_db'; // Nome do banco de dados

let db = null;

async function connect() {
    if (db) return db;
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    return db;
}

module.exports = { connect }; 