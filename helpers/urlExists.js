import sql from "./db.js";

export default async url => {
    sql.query(`SELECT 1 FROM 1pt WHERE short_url = '${url}'`, (err, rows, fields) => {
        if (err) throw err
        const data = rows[0];
        return (Boolean(data));
    })
}
