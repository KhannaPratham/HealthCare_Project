const jwt = require('jsonwebtoken');
const generateJwtToken=(userdata)=>{
    return jwt.sign(userdata,process.env.Private_key,
        {expiresIn:80000}
    )
}
const validateJwtToken= (req,res,next)=>{
    const authCheck=req.headers.authorization;
    if(!authCheck) return res.status(401).json
    ({err:'TOKEN NOT AVAKIABLE'});
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try{
        const token=req.headers.authorization.
    split(' ')[1];
        const validateToken = jwt.verify(token,process.env.Private_key);
        req.user=validateToken;
        next();

    }catch (error){
        console.error(error);
        res.status(401);
        throw new error("Not authorization ,token falied")
    }}else{
        res.status(401);
        throw new error("Not authorization ,token falied")
    }


}

module.exports={generateJwtToken,validateJwtToken}