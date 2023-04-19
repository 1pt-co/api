import geoip from "geoip-lite";
import query from "./helpers/db.js";
import generateRandomString from "./helpers/generateRandomString.js";
import isHarmful from "./helpers/safebrowsing.js"
import urlExists from "./helpers/urlExists.js";
import verifyToken from "./helpers/verifyToken.js";

export const getURL = async (req, res) => {
    const data = (await query(`SELECT long_url FROM 1pt WHERE short_url = '${req.query.url}' LIMIT 1`))[0]; 

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
    const data = (await query(`SELECT long_url, timestamp, hits, ip FROM 1pt WHERE short_url = '${req.query.url}' LIMIT 1`))[0];

    const malicious = await isHarmful(data.long_url)
    
    // a local IP would result in a null lookup result, and
    // if data.ip is a local IP, then it must have originated from the same network as the server
    // since the API is hosted on uwaterloo's servers, this must mean it originated from Waterloo, Canada
    const country = geoip.lookup(data?.ip)?.country || "CA"

    if (data) {
        res.status(200).send({
            short: req.query.url,
            long: data?.long_url,
            date: data?.timestamp,
            hits: data?.hits,
            country: country,
            malicious: malicious
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
    const ipAddress = req.ip;

    if (long === undefined || long === "") {
        res.status(400).send({
            message: "Bad request", 
        })

        return;
    } 

    let short;

    if (!requestedShort || await urlExists(requestedShort)) {
        short = await generateRandomString(5);
    } else {
        short = requestedShort
    }

    const auth = req.get("Authorization")

    if(auth) {
        try {
            const user = await verifyToken(auth.split(" ")[1]);
            const email = user.email;

            await query(`INSERT INTO 1pt (short_url, long_url, ip, email) VALUES ('${short}', '${long}', '${ipAddress}', '${email}')`);

        } catch {
            res.status(401).send({
                message: "Unauthorized", 
            })

            return
        }

    } else {
        await query(`INSERT INTO 1pt (short_url, long_url, ip) VALUES ('${short}', '${long}', '${ipAddress}')`);
    }

    logger.info(`Inserting ${short} -> ${long}`);

    res.status(201).send({
        message: "Added!", 
        short: short, 
        long: long
    })
}

export const getProfileInfo = async (req, res) => {
    const auth = req.get("Authorization")

    if (!auth) {
        console.log("no auth")
        res.status(401).send()
        return
    }

    const user = await verifyToken(auth.split(" ")[1]);
    const email = user.email;
    const data = await query(`SELECT short_url, long_url, timestamp, hits, ip, email FROM 1pt WHERE email = '${email}' ORDER BY timestamp DESC`);

    res.status(200).send(data)
}


export const redirect = async (req, res) => {
    const data = (await query(`SELECT long_url FROM 1pt WHERE short_url = '${req.params.shortCode}' LIMIT 1`))[0];

    if (data) {
        res.status(301).redirect(data.long_url)
    } else {
        res.status(404).redirect('/')
    }
}
