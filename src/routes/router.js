"use strict"

const express = require("express")

const authenticationChecker = require("../middlewares/authentication-checker")

const apiRoutes = require("./api/router")

const dashboardRoutes = require("./dashboard")
const authenticationRoutes = require("./authentication")

const router = express.Router()

router.use((request, response, next) => {
	request.session.user = {
		userId: "f2839094-b7a1-4940-9904-a4495ff9c827",
		username: "PTL_Riau1",
		role: "ptl-admin",
		ptlId: "c96d9980-23aa-4e9b-863f-e684127f374d",
	}

	return next()
})

router.use(authenticationChecker)

router.use("/api", apiRoutes)

router.use("/authentication", authenticationRoutes)
router.use("/", dashboardRoutes)

module.exports = router
