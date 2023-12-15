function toCamelCase(str) {
	return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""))
}

function convertKeysToCamelCase(object) {
	if (Array.isArray(object)) {
		return object.map((v) => convertKeysToCamelCase(v))
	} else if (object !== null && object.constructor === Object) {
		return Object.keys(object).reduce(
			(result, key) => ({
				...result,
				[toCamelCase(key)]: convertKeysToCamelCase(object[key]),
			}),
			{}
		)
	}
	return object
}

module.exports = function (object) {
	return convertKeysToCamelCase(object)
}
