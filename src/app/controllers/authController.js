const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../../config/auth');

const User = require('../models/User')

const router = express.Router();

//Realiza a autenticação do usuário via JWT, gerando um Token a cada Login
function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

//Rota de registro do usuário
router.post('/register', async (req, res) => {
    const { email } = req.body;

    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'Este email já está cadastrado'});
            //Mensagem de erro caso o email já tenha sido utilizado em um cadastro anterior
        
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Falha no registro' });
    } 
});

//Rota de autenticação/Login de Usuário
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    //Verifica se a senha informada corresponde ao usuário
    const user = await User.findOne({ email }).select('+password');

    if(!user)
        return res.status(400).send({ error: 'Usuário não encontrado' });
    
    //compara se a senha usada no Login corresponde a senha cadastrada no banco de dados e retorna um erro caso a senha esteja errada
    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Senha Incorreta' });    

    user.password = undefined; 

    res.send({ 
        user, 
        token: generateToken({ id: user.id }),
    })
});

router.post('/forgot_password', async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne( { email } );
    
        if(!user)
            return res.status(400).send( {error: 'Usuário não encontrado'} );

        //gera um token usando o próprio crypto do Node que expira em 1 hora
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
           '$set': {
               passwordResetToken: token,
               passwordResetExpires: now,
           } 
        });

        console.log(token, now);

    } catch (err) {
        res.status(400).send({ error: 'Erro, tente novamente' });
    }
})

module.exports = app => app.use('/auth', router);