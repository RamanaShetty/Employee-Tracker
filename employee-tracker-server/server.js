const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyparser = require("body-parser");
const cookieParser = require('cookie-parser');
const configdb = require("./config/database");
const app = express();


app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors({
    origin: '*'
}));
app.use(bodyparser.urlencoded({extended : true}));
app.use(cookieParser());



dotenv.config({path : './config/.env'})
configdb();

app.use(require('./controllers/superadmin'));
app.use(require('./controllers/employee'));
app.use(require('./controllers/siteadmin'));

app.listen(4200,() => {
    console.log("server is running on port 4200");
});