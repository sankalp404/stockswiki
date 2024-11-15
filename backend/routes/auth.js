// routes/auth.js
import { Router } from 'express';
const router = Router();
import { register, login } from '../controllers/authController.js'; // Ensure the file extension is included

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

export default router;
