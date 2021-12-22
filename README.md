# <img align="center" width="45" src="https://raw.githubusercontent.com/paramt/1pt/master/resources/favicon/android-chrome-512x512.png"> 1pt.co API

The API uses Python Flask and is [hosted on a replit](https://replit.com/@paramt/1ptco-API). The 1pt.co API is public so anyone can create a shortened URL

Endpoint: `api.1pt.co`

  1.  If you want custom name to url 
   ```
          https://api.1pt.co/addURL?long={LONG_URL}&short={CUSTOM_SHORT_WORD}
    
          https://api.1pt.co/addURL?long=https://www.param.me&short=param
   ```



  2.  If you want to skip custom name to url :  
   ```            
        https://api.1pt.co/addURL?long={LONG_URL}
  
        https://api.1pt.co/addURL?long=https://www.param.me
   ```
      

#### Method: `GET`

| Parameter | Description                                                                                                                                                                                        | Example                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `long`    | **Required** - The long URL to shorten                                                                                                                                                             | `https://www.param.me` |
| `short`   | **Optional** - The part after `1pt.co/` that will redirect to your long URL. If this paramter is not provided or the requested short URL is already taken, it will return a random 5-letter string | `param`                |

#### Example Response

```json
{
  "status": 201,
  "message": "Added!",
  "short": "param",
  "long": "https://www.param.me"
}
```

With this example 1pt.co/param will redirect to https://www.param.me

## 🛠️ Self-Host

Self-hosting an instance of 1pt requires setting up the Flask server and the Google Sheets API

1. Set up the Google Sheets API
   - Go to [Google Developer Console](https://console.developers.google.com/apis/dashboard) and create a new project
   - Click <kbd>+ ENABLE APIS AND SERVICES</kbd> and enable the "Drive API" as well as the "Sheets API"
   - Navigate to "APIs and Services" > "Credentials"
   - Click <kbd>+ CREATE CREDENTIALS</kbd> and select "Service account"
   - Fill in the required fields, press <kbd>CREATE</kbd>, <kbd>CONTINUE</kbd>, and on the last step click <kbd>+ CREATE KEY</kbd> to download a JSON file
1. Set up the Python server

   - Fork the [1pt.co repl.it](https://repl.it/@paramt/1ptco-API)
   - Create a file named `.env` and create the following environment variables:

   ```
   SHEET_TYPE=""

   SHEET_PROJECT_ID=""

   SHEET_PRIVATE_KEY_ID=""

   SHEET_PRIVATE_KEY=""

   SHEET_CLIENT_EMAIL=""

   SHEET_CLIENT_ID=""

   SHEET_AUTH_URI=""

   SHEET_TOKEN_URI=""

   SHEET_AUTH_PROVIDER_X509_CERT_URL=""

   SHEET_CLIENT_X509_CERT_URL=""
   ```

   - Copy this [1pt.co Database Template sheet](https://docs.google.com/spreadsheets/d/16y5nLdXFVbmRG3jdzJsa0TOHEbyskc6AQdyhFzKjXto/copy) and share it with the `client_email` found in the JSON file with all the credentials

   - In `config.py` change the value of `spreadsheet` to the name of your Google Sheet

   - Run your repl.it and set it to be **always on**

   > 📝 Note: This requires the [Repl.it Hacker Plan](https://repl.it/site/pricing). Without the **always on** feature, the server will sleep after 1 hour of inactivity.
