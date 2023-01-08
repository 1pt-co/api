import geoip from "geoip-lite";
import query from "./helpers/db.js";
import generateRandomString from "./helpers/generateRandomString.js";
import isHarmful from "./helpers/safebrowsing.js"
import urlExists from "./helpers/urlExists.js";

export const getURL = async (req, res) => {
    const data = await query(`SELECT long_url FROM 1pt WHERE short_url = '${req.query.url}' LIMIT 1`); 

    if (data) {
        res.status(301).send({
            url: data.long_url
        })

        await query(`UPDATE 1pt SET hits=hits+1 WHERE short_url='${req.query.url}'`)
    } else {        
        res.status(404).send({
            message: "URL doesn't exist!"
        })
    }
}

export const getInfo = async (req, res) => {
    const data = await query(`SELECT long_url, timestamp, hits, ip FROM 1pt WHERE short_url = '${req.query.url}' LIMIT 1`);

    if (data) {
        res.status(200).send({
            short: req.query.url,
            long: data?.long_url,
            date: data?.timestamp,
            hits: data?.hits,
            country: geoip.lookup(data?.ip)?.country,
            malicious: await isHarmful(data.long_url)
        })
    } else {
        res.status(404).send({
            message: "URL doesn't exist!"
        })
    }
}

export const addURL = async (req, res, logger) => {
    const long = req.query.long;
    const requestedShort = req.query.short;
    const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress;

    let short;

    if (!requestedShort || await urlExists(requestedShort)) {
        short = await generateRandomString(5);
    } else {
        short = requestedShort
    }

    logger.info(`Inserting ${short} -> ${long}`);

    await query(`INSERT INTO 1pt (short_url, long_url, ip) VALUES ('${short}', '${long}', '${ipAddress}')`);

    res.status(201).send({
        message: "Added!", 
        short: short, 
        long: long
    })
}