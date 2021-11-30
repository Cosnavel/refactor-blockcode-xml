const fs = require('fs')
const fse = require('fs-extra')
const TurndownService = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')

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

const exportMarkdown = (output, className) => {
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
    turndownService.addRule('hint', {
        filter: ['hint'],
        replacement: function (content) {
            return ':::info\n\n' + content + '\n\n:::'
        },
    })
    turndownService.addRule('blockcode', {
        filter: ['blockcode'],
        replacement: function (content, node, options) {
            let type = node.getAttribute('type')

            if (type) {
                return '```' + type + '\n\n' + content + '\n\n' + '```'
            }
            return '```' + '\n\n' + content + '\n\n' + '```'
        },
    })
    turndownService.addRule('video', {
        filter: ['video'],
        replacement: function (content, node, options) {
            let src = node.getAttribute('src')

            if (!src) return

            let { hostname } = new URL(src)
            if (hostname.includes('vimeo.com')) {
                return `[${src}](${src})`
            }
            return `<video>
            <source src="${src}">
          </video>`
        },
    })
    turndownService.use(turndownPluginGfm.gfm)
    const markdown = turndownService.turndown(preparedHTML)
    fse.outputFileSync(`${className}.md`, markdown)
}

module.exports = { exportHTML, exportMarkdown }
