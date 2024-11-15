import db from '../models/index.js'; // Ensure the file extension is included
import OpenAI from 'openai';
import { generateResponse as generateLLMResponse } from '../services/llmService.js'; // Ensure the file extension is included

const { Note } = db;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(req, res) {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    // Fetch relevant notes to include as context
    const notes = await Note.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5, // Limit the number of notes to keep within token limits
    });

    const notesContent = notes.map((note, index) => `Note ${index + 1}: ${note.content}`).join('\n');

    const prompt = `
    You are an assistant that helps the user based on their previous notes.

    User Message: ${message}

    Relevant Notes: ${notesContent}

    Provide a helpful response to the user's message based on the notes above.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or the model you wish to use
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
    });

    res.json({ response: aiResponse.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
}

export async function generateResponse(req, res) {
  try {
    const { prompt } = req.body;

    // Generate response
    const response = await generateLLMResponse(prompt);

    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response.' });
  }
}