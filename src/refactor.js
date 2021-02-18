const jsdom = require('jsdom')
const fs = require('fs')
const fse = require('fs-extra')
const hljs = require('highlight.js')

const { removeEntities } = require('./replaceEntities')

const { JSDOM } = jsdom

const commonLanguages = [
    'css',
    'javascript',
    'json',
    'html',
    'markdown',
    'php',
    'plaintext',
    'sql',
    'scss',
    'xml',
    'typescript',
    'yaml',
]

const languageExtensions = [
    {
        id: 'css',
        extension: '.css',
    },
    {
        id: 'javascript',
        extension: '.js',
    },
    {
        id: 'json',
        extension: '.json',
    },
    {
        id: 'html',
        extension: '.html',
    },
    {
        id: 'markdown',
        extension: '.md',
    },
    {
        id: 'php',
        extension: '.php',
    },
    {
        id: 'plaintext',
        extension: '.txt',
    },
    {
        id: 'sql',
        extension: '.sql',
    },
    {
        id: 'scss',
        extension: '.scss',
    },
    {
        id: 'xml',
        extension: '.xml',
    },
    {
        id: 'typescript',
        extension: '.ts',
    },
    {
        id: 'yaml',
        extension: '.yaml',
    },
]

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

    function writeCleanBlockcode(filename, value) {
        value = removeEntities(
            {
                '&lt;': '<',
                '&gt;': '>',
                '&amp;': '&',
            },
            value,
        )
        response = hljs.highlightAuto(value, commonLanguages)

        let extension
        for (lang of languageExtensions) {
            if (lang.id == response.language && response.relevance >= 9) {
                extension = lang.extension
            }
        }
        extension ? '' : (extension = '.txt')
        //fse.outputFileSync(`${output}code/${filename}`, value)
        try {
            fs.writeFileSync(`${output}code/${filename + extension}`, value)
        } catch (e) {
            console.log('inherit filename')
            // try {
            //     fs.writeFileSync(`${output}code/${new_filename + extension}`, value)
            // } catch (e) {
            //     console.error("We couldnt create a proper file for you")
            //     return
            // }
        } finally {
            console.log('done')
        }
    }

    function persistBlockCode(data) {
        const { questionTextBlockCodes, answerBlockCodes } = data
        if (questionTextBlockCodes) {
            questionTextBlockCodes.forEach(blockcode => {
                let { filename, value } = blockcode
                writeCleanBlockcode(filename, value)
            })
        }
        if (answerBlockCodes) {
            answerBlockCodes.forEach(blockcode => {
                let { filename, value } = blockcode
                writeCleanBlockcode(filename, value)
            })
        }
        if (data.value && data.filename) {
            writeCleanBlockcode(data.filename, data.value)
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
