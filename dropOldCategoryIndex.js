require("dotenv").config();
const mongoose = require("mongoose");

async function dropOldIndex() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("categories");

    console.log("\n=== Current indexes ===");
    const currentIndexes = await collection.indexes();
    currentIndexes.forEach((index) => {
      console.log(`- ${index.name}:`, JSON.stringify(index.key));
    });

    console.log("\n=== Dropping slug_1 index ===");
    try {
      await collection.dropIndex("slug_1");
      console.log("✓ Successfully dropped slug_1 index");
    } catch (err) {
      if (err.code === 27) {
        console.log("✓ Index slug_1 does not exist (already dropped)");
      } else {
        console.log("✗ Error:", err.message);
      }
    }

    console.log("\n=== Creating composite index ===");
    try {
      await collection.createIndex({ slug: 1, parent: 1 }, { unique: true });
      console.log(
        "✓ Successfully created composite index { slug: 1, parent: 1 }"
      );
    } catch (err) {
      console.log("Note:", err.message);
    }

    console.log("\n=== Updated indexes ===");
    const updatedIndexes = await collection.indexes();
    updatedIndexes.forEach((index) => {
      console.log(`- ${index.name}:`, JSON.stringify(index.key));
    });

    console.log("\n✓ Index migration complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

dropOldIndex();
