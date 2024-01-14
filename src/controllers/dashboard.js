"use strict"

const lodash = require("lodash")

const knex = require("../utilities/knex")

module.exports = {
	dashboard: async (request, response) => {
		try {
			if (request.session.user.role == "master") {
				const numberOfPtl = await knex("ptl").count("ptl_id as ptl")
				const numberOfPtlAdmin = await knex("users").where("role", "ptl-admin").count("user_id as user")
				const numberOfMitra = await knex("mitra").count("mitra_id as mitra")
				const numberOfMitraAdmin = await knex("users").where("role", "mitra-admin").count("user_id as user")

				return response.render("master/dashboard", {
					baseUrl: process.env.BASE_URL,
					user: request.session.user,
					numberOfPtl: numberOfPtl[0].ptl,
					numberOfPtlAdmin: numberOfPtlAdmin[0].user,
					numberOfMitra: numberOfMitra[0].mitra,
					numberOfMitraAdmin: numberOfMitraAdmin[0].user,
				})
			} else if (request.session.user.role == "ptl-admin") {
				const totalPa = await knex("pa").where("ptl_id", request.session.user.ptlId).count("id_pa as pa")
				const totalPaDonePenarikan = await knex("pa").where("ptl_id", request.session.user.ptlId).where("progres_tarikan", "=", knex.ref("panjang_tarikan")).count("id_pa as pa")
				const totalPaDoneTracingCore = await knex("pa").where("ptl_id", request.session.user.ptlId).where("tracing_core", 100).count("id_pa as pa")
				const totalPaDoneTestcom = await knex("pa").where("ptl_id", request.session.user.ptlId).where("testcom", 100).count("id_pa as pa")
				const totalPaOnProgressBai = await knex("pa").where("ptl_id", request.session.user.ptlId).where("bai_user", 50).count("id_pa as pa")
				const totalPaDoneBai = await knex("pa").where("ptl_id", request.session.user.ptlId).where("bai_user", 100).count("id_pa as pa")
				const totalPaKendala = await knex("pa").where("ptl_id", request.session.user.ptlId).whereNot("kendala", null).count("id_pa as pa")

				return response.render("dashboard", {
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

				return response.render("dashboard", {
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
			} else {
				throw { error: "permission-denied" }
			}
		} catch (error) {
			console.log("dashboard-controller/dashbord\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	ptl: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			const ptl = await knex("ptl").select("ptl_name").orderBy("ptl_name")

			return response.render("master/ptl", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				flashMessages: request.flash(),
				ptl: ptl,
			})
		} catch (error) {
			console.log("dashboard-controller/ptl\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	ptlAdmin: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			const ptl = await knex("ptl").orderBy("ptl_name")

			const ptlAdmin = await knex("users")
				.select("users.username", "ptl.ptl_name")
				.where("users.role", "ptl-admin")
				.join("ptl", "users.ptl_id", "=", "ptl.ptl_id")
				.orderBy([{ column: "ptl.ptl_name" }, { column: "users.username" }])

			return response.render("master/ptl-admin", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				flashMessages: request.flash(),
				ptl: ptl,
				ptlAdmin: ptlAdmin,
			})
		} catch (error) {
			console.log("dashboard-controller/ptlAdmin\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	mitra: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			const mitra = await knex("mitra").orderBy("mitra_name")

			return response.render("master/mitra", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				flashMessages: request.flash(),
				mitra: mitra,
			})
		} catch (error) {
			console.log("dashboard-controller/mitra\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	mitraAdmin: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			const mitra = await knex("mitra").orderBy("mitra_name")

			const mitraAdmin = await knex("users")
				.select("users.username", "mitra.mitra_name")
				.where("users.role", "mitra-admin")
				.join("mitra", "users.mitra_id", "=", "mitra.mitra_id")
				.orderBy([{ column: "mitra.mitra_name" }, { column: "users.username" }])

			return response.render("master/mitra-admin", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				flashMessages: request.flash(),
				mitra: mitra,
				mitraAdmin: mitraAdmin,
			})
		} catch (error) {
			console.log("dashboard-controller/mitraAdmin\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	submitPa: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			const mitra = await knex("mitra").orderBy("mitra_name")
			const pa = await knex("pa").select("pa.*", "mitra.mitra_name as mitra").where("pa.ptl_id", request.session.user.ptlId).join("mitra", "pa.mitra_id", "=", "mitra.mitra_id").orderBy("tanggal_terbit_pa")

			return response.render("ptl-admin/submit-pa", {
				baseUrl: process.env.BASE_URL,
				flashMessages: request.flash(),
				user: request.session.user,
				mitra: mitra,
				pa: pa,
			})
		} catch (error) {
			console.log("dashboard-controller/submitPa\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	updatePa: async (request, response) => {
		try {
			if (request.session.user.role != "mitra-admin") throw { error: "permission-denied" }

			const pa = await knex("pa").where("mitra_id", request.session.user.mitraId)

			return response.render("mitra-admin/update-pa", {
				baseUrl: process.env.BASE_URL,
				flashMessages: request.flash(),
				user: request.session.user,
				pa: pa,
			})
		} catch (error) {
			console.log("dashboard-controller/updatePa\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	formUpdatePa: async (request, response) => {
		try {
			if (request.session.user.role != "mitra-admin") throw { error: "permission-denied" }

			const pa = await knex("pa")
				.select("pa.*", "mitra.mitra_name as mitra")
				.where("pa.id_pa", request.params.idPa)
				.join("mitra", "pa.mitra_id", "=", "mitra.mitra_id")
				.orderBy("tanggal_terbit_pa")
				.then((pa) => {
					return pa.map((pa) => {
						const currentTimestamp = Math.floor(new Date() / 1000)
						const tanggalTerbitPaTimestamp = Math.floor(new Date(pa.tanggal_terbit_pa) / 1000)

						return {
							...pa,
							tanggal_terbit_pa: `${new Date(pa.tanggal_terbit_pa).getDate()}-${new Date(pa.tanggal_terbit_pa).getMonth() + 1}-${new Date(pa.tanggal_terbit_pa).getFullYear()}`,
							tanggal_bai: Math.floor(new Date(pa.tanggal_bai) / 1000) > 0 ? `${new Date(pa.tanggal_bai).getDate()}-${new Date(pa.tanggal_bai).getMonth() + 1}-${new Date(pa.tanggal_bai).getFullYear()}` : null,
							aging: Math.ceil(((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp) - tanggalTerbitPaTimestamp) / 86400),
						}
					})
				})

			return response.render("mitra-admin/form-update-pa", {
				baseUrl: process.env.BASE_URL,
				flashMessages: request.flash(),
				user: request.session.user,
				pa: pa[0],
			})
		} catch (error) {
			console.log("dashboard-controller/formUpdatePa\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	monitoringPa: async (request, response) => {
		try {
			if (request.session.user.role == "ptl-admin") {
				const query = knex("pa").select("pa.*", "mitra.mitra_name as mitra")

				if (lodash.isNil(request.query.tracingCore) == false) {
					if (request.query.tracingCore !== "all") {
						query.where("tracing_core", request.query.tracingCore)
					}
				}

				if (lodash.isNil(request.query.testcom) == false) {
					if (request.query.testcom !== "all") {
						query.where("testcom", request.query.testcom)
					}
				}

				if (lodash.isNil(request.query.baiUser) == false) {
					if (request.query.baiUser !== "all") {
						query.where("bai_user", request.query.baiUser)
					}
				}

				const pa = await query
					.where("pa.ptl_id", request.session.user.ptlId)
					.join("mitra", "pa.mitra_id", "=", "mitra.mitra_id")
					.orderBy("tanggal_terbit_pa")
					.then((pa) => {
						let totalPanjangTarikan = 0
						let totalProgresTarikan = 0
						let totalJumlahJb = 0
						let totalTracingCore = 0
						let aging = 0

						let mappedPa = pa.map((pa) => {
							const currentTimestamp = Math.floor(new Date() / 1000)
							const tanggalTerbitPaTimestamp = Math.floor(new Date(pa.tanggal_terbit_pa) / 1000)

							totalPanjangTarikan += parseInt(pa.panjang_tarikan)
							totalProgresTarikan += parseInt(pa.progres_tarikan)
							totalJumlahJb += parseInt(pa.jumlah_jb)
							totalTracingCore += parseInt(pa.tracing_core)
							aging += Math.ceil(((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp) - tanggalTerbitPaTimestamp) / 86400)

							return {
								...pa,
								tanggal_terbit_pa: `${new Date(pa.tanggal_terbit_pa).getDate()}-${new Date(pa.tanggal_terbit_pa).getMonth() + 1}-${new Date(pa.tanggal_terbit_pa).getFullYear()}`,
								tanggal_bai: Math.floor(new Date(pa.tanggal_bai) / 1000) > 0 ? `${new Date(pa.tanggal_bai).getDate()}-${new Date(pa.tanggal_bai).getMonth() + 1}-${new Date(pa.tanggal_bai).getFullYear()}` : null,
								aging: Math.ceil(((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp) - tanggalTerbitPaTimestamp) / 86400),
								updated_at: pa.update_at == null ? null : `${new Date(pa.update_at).getDate()}-${new Date(pa.tanggal_terbit_pa).getMonth() + 1}-${new Date(pa.update_at).getFullYear()}`,
							}
						})

						return {
							pa: mappedPa,
							totalPanjangTarikan: totalPanjangTarikan,
							totalProgresTarikan: totalProgresTarikan,
							totalJumlahJb: totalJumlahJb,
							totalTracingCore: totalTracingCore,
							averageAging: Math.round(aging / pa.length),
						}
					})

				return response.render("monitoring-pa", {
					baseUrl: process.env.BASE_URL,
					user: request.session.user,
					pa: pa,
					selectedTracingCoreValue: request.query.tracingCore,
					selectedTestcomValue: request.query.testcom,
					selectedBaiUserValue: request.query.baiUser,
				})
			} else if (request.session.user.role == "mitra-admin") {
				const query = knex("pa").select("pa.*", "mitra.mitra_name as mitra")

				if (lodash.isNil(request.query.tracingCore) == false) {
					if (request.query.tracingCore !== "all") {
						query.where("tracing_core", request.query.tracingCore)
					}
				}

				if (lodash.isNil(request.query.testcom) == false) {
					if (request.query.testcom !== "all") {
						query.where("testcom", request.query.testcom)
					}
				}

				if (lodash.isNil(request.query.baiUser) == false) {
					if (request.query.baiUser !== "all") {
						query.where("bai_user", request.query.baiUser)
					}
				}

				const pa = await query
					.where("pa.mitra_id", request.session.user.mitraId)
					.join("mitra", "pa.mitra_id", "=", "mitra.mitra_id")
					.orderBy("tanggal_terbit_pa")
					.then((pa) => {
						let totalPanjangTarikan = 0
						let totalProgresTarikan = 0
						let totalJumlahJb = 0
						let totalTracingCore = 0
						let aging = 0

						let mappedPa = pa.map((pa) => {
							const currentTimestamp = Math.floor(new Date() / 1000)
							const tanggalTerbitPaTimestamp = Math.floor(new Date(pa.tanggal_terbit_pa) / 1000)

							totalPanjangTarikan += parseInt(pa.panjang_tarikan)
							totalProgresTarikan += parseInt(pa.progres_tarikan)
							totalJumlahJb += parseInt(pa.jumlah_jb)
							totalTracingCore += parseInt(pa.tracing_core)
							aging += Math.ceil(((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp) - tanggalTerbitPaTimestamp) / 86400)

							return {
								...pa,
								tanggal_terbit_pa: `${new Date(pa.tanggal_terbit_pa).getDate()}-${new Date(pa.tanggal_terbit_pa).getMonth() + 1}-${new Date(pa.tanggal_terbit_pa).getFullYear()}`,
								tanggal_bai: Math.floor(new Date(pa.tanggal_bai) / 1000) > 0 ? `${new Date(pa.tanggal_bai).getDate()}-${new Date(pa.tanggal_bai).getMonth() + 1}-${new Date(pa.tanggal_bai).getFullYear()}` : null,
								aging: Math.ceil(((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp) - tanggalTerbitPaTimestamp) / 86400),
								updated_at: pa.update_at == null ? null : `${new Date(pa.update_at).getDate()}-${new Date(pa.tanggal_terbit_pa).getMonth() + 1}-${new Date(pa.update_at).getFullYear()}`,
							}
						})

						return {
							pa: mappedPa,
							totalPanjangTarikan: totalPanjangTarikan,
							totalProgresTarikan: totalProgresTarikan,
							totalJumlahJb: totalJumlahJb,
							totalTracingCore: totalTracingCore,
							averageAging: Math.round(aging / pa.length),
						}
					})

				return response.render("monitoring-pa", {
					baseUrl: process.env.BASE_URL,
					user: request.session.user,
					pa: pa,
					selectedTracingCoreValue: request.query.tracingCore,
					selectedTestcomValue: request.query.testcom,
					selectedBaiUserValue: request.query.baiUser,
				})
			} else {
				throw { error: "permission-denied" }
			}
		} catch (error) {
			console.log("dashboard-controller/monitoringPa\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	aging: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			const mitra = await knex("mitra as m")
				.select("m.mitra_name as mitra")
				.select(knex.raw("SUM(CASE WHEN pa.bai_user = 100 THEN DATEDIFF(pa.tanggal_bai, pa.tanggal_terbit_pa) ELSE DATEDIFF(CURDATE(), pa.tanggal_terbit_pa) + 1 END) AS sum"))
				.select(knex.raw("AVG(CASE WHEN pa.bai_user = 100 THEN DATEDIFF(pa.tanggal_bai, pa.tanggal_terbit_pa) ELSE DATEDIFF(CURDATE(), pa.tanggal_terbit_pa) + 1 END) AS average"))
				.join("pa", "m.mitra_id", "=", "pa.mitra_id")
				.groupBy("m.mitra_name")
				.then((mitra) => {
					return mitra.map((mitra) => {
						return {
							...mitra,
							sum: parseInt(mitra.sum),
							average: parseInt(mitra.average),
						}
					})
				})

			return response.render("ptl-admin/aging", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				mitra: mitra,
			})
		} catch (error) {
			console.log("dashboard-controller/aging\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},

	performance: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			const mitra = await knex
				.select("mitra.mitra_name")
				.count("* as total_pa")
				.select(knex.raw("(SUM(CASE WHEN pa.bai_user = 100 THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS percentage"))
				.from("mitra")
				.join("pa", "mitra.mitra_id", "pa.mitra_id")
				.groupBy("mitra.mitra_name")
				.then((mitra) => {
					return mitra.map((mitra) => {
						return {
							...mitra,
							total_pa: parseInt(mitra.total_pa),
							percentage: parseInt(mitra.percentage),
						}
					})
				})

			console.log(mitra)

			return response.render("ptl-admin/performance", {
				baseUrl: process.env.BASE_URL,
				user: request.session.user,
				mitra: mitra,
			})
		} catch (error) {
			console.log("dashboard-controller/aging\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(500).render("errors/403.ejs", {
						baseUrl: process.env.BASE_URL,
					})

				default:
					return response.status(500).render("errors/500.ejs", {
						baseUrl: process.env.BASE_URL,
					})
			}
		}
	},
}
