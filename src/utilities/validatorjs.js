"use strict"

const validatorjs = require("validatorjs")

module.exports = (data, rules) => {
	return new Promise((resolve, reject) => {
		validatorjs.useLang("id")

		const validator = new validatorjs(data, rules)

		if (validator.fails()) {
			let errorMessages = {}

			Object.entries(validator.errors.all()).forEach(([key, value]) => {
				errorMessages[key] = value[0]
			})

			reject({
				error: "validatorjs-utility/validation-fails",
				errorMessages: errorMessages,
			})
		}

		return resolve(true)
	})
}
