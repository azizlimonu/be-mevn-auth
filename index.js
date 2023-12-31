require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')

const corsOptions = require('./config/cors')
const connectDB = require('./config/dbConn')
const credentials = require('./middleware/credentials')
const errorHandlerMiddleware = require('./middleware/errorHandler')
const authenticationMiddleware = require('./middleware/authentification')

const app = express()
const PORT = 8080

connectDB();

// Allow Credentials
app.use(credentials)

// CORS
app.use(cors(corsOptions))

// application.x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


// application/json response
app.use(express.json())

// middleware for cookies
app.use(cookieParser())

app.use(authenticationMiddleware)

// static files
app.use('/static', express.static(path.join(__dirname, 'public')))

// Default error handler
app.use(errorHandlerMiddleware)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/oke', (req, res) => {
  res.send("API OKE BOS");
})
app.all('*', (req, res) => {
  res.status(404)

  if (req.accepts('json')) {
    res.json({ 'error': '404 Not Found' })
  } else {
    res.type('text').send('404 Not Found')
  }
})

mongoose.connection.once('open', () => {
  console.log('DB connected')
  app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })
})