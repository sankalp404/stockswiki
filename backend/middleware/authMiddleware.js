// middleware/authMiddleware.js
import pkg from 'jsonwebtoken';

const { verify } = pkg;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.error('JWT verification error:', err);
        return res.status(403).json({ error: 'Token expired. Please log in again.' });
      }
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid token.' });
    }

    console.log('Decoded JWT payload:', user);
    req.user = user;
    next();
  });
}
