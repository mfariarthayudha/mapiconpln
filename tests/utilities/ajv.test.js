const { fakerID_ID: faker } = require("@faker-js/faker")

const ajv = require("../../src/utilities/ajv")

test("Successfully validate valid object data", () => {
	return ajv(
		{
			type: "object",
			properties: {
				fullName: { type: "string" },
				age: { type: "integer" },
				job: { type: "string" },
			},
			required: ["fullName", "age", "job"],
		},
		{
			fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
			age: faker.number.int({ min: 1, max: 100 }),
			job: faker.person.jobTitle(),
		}
	)
})

test("Successfully validate invalid object data", async () => {
	return await expect(
		ajv(
			{
				type: "object",
				properties: {
					fullName: { type: "string" },
					age: { type: "integer" },
					job: { type: "string" },
				},
				required: ["fullName", "age", "job"],
			},
			{
				fullName: 20,
				age: "john doe",
				job: true,
			}
		)
	).rejects.toEqual(expect.objectContaining({ error: "ajv-utilities/validation-fails" }))
})
