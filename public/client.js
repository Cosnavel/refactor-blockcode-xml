//alle blockcodes in questions

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
	element.innerText = ''
	element.setAttribute('src', `code/${filename}`)
}

function postBlockCode(data) {
	fetch(`http://127.0.0.1:8081/code`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
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
				value: node.innerText,
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
				value: blockcode.innerText,
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
	html = document.querySelector('html')

	console.log(html)
	console.log(html.outerHTML)
	console.log(html.innerHTML)
	let data = { value: html.outerHTML }
	fetch(`http://127.0.0.1:8081/html`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
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
exportHTML()
