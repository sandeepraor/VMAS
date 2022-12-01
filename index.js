const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connection = require('./api/middlewares/connection');
const alienRoutes = require('./api/routes/aliens');
const adminRoutes = require('./api/routes/adminRoute');

const app = express();
dotenv.config();
connection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening to port:${PORT}`);
});

//Config Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('', (req, res) => {
  res.send('Welcome to alien page');
});
app.use('/alienprofile', alienRoutes);
app.use('/admin', adminRoutes);
//Error Handling Middlewares
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: { message: error.message },
  });
});

module.exports = app;
