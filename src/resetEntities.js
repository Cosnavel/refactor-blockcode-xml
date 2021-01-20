const fs = require('fs')

const resetEntities = output => {
	let bookXML = fs.readFileSync(`${output}book.xml`, 'utf8')
	bookXML = removeEntities(
		{
			'&#x00A0;': '&nbsp;',
			'&#x00A0;': '&nbsp;',
			'https://github.com/Webmasters-Europe/js_dom_table_of_content/releases/tag/2.7.0':
				'&table_of_content_solution;',

			'https://github.com/Webmasters-Europe/js_dom_search_and_replace/releases/tag/2.7.0':
				'&search_and_replace_solution;',
			'https://tableofcontent.webmasters-akademie.dev/': '&toc_demo;',
			'https://search-replace.webmasters-akademie.dev/': '&sar_demo;',

			'https://github.com/Webmasters-Europe/js_basics_royal_flush/releases/tag/1.9.0':
				'&royal_flush_solution;',

			'https://github.com/Webmasters-Europe/js_basics_flood_fill/releases/tag/1.9.0':
				'&flood_fill_solution;',

			'https://github.com/Webmasters-Europe/js_basics_alk_test/releases/tag/1.9.0':
				'&alk_test_solution;',

			'https://terminal.webmasters-akademie.dev': '&terminal_demo;',
		},
		bookXML,
	)

	fs.writeFileSync(`${output}book.xml`, bookXML)
}
module.exports = resetEntities
