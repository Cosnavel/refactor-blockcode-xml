const jsdom = require('jsdom')
const fs = require('fs')
const fse = require('fs-extra')

const { removeEntities } = require('./replaceEntities')

const { JSDOM } = jsdom

const parse = path => {
	return new JSDOM(fs.readFileSync(path), {
		contentType: 'text/xml',
		parsingMode: 'xml',
	})
}

const refactor = (dom, output) => {
	const { document } = dom.window

	function getAllBlockCodes() {
		return Array.from(document.querySelectorAll('blockcode')).filter(
			elem => !elem.hasAttribute('src'),
		)
	}

	function getAllQuestions() {
		return Array.from(document.querySelectorAll('question'))
	}

	function getElementInParent(element, parent) {
		return Array.from(
			document.querySelectorAll(`${parent} > ${element}`),
		).filter(elem => !elem.hasAttribute('src'))
	}

	function modifyBlockCode(element, filename) {
		element.innerHTML = ''
		element.setAttribute('src', `code/${filename}`)
	}

	function persistBlockCode(data) {
		const { questionTextBlockCodes, answerBlockCodes } = data
		if (questionTextBlockCodes) {
			questionTextBlockCodes.forEach(blockcode => {
				let { filename, value } = blockcode
				value = removeEntities(
					{
						'&lt;': '<',
						'&gt;': '>',
					},
					value,
				)

				fse.outputFileSync(`${output}code/${filename}`, value)
			})
		}
		if (answerBlockCodes) {
			answerBlockCodes.forEach(blockcode => {
				let { filename, value } = blockcode
				value = removeEntities(
					{
						'&lt;': '<',
						'&gt;': '>',
					},
					value,
				)
				fse.outputFileSync(`${output}code/${filename}`, value)
			})
		}
		if (data.value && data.filename) {
			data.value = removeEntities(
				{
					'&lt;': '<',
					'&gt;': '>',
				},
				data.value,
			)
			fse.outputFileSync(`${output}code/${data.filename}`, data.value)
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

				persistBlockCode(data)
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
				persistBlockCode({
					questionTextBlockCodes,
					answerBlockCodes,
				})
				questionID++
			}
		})
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
}

module.exports = {
	parse,
	refactor,
}
