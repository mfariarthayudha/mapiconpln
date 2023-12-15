"use strict"

const knex = require("../utilities/knex")

module.exports = {
	dashboard: async (request, response) => {
		if (request.session.user.role == "master") {
			const numberOfPtl = await knex("ptl").count("ptl_id as ptl")
			const numberOfPtlManager = await knex("users").where("role", "ptl-manager").count("user_id as user")
			const numberOfPtlAdmin = await knex("users").where("role", "ptl-admin").count("user_id as user")
			const numberOfMitra = await knex("users").where("role", "mitra").count("user_id as user")

			return response.render("master/dashboard", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				numberOfPtl: numberOfPtl[0].ptl,
				numberOfPtlManager: numberOfPtlManager[0].user,
				numberOfPtlAdmin: numberOfPtlAdmin[0].user,
				numberOfMitra: numberOfMitra[0].user,
			})
		} else if (request.session.user.role == "ptl-admin") {
			const totalPa = await knex("pa").where("ptl_id", request.session.user.ptlId).count("id_pa as pa")
			const totalPaDonePenarikan = await knex("pa").where("ptl_id", request.session.user.ptlId).where("progres_tarikan", "=", knex.ref("panjang_tarikan")).count("id_pa as pa")
			const totalPaDoneTracingCore = await knex("pa").where("ptl_id", request.session.user.ptlId).where("tracing_core", 100).count("id_pa as pa")
			const totalPaDoneTestcom = await knex("pa").where("ptl_id", request.session.user.ptlId).where("testcom", 100).count("id_pa as pa")
			const totalPaOnProgressBai = await knex("pa").where("ptl_id", request.session.user.ptlId).where("bai_user", 50).count("id_pa as pa")
			const totalPaDoneBai = await knex("pa").where("ptl_id", request.session.user.ptlId).where("bai_user", 100).count("id_pa as pa")
			const totalPaKendala = await knex("pa").where("ptl_id", request.session.user.ptlId).whereNot("kendala", null).count("id_pa as pa")

			return response.render("ptl-admin/dashboard", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				totalPa: totalPa[0].pa,
				totalPaDonePenarikan: totalPaDonePenarikan[0].pa,
				totalPaDoneTracingCore: totalPaDoneTracingCore[0].pa,
				totalPaDoneTestcom: totalPaDoneTestcom[0].pa,
				totalPaOnProgressBai: totalPaOnProgressBai[0].pa,
				totalPaDoneBai: totalPaDoneBai[0].pa,
				totalPaKendala: totalPaKendala[0].pa,
			})
		} else if (request.session.user.role == "mitra-admin") {
			const totalPa = await knex("pa").where("mitra_id", request.session.user.mitraId).count("id_pa as pa")
			const totalPaDonePenarikan = await knex("pa").where("mitra_id", request.session.user.mitraId).where("progres_tarikan", "=", knex.ref("panjang_tarikan")).count("id_pa as pa")
			const totalPaDoneTracingCore = await knex("pa").where("mitra_id", request.session.user.mitraId).where("tracing_core", 100).count("id_pa as pa")
			const totalPaDoneTestcom = await knex("pa").where("mitra_id", request.session.user.mitraId).where("testcom", 100).count("id_pa as pa")
			const totalPaOnProgressBai = await knex("pa").where("mitra_id", request.session.user.mitraId).where("bai_user", 50).count("id_pa as pa")
			const totalPaDoneBai = await knex("pa").where("mitra_id", request.session.user.mitraId).where("bai_user", 100).count("id_pa as pa")
			const totalPaKendala = await knex("pa").where("mitra_id", request.session.user.mitraId).whereNot("kendala", null).count("id_pa as pa")

			return response.render("mitra-admin/dashboard", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				totalPa: totalPa[0].pa,
				totalPaDonePenarikan: totalPaDonePenarikan[0].pa,
				totalPaDoneTracingCore: totalPaDoneTracingCore[0].pa,
				totalPaDoneTestcom: totalPaDoneTestcom[0].pa,
				totalPaOnProgressBai: totalPaOnProgressBai[0].pa,
				totalPaDoneBai: totalPaDoneBai[0].pa,
				totalPaKendala: totalPaKendala[0].pa,
			})
		}
	},

	ptl: async (request, response) => {
		if (request.session.user.role != "master") {
			return response.status(403).send("Permission denied")
		}

		const ptl = await knex("ptl").select("ptl_name").orderBy("ptl_name")

		return response.render("master/ptl", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			ptl: ptl,
		})
	},

	ptlManager: async (request, response) => {
		if (request.session.user.role != "master") {
			return response.status(403).send("Permission denied")
		}

		const ptl = await knex("ptl").orderBy("ptl_name")

		const ptlManager = await knex("users")
			.select("users.username", "ptl.ptl_name")
			.where("users.role", "ptl-manager")
			.join("ptl", "users.ptl_id", "=", "ptl.ptl_id")
			.orderBy([{ column: "ptl.ptl_name" }, { column: "users.username" }])

		return response.render("master/ptl-manager", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			ptl: ptl,
			ptlManager: ptlManager,
		})
	},

	ptlAdmin: async (request, response) => {
		if (request.session.user.role != "master") {
			return response.status(403).send("Permission denied")
		}

		const ptl = await knex("ptl").orderBy("ptl_name")

		const ptlAdmin = await knex("users")
			.select("users.username", "ptl.ptl_name")
			.where("users.role", "ptl-admin")
			.join("ptl", "users.ptl_id", "=", "ptl.ptl_id")
			.orderBy([{ column: "ptl.ptl_name" }, { column: "users.username" }])

		return response.render("master/ptl-admin", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			ptl: ptl,
			ptlAdmin: ptlAdmin,
		})
	},

	mitra: async (request, response) => {
		if (request.session.user.role != "master") {
			return response.status(403).send("Permission denied")
		}

		const mitra = await knex("mitra").orderBy("mitra_name")

		return response.render("master/mitra", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			mitra: mitra,
		})
	},

	mitraAdmin: async (request, response) => {
		if (request.session.user.role != "master") {
			return response.status(403).send("Permission denied")
		}

		const mitra = await knex("mitra").orderBy("mitra_name")

		const mitraAdmin = await knex("users")
			.select("users.username", "mitra.mitra_name")
			.where("users.role", "mitra-admin")
			.join("mitra", "users.mitra_id", "=", "mitra.mitra_id")
			.orderBy([{ column: "mitra.mitra_name" }, { column: "users.username" }])

		return response.render("master/mitra-admin", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			mitra: mitra,
			mitraAdmin: mitraAdmin,
		})
	},

	submitPa: async (request, response) => {
		if (request.session.user.role != "ptl-admin") {
			return response.status(403).send("Permission denied")
		}

		const mitra = await knex("mitra").orderBy("mitra_name")
		const pa = await knex("pa").select("pa.*", "mitra.mitra_name as mitra").where("pa.ptl_id", request.session.user.ptlId).join("mitra", "pa.mitra_id", "=", "mitra.mitra_id").orderBy("tanggal_terbit_pa")

		return response.render("ptl-admin/submit-pa", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			mitra: mitra,
			pa: pa,
		})
	},

	updatePa: async (request, response) => {
		if (request.session.user.role != "mitra-admin") {
			return response.status(403).send("Permission denied")
		}

		const pa = await knex("pa").where("mitra_id", request.session.user.mitraId)

		return response.render("mitra-admin/update-pa", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			pa: pa,
		})
	},

	formUpdatePa: async (request, response) => {
		if (request.session.user.role != "mitra-admin") {
			return response.status(403).send("Permission denied")
		}

		const pa = await knex("pa").where("id_pa", request.params.idPa)

		return response.render("mitra-admin/form-update-pa", {
			baseUrl: process.env.BASE_URL,
			flashMessages: request.flash(),
			pa: pa[0],
		})
	},

	monitoringPa: async (request, response) => {
		const pa = await knex("pa")
			.select("pa.*", "mitra.mitra_name as mitra")
			.where("pa.ptl_id", request.session.user.ptlId)
			.join("mitra", "pa.mitra_id", "=", "mitra.mitra_id")
			.orderBy("tanggal_terbit_pa")
			.then((pa) => {
				return pa.map((pa) => {
					const currentTimestamp = Math.floor(new Date() / 1000)
					const tanggalTerbitPaTimestamp = Math.floor(new Date(pa.tanggal_terbit_pa) / 1000)

					return {
						...pa,
						aging: Math.ceil((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp - tanggalTerbitPaTimestamp) / 86400),
					}
				})
			})

		return response.render("ptl-admin/monitoring-pa", {
			baseUrl: process.env.BASE_URL,
			pa: pa,
		})
	},
}
