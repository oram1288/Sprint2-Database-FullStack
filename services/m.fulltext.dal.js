const { ObjectId } = require("mongodb");
const dal = require("./m.db");

async function createTextIndex(collection) {
  try {
    // Create a text index on the 'title' and 'description' fields
    const result = await collection.createIndex(
      { title: "text", description: "text", genre: "text" }, // Add fields you want to search
      { weights: { title: 3, description: 2, genre: 1 } } // Optionally, assign weights
    );

    console.log("Text index created:", result);
  } catch (err) {
    console.error("Error creating text index:", err);
  }
}

async function getFullText(fulltext) {
  if (DEBUG) console.log("mongo.dal.getFullText()");
  try {
    await dal.connect();
    const database = dal.db("Sprint2");
    const collection = database.collection("movies");
    await createTextIndex(collection);
    const result = await collection
      .find({ $text: { $search: fulltext } })
      .toArray();
    return result;
  } catch (err) {
    console.error("Error occurred while trying to connect to MongoDB:", err);
    throw err;
  } finally {
    dal.close();
  }
}

module.exports = {
  getFullText,
};
