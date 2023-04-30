const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
dotenv.config();
//set up server
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server started on port: ${PORT}`));
//app.use(express.json());

//alow images 50 mb
app.use(express.json({ limit: '50mb' }));
//app.use(express.urlencoded({ limit: '50mb' }));

app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

//credentials: true para permitir que mande cookies

//connect to MongoDB

mongoose.connect(process.env.MDB_CONNECT, (err) => {
  if (err) return console.error(err);
  console.log('connected to MongoDb');
});

//set up routes
app.use('/auth', require('./routers/userRouter'));
app.use('/contacts', require('./routers/contactRouter'));
