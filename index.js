import express from "express";
import helmet from "helmet";
import cors from "cors";
import winston from "winston"
import { addURL, getInfo, getProfileInfo, getURL } from "./handleRequests.js";
import safeguard from "./helpers/safeguard.js";

const PORT = 8000;

const logger = winston.createLogger({
    level: "info", 
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "info.log" }),
    ],
})

const app = express();
app.use(helmet())
app.use(cors())
app.set("trust proxy", true)

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the 1pt.co API! Read the docs at github.com/1pt-co/1pt");
});

app.get("/getURL", (req, res) => safeguard(getURL, logger, req, res));

app.get("/getInfo", (req, res) => safeguard(getInfo, logger, req, res));

app.post("/addURL", (req, res) => safeguard(addURL, logger, req, res));

app.get("/getProfileInfo", getProfileInfo);

app.listen(
    PORT, 
    () => console.log(`1pt API running on http://localhost:${PORT}`)
)
