const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, name });
    await user.save();
    res.status(201).json({ message: 'User registered', user: { email: user.email, name: user.name, kycStatus: user.kycStatus } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    // For demo: return user info (no JWT/session)
    res.json({ message: 'Login successful', user: { email: user.email, name: user.name, kycStatus: user.kycStatus } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// KYC submission/update
exports.submitKYC = async (req, res) => {
  try {
    const { email, kycData } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { kycData, kycStatus: 'pending' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'KYC submitted', user: { email: user.email, kycStatus: user.kycStatus } });
  } catch (err) {
    res.status(500).json({ message: 'KYC submission failed', error: err.message });
  }
};

// Admin: Approve/reject KYC
exports.setKYCStatus = async (req, res) => {
  try {
    const { email, status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const user = await User.findOneAndUpdate(
      { email },
      { kycStatus: status },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'KYC status updated', user: { email: user.email, kycStatus: user.kycStatus } });
  } catch (err) {
    res.status(500).json({ message: 'KYC status update failed', error: err.message });
  }
};
