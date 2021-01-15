const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))

const ip = '127.0.0.1'
const port = '8081'

app.use(express.static('public'))

app.post('/code', (req, res) => {
	console.log(req.body)
	res.send(200)
})
app.post('/html', (req, res) => {
	console.log(req.body)
	res.send(200)
})

app.listen(port, ip, () => {
	console.log(`Server running at http://${ip}:${port}/`)
})
