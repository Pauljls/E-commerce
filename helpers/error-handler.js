function errorHandler(err, req,res,next){
    if(err.code == "credentials_required"){
        return res.status(401).json({message : "El usuario no se autorizado"})
    }

    if(err.code == "invalid_token"){
        return res.status(401).json({message : "Token invalidos"})
    }

    return res.status(500).json({message : err})
}
module.exports = errorHandler