"use strict"

module.exports = {
	login: (request, response) => {
		if (request.session.user != undefined) return response.redirect(process.env.BASE_URL)

		return response.render("authentication/login", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
		})
	},
}
