const express = require('express')
const app = express()
const bodyParser  = require('body-parser')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const route = require('./app/routes/route')



dotenv.config()

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());
app.use(cookieParser());


app.listen(3000, ()=> {
    console.log("connect success")
})

route(app);