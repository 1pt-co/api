# <img align="center" width="45" src="https://raw.githubusercontent.com/paramt/1pt/master/resources/favicon/android-chrome-512x512.png"> 1pt.co API

The 1pt.co API is public so anyone can create a shortened URL

## Instructions to use it localy
1. To use this on local host download XAMPP (`https://www.apachefriends.org/download.html`) or MySQL database.
2. Set up .env file or modify `config.js` file to enter database credentials.
3. Open terminal in the project root and type `npm start`


## EndPoints
Endpoint: `csclub.uwaterloo.ca/~phthakka/1pt-express`

> Note: the old endpoint (`csclub.uwaterloo.ca/~phthakka/1pt`) is still live but will soon be **deprecated**.

### `/addURL`

#### Method: `POST`

| Parameter | Description                                                                                                                                                                                        | Example                |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `long`    | **Required** - The long URL to shorten                                                                                                                                                             | `https://www.param.me` |
| `short`   | **Optional** - The part after `1pt.co/` that will redirect to your long URL. If this paramter is not provided or the requested short URL is already taken, it will return a random 5-letter string | `param`                |

#### Example Response

```json
{
  "message": "Added!",
  "short": "param",
  "long": "https://www.param.me"
}
```

### `/r/<short code>`

#### Method: `GET`

###### With this endpoint 1pt.co/r/param will redirect to https://www.param.me