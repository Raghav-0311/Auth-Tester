const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes"); // Importing authRoutes
const cookieParser = require("cookie-parser"); // Importing cookie parser
const { requireAuth, checkUser } = require("./middleware/authMiddleware"); // Importing our custom mw function to protect a route & check a user

const app = express();

// middleware
app.use(express.static("public")); // to access all the static files present in the public dir
app.use(express.json()); // takes json as a request and parse it to javascript object so that we can use it in our code
app.use(cookieParser()); // use cookie parser as middleware

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://raghavkashyap0311:Test1234@cluster0.hjcmkw5.mongodb.net/node-auth";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser); // check user for every get request / route
app.get("/", (req, res) => res.render("home"));
app.get("/services", requireAuth, (req, res) => res.render("services")); // protected route
// ----> USING OUR ROUTES
app.use(authRoutes);

// cookies
/* app.get("/set-cookies", (req, res) => {
  //res.setHeader("Set-Cookie", "newUser=true"); // created a cookie which goes along with the response send by the server

  res.cookie("newUser", false); // *** CREATING A COOKIE **** if cookie exists - update the value, else create new cookie
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  }); // maxAge - Age of cookie, httponly - it can be accessed through document.cookie in console
  res.send("you got the cookies!");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies; // READING COOKIE
  console.log(cookies);
  res.json(cookies);
}); */
