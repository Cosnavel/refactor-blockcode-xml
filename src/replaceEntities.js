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
			'&table_of_content_solution;': '-table_of_content_solution-',
			'&search_and_replace_solution;': '-search_and_replace_solution-',
			'&toc_demo;': '-toc_demo-',
			'&sar_demo;': '-sar_demo-',
			'&royal_flush_solution;': '-royal_flush_solution-',
			'&flood_fill_solution;': '-flood_fill_solution-',
			'&alk_test_solution;': '-alk_test_solution-',
			'&terminal_demo;': '-terminal_demo-',
			'&thumbnails_solution;': '-thumbnails_solution-',
			'&systeminfo_solution;': '-systeminfo_solution-',
			'&nobelprice_solution;': '-nobelprice_solution-',
			'&systeminfo_demo;': '-systeminfo_demo-',
			'&nobelprice_demo;': '-nobelprice_demo-',
			'&square_solution;': '-square_solution-',
			'&square_demo;': '-square_demo-',
			'&tictactoe_solution;': '-tictactoe_solution-',
			'&tictactoe_demo;': '-tictactoe_demo-',
		},
		file,
	)

	fs.writeFileSync(filePath, file)
}

module.exports = {
	replaceEntities,
	removeEntities,
}
