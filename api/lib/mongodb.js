const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

function getMongoUri() {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const envPaths = [
    path.join(process.cwd(), 'keys', '.env'),
    path.join(process.cwd(), 'keys', '.env.local'),
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '..', 'keys', '.env'),
    path.join(__dirname, '..', '..', '.env')
  ];

  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        const match = content.match(/^MONGODB_URI\s*=\s*["']?([^\r\n"']+)["']?/m);
        if (match && match[1]) {
          process.env.MONGODB_URI = match[1].trim();
          return process.env.MONGODB_URI;
        }
      } catch (_) {}
    }
  }
  return null;
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000
  });

  await client.connect();
  const db = client.db('myportfolio');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase, getMongoUri };
