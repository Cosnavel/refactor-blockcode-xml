const fs = require('fs')
const fse = require('fs-extra')
const TurndownService = require('turndown')
const turndownPluginGfm = require('turndown-plugin-gfm')
const { removeEntities } = require('./replaceEntities')

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
            return ':::info\n' + content + '\n:::\n'
        },
    })
    turndownService.addRule('blockcode', {
        filter: ['blockcode'],
        replacement: function (content, node, options) {
            let type = node.getAttribute('type')
            let filePath = node.getAttribute('src')

            let data = fs.readFileSync(filePath, 'utf8')

            if (type) {
                return '```' + type + '\n' + data + '\n' + '```\n'
            }
            return '```' + '\n' + data + '\n' + '```\n'
        },
    })
    turndownService.addRule('video', {
        filter: ['video'],
        replacement: function (content, node, options) {
            // let src = node.getAttribute('src')
            let src = content

            if (!src) {
                return ''
            }
            let { hostname } = new URL(src)
            if (hostname.includes('vimeo.com')) {
                return `[${src}](${src})\n`
            }
            // return `::: video ${src} :::\n`
            return `<video>
                <source src="${src}">
              </video>\n`
        },
    })
    turndownService.use(turndownPluginGfm.gfm)
    const markdown = turndownService.turndown(preparedHTML)
    const markdownWithReplacedEntities = removeEntities(
        {
            '&lt;': '<',
            '&gt;': '>',
            '&amp;': '&',
        },
        markdown,
    )
    fse.outputFileSync(`${output}${className}.md`, markdownWithReplacedEntities)
}

module.exports = { exportHTML, exportMarkdown }
