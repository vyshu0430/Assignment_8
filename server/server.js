const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://221fa04140:janu22k@cluster0.vkxo1.mongodb.net/internshipPlatform?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Routes
app.post('/register', async (req, res) => {
  const { name, email, number, password, confirmPassword } = req.body;

  // Log password and confirmPassword to check for discrepancies
  console.log('Password:', password);
  console.log('Confirm Password:', confirmPassword);

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { number }] });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or registration number already exists.' });
    }

    const newUser = new User({ name, email, number, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { number, password } = req.body;

  try {
    const user = await User.findOne({ number, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid number or password.' });
    }

    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});


// Fetch internships
app.get('/internships', (req, res) => {
  const internships = [
    'Software Developer Intern',
    'Data Analyst Intern',
    'UI/UX Designer Intern'
  ];
  res.json(internships);
});

// Server running
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
