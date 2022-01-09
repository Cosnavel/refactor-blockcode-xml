#!/usr/bin/env node

const chalk = require('chalk')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const figlet = require('figlet')
const inquirer = require('inquirer')
const blc = require('../src/broken-link-checker/lib')
const fs = require('fs')
const async = require('async')

const { replaceEntities, removeComments } = require('../src/replaceEntities')
const {
    parse,
    refactor,
    blockcodeFileToInline,
    removeDocumentHead,
    makeXMLCustomTagsMarkdownCompatible,
    makeImageAssetsMarkdownCompatible,
    makeVideosMarkdownCompatible,
} = require('../src/refactor')
const { exportHTML, exportMarkdown } = require('../src/export')
const resetEntities = require('../src/resetEntities')

console.log(
    chalk.yellow(
        figlet.textSync('refactor-blockcode', { horizontalLayout: 'full' }),
    ),
)

const argv = yargs(hideBin(process.argv)).options({
    path: {
        alias: 'p',
        type: 'string',
        description: 'relative path to your input book.xml',
        default: 'book.xml',
    },
    output: {
        alias: 'o',
        type: 'string',
        description: 'relative path to a output folder',
        default: 'dist/',
    },
    interactive: {
        alias: 'i',
        type: 'boolean',
        description: 'Run interactive mode',
        default: false,
    },
    link: {
        alias: 'l',
        type: 'boolean',
        description: 'Check for broken links',
        default: false,
    },
    detailed: {
        alias: 'd',
        type: 'boolean',
        description: 'Output details for checked links',
        default: false,
    },
    entities: {
        alias: 'e',
        type: 'boolean',
        description: 'reset entities after refactoring blockcode',
        default: false,
    },
    xmlToMarkdown: {
        alias: 'md',
        type: 'string',
        description: 'class from xml to markdown',
    },
}).argv

function refactorBlockCodeToFiles(path, output, entities) {
    replaceEntities(path)

    dom = parse(path)

    refactor(dom, output)
    exportHTML(path, output)

    if (entities) {
        resetEntities(output)
    }
}

function refactorXmlToMd(path, output) {
    replaceEntities(path)
    dom = parse(path)

    async.series(
        [
            function (callback) {
                removeComments(path)
                callback(null, 'removeComments')
            },

            function (callback) {
                blockcodeFileToInline(), callback(null, 'blockcodeFileToInline')
            },
            function (callback) {
                removeDocumentHead(), callback(null, 'removeDocumentHead')
            },
            function (callback) {
                makeXMLCustomTagsMarkdownCompatible(),
                    callback(null, 'makeXMLCustomTagsMarkdownCompatible')
            },
            // disable for faster runtime in development
            function (callback) {
                makeImageAssetsMarkdownCompatible(argv.xmlToMarkdown),
                    callback(null, 'makeImageAssetsMarkdownCompatible')
            },
            function (callback) {
                makeVideosMarkdownCompatible(),
                    callback(null, 'makeVideosMarkdownCompatible')
            },
            function (callback) {
                exportMarkdown(output, argv.xmlToMarkdown),
                    callback(null, 'exportMarkdown')
            },
            // for debbuging only
            // function (callback) {
            //     exportHTML(path, output, true), callback(null, 'exportHTML')
            // },
        ],
        function (err, results) {
            //debugging only
            // console.log('done everything'), console.log(results)
            console.log(
                chalk.greenBright.bold(
                    'Successfully transformed to Markdown ✅🚀',
                ),
            )
        },
    )
    return
}

if (argv.interactive) {
    inquirer
        .prompt([
            {
                name: 'path',
                type: 'input',
                default: 'book.xml',
                message:
                    'Enter the relative path to your book.xml. Press enter to use the default',
            },
            {
                name: 'output',
                type: 'input',
                default: 'dist/',
                message:
                    'Enter the relative path to a output folder. Press enter to use the default',
            },
            {
                name: 'entities',
                type: 'confirm',
                default: false,
                message:
                    'Should entities been resetted after refactoring the blockcode?',
            },
        ])
        .then(input => {
            refactorBlockCodeToFiles(input.path, input.output, input.entities)
            console.log(chalk.greenBright.bold('Successfully refactored ✅🚀'))
        })
} else if (argv.link) {
    replaceEntities(argv.path)
    let file = fs.readFileSync(argv.path, 'utf8')

    let exitCode = 0
    const brokenLinks = []

    const htmlChecker = new blc.HtmlChecker(
        {
            excludeInternalLinks: true,
            cacheResponses: false,
            responseTimeout: 120000,
            retryHeadFail: false,
            // requestMethod: 'HEAD',
            requestMethod: 'GET',
            filterLevel: 0,
            detailedOutput: argv.detailed,
        },
        {
            link: arg => {
                if (arg.broken && arg.brokenReason !== 'BLC_INVALID') {
                    exitCode = 1
                    if (argv.detailed) {
                        brokenLinks.push([
                            arg.url.original,
                            arg.brokenReason,
                            arg.http?.response?.statusMessage,
                        ])
                    } else {
                        console.log(
                            chalk.yellow.underline(arg.url.original),
                            '|',
                            chalk.redBright.bold(arg.brokenReason),
                            '|',
                            arg.http?.response?.statusMessage,
                        )
                    }
                }
            },
            complete: () => {
                htmlChecker.clearCache()
                if (argv.detailed) {
                    brokenLinks.map(error => {
                        console.log(
                            chalk.yellow.underline(error[0]),
                            '|',
                            chalk.redBright.bold(error[1]),
                            '|',
                            error[2],
                        )
                    })
                }

                console.log(chalk.greenBright.bold('Link Check Complete ✅'))
                process.exit(exitCode)
            },
            error: error => {
                console.log(error)
            },
        },
    )
    htmlChecker.clearCache()
    htmlChecker.scan(file)
} else if (argv.xmlToMarkdown) {
    refactorXmlToMd(argv.path, argv.output)
} else {
    refactorBlockCodeToFiles(argv.path, argv.output, argv.entities)
    console.log(chalk.greenBright.bold('Successfully refactored ✅🚀'))
    process.exit(0)
}
