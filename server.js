const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const requestIp = require('request-ip');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.set('view engine','ejs')
app.use(bodyParser.json())

app.listen(process.env.PORT || 5001)