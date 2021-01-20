const fs = require('fs')
const fse = require('fs-extra')

const exportHTML = (input, output) => {
	html = dom.window.document.querySelector('html')

	let inputFile = fs.readFileSync(input, 'utf8')
	regex = new RegExp(/<html(.|\n)*<\/html>/, 'gm')
	outputFile = inputFile.replace(regex, html.outerHTML)
	fse.outputFileSync(`${output}/book.xml`, outputFile)
}

module.exports = exportHTML
