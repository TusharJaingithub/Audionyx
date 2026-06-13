const jwt = require("jsonwebtoken");

async function authArtist(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.role !== "artist"){
            return res.status(403).json({message:"You don't have permission to perform this action"})
        }
        req.user= decoded;      
        next();
    }catch(err){
        return res.status(403).json({message:"You don't have permission to perform this action"})

    }
}
async function authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // if(decoded.role !== "user"){
        //     return res.status(403).json({message:"You don't have permission to perform this action"})
        // }
        req.user= decoded;      
        next();
    }catch(err){
        return res.status(403).json({message:"You don't have permission to perform this action"})

    }
}

module.exports ={authArtist,authUser}
