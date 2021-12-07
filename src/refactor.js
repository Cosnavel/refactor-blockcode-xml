const jsdom = require('jsdom')
const fs = require('fs')
const fse = require('fs-extra')
const Minio = require('minio')
const async = require('async')

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

    async.series(
        [
            function (callback) {
                const questions = Array.from(
                    document.getElementsByTagName('questions'),
                )
                for (const question of questions) {
                    question.remove()
                }
                callback(null, 'removedQuestions')
            },
            //function (callback) {
            // blockcode to code
            // Array.from(document.getElementsByTagName('blockcode')).forEach(elem => {
            //     let type = elem.getAttribute('type')
            //     elem.outerHTML = `<pre><code type="${type}">${elem.innerHTML}</code></pre>`
            // })
            // },
            function (callback) {
                const h3s = Array.from(document.getElementsByTagName('h3'))
                for (const h3 of h3s) {
                    h3.outerHTML = `<h4>${h3.innerHTML}</h4>`
                }
                callback(null, 'h3Toh4')
            },
            function (callback) {
                const h2s = Array.from(document.getElementsByTagName('h2'))
                for (const h2 of h2s) {
                    h2.outerHTML = `<h3>${h2.innerHTML}</h3>`
                }
                callback(null, 'h2Toh3')
            },
            function (callback) {
                const h1s = Array.from(document.getElementsByTagName('h1'))
                for (const h1 of h1s) {
                    // if (!h1.innerHTML.contains())
                    h1.outerHTML = `<h2>${h1.innerHTML}</h2>`
                }
                callback(null, 'h1Toh2')
            },
            function (callback) {
                const keywords = Array.from(
                    document.getElementsByTagName('keyword'),
                )
                for (const keyword of keywords) {
                    keyword.outerHTML = `<b>${keyword.innerHTML}</b>`
                }
                callback(null, 'removedKeywords')
            },
            function (callback) {
                const topics = Array.from(
                    document.getElementsByTagName('topics'),
                )
                for (const topic of topics) {
                    topic.outerHTML = `<ul>${topic.innerHTML}</ul>`
                }
                callback(null, 'removedTopics')
            },
            function (callback) {
                const assignements = Array.from(
                    document.getElementsByTagName('assignment'),
                )
                for (const assignement of assignements) {
                    const names = Array.from(
                        assignement.querySelectorAll(':scope > name'),
                    )
                    for (const name of names) {
                        name.outerHTML = `<h1>${name.innerHTML}</h1>`
                    }
                    const contents = Array.from(
                        assignement.querySelectorAll(':scope > content'),
                    )
                    for (const content of contents) {
                        content.outerHTML = `${content.innerHTML}`
                    }
                    const answers = Array.from(
                        assignement.querySelectorAll(':scope > answer'),
                    )
                    for (const answer of answers) {
                        answer.outerHTML = `<hr/><h2>Lösung</h2>${answer.innerHTML}`
                    }
                    const criterias = Array.from(
                        assignement.querySelectorAll(':scope > criteria'),
                    )
                    for (const criteria of criterias) {
                        criteria.remove()
                    }
                    const submissionInstructions = Array.from(
                        assignement.querySelectorAll(
                            ':scope > submission_instructions',
                        ),
                    )
                    for (const submissionInstruction of submissionInstructions) {
                        submissionInstruction.remove()
                    }
                    assignement.outerHTML = `${assignement.innerHTML}`
                }
                callback(null, 'convertedAssignments')
            },
            function (callback) {
                const aboutAuthors = Array.from(
                    document.getElementsByTagName('about_author'),
                )

                for (const aboutAuthor of aboutAuthors) {
                    const aboutAuthorH4s = Array.from(
                        aboutAuthor.querySelectorAll(':scope > h4'),
                    )

                    for (const aboutAuthorH4 of aboutAuthorH4s) {
                        aboutAuthorH4.outerHTML = `<h1>${aboutAuthorH4.innerHTML}</h1>`
                    }

                    aboutAuthor.outerHTML = `${aboutAuthor.innerHTML}`
                }
                callback(null, 'convertedAboutAuthor')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('preface')).forEach(
                    elem => {
                        elem.outerHTML = `<h1>Einführung</h1>${elem.innerHTML}`
                    },
                ),
                    callback(null, 'convertedPreface')
            },
            function (callback) {
                Array.from(
                    document.getElementsByTagName('lesson_name'),
                ).forEach(elem => {
                    elem.outerHTML = `<h1>${elem.innerHTML}</h1>`
                }),
                    callback(null, 'convertedLessonName')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('lesson')).forEach(
                    elem => {
                        elem.outerHTML = `${elem.innerHTML}`
                    },
                ),
                    callback(null, 'removedLesson')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('lessons')).forEach(
                    elem => {
                        elem.outerHTML = `${elem.innerHTML}`
                    },
                ),
                    callback(null, 'removedLessons')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('exercise')).forEach(
                    elem => {
                        elem.outerHTML = `${elem.innerHTML}`
                    },
                ),
                    callback(null, 'convertedExercises')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('name')).forEach(
                    elem => {
                        elem.outerHTML = `<h3>${elem.innerHTML}</h3>`
                    },
                ),
                    callback(null, 'convertedExerciseNameToH3')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('content')).forEach(
                    elem => {
                        elem.outerHTML = `${elem.innerHTML}`
                    },
                ),
                    callback(null, 'removedExerciseContent')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('answer')).forEach(
                    elem => {
                        elem.outerHTML = `<h4>Answer</h4>${elem.innerHTML}`
                    },
                ),
                    callback(null, 'convertedExerciseAnswers')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('step')).forEach(
                    elem => {
                        elem.outerHTML = `<li>${elem.innerHTML}</li>`
                    },
                ),
                    callback(null, 'convertedWalkthroughSteps')
            },
            function (callback) {
                Array.from(
                    document.getElementsByTagName('walkthrough'),
                ).forEach(elem => {
                    Array.from(
                        elem.querySelectorAll(':scope > content'),
                    ).forEach(el => {
                        el.outerHTML = `<ol>${el.innerHTML}</ol>`
                    })
                    elem.outerHTML = `${elem.innerHTML}`
                }),
                    callback(null, 'convertedWalkthroughs')
            },
            function (callback) {
                Array.from(document.getElementsByTagName('figure')).forEach(
                    elem => {
                        elem.outerHTML = `${elem.innerHTML}`
                    },
                    callback(null, 'removedFigures'),
                )
            },
            function (callback) {
                const figcaptions = Array.from(
                    document.getElementsByTagName('figcaption'),
                )

                for (const figcaption of figcaptions) {
                    figcaption.outerHTML = `<p><i>${figcaption.innerHTML}</i></p>`
                }

                callback(null, 'removedFigcaptions')
            },
        ],
        function (err, results) {
            //debugging only
            // console.log('done converting tags'), console.log(results)
        },
    )
}

