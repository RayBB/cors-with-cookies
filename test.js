const axios = require('axios')

const HOST = 'http://localhost:3000/'

async function testProxy() {
  try {
    console.log('Testing proxy server...')
    
    const response = await axios.post(`${HOST}/proxy`, {
      url: 'https://openlibrary.org/authors/OL2716007A.json',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    console.log('\nResponse Status:', response.status)
    console.log('\nAuthor Data:')
    console.log(JSON.stringify(response.data, null, 2))
    
    if (response.data.data && response.data.data.name) {
      console.log('\n✅ Test successful! Retrieved author:', response.data.data.name)
    } else {
      console.log('\n❌ Test failed: Could not retrieve author name')
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    if (error.response) {
      console.error('Error details:', error.response.data)
    }
  }
}

testProxy() 