//intercepta a requisição entre o controller e a rota
//verifica se o req e res são válidos
//valida o token de autenticação
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    //verifica se o token foi informado
    if(!authHeader)
        return res.status(401).send({ error: 'O Token não foi informado' });

        // formato do token:Bearer + hash
    const parts = authHeader.split(' ');

        //verifica se o token tem as duas partes (bearer + hash)
    if(!parts.length === 2)
        return res.status(401).send({ error: 'Token error'});
        
        // Faz a desestruturação das duas partes
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Tokem mal formatado' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token inválido'});

        req.userId = decoded.id;
        return next();
    });

};