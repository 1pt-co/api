import urlExists from "./urlExists.js";

const generateRandomString = async n => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let randomString = "";

    for (let i = 0; i < n; i++) {
        randomString += chars[Math.floor(Math.random()*chars.length)]
    }

    const exists = await urlExists(randomString);

    if (exists) { 
        randomString = await generateRandomString(n)
    }

    return randomString
}

export default generateRandomString;