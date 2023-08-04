// importing mongoose
const mongoose = require("mongoose");

//importing isEmail function from validator package
const { isEmail } = require("validator");

//importing bcrypt package
const bcrypt = require("bcrypt");

// creating a schema (defines the structure of our user document)
const userSchema = new mongoose.Schema({
  email: {
    type: String, // email type must be a string
    required: [true, "Please enter an email"], // email cannot be empty - REQUIRED
    unique: true, // email must be unique
    lowercase: true, // email should be converted in lowercase for every email entry
    validate: [isEmail, "Please enter a valid email"], //email must be validated
  },
  password: {
    type: String, // password type must be a string
    required: [true, "Please enter a password"], // password cannot be empty - REQUIRED
    minlength: [6, "Minimum password lenth is 6 characters"], // password must contain atleast 6 characters
  },
});

// fire a function after (post) doc saved to db
/* userSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc);
    next();
}); */

// fire a function before (pre) doc saved to db
userSchema.pre("save", async function (next) {
  // console.log('user about to be created & saved', this);
  const salt = await bcrypt.genSalt(); // generate a salt that is attach to user password hash
  this.password = await bcrypt.hash(this.password, salt); // hashing user password before it saves to db
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    // if user exist --- compare pasword
    const auth = await bcrypt.compare(password, user.password); // comparing password entered by user with the one stored in our db
    if (auth) {
      // if auth is truthy return user and login
      return user;
    }
    throw Error("Incorrect Password"); // if auth is falsy , throw an error
  }
  throw Error("Incorrect Email"); // if user doesn't exist ---- throw error
};

// Create a model based on the schema defined above
const User = mongoose.model("user", userSchema);

// export model
module.exports = User;
