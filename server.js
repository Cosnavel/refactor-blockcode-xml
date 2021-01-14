const fs = require('fs')
const path = require('path');
const express = require('express')
const app = express()

const ip = '127.0.0.1'
const port = '8081'

app.use(express.static(__dirname + '/public'))

app.get('/test', (res, req) => {
    console.log(req.body)
})

app.listen(port, ip, () => {
    console.log(`Server running at http://${ip}:${port}/`)
})