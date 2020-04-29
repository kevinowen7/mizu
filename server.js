const express = require("express")
const app = express()
var methodOverride = require("method-override")
const path = require("path")
const con = require("./config/db.js")
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

var fs = require("fs")
const https = require("https")

app.use(cookieParser());
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'ejs');
//set folder public sebagai static folder untuk static file
app.use(express.static('public'));
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))

// connecting route to database
app.use(function(req, res, next) {
  req.con = con
  next()
})

// parsing body request
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// include router
const adminRouter = require("./routes/adminRouter")
// routing
app.use("/admin", adminRouter)

// include router
const userRouter = require("./routes/userRouter")
// routing
app.use("/", userRouter)

// starting server
app.listen(8000, function() {
  console.log("server listening on port 8000")
})
