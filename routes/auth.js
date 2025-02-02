const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async (req, res) => {
  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // creating a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // save user and return jsonwebtoken
    const user = await newUser.save();
    res.status(200).json(user);
  } 
  catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: "User with this email or username already exists" });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
});


//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("User not found!")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong Password!")


        res.status(200).json(user)
        
    }
    catch(err){
        res.status(500).json(err)
    }
});


module.exports = router;    
