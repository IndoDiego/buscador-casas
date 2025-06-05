const axios = require('axios');
require('dotenv').config({ path: '../credential.env' });

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.post(
      'https://realtime.oxylabs.io/v1/queries',
      {
        source: 'universal',
        url: url,
        parse: true
      },
      {
        auth: {
          username: process.env.OXYLABS_USER,
          password: process.env.OXYLABS_PASS
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error scraping:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Error scraping', details: error?.response?.data || error.message });
  }
}; 