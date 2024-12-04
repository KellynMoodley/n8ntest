import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios';

const app = express();
const router = express.Router();
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const supabase= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Enable CORS
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Allow both localhost and 127.0.0.1
    methods: ['GET', 'POST'],
    credentials: true
}));

// Static files
app.use(express.json());
app.use(express.static('public'));

// Mount the router
app.use('/api', router);


//n8n api 
async function callN8nWebhook(supabaseUrl) {
  try {
    const response = await axios.get('https://kkarodia.app.n8n.cloud/webhook-test/call_url', {
      params: {
        myUrl: supabaseUrl
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
        throw error;
    }
  }


  app.get('/webhook-data', async (req, res) => {
    try {
        const data = await callN8nWebhook();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// supabase connect and read 
async function checkFileAndLog() {
  try {
    // Get the public URL of the file
    const { data, error } = supabase
      .storage
      .from('call_transcripts')
      .getPublicUrl('Transcript_example.txt');

    if (error) {
      console.error('Error fetching file:', error.message);
      return;
    }

    // Check if the URL is valid (Supabase returns a URL regardless of existence)
    const response = await fetch(data.publicUrl);
    if (response.ok) {
      console.log('success');
      console.log(data.publicUrl);
      callN8nWebhook(data.publicUrl);

    } else {
      console.error('File not found or inaccessible');
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

  app.get('/check-file', async (req, res) => {
    try {
      await checkFileAndLog(); // Call your Supabase-related logic here
      res.json({ message: 'File check initiated.' });
    } catch (err) {
      console.error('Error in file check route:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
