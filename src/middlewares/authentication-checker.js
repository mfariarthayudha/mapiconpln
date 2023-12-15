"use strict"

const knex = require("../utilities/knex")

module.exports = async (request, response, next) => {
	if (request.session.user == undefined) return next()

	const user = await knex("users")
		.where("user_id", request.session.user.userId)
		.limit(1)
		.count("user_id as user")
		.then((result) => {
			return result[0].user
		})

	if (user < 1) request.session.user = undefined

	return next()
}
