const jsdom = require('jsdom')
const fs = require('fs')
const fse = require('fs-extra')
const Minio = require('minio')

const { removeEntities } = require('./replaceEntities')

const { JSDOM } = jsdom

const parse = path => {
    return new JSDOM(fs.readFileSync(path), {
        contentType: 'text/xml',
        parsingMode: 'xml',
    })
}

function removeDocumentHead() {
    const { document } = dom.window
    document.querySelector('head').innerHTML = ''
}

function makeXMLCustomTagsMarkdownCompatible() {
    const { document } = dom.window

    // remove questions
    Array.from(document.getElementsByTagName('questions')).forEach(elem => {
        elem.remove()
    })
    // blockcode to code
    // Array.from(document.getElementsByTagName('blockcode')).forEach(elem => {
    //     let type = elem.getAttribute('type')
    //     elem.outerHTML = `<pre><code type="${type}">${elem.innerHTML}</code></pre>`
    // })

    // h3 to h4
    Array.from(document.getElementsByTagName('h3')).forEach(elem => {
        elem.outerHTML = `<h4>${elem.innerHTML}</h4>`
    })
    // h2 to h3
    Array.from(document.getElementsByTagName('h2')).forEach(elem => {
        elem.outerHTML = `<h3>${elem.innerHTML}</h3>`
    })
    // h1 to h2
    Array.from(document.getElementsByTagName('h1')).forEach(elem => {
        elem.outerHTML = `<h2>${elem.innerHTML}</h2>`
    })

    // remove keyword
    Array.from(document.getElementsByTagName('keyword')).forEach(elem => {
        elem.outerHTML = `<b>${elem.innerHTML}</b>`
    })
    // remove topic
    Array.from(document.getElementsByTagName('topics')).forEach(elem => {
        elem.outerHTML = `<ul>${elem.innerHTML}</ul>`
    })

    // remove assignment stuff
    Array.from(document.getElementsByTagName('assignement')).forEach(elem => {
        Array.from(elem.querySelectorAll(':scope > name')).forEach(name => {
            name.outerHTML = `<h1>${name.innerHTML}</h1>`
        })
        Array.from(elem.querySelectorAll(':scope > content')).forEach(
            content => {
                content.outerHTML = `${content.innerHTML}`
            },
        )
        Array.from(elem.querySelectorAll(':scope > answer')).forEach(answer => {
            answer.outerHTML = `<hr/><h2>Lösung</h2>${answer.innerHTML}`
        })
        Array.from(elem.querySelectorAll(':scope > criteria')).forEach(
            criteria => {
                criteria.remove()
            },
        )
        Array.from(
            elem.querySelectorAll(':scope > submission_instructions'),
        ).forEach(submissionInstructions => {
            submissionInstructions.remove()
        })

        elem.outerHTML = `${elem.innerHTML}`
    })
    // remove about_author stuff
    Array.from(document.getElementsByTagName('about_author')).forEach(elem => {
        Array.from(elem.querySelectorAll(':scope > h3')).forEach(name => {
            name.outerHTML = `<h1>${name.innerHTML}</h1>`
        })
        elem.outerHTML = `${elem.innerHTML}`
    })
    // remove preface stuff
    Array.from(document.getElementsByTagName('preface')).forEach(elem => {
        elem.outerHTML = `<h1>Einführung</h1>${elem.innerHTML}`
    })

    // remove lesson_name
    Array.from(document.getElementsByTagName('lesson_name')).forEach(elem => {
        elem.outerHTML = `<h1>${elem.innerHTML}</h1>`
    })
    // remove lesson
    Array.from(document.getElementsByTagName('lesson')).forEach(elem => {
        elem.outerHTML = `${elem.innerHTML}`
    })
    // remove lessons
    Array.from(document.getElementsByTagName('lessons')).forEach(elem => {
        elem.outerHTML = `${elem.innerHTML}`
    })
    // remove exercise tag
    Array.from(document.getElementsByTagName('exercise')).forEach(elem => {
        elem.outerHTML = `${elem.innerHTML}`
    })
    // exercise name to h3
    Array.from(document.getElementsByTagName('name')).forEach(elem => {
        elem.outerHTML = `<h3>${elem.innerHTML}</h3>`
    })
    // remove exercise content tag
    Array.from(document.getElementsByTagName('content')).forEach(elem => {
        elem.outerHTML = `${elem.innerHTML}`
    })
    // remove exercise answer tag
    Array.from(document.getElementsByTagName('answer')).forEach(elem => {
        elem.outerHTML = `<h4>Answer</h4>${elem.innerHTML}`
    })

    // walkthrough step to li
    Array.from(document.getElementsByTagName('step')).forEach(elem => {
        elem.outerHTML = `<li>${elem.innerHTML}</li>`
    })

    // remove walkthrough tag and change content to ol
    Array.from(document.getElementsByTagName('walkthrough')).forEach(elem => {
        Array.from(elem.querySelectorAll(':scope > content')).forEach(el => {
            el.outerHTML = `<ol>${el.innerHTML}</ol>`
        })
        elem.outerHTML = `${elem.innerHTML}`
    })

    // remove figure tag
    Array.from(document.getElementsByTagName('figure')).forEach(elem => {
        elem.outerHTML = `${elem.innerHTML}`
    })

    // remove figcaption tag
    Array.from(document.getElementsByTagName('figcaption')).forEach(elem => {
        elem.outerHTML = `<p><i>${elem.innerHTML}</i></p>`
    })
}

