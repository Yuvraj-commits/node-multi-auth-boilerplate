const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createToken } = require("../middleware/createToken");
const { body, validationResult } = require("express-validator");

module.exports.register = [
  body("phoneNumber")
    .not()
    .isEmpty()
    .withMessage("Phone Number Field is required"),
  body("email").not().isEmpty().withMessage("email Field is required"),
  body("password").not().isEmpty().withMessage("password Field is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.create({ ...req.body });
      const token = await createToken(user);
      res.status(201).json({ user: user, token: token });
    } catch (err) {
      let error = err.message;
      if (err.code == 11000) {
        error = `${
          err.keyPattern.hasOwnProperty("phoneNumber") ? "PhoneNumber" : "Email"
        } already exists`;
      }
      res.status(400).json({ error: error });
    }
  },
];

module.exports.login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = await createToken(user);
        res.status(200).json({ user, token });
      }
      throw Error("incorrect password");
    }
    throw Error("User not found with given phone number");
  } catch (err) {
    let error = err.message;
    res.status(400).json({ error: error });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ phoneNumber });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        res.status(400).json({ message: "Old and New password can't be same" });
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const updatePassword = await User.findOneAndUpdate(
          { phoneNumber },
          { password: hashedPassword },
          { new: true, useFindAndModify: false }
        );
        res.status(200).json({
          message: "Password Updated Successfuly",
          user: updatePassword,
        });
      }
    } else throw Error("User not found with given phone number");
  } catch (err) {
    console.log(err);
    let error = err.message;
    res.status(400).json({ error: error });
  }
};
