const mongoose = require("mongoose");


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to the database successfully");
    }catch(error){
        console.error("Error connecting to the database",error);
    }
}


module.exports = connectDB;