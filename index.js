const fs = require('fs')
const fse = require('fs-extra')
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
	const { questionTextBlockCodes, answerBlockCodes } = req.body
	if (questionTextBlockCodes) {
		questionTextBlockCodes.forEach(blockcode => {
			const { filename, value } = blockcode
			fse.outputFileSync(`dist/code/${filename}`, value)
		})
	}
	if (answerBlockCodes) {
		answerBlockCodes.forEach(blockcode => {
			const { filename, value } = blockcode
			fse.outputFileSync(`dist/code/${filename}`, value)
		})
	}
	if (req.body.value && req.body.filename) {
		fse.outputFileSync(`dist/code/${req.body.filename}`, req.body.value)
	}

	res.sendStatus(200)
})
app.post('/html', (req, res) => {
	fse.outputFileSync('dist/html/book.html', req.body.value)
	res.sendStatus(200)
	console.log('HTML File created')
})

app.listen(port, ip, () => {
	console.log(`Server running at http://${ip}:${port}/`)
})
