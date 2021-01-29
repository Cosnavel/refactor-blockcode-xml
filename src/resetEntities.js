const fs = require('fs')
const { removeEntities } = require('./replaceEntities')

const resetEntities = output => {
	let bookXML = fs.readFileSync(`${output}book.xml`, 'utf8')

	bookXML = removeEntities(
		{
			'&#x00A0;': '&nbsp;',
			'&#x00A0;': '&nbsp;',
			'-table_of_content_solution-': '&table_of_content_solution;',
			'-search_and_replace_solution-': '&search_and_replace_solution;',
			'-toc_demo-': '&toc_demo;',
			'-sar_demo-': '&sar_demo;',
			'-royal_flush_solution-': '&royal_flush_solution;',
			'-flood_fill_solution-': '&flood_fill_solution;',
			'-alk_test_solution-': '&alk_test_solution;',
			'-terminal_demo-': '&terminal_demo;',
			'-thumbnails_solution-': '&thumbnails_solution;',
			'-systeminfo_solution-': '&systeminfo_solution;',
			'-nobelprice_solution-': '&nobelprice_solution;',
			'-systeminfo_demo-': '&systeminfo_demo;',
			'-nobelprice_demo-': '&nobelprice_demo;',
			'-square_solution-': '&square_solution;',
			'-square_demo-': '&square_demo;',
			'-tictactoe_solution-': '&tictactoe_solution;',
			'-tictactoe_demo-': '&tictactoe_demo;',
		},
		bookXML,
	)

	fs.writeFileSync(`${output}book.xml`, bookXML)
}
module.exports = resetEntities
