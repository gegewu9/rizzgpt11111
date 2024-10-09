import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.VITE_API_KEY,
  baseURL: process.env.VITE_API_BASE_URL,
});

app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages
      ],
    });

    res.json({ message: completion.choices[0].message });
  } catch (error) {
    console.error('Error processing chat request:', error);
    let errorMessage = 'An error occurred while processing your request.';
    let errorDetails = 'Unknown error';
    let errorStack;

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.toString();
      errorStack = error.stack;
    } else if (typeof error === 'string') {
      errorMessage = error;
      errorDetails = error;
    }

    res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});