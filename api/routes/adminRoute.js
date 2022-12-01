const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');
const auth = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    console.log(req.admin);
    const admin = await Admin.findById({ _id: req.admin.id });
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const admin = await Admin.findOne({ name: name });
    if (!admin) res.status(400).json({ message: 'Admin not found' });
    const isVaild = await bcrypt.compare(password, admin.password);
    if (!isVaild) res.status(400).json({ msg: 'Enter a correct password' });
    else if (isVaild) {
      const payload = {
        admin: {
          id: admin.id,
        },
      };
      const secretKey = process.env.JWT_SECRET;
      jwt.sign(payload, secretKey, { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/add_admin', auth, async (req, res) => {
  const { name, password } = req.body;
  try {
    let admin = await Admin.findOne({ name: name });
    if (admin) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Admin already exists' }] });
    }
    admin = new Admin({
      name,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    await admin.save();
    const secretKey = process.env.JWT_SECRET;
    const payload = {
      admin: {
        id: admin.id,
      },
    };
    jwt.sign(payload, secretKey, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
