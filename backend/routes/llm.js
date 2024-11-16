// routes/llm.js
import { Router } from 'express';
import { generateResponse } from '../controllers/llmController.js'; // Ensure the file extension is included
import { authenticateToken } from '../middleware/authMiddleware.js'; // Ensure the file extension is included

const router = Router();

// Generate a response
router.post('/generate', authenticateToken, generateResponse);

export default router;
