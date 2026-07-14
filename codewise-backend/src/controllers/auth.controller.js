const usermodel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registeruser(req, res) {
  try {
    const { username, email, password } = req.body;  

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
         
    const isuser = await usermodel.findOne({ 
        $or: [{ username }, { email }]
     });

    if (isuser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await usermodel.create({ username, email, password: hash});
    
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email, role: user.role}});
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  } 
}

async function loginuser(req, res) {
  try {
    const { password, email } = req.body;

      if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await usermodel.findOne({ email });

    if(!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.cookie('token', token);

    res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email, role: user.role }});
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function logoutuser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

module.exports = {registeruser, loginuser, logoutuser}


// const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
    // res.cookie('token', token);