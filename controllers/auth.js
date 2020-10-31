const User = require("../models");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt"); //auth check
const { errorHandler } = require("../helpers/dbErrorHandler")

exports.signup = (req, res) => {
  // console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      })
    }
    user.salt = undefined
    user.hashed_password = undefined
    res.json({
      user
    });
  })
};

exports.signin = (req, res) => {
  // find user based on email
  const {email, password } = req.body
  User.findOne({email}, (err, user) => {
    if(err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please sign up"
      })
    }
    // if user is found, make sure email and password match
    // create auth method in user model
    if(!user.authenticate(password)) {
      return res.status(401).json({ error: "Email and password don't match"})
    }

    // generate a signed token with user id and secret
    const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET)
    // persist the token at "t" in cookie with exp date
    res.cookie("t", token, {expire: new Date() + 9999});
    //return res with user and token to front end
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role }});
  })
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout successful"});
}

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;

    if(!user) {
      return res.status(403).json({
        error: "Access denied"
      })
    }
  next();

}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0 ) {
    return res.status(403).json({
      error: "Admin resource! Access denied"
    }); 
  }
  next();
}