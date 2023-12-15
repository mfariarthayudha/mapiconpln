"use strict"

const { login } = require("../../src/services/authentication")

const knex = require("../../src/utilities/knex")

describe("login", () => {
	test("Successfully logged in", async () => {
		const user = await knex("users").select("username").limit(1)

		return login({ username: user[0].username, password: "defaultPassword" })
	})

	test("Failed to login using invalid username", async () => {
		return await expect(login({ username: "invalid-username", password: "defaultPassword" })).rejects.toEqual(expect.objectContaining({ error: "authentication-service/login/user-not-found" }))
	})

	test("Failed to login using invalid password", async () => {
		const user = await knex("users").select("username").limit(1)

		return await expect(login({ username: user[0].username, password: "invalid-password" })).rejects.toEqual(expect.objectContaining({ error: "authentication-service/login/invalid-password" }))
	})

	test("Failed to login without username", async () => {
		return await expect(login({ username: undefined, password: "defaultPassword" })).rejects.toEqual(expect.objectContaining({ error: "authentication-service/login/invalid-parameters" }))
	})

	test("Failed to login without password", async () => {
		const user = await knex("users").select("username").limit(1)

		return await expect(login({ username: user[0].username, password: undefined })).rejects.toEqual(expect.objectContaining({ error: "authentication-service/login/invalid-parameters" }))
	})
})
