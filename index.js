const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const db = require("./config/mongoose");
const passport_JWT = require("./config/passport_jwt");

// middlewre are the operations which are performed after the request has received 
// and before responding back to the user/client

app.use(express.urlencoded());
app.use('/', require('./routes/index'));


app.listen(port, (error) => {
    if(error) {
        console.log("Error while running thr server ", error);
        return;
    }
    console.log("Server is up and running on port ", port);
});