function makeImageAssetsMarkdownCompatible(className) {
    const { document } = dom.window
    // upload images to s3
    Array.from(document.getElementsByTagName('img')).forEach(elem => {
        let src = elem.getAttribute('src')

        if (src && !['http', 'www'].some(w => src.includes(w))) {
            data = fs.readFileSync(src)
            uploadImageToS3(data, retrieveFileNameFromPath(src), className)
            let newSrcForImage = `https://${process.env.MINIO_ENDPOINT}:${
                process.env.MINIO_PORT
            }/${
                process.env.MINIO_BUCKET
            }/${className}/${retrieveFileNameFromPath(src)}`
            elem.setAttribute('src', newSrcForImage)
        }
    })
}

function uploadImageToS3(data, filename, className) {
    require('dotenv').config()
    const minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT,
        port: parseInt(process.env.MINIO_PORT),
        useSSL: true,
        accessKey: process.env.MINIO_KEY,
        secretKey: process.env.MINIO_SECRET,
    })

    minioClient.putObject(
        process.env.MINIO_BUCKET,
        `${className}/${filename}`,
        data,
        function (error, objInfo) {
            if (error) {
                return console.error(error)
            }
        },
    )
}

function makeVideosMarkdownCompatible() {
    const { document } = dom.window

    Array.from(document.getElementsByTagName('video')).forEach(elem => {
        let src = elem.getAttribute('src')

        Array.from(
            elem.querySelectorAll(':scope > alternative_content'),
        ).forEach(name => {
            name.outerHTML = `${name.innerHTML}`
        })
        elem.outerHTML = `<video src="${src}" />${elem.innerHTML}`
    })
}

function retrieveFileNameFromPath(path) {
    return path.split('\\').pop().split('/').pop()
}

function blockcodeFileToInline() {
    const { document } = dom.window

    function getAllBlockCodesWithoutSource() {
        return Array.from(document.querySelectorAll('blockcode')).filter(elem =>
            elem.hasAttribute('src'),
        )
    }

    function setBlockCodeToInline(blockcodes) {
        blockcodes.forEach(blockcode => {
            let filePath = blockcode.getAttribute('src')
            let fileExtension = filePath.split('.').pop()

            blockcode.getAttribute('type') ??
                blockcode.setAttribute('type', fileExtension)

            let data
            try {
                data = fs.readFileSync(filePath, 'utf8')
            } catch (err) {
                console.log(err)
                return
            }

            blockcode.innerHTML = removeEntities(
                {
                    '…': '...',
                    '<': '&lt;',
                    '>': '&gt;',
                    '&': '&amp;',
                },
                data,
            )
            blockcode.removeAttribute('src')

            fse.remove(filePath, err => {
                if (err) return console.error(err)
            })
        })
    }
    const allBlockcodes = getAllBlockCodesWithoutSource()
    setBlockCodeToInline(allBlockcodes)
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
                        '&amp;': '&',
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
                        '&amp;': '&',
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
                    '&amp;': '&',
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
                let fileExtension = node.getAttribute('type') ?? 'txt'
                let filename = `${prefix}${namingIterator}_${i}.${fileExtension}`
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
                let fileExtension = blockcode.getAttribute('type') ?? 'txt'

                let data = {
                    filename: `${id}.${fileExtension}`,
                    value: blockcode.innerHTML,
                }

                persistBlockCode(data)
                modifyBlockCode(blockcode, `${id}.${fileExtension}`)
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
    blockcodeFileToInline,
    removeDocumentHead,
    makeXMLCustomTagsMarkdownCompatible,
    makeImageAssetsMarkdownCompatible,
    makeVideosMarkdownCompatible,
}
