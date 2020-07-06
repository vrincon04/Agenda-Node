const { response } = require('express');
const { remove } = require('../models/user');

const Router = require('express').Router();
const EventSchema = require('../models').Event;

Router.get('/', (req, res) => {
    req.session.reload( (err) => {
        if (err)
            return res
                .status(401)
                .send({
                    error: true,
                    message: 'Unauthorized'
                })
                .end();
        
        EventSchema
        .list({ criteria: { userId: req.session.user.id }, page: 0, limit: 30 })
        .then( (events) => {
            return res.status(200).send({
                error: false,
                message: "Success!",
                data: events
            });
        }).catch( (err) => {
            return res.status(500).send({
                error: true, 
                message: `Error. \n ${err}`
            });
        }); 
    });
});

Router.post('/', (req, res) => {
    let body = req.body;
    
    req.session.reload( (err) => {
        if (err)
            return res
                .status(401)
                .send({
                    error: true,
                    message: 'Unauthorized'
                })
                .end();

        let event = new EventSchema({
            userId: req.session.user.id,
            title: body.title,
            start: body.start,
            end: body.end
        });

        event.save( (err, doc) => {
            if (err)
                return res
                    .status(412)
                    .send({
                        error: true,
                        message: err
                    });
            
            return res
                .status(201)
                .send({
                    error: false,
                    message: "Success!",
                    data: doc
                }); 
        });
    });
});

Router.put('/:id', (req, res) => {
    let params = req.params;
    let body = req.body;
    req.session.reload( (err) => {
        if (err)
            return res
                .status(401)
                .send({
                    error: true,
                    message: 'Unauthorized'
                })
                .end();
        
        EventSchema.findById(params.id, (err, event) => {
            if (err)
                return res
                    .status(404)
                    .send({
                        error: true,
                        message: 'Not fount'
                    })
                    .end();

            event.start = body.start;
            event.end = body.end;
            event.save( (err) => {
                if(err)
                    return res
                        .status(500)
                        .send({
                            error: true,
                            message: err
                        });

                return res
                    .status(200)
                    .send({
                        error: false,
                        message: 'Update success',
                        data: event
                    });
            });
        });
    });
});

Router.delete('/:id', (req, res) => {
    let params = req.params;

    req.session.reload( (err) => {
        if (err)
            return res
                .status(401)
                .send({
                    error: true,
                    message: 'Unauthorized'
                })
                .end();

        EventSchema.findById(params.id, (err, event) => {
            if (err)
                return res
                    .status(404)
                    .send({
                        error: true,
                        message: 'Not fount'
                    })
                    .end();
            event.remove( (err) => {
                if(err)
                    return res
                        .status(500)
                        .send({
                            error: true,
                            message: err
                        });

                return res
                    .status(200)
                    .send({
                        error: false,
                        message: 'Delete success',
                        data: event
                    });
            });
        });
    });
});

module.exports = Router;