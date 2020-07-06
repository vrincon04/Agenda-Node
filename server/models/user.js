const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z0-9]+$/, 'Please fill a valid username'], 
        index: true
    },
    email: { 
        type: String, 
        lowercase: true, 
        unique: true, 
        required: [true, "can't be blank"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'], 
        index: true
    },
    hashedPassword: { 
        type: String, 
        default: '' 
    },
    salt: { 
        type: String, 
        default: '' 
    },
}, { 
    timestamps: true,
    toJSON: {
        versionKey: false,
        transform(doc, ret) {
            delete ret.hashedPassword;
            delete ret.salt;
        }
    }
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.constructor.generateSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
    .path('hashedPassword')
    .validate(function() {
        if (this._password) {
            if (typeof this._password === 'string' && this._password.length < 6) {
                this.invalidate('password', 'must be at least 6 characters.');
            }
        }

        if (this.isNew && !this._password) {
            this.invalidate('password', 'Password is required');
        }
    });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Methods
 */
UserSchema.methods = {
    authenticate(password) {
        return this.encryptPassword(password) === this.hashedPassword;
    },
    encryptPassword(password) {
        return this.constructor.encryptPasswordWithSalt(password, this.salt);
    }
};

/**
 * Statics
 */
UserSchema.statics = {
    signUp(username, email, password) {
        const User = this;

        const newUser = new User({ username, email, password });

        return newUser.save();
    },
    signIn(username, password) {
        const User = this;

        return User.load({ criteria: { username } })
            .then(user => {
                if (!user) {
                    throw new Error('Wrong username')
                }
                if (!user.authenticate(password)) {
                    throw Error('Incorrect password')
                }
                return user;
            });
    },

    encryptPasswordWithSalt(password, salt) {
        if (!password) {
            return '';
        }

        try {
            return crypto
                .createHmac('sha1', salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    generateSalt() {
        return `${Math.round(new Date().valueOf() * Math.random())}`;
    },

    load({ criteria, select } = {}) {
        return this.findOne(criteria)
            .select(select)
            .exec();
    },
};

module.exports = mongoose.model('User', UserSchema);