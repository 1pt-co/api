import express from "express";
import cors from "cors";
import { addURL, getInfo, getURL } from "./handleRequests.js";

const app = express();
const PORT = 8000;

app.use(cors())

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the 1pt.co API! Read the docs at github.com/1pt-co/1pt");
});

app.get("/getURL", getURL);

app.get("/getInfo", getInfo);

app.get("/addURL", addURL);

app.listen(
    PORT, 
    () => console.log(`1pt API running on http://localhost:${PORT}`)
)
