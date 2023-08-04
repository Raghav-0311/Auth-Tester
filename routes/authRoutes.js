// destructure the Router from the express package
const { Router } = require("express");

// Importing authController functions
const authController = require("../controllers/authController");

// create a new instance of Router
const router = Router();

// Now we can attach different requests to this router instance

router.get("/signup", authController.signup_get); // HANDLE GET REQUEST FOR /signup ROUTE ====> render sign up Page
router.post("/signup", authController.signup_post); // HANDLE POST REQUEST FOR /signup ROUTE ====> create a new user in db
router.get("/login", authController.login_get); // HANDLE GET REQUEST FOR /login ROUTE ====> render log in page
router.post("/login", authController.login_post); // HANDLE POST REQUEST FOR /login ROUTE ====> authenticate a current user
router.get("/logout", authController.logout_get); // HANDLE GET REQUEST FOR /logout ROUTE ====> log a user out

// Export router so that we can use / call it in app.js
module.exports = router;
