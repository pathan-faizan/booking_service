const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const sequelize = require('./config/db');

const { notFound,errorHandler } = require('./middleware/errorMiddleware');


const saveCSVToDB = require('./utils/csvToDB');


const port = process.env.NODE_DOCKER_PORT || 3000;

const dbAuthenticate = async () => {
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } 
catch (error) {
    console.error('Unable to connect to the database:', error);
  }

}
dbAuthenticate();

// save csv file to database
saveCSVToDB();

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(upload.array());

const router = require("./routes/index");
app.use("/api",router);


app.use(notFound);
app.use(errorHandler);


// app.listen(port,()=>console.log("app is running"))

app.listen(port, '0.0.0.0');
