const blockcodesInQuestionText = Array.from(
	document.querySelectorAll('question_text > blockcode'),
).filter(elem => !elem.hasAttribute('src'))
const blockcodesInAnswer = Array.from(
	document.querySelectorAll('answer > blockcode'),
).filter(elem => !elem.hasAttribute('src'))
const elements = Array.from(document.querySelectorAll('question'))

//alle blockcodes in questions
let i = 1
elements.forEach(element => {
	question_text_bcs = []
	answer_bcs = []
	blockcodesInQuestionText.forEach(bc => {
		if (element.contains(bc)) {
			question_text_bcs.push(bc.innerText)
		}
	})
	blockcodesInAnswer.forEach(bc => {
		if (element.contains(bc)) {
			answer_bcs.push(bc.innerText)
		}
	})
	if ((question_text_bcs.length > 0) | (answer_bcs.length > 0)) {
		console.log({
			id: i,
			question_text_bcs,
			answer_bcs,
		})
		i++
	}
})

const blockcodes = Array.from(document.querySelectorAll('blockcode')).filter(
	elem => !elem.hasAttribute('src'),
)
elements.forEach(element => {
	let y = 1
	blockcodes.forEach(bc => {
		if (!element.contains(bc)) {
			let data = {
				id: y,
				value: bc.innerText,
			}
			y++
			//anfrage with data
			if (y < 3) {
				//mutate element
				console.log('------------')
				console.log('Before')
				console.log(bc)
				bc.innerText = ''
				bc.setAttribute('src', `code/${y}.js`)
				console.log('After')
				console.log(bc)
				console.log('-------------')
			}
		}
	})
})

// const elements = Array.from(document.querySelectorAll('blockcode')).filter(
// 	elem => !elem.hasAttribute('src'),
// )
//.filter(elem => console.log(elem.parentElement !== h1))

//blockcode with question?text parent
// elements.forEach(el => {
// 	console.log(el.closest('question_text > blockcode'))
// })
//ANswer Parent
// elements.forEach(el => {
// 	console.log(el.closest('answer blockcode'))
// })
// console.log(
// 	Array.from(document.querySelectorAll('answer < blockcode')).filter(
// 		elem => elem.attributes.src === undefined,
// 	),
// )

let data = {
	name: 'Georg',
}
// fetch('http://127.0.0.1:8081/test', {
// 	method: 'POST', // or ‘PUT’
// 	headers: {
// 		'Content-Type': 'application/json',
// 	},
// 	body: JSON.stringify(data),
// })
