#!/usr/bin/env node

// Redo Entities
// Output folder
// Success meldung
// Siltent
// Interactive

const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const figlet = require('figlet')
const inquirer = require('inquirer')

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
	console.log('interactive')
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
	console.log(argv)

	console.log(chalk.white.bold(`Input, ${argv.path}!`))
	console.log(chalk.white.bold(`Output, ${argv.output}!`))
	console.log(chalk.white.bold(`Entities, ${argv.e}!`))
}

// const boxenOptions = {
// 	padding: 1,
// 	margin: 1,
// 	borderStyle: 'round',
// 	borderColor: 'green',
// 	backgroundColor: '#555555',
// }
// const msgBox = boxen(greeting, boxenOptions)
