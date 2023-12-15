"use strict"

const express = require("express")

const { login, logout } = require("../../controllers/api/authentication")

const router = express.Router()

router.post("/login", express.urlencoded({ extended: false }), login)

router.get("/logout", logout)

module.exports = router
