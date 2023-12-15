"use strict"

module.exports = {
	camelCaseToSpace: (camelCaseString) => {
		return camelCaseString
			.replace(/([A-Z])/g, " $1")
			.trim()
			.toLowerCase()
	},

	camelCaseToSnakeCase: (camelCaseString) => {
		return camelCaseString.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase()).trim()
	},

	snakeCaseToCamelCase: (snakeCaseString) => {
		return snakeCaseString.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()).trim()
	},
}
