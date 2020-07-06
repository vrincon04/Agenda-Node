const Router = require('express').Router();
const UserSchema = require('../models').User;

Router.get('/', (req, res) => {
    UserSchema.find((err, users) => {
        if (err)
            return res.status(500).send({
                error: true, 
                message: `Conexion error. \n ${err}`
            });

        return res.status(200).send({
            error: false,
            message: "Success!",
            data: users
        });
    });
});

Router.get('/:id', (req, res) => {
    let params = req.params;
    UserSchema.findById(params.id, (err, user) => {
        if (err)
            return res.status(500).send({ 
                error: true, 
                message: `Conexion error. \n ${err}`
            });
        else if (!user)
            return res.status(404).send({ 
                error: true, 
                message: `User not found. \n ${err}`
            });
        
        return res.status(200).send({
            error: false,
            message: "Success!",
            data: user
        });
    });
});

Router.post('/login', (req, res) => {
    let body = req.body;
    UserSchema.signIn(body.username, body.password)
        .then( (user) => {
            req.session.user = {
                id: user._id,
                username: user.username
            };
            console.info('Session data', req.session);
            return res.status(200).send({
                error: false,
                message: "Success!",
                data: user
            });
        })
        .catch( (err) => {
            console.error(err);
            return res.status(500).send({ 
                error: true, 
                message: ` error. \n ${err}`
            });
        });
});

Router.post('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if (err)
            return res
                .status()
                .send({
                    error: true,
                    message: err
                });

        req.session = null;
        return res
            .status(200)
            .send({
                error: false,
                message: 'logout success!'
            })
            .end();
    });
});

module.exports  = Router;