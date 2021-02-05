#!/usr/bin/env node

const chalk = require('chalk')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const figlet = require('figlet')
const inquirer = require('inquirer')
const blc = require('broken-link-checker')
const fs = require('fs')

const { replaceEntities } = require('../src/replaceEntities')
const { parse, refactor } = require('../src/refactor')
const exportHTML = require('../src/export')
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
    entities: {
        alias: 'e',
        type: 'boolean',
        description: 'reset entities after refactoring blockcode',
        default: false,
    },
}).argv

function run(path, output, entities) {
    replaceEntities(path)
    dom = parse(path)
    refactor(dom, output)
    exportHTML(path, output)

    if (entities) {
        resetEntities(output)
    }
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
            run(input.path, input.output, input.entities)
            console.log(chalk.greenBright.bold('Successfully refactored ✅🚀'))
        })
} else if (argv.link) {
    replaceEntities(argv.path)
    let file = fs.readFileSync(argv.path, 'utf8')

    const htmlChecker = new blc.HtmlChecker(
        { excludeInternalLinks: true },
        {
            link: arg => {
                if (arg.broken && arg.brokenReason !== 'BLC_INVALID') {
                    console.log(
                        chalk.yellow.underline(arg.url.original),
                        '|',
                        chalk.redBright.bold(arg.brokenReason),
                        '|',
                        arg.http?.response?.statusMessage,
                    )
                }
            },
            complete: arg => {
                console.log(chalk.greenBright.bold('Link Check Complete ✅'))
            },
            error: error => {
                console.log(error)
            },
        },
    )
    htmlChecker.clearCache()
    htmlChecker.scan(file)
    htmlChecker.clearCache()
} else {
    run(argv.path, argv.output, argv.entities)
    console.log(chalk.greenBright.bold('Successfully refactored ✅🚀'))
}
