require("dotenv").config();
const app = require("./src/app")
const connectDB = require("./src/db/db");

connectDB();

PORT = process.env.PORT||"";

app.listen(PORT,()=>{
    console.log("Server is running on port 3000");
})