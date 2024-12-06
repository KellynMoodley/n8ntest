
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

// CORS Configuration
//app.use(cors({
  //origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
//  origin:'*',
//  methods: ['GET', 'POST'],
//  credentials: true
//}));

app.use(cors());

// Middleware
app.use(express.json());
//app.use(express.static('public'));

// Supabase Client
const supabase = createClient(
  'https://azaciowvtzpbudilmvqz.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6YWNpb3d2dHpwYnVkaWxtdnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzM4MDIsImV4cCI6MjA0ODcwOTgwMn0.v4AVDi4Zk_obPeMygY-ODbvOI8tW7VV-o8V1T2WiNOI'
);

// N8N Webhook Function
async function callN8nWebhook(fileUrl) {
  try {
    console.log('Calling N8N Webhook with URL:', fileUrl);
    console.log('Full Axios Config:', {
      method: 'get',
      url: 'https://kkarodia.app.n8n.cloud/webhook/call_url',
      params: { myUrl: fileUrl }
    });

    const response = await axios({
      method: 'get',
      url: 'https://kkarodia.app.n8n.cloud/webhook/call_url',
      params: { myUrl: fileUrl },
      timeout: 100000 // 10 second timeout
    });

    console.log('Webhook Response Status:', response.status);
    console.log('Webhook Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('N8N Webhook Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      config: error.config
    });
    throw error;
  }
}

// Supabase File Check Function
async function checkFileAndLog() {
  try {
    // Get the public URL of the file
    const { data, error } = supabase
      .storage
      .from('truworths')
      .getPublicUrl('+27815952073_CA97723bbb3961adc241281cdf40f629a9.txt');

    if (error) {
      console.error('Error fetching file:', error.message);
      return null;
    }

    // Check if the URL is valid
    const response = await fetch(data.publicUrl);
    if (response.ok) {
      console.log('File found successfully');
      console.log('File URL:', data.publicUrl);
      
      // Call N8N webhook with file URL
      const webhookResult = await callN8nWebhook(data.publicUrl);
      return webhookResult;
    } else {
      console.error('File not found or inaccessible');
      return null;
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
    throw err;
  }
}

// Backend (index.js)
app.get('/check-file', async (req, res) => {
  try {
    const result = await checkFileAndLog();
    res.json({ 
      message: 'File check completed', 
      data: result?.response?.output_text  || 'No data received'
      
    });
  } catch (err) {
    console.error('Error in file check route:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/webhook-data', async (req, res) => {
  try {
    const result = await checkFileAndLog();
    res.json({ 
      message: 'Webhook data retrieved', 
      response: result?.response?.text || 'No data received'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
