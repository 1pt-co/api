# <img align="center" width="45" src="https://raw.githubusercontent.com/paramt/1pt/master/resources/favicon/android-chrome-512x512.png"> 1pt.co API

The 1pt.co API is public so anyone can create a shortened URL

Endpoint: `csclub.uwaterloo.ca/~phthakka/1pt-express`

> [!WARNING]
> The old endpoint (`csclub.uwaterloo.ca/~phthakka/1pt`) is still live but will soon be **deprecated**.

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

With this example 1pt.co/param will redirect to https://www.param.me

> [!NOTE]
> If the requested short is taken, it will return a random 5-letter string along with the flag `receivedRequestedShort: false`
