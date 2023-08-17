const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Admin = require('./routes/Admin/admin')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/Admin',Admin);

app.listen(9002, () => {
    console.log('Backend Running At Port 9002')
})
