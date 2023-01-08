import got from "got";
import config from "../config.js";

export default async url => {
    const data = await got.post(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${config.googleSafeBrowsingKey}`, {
        json: {
            "client": {
                "clientId": "1pt.co",
                "clientVersion": "4.0"
            },
            
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "POTENTIALLY_HARMFUL_APPLICATION", "UNWANTED_SOFTWARE"],
                "platformTypes": ["ANY_PLATFORM", "WINDOWS", "LINUX", "OSX", "ALL_PLATFORMS", "CHROME", "ANDROID", "IOS"],
                "threatEntryTypes": ["URL", "IP_RANGE"],
                "threatEntries": {
                    "url": url
                }
            }
        }
    }).json();

    return (Object.keys(data).length !== 0);
}