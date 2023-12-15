"use strict"

require("dotenv").config()
const path = require("path")
const express = require("express")
const session = require("express-session")
const connectFlash = require("connect-flash")

const router = require("./routes/router")

const application = express()

application.use(
	session({
		name: "mapiconpln",
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		unset: "destroy",
		cookie: {
			httpOnly: true,
			maxAge: 7200000,
			secure: false,
		},
	})
)

application.set("view engine", "ejs")
application.set("views", path.join(__dirname, "./views"))

application.use(connectFlash())
application.use(express.static(path.join(__dirname, "../public")))
application.use(router)

application.listen(3000)
