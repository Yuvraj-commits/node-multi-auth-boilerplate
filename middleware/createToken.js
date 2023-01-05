const jwt = require("jsonwebtoken");
const { USER_TOKEN_AGE } = require("../config/config");

module.exports.createToken = async (user) => {
  let expiresIn = USER_TOKEN_AGE;
  const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn,
  });
  return token;
};
