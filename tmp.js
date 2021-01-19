const jsdom = require('jsdom')
const fs = require('fs')
const fse = require('fs-extra')

let file = fs.readFileSync('./public/index.xml', 'utf8')

function replace(searchValue, replaceValue, source) {
	return source.replaceAll(searchValue, replaceValue)
}

const removeEntities = (entities, source) => {
	for (const [key, value] of Object.entries(entities)) {
		source = replace(key, value, source)
	}
	return source
}

file = removeEntities(
	{
		'&nbsp;': '&#x00A0;',
		'&nbsp;': '&#x00A0;',
		'&shy;': '&#x00AD;',
		'&thinsp;': '&#x202F;',
		'&zwsp;': '&#x200B;',
		'&ndash;': '&#8211;',
		'&mdash;': '&#x2014;',
		'&hellip;': '&#8230;',
		'&times;': '&#215;',
		'&darr;': '&#8595;',
		'&larr;': '&#8592;',
		'&uarr;': '&#8593;',
		'&rarr;': '&#8594;',
		'&rsquo;': '&#8217;',
		'&lsquo;': '&#8216;',
		'&raquo;': '&#187;',
		'&laquo;': '&#171;',
		'&rsaquo;': '&#8250;',
		'&lsaquo;': '&#8249;',
		'&bdquo;': '&#8222;',
		'&ldquo;': '&#8220;',
		'&rdquo;': '&#8221;',
		'&table_of_content_solution;':
			'https://github.com/Webmasters-Europe/js_dom_table_of_content/releases/tag/2.7.0',
		'&search_and_replace_solution;':
			'https://github.com/Webmasters-Europe/js_dom_search_and_replace/releases/tag/2.7.0',
		'&toc_demo;': 'https://tableofcontent.webmasters-akademie.dev/',
		'&sar_demo;': 'https://search-replace.webmasters-akademie.dev/',
		'&royal_flush_solution;':
			'https://github.com/Webmasters-Europe/js_basics_royal_flush/releases/tag/1.9.0',
		'&flood_fill_solution;':
			'https://github.com/Webmasters-Europe/js_basics_flood_fill/releases/tag/1.9.0',
		'&alk_test_solution;':
			'https://github.com/Webmasters-Europe/js_basics_alk_test/releases/tag/1.9.0',

		'&terminal_demo;': 'https://terminal.webmasters-akademie.dev',
	},
	file,
)

fs.writeFileSync('./public/index.xml', file)

const { JSDOM } = jsdom
const dom = new JSDOM(fs.readFileSync('./public/index.xml'), {
	contentType: 'text/xml',
	//includeNodeLocations: false,
	//storageQuota: 1000000000,
	parsingMode: 'xml',
})

//alle blockcodes in questions

function getAllBlockCodes() {
	return Array.from(dom.window.document.querySelectorAll('blockcode')).filter(
		elem => !elem.hasAttribute('src'),
	)
}

function getAllQuestions() {
	return Array.from(dom.window.document.querySelectorAll('question'))
}

function getElementInParent(element, parent) {
	return Array.from(
		dom.window.document.querySelectorAll(`${parent} > ${element}`),
	).filter(elem => !elem.hasAttribute('src'))
}

function modifyBlockCode(element, filename) {
	element.innerHTML = ''
	element.setAttribute('src', `code/${filename}`)
}

function postBlockCode(data) {
	const { questionTextBlockCodes, answerBlockCodes } = data
	if (questionTextBlockCodes) {
		questionTextBlockCodes.forEach(blockcode => {
			let { filename, value } = blockcode
			value = removeEntities(
				{
					'&lt;': '<',
					'&gt;': '>',
					'#8595': '⬇️',
					'#8593': '⬆️',
				},
				value,
			)

			fse.outputFileSync(`dist/code/${filename}`, value)
		})
	}
	if (answerBlockCodes) {
		answerBlockCodes.forEach(blockcode => {
			let { filename, value } = blockcode
			value = removeEntities(
				{
					'&lt;': '<',
					'&gt;': '>',
					'#8595': '⬇️',
					'#8593': '⬆️',
				},
				value,
			)
			fse.outputFileSync(`dist/code/${filename}`, value)
		})
	}
	if (data.value && data.filename) {
		data.value = removeEntities(
			{
				'&lt;': '<',
				'&gt;': '>',
				'#8595': '⬇️',
				'#8593': '⬆️',
			},
			data.value,
		)
		fse.outputFileSync(`dist/code/${data.filename}`, data.value)
	}
}

function getAndEditElementInsideOfNodeArray(
	nodeList,
	element,
	namingIterator,
	prefix,
) {
	let i = 1
	filteredNodes = []
	nodeList.forEach(node => {
		if (element.contains(node)) {
			let filename = `${prefix}${namingIterator}_${i}.js`
			filteredNodes.push({
				filename,
				value: node.innerHTML,
			})
			modifyBlockCode(node, filename)
			i++
		}
	})
	return filteredNodes
}

function refactorBlockCodeOutsideOfQuestions(blockcodes, questions) {
	id = 1
	blockcodes.forEach(blockcode => {
		let isNotInQuestion = true

		questions.forEach(question => {
			if (question.contains(blockcode)) {
				isNotInQuestion = false
			}
		})

		if (isNotInQuestion) {
			let data = {
				filename: `${id}.js`,
				value: blockcode.innerHTML,
			}

			postBlockCode(data)

			id++
			modifyBlockCode(blockcode, `${id}.js`)
		}
	})
}

function refactorBlockCodeInsideOfQuestions() {
	let questionID = 1
	questions.forEach(question => {
		questionTextBlockCodes = getAndEditElementInsideOfNodeArray(
			blockCodesInQuestionText,
			question,
			questionID,
			'question',
		)
		answerBlockCodes = getAndEditElementInsideOfNodeArray(
			blockCodesInAnswer,
			question,
			questionID,
			'answer',
		)

		if (
			(questionTextBlockCodes.length > 0) |
			(answerBlockCodes.length > 0)
		) {
			postBlockCode({
				questionTextBlockCodes,
				answerBlockCodes,
			})
			questionID++
		}
	})
}

function exportHTML() {
	html = dom.window.document.querySelector('html')
	// fse.outputFileSync('dist/html/book.html', html.outerHTML)

	let file2 = fs.readFileSync('./public/index.xml', 'utf8')
	file2 = file2.replace(/<html.*<\/html>/, html.outerHTML)
	fse.outputFileSync('dist/html/book.xml', file2)
}

const blockcodes = getAllBlockCodes()
const questions = getAllQuestions()

const blockCodesInQuestionText = getElementInParent(
	'blockcode',
	'question_text',
)
const blockCodesInAnswer = getElementInParent('blockcode', 'answer')

refactorBlockCodeOutsideOfQuestions(blockcodes, questions)
refactorBlockCodeInsideOfQuestions()

exportHTML()
