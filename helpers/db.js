import mysql from "mysql";
import config from "../config.js";

var connection = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    multipleStatements: true
});

export default connection;