"use strict";

if (process.env.NODE_ENV !== "production" ) {
	require("dotenv").config();
}


const express = require('express')
const path = require("path")
const app = express()
const bodyParser = require('body-parser')
const router = require("./server-router.js")

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/exercise-track', { useNewUrlParser: true, useMongoClient: true } )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static(path.join('public')))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

router(app);

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

module.exports.app = app;