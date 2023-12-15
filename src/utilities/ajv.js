const Ajv = require("ajv")
const addFormat = require("ajv-formats")

module.exports = function (schema, data) {
	return new Promise((resolve, reject) => {
		const ajv = new Ajv()
		addFormat(ajv)

		const compiledSchema = ajv.compile(schema)
		const validation = compiledSchema(data)

		if (!validation) {
			return reject({
				error: "ajv-utilities/validation-fails",
				ajvError: compiledSchema.errors,
			})
		}

		return resolve(true)
	})
}
