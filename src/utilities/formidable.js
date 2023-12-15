"use strict"

const uuid = require("uuid")
const { formidable } = require("formidable")

module.exports = (request, uploadDirectory) => {
	return new Promise((resolve, reject) => {
		const form = formidable({
			uploadDir: uploadDirectory,
			filename: (OriginalFileName, fileExtension) => {
				return uuid.v4() + fileExtension
			},
			filter: ({ mimetype }) => {
				return mimetype != "application/octet-stream"
			},
			keepExtensions: true,
			allowEmptyFiles: true,
			minFileSize: 0,
		})

		form.parse(request, (error, requestBody, requestFiles) => {
			if (error) return reject({ error: error })

			let body = {}
			let files = {}

			Object.entries(requestBody).forEach(([fieldName, value]) => {
				body[fieldName] = value[0]
			})

			Object.entries(requestFiles).forEach(([fieldName, file]) => {
				files[fieldName] = file[0].newFilename
			})

			return resolve({
				body: body,
				files: files,
			})
		})
	})
}
