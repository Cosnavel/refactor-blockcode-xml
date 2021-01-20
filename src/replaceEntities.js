const fs = require('fs')

function replace(searchValue, replaceValue, source) {
	return source.replaceAll(searchValue, replaceValue)
}

const removeEntities = (entities, source) => {
	for (const [key, value] of Object.entries(entities)) {
		source = replace(key, value, source)
	}
	return source
}

const replaceEntities = filePath => {
	let file = fs.readFileSync(filePath, 'utf8')

	file = removeEntities(
		{
			'&nbsp;': '&#x00A0;',
			'&shy;': '&#x00AD;',
			'&thinsp;': '',
			'&zwsp;': '',
			'&ndash;': '–',
			'&mdash;': '—',
			'&hellip;': '…',
			'&times;': '×',
			'&darr;': '↓',
			'&larr;': '←',
			'&uarr;': '↑',
			'&rarr;': '→',
			'&rsquo;': '’',
			'&lsquo;': '‘',
			'&raquo;': '»',
			'&laquo;': '«',
			'&rsaquo;': '›',
			'&lsaquo;': '‹',
			'&bdquo;': '„',
			'&ldquo;': '“',
			'&rdquo;': '”',
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

	fs.writeFileSync(filePath, file)
}

module.exports = { replaceEntities, removeEntities }
