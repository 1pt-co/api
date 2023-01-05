import express from "express";
import helmet from "helmet";
import cors from "cors";
import { addURL, getInfo, getURL } from "./handleRequests.js";

const PORT = 8000;

const app = express();
app.use(helmet())

app.use(cors())

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the 1pt.co API! Read the docs at github.com/1pt-co/1pt");
});

app.get("/getURL", getURL);

app.get("/getInfo", getInfo);

app.post("/addURL", addURL);

app.listen(
    PORT, 
    () => console.log(`1pt API running on http://localhost:${PORT}`)
)
