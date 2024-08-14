require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const credentials = require('./middleware/credentials')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500
global.__basedir = __dirname;
//console.log(process.env.NODE_ENV)
const fileUpload = require('express-fileupload');
connectDB()

app.use(logger)
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions))
// app.use(cors())
// app.options("*", (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', "*")
// })

// app.use(cors())
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
//     });


//     app.options('*', cors()) 
app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/projects', require('./routes/projectRoutes'))
app.use('/dailyReports', require('./routes/dailyReportRoutes'))
app.use('/activities', require('./routes/activityRoutes'))
app.use('/cashes', require('./routes/cashRoutes'))
app.use('/consumables', require('./routes/consumableRoutes'))
app.use('/equipment', require('./routes/equipmentRoutes'))
app.use('/expenses', require('./routes/expenseRoutes'))
app.use('/records', require('./routes/recordRoutes'))
app.use('/masters', require('./routes/masterRoutes'))
app.use('/attends', require('./routes/attendRoutes'))
app.use('/types', require('./routes/typeRoutes'))
app.use('/crviews', require('./routes/crviewRoutes'))
app.use(fileUpload());
app.use('/files', require('./routes/filesRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
