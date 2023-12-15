"use strict"

const { camelCaseToSnakeCase, snakeCaseToCamelCase } = require("./string-utilities")

function camelCaseKeysToSnakeCase(object) {
	if (object?.constructor != {}.constructor && object?.constructor != [].constructor) {
		return object
	}

	if (Array.isArray(object)) {
		return object.map((item) => camelCaseKeysToSnakeCase(item))
	}

	const camelObj = {}
	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const camelKey = camelCaseToSnakeCase(key)
			camelObj[camelKey] = camelCaseKeysToSnakeCase(object[key])
		}
	}

	return camelObj
}

function snakeCaseKeysToCamelCase(object) {
	if (object?.constructor != {}.constructor && object?.constructor != [].constructor) {
		return object
	}

	if (Array.isArray(object)) {
		return object.map((item) => snakeCaseKeysToCamelCase(item))
	}

	const camelObj = {}
	for (const key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const camelKey = snakeCaseToCamelCase(key)
			camelObj[camelKey] = snakeCaseKeysToCamelCase(object[key])
		}
	}

	return camelObj
}

module.exports = {
	camelCaseKeysToSnakeCase: camelCaseKeysToSnakeCase,
	snakeCaseKeysToCamelCase: snakeCaseKeysToCamelCase,
}
