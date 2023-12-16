"use strict"

const express = require("express")

const { addPtl, addPtlManager, addPtlAdmin, addMitra, addMitraAdmin, submitPa, updatePa, deleteFotoBriefingK3, deleteFileTestcom, deleteFileBaiBakl, deletePa, exportExcel, importExcelSubmitPa } = require("../../controllers/api/dashboard")

const router = express.Router()

router.use((request, response, next) => {
	if (request.session.user == undefined) return response.redirect(`${process.env.BASE_URL}/authentication/login`)
	return next()
})

router.post("/add-ptl", express.urlencoded({ extended: false }), addPtl)
router.post("/add-ptl-manager", express.urlencoded({ extended: false }), addPtlManager)
router.post("/add-ptl-admin", express.urlencoded({ extended: false }), addPtlAdmin)
router.post("/add-mitra", express.urlencoded({ extended: false }), addMitra)
router.post("/add-mitra-admin", express.urlencoded({ extended: false }), addMitraAdmin)

router.post("/submit-pa", express.urlencoded({ extended: false }), submitPa)

router.get("/update-pa/:idPa/delete-foto-briefing-k3", deleteFotoBriefingK3)
router.get("/update-pa/:idPa/delete-file-testcom", deleteFileTestcom)
router.get("/update-pa/:idPa/delete-file-bai-bakl", deleteFileBaiBakl)
router.post("/update-pa/:idPa", updatePa)

router.get("/:idPa/delete-pa", deletePa)

router.post("/import-excel-submit-pa", importExcelSubmitPa)
router.get("/export-excel", exportExcel)

module.exports = router
