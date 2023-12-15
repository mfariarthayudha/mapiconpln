"use strict"

const { camelCaseToSpace, camelCaseToSnakeCase, snakeCaseToCamelCase } = require("../../src/utilities/string-utilities")

describe("camelCaseToSpace", () => {
	test("Successfully convert camel case string to word", () => {
		const camelCaseString = "helloWorld"
		const expectedResult = "hello world"

		return expect(camelCaseToSpace(camelCaseString)).toEqual(expectedResult)
	})
})

describe("camelCaseToSnakeCase", () => {
	test("Successfully convert camel case string to snake case", () => {
		const camelCaseString = "helloWorld"
		const expectedResult = "hello_world"

		return expect(camelCaseToSnakeCase(camelCaseString)).toEqual(expectedResult)
	})
})

describe("snakeCaseToCamelCase", () => {
	test("Successfully convert snake case string to camel case", () => {
		const snakeCaseString = "hello_world"
		const expectedResult = "helloWorld"

		return expect(snakeCaseToCamelCase(snakeCaseString)).toEqual(expectedResult)
	})
})
