// Define and export controller functions for different routes

// import User model
const User = require("../models/User");

// import jwt
const jwt = require("jsonwebtoken");

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "Incorrect Email") {
    errors.email = "That email is not registered";
  }

  // incorrect password
  if (err.message === "Incorrect Password") {
    errors.password = "That password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    //TESTED - for duplicate values the error code is 11000 ****** & if it is 11000, than
    errors.email = "That email is already registered"; //display this custom message
    return errors; //if this happens no need to go further - return from here
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    //console.log(err); //got the errors object
    //console.log(Object.values(err.errors)); //got array of object
    Object.values(err.errors).forEach(({ properties }) => {
      //console.log(properties); // accessed two objects of properties
      errors[properties.path] = properties.message;
    });
  }

  return errors; //returning the errors object
};

// creating tokens
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "auth tester secret", {
    expiresIn: maxAge, // this expires in 3 days ***NOTE*** this is in seconds not in milliseconds (like cookies)
  });
};

// CONTROLLER FUNCTION FOR GET REQUEST FOR /signup ROUTE
module.exports.signup_get = (req, res) => {
  // in the response we will simply render the SIGNUP View
  res.render("signup");
};

// CONTROLLER FUNCTION FOR POST REQUEST FOR /signup ROUTE
module.exports.signup_post = async (req, res) => {
  // in the response we will connect our new user to the db
  //   console.log(req.body); // { email: 'test@authtester.com', password: 'test123' } ****TESTED 200 OK****

  const { email, password } = req.body; // destructuring email and password from req.body
  //   console.log(email, password); // *** TESTED 200 OK ****
  //   res.send("new signup");
  try {
    // IF no error try to create a user
    const user = await User.create({ email, password }); // creating a user
    const token = createToken(user._id); //creating a token for user
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // wraping our token in cookie
    res.status(201).json({ user: user._id });
  } catch (err) {
    // IF error - display error
    // console.log(err);
    const errors = handleErrors(err); //calling handleError function
    res.status(400).json({ errors });
  }
};

// CONTROLLER FUNCTION FOR GET REQUEST FOR /login ROUTE
module.exports.login_get = (req, res) => {
  // in the response we will simply render the LOGIN View
  res.render("login");
};

// CONTROLLER FUNCTION FOR POST REQUEST FOR /login ROUTE
module.exports.login_post = async (req, res) => {
  // in the response we will authenticate a current user
  //   console.log(req.body); // { email: 'test@authtester.com', password: 'test123' } ****TESTED 200 OK****

  const { email, password } = req.body; // destructuring email and password from req.body
  // console.log(email, password); // *** TESTED 200 OK ****
  // res.send("user login");
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id); //creating a token for user
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // wraping our token in cookie
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

// CONTROLLER FUNCTION FOR GET REQUEST FOR /logout ROUTE
module.exports.logout_get = (req, res) => {
  // here we need to delete our jwt cookie but we cannot do this from the server ?????
  // what we can do is replace jwt cookie with another cookie with a very short maxAge ****
  res.cookie("jwt", "", { maxAge: 1 }); // replaced jwt cookie with empty string with a maxAge of 1ms

  // once a user is logged out
  res.redirect("/"); // redirect user to home view
};
