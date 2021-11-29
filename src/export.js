const fs = require('fs')
const fse = require('fs-extra')
const TurndownService = require('turndown')

const exportHTML = (input, output, asHTML = false) => {
    html = dom.window.document.querySelector('html')

    let inputFile = fs.readFileSync(input, 'utf8')
    regex = new RegExp(/<html(.|\n)*<\/html>/, 'gm')
    let preparedHTML = html.outerHTML.replace(/\$\$/g, '$$$$$$')

    if (asHTML) {
        fse.outputFileSync(`${output}book.html`, preparedHTML)
    } else {
        outputFile = inputFile.replace(regex, preparedHTML)
        fse.outputFileSync(`${output}book.xml`, outputFile)
    }
}

const exportMarkdown = output => {
    html = dom.window.document.querySelector('html')
    regex = new RegExp(/<html(.|\n)*<\/html>/, 'gm')
    let preparedHTML = html.outerHTML.replace(/\$\$/g, '$$$$$$')

    const turndownService = new TurndownService({
        headingStyle: 'atx',
        hr: '---',
        bulletListMarker: '-',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
    })
    const markdown = turndownService.turndown(preparedHTML)
    fse.outputFileSync(`${output}.md`, markdown)
}

module.exports = { exportHTML, exportMarkdown }
