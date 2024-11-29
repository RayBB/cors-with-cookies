# CORS Proxy with Cookie Support

A simple Express-based proxy server that handles CORS requests while preserving cookies. Perfect for situations where you need to make cross-origin requests that require cookie preservation.

## Features

- Handles CORS requests with cookie support
- Forwards all HTTP methods
- Preserves headers and cookies
- Simple JSON-based request format
- Error handling and validation

## Installation

```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Make requests to the proxy:
```javascript
fetch('http://localhost:3000/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://api.example.com/data',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    body: {} // Optional request body
  })
})
```

## API

### POST /proxy

Request body format:
```json
{
  "url": "Required: Target URL",
  "method": "Required: HTTP method (GET, POST, etc.)",
  "headers": {
    "Optional": "Request headers"
  },
  "body": "Optional: Request body data"
}
```

## Testing

Run the included test script:
```bash
npm test
```
