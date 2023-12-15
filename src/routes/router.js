"use strict"

const express = require("express")

const authenticationChecker = require("../middlewares/authentication-checker")

const apiRoutes = require("./api/router")

const dashboardRoutes = require("./dashboard")
const authenticationRoutes = require("./authentication")

const router = express.Router()

router.use((request, response, next) => {
	request.session.user = {
		userId: "f5598cb3-2ba6-45b1-854f-f1bc881dfbe6",
		username: "acm_aktivasi",
		role: "mitra-admin",
		mitraId: "739dcf40-1490-4be9-9fdb-1740622abaf0",
	}

	return next()
})

router.use(authenticationChecker)

router.use("/api", apiRoutes)

router.use("/authentication", authenticationRoutes)
router.use("/", dashboardRoutes)

module.exports = router
