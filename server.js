const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json())
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}))

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

// Main proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    const { url, method, headers = {}, body } = req.body

    // Validate required fields
    if (!url || !method) {
      return res.status(400).json({ error: 'URL and method are required' })
    }

    // Prepare request configuration
    const config = {
      url,
      method,
      headers,
      data: body,
      withCredentials: true,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }

    // Make the request
    const response = await axios(config)

    // Forward the response
    return res.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    })
  } catch (error) {
    // Handle errors
    const status = error.response?.status || 500
    const message = error.response?.data || error.message
    return res.status(status).json({ error: message })
  }
})

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Proxy server running at http://0.0.0.0:${port}`)
}) 