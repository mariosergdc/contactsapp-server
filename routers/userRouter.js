const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
router.post('/', async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    if (!email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: 'Please enter all required fields' });
    }
    if (password.length < 6) {
      return res.status(400).json({
        errorMessage: 'Password must be at least 6 characters',
      });
    }
    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: 'Enter the same password twice',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: 'There is already an account with this email',
      });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('token', token, {
        httpOnly: false,
      })
      .send();
  } catch (err) {
    res.status(500).send();
  }
});

//login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // validations
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: 'Please enter all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({
        errorMessage: 'Wrong email or password',
      });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordCorrect)
      return res.status(401).json({
        errorMessage: 'Wrong email or password',
      });

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    res
      .cookie('token', token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    res.status(500).send();
  }
});

router.get('/logout', (req, res) => {
  res
    .cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

router.get('/loggedin', (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).send(false);
    jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send(true);
  } catch (err) {
    res.status(200).send(false);
  }
});

router.get('/loggeduser', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({ email: null });
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: verified.user });
    if (!user) return res.status(200).json({ email: null });
    res.status(200).json({ email: user.email });
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = router;
