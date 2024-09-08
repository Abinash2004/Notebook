const mongoose = require('mongoose');
const monURI = "mongodb://127.0.0.1:27017/notebook?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.12";

const connectToMongo = async () => {
    await mongoose.connect(monURI).then(() => {
        console.log("Connected to MongoDB Successfully");
    });
}

module.exports = connectToMongo;