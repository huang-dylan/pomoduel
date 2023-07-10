import { MongoClient } from "mongodb";

let db;

async function connectToDb(cb) {
    // Standard code to connect to MongoClient
    const client = new MongoClient(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ovlx1be.mongodb.net/?retryWrites=true&w=majority`);
    await client.connect();

    db = client.db('react-blog-db');
    cb();
}

export {
    db,
    connectToDb,
}