import sql from "./db.js";

export default async url => 
    new Promise((resolve, reject) => {
        sql.query(`SELECT 1 FROM 1pt WHERE short_url = '${url}'`, (err, rows, fields) => {
            if (err) throw err // reject(err) ?
            const data = rows[0];
            resolve(Boolean(data));
        })
    })