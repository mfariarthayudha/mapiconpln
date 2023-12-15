"use strict"

require("dotenv").config()
const { fakerID_ID: faker } = require("@faker-js/faker")

const knex = require("../src/utilities/knex")

const incompletePaData = require("./incomplete-pa-data")

module.exports = async function (globalConfig, projectConfig) {
	const numberOfPtlUsers = 5
	const numberOfMitraUsers = 5
	let num = 0

	let ptlUsers = []
	let mitraUsers = []

	for (let i = 0; i < numberOfPtlUsers; i++) {
		ptlUsers.push({
			user_id: faker.string.uuid(),
			username: faker.internet.userName(),
			// defaultPassword
			password: "$2a$10$X7xBfrzaTkf.t84Kljbbg.ji10MMTXNV0FiNHnDV/4KOeu/X.KNU6",
			role: "ptl",
		})
	}

	for (let i = 0; i < numberOfMitraUsers; i++) {
		mitraUsers.push({
			user_id: faker.string.uuid(),
			username: faker.internet.userName(),
			// defaultPassword
			password: "$2a$10$X7xBfrzaTkf.t84Kljbbg.ji10MMTXNV0FiNHnDV/4KOeu/X.KNU6",
			role: "mitra",
		})
	}

	const incompletePa = incompletePaData.map((pa) => {
		let currentNum = num++
		return {
			...pa,
			ptl: ptlUsers[currentNum].user_id,
			mitra: mitraUsers[currentNum].user_id,
		}
	})

	await knex("users").insert(ptlUsers)
	await knex("users").insert(mitraUsers)
	await knex("pa").insert(incompletePa)
}
