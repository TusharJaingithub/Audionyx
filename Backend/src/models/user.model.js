const mongoose = require("mongoose")



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"Please enter a valid email address"],
    },
    password:{
        type:String,
        required:true,
        minlength:[8,"Password must be at least 8 characters long"],
    },
    role:{
        type:String,
        enum:["user","artist"],
        default:"user",
    }
},{ timestamps:true })

const userModel = mongoose.model("user",userSchema);

module.exports=userModel;
