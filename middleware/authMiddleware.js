// import jwt
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// creating a custom middleware function required for authentication for different routes
const requireAuth = (req, res, next) => {
  // inside every mw we have req, res and next(* need to call at the end)
  const token = req.cookies.jwt; // grabing owr jwt cookies

  // check json web token exists & is verified
  if (token) {
    // if we have token
    jwt.verify(token, "auth tester secret", (err, decodedToken) => {
      //verifying token with the same app secret
      if (err) {
        // if there is an error
        console.log(err.message);
        res.redirect("/login"); // redirect to login view
      } else {
        // if there is no error
        console.log(decodedToken);
        next(); // user can continue
      }
    });
  } else {
    // if we don't have token
    res.redirect("/login"); // redirect to login view
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // grabing owr jwt cookies

  if (token) {
    // if we have token
    jwt.verify(token, "auth tester secret", async (err, decodedToken) => {
      //verifying token with the same app secret
      if (err) {
        // if there is an error
        console.log(err.message);
        res.locals.user = null;
        next(); //continue to next mw
      } else {
        // if there is no error
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next(); // continue
      }
    });
  } else {
    // if we don't have token
    res.locals.user = null;
    next();
  }
};

// export our custom middleware functions
module.exports = { requireAuth, checkUser };
