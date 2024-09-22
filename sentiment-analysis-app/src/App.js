// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [feedback, setFeedback] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [article, setArticle] = useState('');

  const analyzeFeedback = async () => {
    setError('');
    setResult(null);

    if (!feedback.trim()) {
      setError('Please enter feedback to analyze.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { feedback });
      setResult([{ feedback: response.data.feedback, sentiment: response.data.sentiment, category: response.data.category }]);
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      setError('Error analyzing feedback. Please try again later.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const uploadFile = async () => {
    setError('');
    setResult(null);

    if (!file) {
      setError('Please upload an Excel file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again later.');
    }
  };

  const fetchArticle = async () => {
    setError('');
    setArticle('');

    if (!url.trim()) {
      setError('Please enter a URL to fetch the article.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/fetch-article', { url }, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
        },
      });
      setArticle(response.data.article);
    } catch (error) {
      console.error('Error fetching article:', error.response ? error.response.data : error.message);
      if (error.response) {
        // Check for specific status codes
        if (error.response.status === 403) {
          setError('Access denied. Please check the URL or try a different one.');
        } else if (error.response.status === 404) {
          setError('Article not found. Please check the URL and try again.');
        } else {
          setError('Error fetching article. Please try again later.');
        }
      } else {
        setError('Error fetching article. Please try again later.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customer Feedback Sentiment Analysis</h1>
      <textarea
        rows="4"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Enter customer feedback"
        style={{ width: '100%', padding: '10px' }}
      />
      <button onClick={analyzeFeedback} style={{ padding: '10px', marginTop: '10px' }}>
        Analyze Feedback
      </button>

      <h2>Upload Excel File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} style={{ padding: '10px', marginTop: '10px' }}>
        Upload File
      </button>

      <h2>Fetch Article</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter article URL"
        style={{ width: '100%', padding: '10px' }}
      />
      <button onClick={fetchArticle} style={{ padding: '10px', marginTop: '10px' }}>
        Fetch Article
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Analysis Result:</h2>
          {Array.isArray(result) ? (
            result.map((item, index) => (
              <div key={index}>
                <p><strong>Feedback:</strong> {item.feedback}</p>
                <p><strong>Sentiment:</strong> {item.sentiment}</p>
                <p><strong>Category:</strong> {item.category}</p>
              </div>
            ))
          ) : (
            <p>{result}</p>
          )}
        </div>
      )}

      {article && (
        <div style={{ marginTop: '20px' }}>
          <h2>Article Content:</h2>
          <p>{article}</p>
        </div>
      )}
    </div>
  );
};

export default App;
