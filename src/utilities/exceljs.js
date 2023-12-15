"use strict"

const exceljs = require("exceljs")

const { camelCaseToSpace } = require("./string-utilities")

module.exports = {
	generateExcel: (data) => {
		return new Promise((resolve, reject) => {
			try {
				const workbook = new exceljs.Workbook()

				Object.entries(data).forEach(([worksheetName, data]) => {
					const worksheet = workbook.addWorksheet(worksheetName)

					if (data.length < 1) return

					let columns = []

					Object.keys(data[0]).forEach((column) => {
						columns.push({
							header: camelCaseToSpace(column).replace(/\b\w/g, function (match) {
								return match.toUpperCase()
							}),
							key: column,
						})
					})

					worksheet.columns = columns

					data.forEach((data) => {
						worksheet.addRow(data)
					})
				})

				return resolve({ workbook: workbook })
			} catch (error) {
				console.log("exceljs-utilities\n", error)

				switch (error?.error) {
					default:
						return reject({ error: "exceljs-utilities/unknown-error-occured" })
				}
			}
		})
	},
}
