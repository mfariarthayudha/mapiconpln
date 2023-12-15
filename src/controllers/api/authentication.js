"use strict"

const bcrypt = require("bcrypt")

const validatorjs = require("../../utilities/validatorjs")
const knex = require("../../utilities/knex")

module.exports = {
	login: async (request, response) => {
		try {
			if (request.session.user != undefined) return response.redirect(process.env.BASE_URL)

			await validatorjs(
				{
					username: request.body.username,
					password: request.body.password,
				},
				{
					username: "required|string",
					password: "required|string",
				}
			)

			const user = await knex("users").where("username", request.body.username).limit(1)

			if (user.length < 1) throw { error: "user-not-found" }
			if ((await bcrypt.compare(request.body.password, user[0].password).then((result) => result)) == false) throw { error: "invalid-password" }

			let userData = {
				userId: user[0].user_id,
				username: user[0].username,
				role: user[0].role,
			}

			if (user[0].role == "ptl-manager" || user[0].role == "ptl-admin") userData["ptlId"] = user[0].ptl_id
			if (user[0].role == "mitra-admin") userData["mitraId"] = user[0].mitra_id

			request.session.user = userData

			return response.redirect(process.env.BASE_URL)
		} catch (error) {
			console.log(error)
			switch (error?.error) {
				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/authentication/login`)

				case "user-not-found":
					request.flash("usernameInputError", "Username tidak ditemukan")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/authentication/login`)

				case "invalid-password":
					request.flash("passwordInputError", "Password salah")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/authentication/login`)
			}
		}
	},

	logout: (request, response) => {
		request.session.user = undefined

		return response.redirect(`${process.env.BASE_URL}/authentication/logout`)
	},
}
