"use strict"

const express = require("express")

const authenticationRoutes = require("./authentication")
const dashboardRoutes = require("./dashboard")

const router = express.Router()

router.use("/authentication", express.json(), authenticationRoutes)
router.use("/dashboard", dashboardRoutes)

module.exports = router
