const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost: 27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'test';

async function main() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('restaurants');

    // Example query to fetch all restaurants in Manhattan
    const query = { borough: 'Manhattan' };
    const restaurants = await collection.find(query).toArray();
    console.log(restaurants);

  } finally {
    await client.close();
  }
}

main().catch(console.error);
