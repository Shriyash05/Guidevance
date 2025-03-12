import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || "";
const client = new MongoClient(MONGO_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

export { client, connectDB };
