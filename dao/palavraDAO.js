const { connect } = require('./mongoConnection');
const { ObjectId } = require('mongodb');

async function buscarTodas() {
  const db = await connect();
  return db.collection('palavras').find().toArray();
}

async function buscarPorNivel(nivel) {
  const db = await connect();
  return db.collection('palavras').find({ nivel }).toArray();
}

async function buscarAleatoriaPorNivel(nivel) {
  const db = await connect();
  const palavras = await db.collection('palavras').find({ nivel }).toArray();
  if (palavras.length === 0) return null;
  const idx = Math.floor(Math.random() * palavras.length);
  return palavras[idx];
}

async function criar(palavra) {
  const db = await connect();
  const result = await db.collection('palavras').insertOne(palavra);
  return { _id: result.insertedId, ...palavra };
}


async function atualizar(id, dados) {
  const db = await connect();
  await db.collection('palavras').updateOne(
    { _id: new ObjectId(id) },
    { $set: dados }
  );
  return db.collection('palavras').findOne({ _id: new ObjectId(id) });
}

/*
async function atualizar(id, dados) {
  const db = await connect();
  const result = await db.collection("palavras").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: dados },
    { returnDocument: "after" }
  );
  return result.value; // retorna o objeto atualizado
}*/

async function deletar(id) {
  const db = await connect();
  const result = await db.collection('palavras').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  buscarTodas,
  buscarPorNivel,
  buscarAleatoriaPorNivel,
  criar,
  atualizar,
  deletar
}; 