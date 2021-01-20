#!/usr/bin/env node

const chalk = require('chalk')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const figlet = require('figlet')
const inquirer = require('inquirer')

const replaceEntities = require('src/replaceEntities')
const { parse, refactor } = require('src/refactor')
const exportHTML = require('src/export')

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
	entities: {
		alias: 'e',
		type: 'boolean',
		description: 'reset entities after refactoring blockcode',
		default: false,
	},
}).argv

if (argv.interactive) {
	inquirer
		.prompt([
			{
				name: 'input',
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
		.then(path => console.log(path))
} else {
	replaceEntities(argv.path)
	refactor(parse(argv.path), argv.output)
	exportHTML(argv.path, argv.output)
	console.log(chalk.white.bold(`Input, ${argv.path}!`))
	console.log(chalk.white.bold(`Output, ${argv.output}!`))
	console.log(chalk.white.bold(`Entities, ${argv.e}!`))
}

console.log(chalk.greenBright.bold('Succuessfully refactored ✅🚀'))
