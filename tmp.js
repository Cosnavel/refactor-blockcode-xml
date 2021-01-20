const jsdom = require('jsdom')
const fs = require('fs')
const fse = require('fs-extra')

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
			modifyBlockCode(blockcode, `${id}.js`)
			id++
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
	regex = new RegExp(/<html(.|\n)*<\/html>/, 'gm')
	file3 = file2.replace(regex, html.outerHTML)
	fse.outputFileSync('dist/html/book.xml', file3)
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

// let newBookXML = fs.readFileSync('./dist/html/book.xml', 'utf8')
// newBookXML = removeEntities(
// 	{
// 		// '&#x00A0;': '&nbsp;',
// 		// '&#x00A0;': '&nbsp;',
// 		// '&#x00AD;': '&shy;',
// 		// '&#x202F;': '&thinsp;',
// 		// '&#x200B;': '&zwsp;',
// 		// '&#8211;': '&ndash;',
// 		// '&#x2014;': '&mdash;',
// 		// '&#8230;': '&hellip;',
// 		// '&#215;': '&times;',
// 		// '&#8595;': '&darr;',
// 		// '&#8592;': '&larr;',
// 		// '&#8593;': '&uarr;',
// 		// '&#8594;': '&rarr;',
// 		// '&#8217;': '&rsquo;',
// 		// '&#8216;': '&lsquo;',
// 		// '&#187;': '&raquo;',
// 		// '&#171;': '&laquo;',
// 		// '&#8250;': '&rsaquo;',
// 		// '&#8249;': '&lsaquo;',
// 		// '&#8222;': '&bdquo;',
// 		// '&#8220;': '&ldquo;',
// 		// '&#8221;': '&rdquo;',

// 		'https://github.com/Webmasters-Europe/js_dom_table_of_content/releases/tag/2.7.0':
// 			'&table_of_content_solution;',

// 		'https://github.com/Webmasters-Europe/js_dom_search_and_replace/releases/tag/2.7.0':
// 			'&search_and_replace_solution;',
// 		'https://tableofcontent.webmasters-akademie.dev/': '&toc_demo;',
// 		'https://search-replace.webmasters-akademie.dev/': '&sar_demo;',

// 		'https://github.com/Webmasters-Europe/js_basics_royal_flush/releases/tag/1.9.0':
// 			'&royal_flush_solution;',

// 		'https://github.com/Webmasters-Europe/js_basics_flood_fill/releases/tag/1.9.0':
// 			'&flood_fill_solution;',

// 		'https://github.com/Webmasters-Europe/js_basics_alk_test/releases/tag/1.9.0':
// 			'&alk_test_solution;',

// 		'https://terminal.webmasters-akademie.dev': '&terminal_demo;',
// 	},
// 	newBookXML,
// )

// fs.writeFileSync('./dist/html/book.xml', newBookXML)
