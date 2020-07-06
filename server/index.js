const app = require('./app');
const config = require('./config');
const mongoose = require('mongoose');

console.info('>> Init Mongo DB...');
mongoose.connect(config.mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err, res) => {
        if (err)
            return console.error(`Error: \n ${err}`);
        

        console.info(`>> Mongo DB is running`);
        console.info(">> Init server...");

        app.listen(config.port, () => {
            console.info(`>> Escuchando en http://localhost:${config.port}`);
        });
    }
);