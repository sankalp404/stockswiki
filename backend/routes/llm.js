// routes/llm.js
import { Router } from 'express';
const router = Router();
import { generateResponse } from '../controllers/llmController.js'; // Ensure the file extension is included
import { authenticateToken } from '../middleware/authMiddleware.js'; // Ensure the file extension is included

// Generate a response
router.post('/generate', authenticateToken, generateResponse);

export default router;
