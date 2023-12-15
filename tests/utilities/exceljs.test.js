"use strict"

const exceljs = require("../../src/utilities/exceljs")

test("Successfully create excel file", () => {
	return exceljs({
		data: {
			users: [
				{
					fullName: "yudha",
					age: 5,
				},
			],
		},
	}).then(({ workbook }) => workbook.xlsx.writeFile("test.xlsx"))
})
