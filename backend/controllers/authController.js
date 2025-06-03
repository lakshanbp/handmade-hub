const User = require('../models/User');
const ArtisanRequest = require('../models/ArtisanRequest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Use bcryptjs everywhere

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if an admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists && role === 'admin') {
      return res.status(403).json({ error: 'Admin already exists' });
    }

    // Only allow valid roles
    const allowedRoles = ['customer', 'artisan', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'customer';

    const user = new User({ name, email, password, role: userRole });
    await user.save();
    res.status(201).json({ message: `User registered as ${userRole}`, user });
  } catch (error) {
    next(error);
  }
};

// Login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

// Request Artisan Role
exports.requestArtisanRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role !== 'customer') {
      return res.status(400).json({ error: 'Only customers can request artisan role' });
    }
    if (user.artisanStatus !== 'none') {
      return res.status(400).json({ error: 'Artisan request already submitted or processed' });
    }

    const artisanRequest = new ArtisanRequest({
      user: req.user.id,
      status: 'pending',
    });
    await artisanRequest.save();

    user.artisanStatus = 'pending';
    await user.save();

    res.status(201).json({ message: 'Artisan role request submitted', artisanRequest });
  } catch (error) {
    next(error);
  }
};

// Forgot Password (send reset link)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    // Generate a reset token (JWT, expires in 1 hour)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // In production, send email here. For now, just log the link.
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log('Password reset link:', resetLink);
    return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    next(error);
  }
};

// Reset Password (set new password)
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and new password are required.' });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }
    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.password = password;
    await user.save();
    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    next(error);
  }
};