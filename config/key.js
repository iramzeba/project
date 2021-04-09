
const MongoClient = require('mongodb').MongoClient,
url = "mongodb://localhost:27017/",
DATABASE_NAME = "users";
MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("customers");
    console.log("Connected to the `" + DATABASE_NAME + "`!");
  });
  

module.exports = MongoClient;