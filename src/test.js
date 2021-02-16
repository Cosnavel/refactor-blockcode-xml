const hljs = require('highlight.js');
var commonLanguages = ["css", "javascript","json", "http","html", "markdown", "php", "php-template", "plaintext", "sql", "scss",  "xml","typescript", "yaml"];




txt = `KO: nope
Error: nope
    at tryWork (/Users/chris/01/examples/stack_trace.js:8:16)
    at new Promise (<anonymous>)
    at Object.<anonymous> (/Users/chris/01/examples/stack_trace.js:12:1)
    at Module._compile (module.js:643:30)
    at Object.Module._extensions..js (module.js:654:10)
    at Module.load (module.js:556:32)
    at tryModuleLoad (module.js:499:12)
    at Function.Module._load (module.js:491:3)
    at Function.Module.runMain (module.js:684:10)
    at startup (bootstrap_node.js:187:16)`
response = hljs.highlightAuto(txt, commonLanguages)
console.log("Should be plaintext")
console.log(response.language)
console.log(response.relevance)

js = `const printDelay = (time, str) =>
new Promise(resolve =>
    setTimeout(() => {
        console.log(str)
        resolve()
    }, time),
)`
response2 = hljs.highlightAuto(js, commonLanguages)
console.log("Should be js")
console.log(response2.language)
console.log(response2.relevance)


txt2 = `IP address = 54.93.168.85`

response3 = hljs.highlightAuto(txt2, commonLanguages)
console.log("Should be plaintext")
console.log(response3.language)
console.log(response3.relevance)

txt3 = `nerdshop_investors/
+-package.json
+-server.js
+-public/
    +-index.html
    +-style.css`

response4 = hljs.highlightAuto(txt3, commonLanguages)
console.log("Should be plaintext")
console.log(response4.language)
console.log(response4.relevance)

html = `price (NYSE): $<span id="price">174.00</span><br>
volume: <span id='volume'>16000000</span><br>
time: <span id='time'>16:15</span><br>`

response5 = hljs.highlightAuto(html, commonLanguages)
console.log("Should be html")
console.log(response5.language)
console.log(response5.relevance)

ejs = `// 06/examples/nerdshop9/public/view_product_edit.js - Zeile 14
<% if (product.code) { %> disabled <% } %>
`
response6 = hljs.highlightAuto(ejs, commonLanguages)
console.log("Should be js")
console.log(response6.language)
console.log(response6.relevance)


json = `{
    "id": 1,
    "edited": "2014-12-20T20:58:18.411Z",
    "climate": "arid",
    "surface_water": "1",
    "name": "Tatooine",
    "diameter": "10465",
    "rotation_period": "23",
    "created": "2014-12-09T13:50:49.641Z",
    "terrain": "desert",
    "gravity": "1 standard",
    "orbital_period": "304",
    "population": "200000"
  } `
response7 = hljs.highlightAuto(json, commonLanguages)
console.log("Should be json")
console.log(response7.language)
console.log(response7.relevance)

jsx = `import React, { useState } from 'react'
export const PriceInput = props => {
    const [amount, setAmount] = useState(0)
    const changeValue = e => {
        console.log('new Value: ' + e.target.value)
        setAmount(e.target.value)
    }
    return (
        <span>
            $
            <input
                type="number"
                value={amount}
                style={{ width: '50px', color: 'cornflowerblue' }}
                onChange={changeValue}
            />
        </span>
    )
}
`
response8 = hljs.highlightAuto(jsx, commonLanguages)
console.log("Should be js")
console.log(response8.language)
console.log(response8.relevance)


php = `<?php
Gate::before(function ($user, $ability) {
    if ($user->abilities()->contains($ability)) {
        return true;
    }
});`
response9 = hljs.highlightAuto(php, commonLanguages)
console.log("Should be php")
console.log(response9.language)
console.log(response9.relevance)

blade = `@if (count($records) === 1)
I have one record!
@elseif (count($records) > 1)
I have multiple records!
@else
I don't have any records!
@endif`
response10 = hljs.highlightAuto(blade, commonLanguages)
console.log("Should be php")
console.log(response10.language)
console.log(response10.relevance)
