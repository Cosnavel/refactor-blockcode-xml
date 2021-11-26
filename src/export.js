const fs = require('fs')
const fse = require('fs-extra')

const exportHTML = (input, output) => {
    console.log(input)
    console.log(output)
    html = dom.window.document.querySelector('html')

    let inputFile = fs.readFileSync(input, 'utf8')
    regex = new RegExp(/<html(.|\n)*<\/html>/, 'gm')
    let preparedHTML = html.outerHTML.replace(/\$\$/g, '$$$$$$')
    outputFile = inputFile.replace(regex, preparedHTML)
    fse.outputFileSync(`${output}book.xml`, outputFile)
}

module.exports = exportHTML
