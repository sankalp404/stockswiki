// controllers/authController.js
import db from '../models/index.js';
import pkg from 'jsonwebtoken';
import { compare } from 'bcrypt'; // Removed 'hash'

const { sign } = pkg;
const { User } = db;

export async function register(req, res) {
  try {
    const { email, password, role, firstName, lastName, phoneNumber, address, state } = req.body;

    console.log('Request body:', req.body); // Log the request body

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required.' });
    }

    // **Removed manual hashing**
    // const hashedPassword = await hash(password, 10);

    // Create user without manual hashing
    const user = await User.create({
      email,
      password, // Plain password; will be hashed by the model's hook
      role,
      firstName,
      lastName,
      phoneNumber,
      address,
      state,
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error details
    res.status(500).json({ error: 'User registration failed.', details: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT with a longer expiration time (e.g., 24 hours)
    const token = sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, userId: user.id, userFirstName: user.firstName });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'User login failed.' });
  }
}
