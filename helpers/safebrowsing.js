import got from "got";

export default async url => {
    const data = await got.post("https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyCeb9qkUdAp8UHj3LsCrWfs-L9Fw2sbyv0", {
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