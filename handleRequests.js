import sql from "./helpers/db.js";
import generateRandomString from "./helpers/generateRandomString.js";
import isHarmful from "./helpers/safebrowsing.js"
import urlExists from "./helpers/urlExists.js";

export const getURL = (req, res) => {
    sql.query(`SELECT long_url FROM 1pt WHERE short_url = '${req.query.url}' LIMIT 1`, (err, rows, fields) => {
        if (err) throw err

        const data = rows[0];

        if (!data) {
            res.status(404).send({
                message: "URL doesn't exist!"
            })

            return;
        } 
        
        res.status(301).send({
            url: data.long_url
        })
    })
    
    sql.query(`UPDATE 1pt SET hits=hits+1 WHERE short_url='${req.query.url}'`)
}

export const getInfo = (req, res) => {
    sql.query(`SELECT long_url, timestamp, hits FROM 1pt WHERE short_url = '${req.query.url}' LIMIT 1`, async (err, rows, fields) => {
        if (err) throw err

        const data = rows[0];

        if (!data) {
            res.status(404).send({
                message: "URL doesn't exist!"
            })

            return;
        } 

        res.status(200).send({
            short: req.query.url,
            long: data?.long_url,
            date: data?.timestamp,
            hits: data?.hits,
            malicious: await isHarmful(data.long_url)
        })
    })
}

export const addURL = async (req, res) => {
    const long = req.query.long;
    const requestedShort = req.query.short;
    let short;

    if (!requestedShort || await urlExists(requestedShort)) {
        short = await generateRandomString(5);
    } else {
        short = requestedShort
    }

    console.log(`Inserting ${short} -> ${long}`);

    sql.query(`INSERT INTO 1pt (short_url, long_url) VALUES ('${short}', '${long}')`, () => {
        res.status(201).send({
            message: "Added!", 
            short: short, 
            long: long
        })
    })
}