const Quotation = require('../model/quotation');
const User = require("../model/user");
const nodemailer = require('../config/nodemailer');

// controller action to create quotation
module.exports.createQuotation = async(req, res) => {
    try{
        // 1-> fetch the content, user, subject from the req.body object
        const { content, subject } = req.body;
        const { _id: userId } = req.user;

        // 2-> create the quotation
        const quotation = await Quotation.create({
            content: content,
            user: userId,
            subject: subject,
        });

        // 3-> fetch the user details from the db
        const user = await User.findById(userId);

        // 4-> add the created quotation id in the quotation property of the user
        user.quotations.push(quotation._id);
        user.save();
        console.log("heyyy- before", quotation);
        await nodemailer.transporter.sendMail({
            from: 'mscodeialweb@gmail.com', // sender address
            to: req.user.email, // list of receivers
            subject: "Quotation created", // Subject line
            html: `You have just posted you quotation, ${quotation}`, // html body
          });

        console.log("heyyy- before", quotation);

        // 5-> send the response
        return res.status(200).json({
            message: "Successfully created the Quotation!",
            data: {},
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

// api to get all the quotations
module.exports.allQuotations = async (req, res) => {
    try{
        // fetch the entire quotations from the Quotation model
        // populate the user property and get only the name of the user
        const quotations = await Quotation.find({}).populate({
            path: "user",
            select: "name"
        })

        // send the response 
        return res.status(200).json({
            message: "Successfully fetched the quotations!",
            data: {
                quotations: quotations,
            }
        })
    }catch(error){
        return res.status(500).json({
            message: "Opps something went wront at the server!",
            data: {
                error: error,
            }
        })
    }
}