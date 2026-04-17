const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, licenseNumber } = req.body;
    if (!name || !email || !password || !licenseNumber)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ $or: [{ email }, { licenseNumber }] });
    if (exists) return res.status(400).json({ message: 'Email or license number already registered' });

    const user = await User.create({ name, email, password, licenseNumber });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      licenseNumber: user.licenseNumber, token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, licenseNumber } = req.body;
    if (!email || !password || !licenseNumber)
      return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email, licenseNumber });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials or license number' });

    res.json({
      _id: user._id, name: user.name, email: user.email,
      licenseNumber: user.licenseNumber, token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, licenseNumber: req.user.licenseNumber });
};

module.exports = { register, login, getMe };
