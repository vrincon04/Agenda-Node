const config = {
    port: process.env.PORT || 3000,

    env: process.env.NODE_ENV || 'development',
  
    mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/agenda',

    SESSION_NAME: process.env.SESSION_NAME || 'agenda_session',

    SESSION_LIFETIME: process.env.SESSION_LIFETIME || 1000 * 60 * 60 * 2,

    SESSION_SECRET: process.env.SESSION_SECRET || 'secret'
  };
  
module.exports = config;