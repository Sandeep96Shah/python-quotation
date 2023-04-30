const User = require("../model/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const { validationResult } = require("express-validator");

// controller action to create the user
module.exports.signup = async (req, res) => {
    try{
        // 1-> fetch the user data from the req.body object.
        // const name = req.body.name;
        // const email = req.body.email;
        // const password = req.body.password;
        // const confirmPassword = req.body.confirmPassword;
        const { name, email, password, confirmPassword } = req.body;

        const errors = validationResult(req);

        if(errors.errors.length > 0) {
            return res.status(400).json({
                message: "Validation error",
                data: {
                    errors: errors,
                }
            })
        }

        // 2-> match password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                meessage: "Password and Confirm Password Do not match!",
                data: {},
            })
        };

        // 3-> user should not be present in our database
        const user = await User.findOne({email: email});
            // if user exist 
            if(user){
                return res.status(400).json({
                    message: "You already have an account!",
                    data: {},
                })
            }

            const hashPassword = bcrypt.hashSync(password, saltRounds);

        // 4-> create user account 
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashPassword,
        });

        // 5-> send the response
        return res.status(200).json({
            message: "Successfully signed up!",
            data: {
                user: newUser,
            }
        })
    }catch(error){
        return res.status(500).json({
            message: "Opps something went wrong!",
            data: {
                error: error,
            }
        })
    }
};

// signin api
module.exports.signin = async (req, res) => {
    try{
        // 1-> fetch the email and password from the req.body
        const { email, password } = req.body; // de-structuring.

        // 2-> find the user with email from the data base
        const user = await User.findOne({email: email});

        // 3-> check whether user is fetched from the db or not
            // a-> respond with appropriate message if user do not exist
            if(!user) {
                return res.status(400).json({
                    message: "Please signup to use our platform",
                    data: {},
                })
            }

        // 4-> matched the password 
            // b-> else respond with failure message
            const isPasswordMatched = bcrypt.compareSync(password, user.password);

            if(!isPasswordMatched){
                return res.status(400).json({
                    message: "Email/Password do not match!",
                    data: {},
                })
            };

            const token = jwt.sign({ email: user.email }, 'PtlPmGm2Fos02SXwCkPv87ybGlZTe3ti', { expiresIn: '1h' });

            // a-> if matched then respond with success message
            return res.status(200).json({
                message: "Successfully signedIn",
                data: {
                    token: token,
                }
            })
    }catch(error){
        return res.status(500).json({
            message: "Opps something went wrong!",
            data: {
                error: error,
            }
        })
    }
}

// controller action to get the user details
module.exports.userDetails = async (req, res) => {
    try{
        // 1-> fetch the userId from the req.user object
        const { _id: userId } = req.user;

        // 2-> fetch the user details frm the databse 
            // 3-> populate to get the desired data
            // a-> fetch selective properties.
            // b-> populate { path:  }
        const user = await User.findById(userId, 'name email quotations').populate([{
            path: "quotations",
            populate: {
                path: "user",
                select: "name"
            }
        }]);

        // 4-> reponsd to the user/client
        return res.status(200).json({
            message: "Successfully fetched user details",
            data: {
                user: user,
            }
        })

    }catch(error){
        return res.status(500).json({
            message: "Opps something went wrong!",
            data: {
                error: error,
            }
        })
    }
}

