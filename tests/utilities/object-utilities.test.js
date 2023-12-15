"use strict"

const { camelCasePropertiesToSnakeCase, snakeCasePropertiesToCamelCase } = require("../../src/utilities/object-utilities")

describe("camelCasePropertiesToSnakeCase", () => {
	test("Successfully convert camel case object properties to snake case", () => {
		const biodata = {
			name: {
				firstName: "Hello",
				lastName: "World",
			},
			dateOfBirth: "1970-01-01",
		}

		const expectedResult = {
			name: {
				first_name: "Hello",
				last_name: "World",
			},
			date_of_birth: "1970-01-01",
		}

		return expect(camelCasePropertiesToSnakeCase(biodata)).toEqual(expectedResult)
	})
})

describe("snakeCasePropertiesToCamelCase", () => {
	test("Successfully convert snake case object properties to camel case", () => {
		const biodata = {
			name: {
				first_name: "Hello",
				last_name: "World",
			},
			date_of_birth: "1970-01-01",
		}

		const expectedResult = {
			name: {
				firstName: "Hello",
				lastName: "World",
			},
			dateOfBirth: "1970-01-01",
		}

		return expect(snakeCasePropertiesToCamelCase(biodata)).toEqual(expectedResult)
	})
})
