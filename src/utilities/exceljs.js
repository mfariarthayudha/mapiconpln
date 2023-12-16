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
				console.log("exceljs-utilities/generateExcel\n", error)

				switch (error?.error) {
					default:
						return reject({ error: "exceljs-utilities/generateExcel/unknown-error-occured" })
				}
			}
		})
	},

	readExcel: (excelFile) => {
		return new Promise(async (resolve, reject) => {
			try {
				const workbook = new exceljs.Workbook()

				await workbook.xlsx.readFile(excelFile)

				const sheet = workbook.worksheets[0]

				let columnsName = []
				let data = []

				sheet.eachRow((row, rowNumber) => {
					let dataInRow = {}

					row.eachCell((cell, columnNumber) => {
						if (rowNumber == 1) {
							columnsName.push(cell.value)
							return
						}

						dataInRow[columnsName[columnNumber - 1]] = cell.value
					})

					if (rowNumber > 1) data.push(dataInRow)
				})

				return resolve(data)
			} catch (error) {
				console.log("exceljs-utilities/readExcel\n", error)

				switch (error?.error) {
					default:
						return reject({ error: "exceljs-utilities/readExcel/unknown-error-occured" })
				}
			}
		})
	},
}
