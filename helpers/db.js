import mysql from "mysql";
import config from "../config.js";

const connection = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
});

const query = async sql => new Promise((resolve, reject) => {
    connection.query(sql, (err, rows, fields) => {
        if (err) reject(err)
        else resolve(rows)
    })
})

export default query;