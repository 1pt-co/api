# <img align="center" width="45" src="https://raw.githubusercontent.com/paramt/1pt/master/resources/favicon/android-chrome-512x512.png"> 1pt.co API

The 1pt.co API is public so anyone can create a shortened URL

Endpoint: `csclub.uwaterloo.ca/~phthakka/1pt`

### `/addURL`

#### Method: `GET`

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

With this example 1pt.co/param will redirect to https://www.param.me
