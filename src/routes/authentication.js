"use strict"

const express = require("express")

const { login } = require("../controllers/authentication")

const router = express.Router()

router.get("/login", login)

module.exports = router
