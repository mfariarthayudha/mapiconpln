"use strict"

const express = require("express")

const { dashboard, ptl, ptlManager, ptlAdmin, mitra, mitraAdmin, submitPa, updatePa, formUpdatePa, monitoringPa, aging } = require("../controllers/dashboard")

const router = express.Router()

router.use((request, response, next) => {
	if (request.session.user == undefined) return response.redirect(`${process.env.BASE_URL}/authentication/login`)
	return next()
})

router.get("/ptl", ptl)
router.get("/ptl-manager", ptlManager)
router.get("/ptl-admin", ptlAdmin)
router.get("/mitra", mitra)
router.get("/mitra-admin", mitraAdmin)

router.get("/submit-pa", submitPa)
router.get("/monitoring-pa", monitoringPa)

router.get("/update-pa/:idPa", formUpdatePa)
router.get("/update-pa", updatePa)

router.get("/aging", aging)

router.get("/", dashboard)

module.exports = router
