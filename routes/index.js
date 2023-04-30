const express = require("express");
const router = express.Router();
const passport = require("passport");
// import the { check } from express-validator
const { check } = require("express-validator");

const validate = [
    check("email", "Must be an email").isEmail(),
    check("name", "Must not be empty").isLength({ min: 1 }),
    check("password")
    .matches(/.*[A-Z].*/).withMessage("Password must contain atleast one upperCase")
    .matches(/.*[0-9].*/).withMessage("Password must contain atleast one number")
    .matches(/.*[a-z].*/).withMessage("Password must contain atleast one lowercase letter")
    // .matches(/^[!@#\$%\^\&*\)\(+=._-]+$/g).withMessage("Password must contain atleast one special character")
]

const contentValidate = [
    check("content", "It shoud not be empty").notEmpty()
]


// import the controller
const userController = require("../controller/user");
const quotationController = require("../controller/quotation");

// public api
// signup api
router.post(
    "/signup", 
    validate,
    userController.signup
);

// signin api
router.post("/signin", userController.signin);

// private api
// create quotation api
router.post(
    "/create-quotation",
    contentValidate,
    passport.authenticate("jwt", { session: false }),
    quotationController.createQuotation
);

// private api
// user details api
router.get(
    '/user-details',
    passport.authenticate("jwt", { session: false }),
    userController.userDetails,
)

// private api
// all quotations api
router.get(
    "/quotations", 
    passport.authenticate("jwt", { session: false }),
    quotationController.allQuotations,
)

module.exports = router;