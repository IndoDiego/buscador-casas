const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: 'credential.env' });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
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

    res.json(response.data);
  } catch (error) {
    console.error('Error scraping:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Error scraping', details: error?.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 