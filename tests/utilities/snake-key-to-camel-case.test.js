const snakeKeyToCamelCase = require("../../src/utilities/snake-key-to-camel-case")

test("Successfully convert object", () => {
	const data = {
		full_name: "SAQ Laboratory",
		date_of_birth: "2019",
	}

	const expectedResult = {
		fullName: "SAQ Laboratory",
		dateOfBirth: "2019",
	}

	return expect(snakeKeyToCamelCase(data)).toEqual(expectedResult)
})

test("Successfully convert nested object", () => {
	const data = {
		full_name: {
			first_name: "SAQ",
			last_name: "Laboratory",
		},
		date_of_birth: "2019",
	}

	const expectedResult = {
		fullName: {
			firstName: "SAQ",
			lastName: "Laboratory",
		},
		dateOfBirth: "2019",
	}

	return expect(snakeKeyToCamelCase(data)).toEqual(expectedResult)
})
