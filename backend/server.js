// backend/server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Customer Feedback API!');
});

// API route for sentiment analysis
app.post('/api/analyze', async (req, res) => {
  const { feedback } = req.body;
  
  // Placeholder logic for sentiment analysis (replace with actual logic)
  const sentiment = feedback.includes('love') ? 'positive' : 'negative'; 
  const category = feedback.includes('bug') ? 'bugs' : 'user love'; 

  res.json({ feedback, sentiment, category });
});

// API route for uploading Excel files
app.post('/api/upload-excel', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File is required.' });
  }
  
  // Placeholder logic for processing the Excel file (replace with actual logic)
  res.json({ message: 'File uploaded successfully.', filename: req.file.filename });
});

// API route for fetching articles
app.post('/api/fetch-article', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const articleText = $('p').text(); // Adjust selector based on your needs
    res.json({ article: articleText });
  } catch (error) {
    console.error('Error fetching article:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: error.response ? error.response.data : 'Error fetching article. Please try again later.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
