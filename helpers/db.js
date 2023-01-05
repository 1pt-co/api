import mysql from "mysql";
import config from "../config.js";

const connection = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    multipleStatements: true
});

const query = async sql => new Promise((resolve, reject) => {
    connection.query(sql, (err, rows, fields) => {
        if (err) reject(err)
        else resolve(rows[0])
    })
})

export default query;