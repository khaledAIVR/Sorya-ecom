const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

async function generateHash(password) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
async function comparePasswordHash(requestedPassword, hashedPassword) {
  try {
    const isValidPassword = await bcrypt.compare(
      requestedPassword,
      hashedPassword
    );
    return isValidPassword;
  } catch (error) {
    console.log(error);
  }
}

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: await generateHash(req.body.password),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(401).json("Wrong credentials!");

    isValidPassword = await comparePasswordHash(
      req.body.password,
      user.password
    );

    isValidPassword === false && res.status(401).json("Wrong credentials!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
