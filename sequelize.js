const Sequelize = require('sequelize')
const OTPModel = require('./models/OTP')

const sequelize = new Sequelize(process.env['DB_NAME'], process.env['DB_USER'], process.env['DB_PASSWORD'], {
    host: process.env['DB_HOST'],
    dialect: 'mysql',
    protocol: 'mysql',
    port: process.env['DB_PORT'],
    dialectOptions: {
        "ssl": {
            "require": true,
            "rejectUnauthorized": false
        }
    },
    define: {
        timestamps: false
    },
    pool: {
        max: 20,
        min: 0,
        idle: 5000
    },
    logging:false
});

const OTP = OTPModel(sequelize, Sequelize);

sequelize.sync().then(() => {
    console.log('DB created, Table Created')
})

module.exports = {OTP};