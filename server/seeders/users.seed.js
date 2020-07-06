const User = require('../models').User;
const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

let users = [
    new User({
        username: 'vrincon',
        email: 'vrinconaquino@gmail.com',
        password: 'secret'
    })
];
let done = 0;

console.info('>> Start users seed.');

for (let index = 0; index < users.length; index++) {
    console.log(users[index]);
    users[index].save( (err, document) => {
        done++;
        if (done === users.length)
            mongoose.disconnect();
    });
}

console.info('>> End users seed.');