function makeImageAssetsMarkdownCompatible(className) {
    const { document } = dom.window
    // upload images to s3

    const images = Array.from(document.getElementsByTagName('img'))

    for (const img of images) {
        let src = img.getAttribute('src')

        if (src && !['http', 'www'].some(w => src.includes(w))) {
            data = fs.readFileSync(src)
            uploadImageToS3(data, retrieveFileNameFromPath(src), className)
            let newSrcForImage = `https://${process.env.MINIO_ENDPOINT}:${
                process.env.MINIO_PORT
            }/${
                process.env.MINIO_BUCKET
            }/${className}/${retrieveFileNameFromPath(src)}`
            img.setAttribute('src', newSrcForImage)
        }
    }
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
        elem.outerHTML = `<video>${src}</video>${elem.innerHTML}`
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

            blockcode.innerHTML = filePath
            // blockcode.removeAttribute('src')

            // let data
            // try {
            //     data = fs.readFileSync(filePath, 'utf8')
            // } catch (err) {
            //     console.log(err)
            //     return
            // }

            // blockcode.innerHTML = removeEntities(
            //     {
            //         '…': '...',
            //         '<': '&lt;',
            //         '>': '&gt;',
            //         '&': '&amp;',
            //     },
            //     data,
            // )
            // blockcode.removeAttribute('src')

            // fse.remove(filePath, err => {
            //     if (err) return console.error(err)
            // })
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
