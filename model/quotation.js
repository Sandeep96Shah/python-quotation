const mongoose = require("mongoose");

const quotationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    subject: {
        type: String,
        required: true,
    }
});

const Quotation = mongoose.model("quotation", quotationSchema);

module.exports = Quotation;

