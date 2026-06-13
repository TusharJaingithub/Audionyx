const mongoose = require("mongoose");


async function connectDB(){
    try{
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing");
        }

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to the database successfully");
    }catch(error){
        console.error("Error connecting to the database",error);
        throw error;
    }
}


module.exports = connectDB;
