"use strict"

const fs = require("fs").promises
const path = require("path")

const uuid = require("uuid")
const bcrypt = require("bcrypt")
const lodash = require("lodash")

const validatorjs = require("../../utilities/validatorjs")
const knex = require("../../utilities/knex")
const formidable = require("../../utilities/formidable")

const { snakeCaseKeysToCamelCase } = require("../../utilities/object-utilities")
const { generateExcel, readExcel } = require("../../utilities/exceljs")

module.exports = {
	addPtl: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			await validatorjs({ ptlName: request.body.ptlName }, { ptlName: "required|string|max:32" })

			await knex("ptl")
				.where("ptl_name", request.body.ptlName)
				.limit(1)
				.count("ptl_id as ptl")
				.then((result) => {
					if (result[0].ptl > 0) throw { error: "duplicate-ptl-name" }
				})

			await knex("ptl").insert({
				ptl_id: uuid.v4(),
				ptl_name: request.body.ptlName,
			})

			return response.redirect(`${process.env.BASE_URL}/ptl`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).send("Permission denied")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("ptlNameInputValue", request.body.ptlName)

					return response.redirect(`${process.env.BASE_URL}/ptl`)

				case "duplicate-ptl-name":
					request.flash("ptlNameInputError", "Nama PTL sudah ada")
					request.flash("ptlNameInputValue", request.body.ptlName)

					return response.redirect(`${process.env.BASE_URL}/ptl`)
			}
		}
	},

	addPtlManager: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			await validatorjs(
				{
					ptlId: request.body.ptlId,
					username: request.body.username,
					password: request.body.password,
				},
				{
					ptlId: "required|string|size:36",
					username: "required|string|max:32",
					password: "required|string",
				}
			)

			await knex("ptl")
				.where("ptl_id", request.body.ptlId)
				.limit(1)
				.count("ptl_id as ptl")
				.then((result) => {
					if (result[0].ptl < 1) throw { error: "invalid-ptl-id" }
				})

			await knex("users")
				.where("username", request.body.username)
				.limit(1)
				.count("user_id as user")
				.then((result) => {
					if (result[0].user > 0) throw { error: "duplicate-username" }
				})

			await knex("users").insert({
				user_id: uuid.v4(),
				username: request.body.username,
				password: await bcrypt.hash(request.body.password, 10).then((hashedPassword) => hashedPassword),
				role: "ptl-manager",
				ptl_id: request.body.ptlId,
			})

			return response.redirect(`${process.env.BASE_URL}/ptl-manager`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).send("Permission denied")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/ptl-manager`)

				case "invalid-ptl-id":
					request.flash("ptlInputError", "PTL tidak valid")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/ptl-manager`)

				case "duplicate-username":
					request.flash("usernameInputError", "Username sudah terdaftar")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/ptl-manager`)
			}
		}
	},

	addPtlAdmin: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			await validatorjs(
				{
					ptlId: request.body.ptlId,
					username: request.body.username,
					password: request.body.password,
				},
				{
					ptlId: "required|string|size:36",
					username: "required|string|max:32",
					password: "required|string",
				}
			)

			await knex("ptl")
				.where("ptl_id", request.body.ptlId)
				.limit(1)
				.count("ptl_id as ptl")
				.then((result) => {
					if (result[0].ptl < 1) throw { error: "invalid-ptl-id" }
				})

			await knex("users")
				.where("username", request.body.username)
				.limit(1)
				.count("user_id as user")
				.then((result) => {
					if (result[0].user > 0) throw { error: "duplicate-username" }
				})

			await knex("users").insert({
				user_id: uuid.v4(),
				username: request.body.username,
				password: await bcrypt.hash(request.body.password, 10).then((hashedPassword) => hashedPassword),
				role: "ptl-admin",
				ptl_id: request.body.ptlId,
			})

			return response.redirect(`${process.env.BASE_URL}/ptl-admin`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).send("Permission denied")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/ptl-admin`)

				case "invalid-ptl-id":
					request.flash("ptlInputError", "PTL tidak valid")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/ptl-admin`)

				case "duplicate-username":
					request.flash("usernameInputError", "Username sudah terdaftar")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/ptl-admin`)
			}
		}
	},

	addMitra: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			await validatorjs({ mitraName: request.body.mitraName }, { mitraName: "required|string|max:32" })

			await knex("mitra")
				.where("mitra_name", request.body.mitraName)
				.limit(1)
				.count("mitra_id as mitra")
				.then((result) => {
					if (result[0].mitra > 0) throw { error: "duplicate-mitra-name" }
				})

			await knex("mitra").insert({
				mitra_id: uuid.v4(),
				mitra_name: request.body.mitraName,
			})

			return response.redirect(`${process.env.BASE_URL}/mitra`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).send("Permission denied")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("mitraNameInputValue", request.body.ptlName)

					return response.redirect(`${process.env.BASE_URL}/mitra`)

				case "duplicate-mitra-name":
					request.flash("mitraNameInputError", "Nama Mitra sudah ada")
					request.flash("mitraNameInputValue", request.body.ptlName)

					return response.redirect(`${process.env.BASE_URL}/mitra`)
			}
		}
	},

	addMitraAdmin: async (request, response) => {
		try {
			if (request.session.user.role != "master") throw { error: "permission-denied" }

			await validatorjs(
				{
					mitraId: request.body.mitraId,
					username: request.body.username,
					password: request.body.password,
				},
				{
					mitraId: "required|string|size:36",
					username: "required|string|max:32",
					password: "required|string",
				}
			)

			await knex("users")
				.where("username", request.body.username)
				.limit(1)
				.count("user_id as user")
				.then((result) => {
					if (result[0].user > 0) throw { error: "duplicate-username" }
				})

			await knex("users").insert({
				user_id: uuid.v4(),
				username: request.body.username,
				password: await bcrypt.hash(request.body.password, 10).then((hashedPassword) => hashedPassword),
				role: "mitra-admin",
				mitra_id: request.body.mitraId,
			})

			return response.redirect(`${process.env.BASE_URL}/mitra-admin`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).send("Permission denied")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/mitra-admin`)

				case "duplicate-username":
					request.flash("usernameInputError", "Username sudah terdaftar")

					request.flash("usernameInputValue", request.body.username)
					request.flash("passwordInputValue", request.body.password)

					return response.redirect(`${process.env.BASE_URL}/mitra-admin`)
			}
		}
	},

	submitPa: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			await validatorjs(
				{
					idPa: request.body.idPa,
					mitra: request.body.mitra,
					tanggalTerbitPa: request.body.tanggalTerbitPa,
					customer: request.body.customer,
					lokasi: request.body.lokasi,
					layanan: request.body.layanan,
					bandwidth: request.body.bandwidth,
					panjangTarikan: request.body.panjangTarikan,
					jumlahJb: request.body.jumlahJb,
				},
				{
					idPa: "required|string|max:16",
					mitra: "required|string|max:36",
					tanggalTerbitPa: "required|string",
					customer: "required|string|max:128",
					lokasi: "required|string|max:256",
					layanan: "required|string|max:32",
					bandwidth: "required|integer",
					panjangTarikan: "required|integer",
					jumlahJb: "required|integer",
				}
			)

			await knex("pa")
				.where("id_pa", request.body.idPa)
				.limit(1)
				.count("id_pa as pa")
				.then((result) => {
					if (result[0].pa > 0) throw { error: "duplicate-id-pa" }
				})

			await knex("pa").insert({
				id_pa: request.body.idPa,
				user_id: request.session.user.userId,
				ptl_id: request.session.user.ptlId,
				mitra_id: request.body.mitra,
				tanggal_terbit_pa: request.body.tanggalTerbitPa,
				customer: request.body.customer,
				lokasi: request.body.lokasi,
				layanan: request.body.layanan,
				bandwidth: request.body.bandwidth,
				panjang_tarikan: request.body.panjangTarikan,
				jumlah_jb: request.body.jumlahJb,
			})

			return response.redirect(`${process.env.BASE_URL}/submit-pa`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					request.flash("idPaInputValue", request.body.idPa)
					request.flash("tanggalTerbitPaInputValue", request.body.tanggalTerbitPa)
					request.flash("customerInputValue", request.body.customer)
					request.flash("lokasiInputValue", request.body.lokasi)
					request.flash("layananInputValue", request.body.layanan)
					request.flash("bandwidthInputValue", request.body.bandwidth)
					request.flash("idMitraInputValue", request.body.idMitra)
					request.flash("panjangTarikanInputValue", request.body.panjangTarikan)
					request.flash("jumlahJbInputValue", request.body.jumlahJb)

					return response.redirect(`${process.env.BASE_URL}/submit-pa`)

				case "duplicate-id-pa":
					request.flash("idPaInputError", "ID PA Duplikat")

					request.flash("idPaInputValue", request.body.idPa)
					request.flash("tanggalTerbitPaInputValue", request.body.tanggalTerbitPa)
					request.flash("customerInputValue", request.body.customer)
					request.flash("lokasiInputValue", request.body.lokasi)
					request.flash("layananInputValue", request.body.layanan)
					request.flash("bandwidthInputValue", request.body.bandwidth)
					request.flash("idMitraInputValue", request.body.idMitra)
					request.flash("panjangTarikanInputValue", request.body.panjangTarikan)
					request.flash("jumlahJbInputValue", request.body.jumlahJb)

					return response.redirect(`${process.env.BASE_URL}/submit-pa`)
			}
		}
	},

	updatePa: async (request, response) => {
		try {
			if (request.session.user.role != "mitra-admin") throw { error: "permission-denied" }

			const { body, files } = await formidable(request, "public/uploaded-files")

			await validatorjs(
				{
					fotoBriefingK3: files.fotoBriefingK3,
					progresTarikan: body.progresTarikan,
					tracingCore: body.tracingCore,
					testcom: body.testcom,
					fileTestcom: files.fileTestcom,
					baiUser: body.baiUser,
					fileBaiBakl: files.fileBaiBakl,
					tanggalBai: body.tanggalBai,
					kendala: body.kendala,
				},
				{
					fotoBriefingK3: "string",
					panjangTarikan: "integer",
					tracingCore: "integer",
					testcom: "integer",
					fileTestcom: "string",
					baiUser: "integer",
					fileBaiBakl: "string",
					tanggalBai: "string",
					kendala: "string",
				}
			)

			const pa = await knex("pa").where("id_pa", request.params.idPa).limit(1)

			if (body.testcom == 100) {
				if (lodash.isNil(files.fileTestcom)) {
					if (pa[0].file_testcom == null) throw { error: "missing-file-testcom" }
				}
			}

			if (body.baiUser == 100) {
				if (lodash.isNil(files.fileBaiBakl)) {
					if (pa[0].file_bai_bakl == null) throw { error: "missing-file-bai-bakl" }
				}
			}

			await knex("pa")
				.where("id_pa", request.params.idPa)
				.limit(1)
				.update({
					foto_briefing_k3: files.fotoBriefingK3,
					progres_tarikan: body.progresTarikan,
					tracing_core: body.tracingCore,
					testcom: body.testcom,
					file_testcom: files.fileTestcom,
					bai_user: body.baiUser,
					file_bai_bakl: files.fileBaiBakl,
					tanggal_bai: body.tanggalBai.length > 0 ? body.tanggalBai : null,
					kendala: body.kendala.length > 0 ? body.kendala : null,
				})

			request.flash(
				"message",
				`
						<div class="alert alert-success alert-dismissable">
						<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> Berhasil update PA </div>
					`
			)

			return response.redirect(`${process.env.BASE_URL}/update-pa`)
		} catch (error) {
			console.log("api-dashboard-controller/updatePa\n", error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")

				case "validatorjs-utility/validation-fails":
					Object.entries(error.errorMessages).forEach(([field, error]) => {
						request.flash(`${field}InputError`, error)
					})

					return response.redirect(`${process.env.BASE_URL}/update-pa/${request.params.idPa}`)

				case "missing-file-testcom":
					request.flash("fileTestcomInputError", "File Testcom harus di upload jika Testcom sudah 100%")

					return response.redirect(`${process.env.BASE_URL}/update-pa/${request.params.idPa}`)

				case "missing-file-bai-bakl":
					request.flash("fileBaiBaklInputError", "File Bai Bakl harus di upload jika BAI User sudah 100%")

					return response.redirect(`${process.env.BASE_URL}/update-pa/${request.params.idPa}`)
			}
		}
	},

	deleteFotoBriefingK3: async (request, response) => {
		try {
			if (request.session.user.role != "mitra-admin") throw { error: "permission-denied" }

			const pa = await knex("pa").where("id_pa", request.params.idPa).limit(1)

			await fs.unlink(`public/uploaded-files/${pa[0].foto_briefing_k3}`)

			await knex("pa").where("id_pa", request.params.idPa).limit(1).update({ foto_briefing_k3: null })

			return response.redirect(`${process.env.BASE_URL}/update-pa/${request.params.idPa}`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")
			}
		}
	},

	deleteFileTestcom: async (request, response) => {
		try {
			if (request.session.user.role != "mitra-admin") throw { error: "permission-denied" }

			const pa = await knex("pa").where("id_pa", request.params.idPa).limit(1)

			await fs.unlink(`public/uploaded-files/${pa[0].file_testcom}`)

			await knex("pa").where("id_pa", request.params.idPa).limit(1).update({ file_testcom: null })

			return response.redirect(`${process.env.BASE_URL}/update-pa/${request.params.idPa}`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")
			}
		}
	},

	deleteFileBaiBakl: async (request, response) => {
		try {
			if (request.session.user.role != "mitra-admin") throw { error: "permission-denied" }

			const pa = await knex("pa").where("id_pa", request.params.idPa).limit(1)

			await fs.unlink(`public/uploaded-files/${pa[0].file_bai_bakl}`)

			await knex("pa").where("id_pa", request.params.idPa).limit(1).update({ file_bai_bakl: null })

			return response.redirect(`${process.env.BASE_URL}/update-pa/${request.params.idPa}`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")
			}
		}
	},

	deletePa: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			const pa = await knex("pa").where("id_pa", request.params.idPa).limit(1)

			if (pa.length < 1) throw { error: "pa-not-found" }

			if (pa[0].foto_briefing_k3 != null) {
				await fs.unlink(path.join(__dirname, `../../../public/uploaded-files/${pa[0].foto_briefing_k3}`))
			}

			if (pa[0].file_testcom != null) {
				await fs.unlink(path.join(__dirname, `../../../public/uploaded-files/${pa[0].file_testcom}`))
			}

			if (pa[0].file_bai_bakl != null) {
				await fs.unlink(path.join(__dirname, `../../../public/uploaded-files/${pa[0].file_bai_bakl}`))
			}

			await knex("pa").where("id_pa", request.params.idPa).del()

			request.flash(
				"message",
				`
					<div class="alert alert-success alert-dismissable">
					<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> Berhasil menghapus PA </div>
				`
			)

			return response.redirect(`${process.env.BASE_URL}/submit-pa`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")

				case "pa-not-found":
					request.flash(
						"message",
						`
							<div class="alert alert-danger alert-dismissable">
							<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> PA tidak ditemukan </div>
						`
					)
			}
		}
	},

	exportExcel: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			const pa = await knex("pa")
				.select("pa.*", "mitra.mitra_name as mitra")
				.where("ptl_id", request.session.user.ptlId)
				.orderBy("tanggal_terbit_pa")
				.where("pa.ptl_id", request.session.user.ptlId)
				.join("mitra", "pa.mitra_id", "=", "mitra.mitra_id")
				.orderBy("tanggal_terbit_pa")
				.then((pa) => {
					return pa.map((pa) => {
						delete pa.user_id
						delete pa.ptl_id
						delete pa.mitra_id

						const currentTimestamp = Math.floor(new Date() / 1000)
						const tanggalTerbitPaTimestamp = Math.floor(new Date(pa.tanggal_terbit_pa) / 1000)

						return snakeCaseKeysToCamelCase({
							...pa,
							foto_briefing_k3: `${process.env.BASE_URL}/uploaded-files/${pa.foto_briefing_k3}`,
							tanggal_terbit_pa: `${new Date(pa.tanggal_terbit_pa).getFullYear()}-${new Date(pa.tanggal_terbit_pa).getMonth() + 1}-${new Date(pa.tanggal_terbit_pa).getDate()}`,
							tracing_core: `${pa.tracing_core}%`,
							testcom: `${pa.testcom}%`,
							file_testcom: `${process.env.BASE_URL}/uploaded-files/${pa.file_testcom}`,
							bai_user: `${pa.bai_user}%`,
							file_bai_bakl: `${process.env.BASE_URL}/uploaded-files/${pa.file_bai_bakl}`,
							tanggal_bai: `${new Date(pa.tanggal_bai).getFullYear()}-${new Date(pa.tanggal_bai).getMonth() + 1}-${new Date(pa.tanggal_bai).getDate()}`,
							aging: Math.ceil((pa.bai_user == 100 ? Math.floor(new Date(pa.tanggal_bai) / 1000) : currentTimestamp - tanggalTerbitPaTimestamp) / 86400),
						})
					})
				})

			const { workbook } = await generateExcel({ PA: pa })

			response.set({
				"content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"content-disposition": "attachment; filename=pa.xlsx",
			})

			await workbook.xlsx.write(response)

			return response.end
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")
			}
		}
	},

	importExcelSubmitPa: async (request, response) => {
		try {
			if (request.session.user.role != "ptl-admin") throw { error: "permission-denied" }

			const { files } = await formidable(request, path.join(__dirname, "../../../public/uploaded-files"))

			const pa = await readExcel(path.join(__dirname, `../../../public/uploaded-files/${files.pa}`)).then((pa) => {
				return pa.map((pa) => {
					return {
						id_pa: pa.id_pa,
						user_id: request.session.user.userId,
						ptl_id: request.session.user.ptlId,
						mitra_id: pa.mitra_id,
						tanggal_terbit_pa: pa.tanggal_terbit_pa,
						customer: pa.customer,
						lokasi: pa.lokasi,
						layanan: pa.layanan,
						bandwidth: pa.bandwidth,
						panjang_tarikan: pa.panjang_tarikan,
						jumlah_jb: pa.jumlah_jb,
					}
				})
			})

			for (let i = 0; i < pa.length; i++) {
				await validatorjs(pa[i], {
					id_pa: "required|string|max:16",
					mitra_id: "required|string|max:36",
					tanggal_terbit_pa: "required|string",
					customer: "required|string|max:128",
					lokasi: "required|string|max:256",
					layanan: "required|string|max:32",
					bandwidth: "required|integer",
					panjang_tarikan: "required|integer",
					jumlah_jb: "required|integer",
				})
			}

			await knex("pa")
				.insert(pa)
				.catch((error) => {
					if (error?.code == "ER_DUP_ENTRY") throw { error: "duplicate-pa" }
					throw error
				})

			request.flash(
				"message",
				`
						<div class="alert alert-success alert-dismissable">
						<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> Berhasil import PA </div>
					`
			)

			return response.redirect(`${process.env.BASE_URL}/submit-pa`)
		} catch (error) {
			console.log(error)

			switch (error?.error) {
				case "permission-denied":
					return response.status(403).render("errors/403")

				case "validatorjs-utility/validation-fails":
					request.flash(`excelInputError`, "Terdapat kesalahan pada data yang di import")
					return response.redirect(`${process.env.BASE_URL}/submit-pa`)

				case "duplicate-pa":
					request.flash(`excelInputError`, "Terdapat PA yang duplikat didalam file excel")
					return response.redirect(`${process.env.BASE_URL}/submit-pa`)
			}
		}
	},
}
