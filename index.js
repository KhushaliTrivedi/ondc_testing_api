require("dotenv").config();
const path = require('path')
const express = require("express");
const app = express();
// const axios = require("axios");
// var cors = require("cors");
app.use(express.urlencoded({ limit: '128mb' }));

const {
    sequelize,
} = require("./models");

// app.use(cors());
app.use(express.json({ limit: '128mb' }));
const routing = require('./routing');
// Setup static directory to serve
const publicDirectoryPath = path.join(__dirname, './uploads')
const resumeirectoryPath = path.join(__dirname, './resume')
const publicDirectoryPathnew = path.join(__dirname)
console.log(publicDirectoryPath)
app.use(express.static(publicDirectoryPath))
app.use('/uploads', express.static(publicDirectoryPath));
app.use('/resume', express.static(resumeirectoryPath));
app.use('/', express.static(publicDirectoryPathnew));
app.use('/api/v1/', routing);

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '128mb', extended: true }));


app.listen(process.env.PORT, async () => {
    try {
        //await sequelize.sync({force:true})
        await sequelize.authenticate();
        console.log("database connected");
        console.log(`server running on port ${process.env.PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // console.log(`server running on port ${process.env.PORT}`);
    }

});
