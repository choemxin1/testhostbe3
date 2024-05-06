const { Sequelize } = require('sequelize');
require('dotenv').config();

//chạy ở mạng
// Option 2: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD
    ,
    
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false,
        dialectOptions: 
            process.env.DB_SSL = 'true' ?
            {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        ,
        query: {
            "raw": true
        },
        timezone: "+07:00"
    }
);
//chỉ chậy ở localhost
// const sequelize = new Sequelize('testlocal', 'root', null, {
//     host: 'localhost',
//     dialect: 'mysql',
//     logging : false 
//   });
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
module.exports = connectDB;
