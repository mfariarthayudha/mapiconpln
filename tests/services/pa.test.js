"use strict"

const { addPa, getPa, updatePa, deletePa, searchPa, exportPaToExcel } = require("../../src/services/pa")

const knex = require("../../src/utilities/knex")
const snakeKeyToCamelCase = require("../../src/utilities/snake-key-to-camel-case")

describe("addPa", () => {
	test("Successfully add pa", async () => {
		const mitra = await knex("users").select("user_id").orderByRaw("RAND()").limit(1)

		return addPa({
			paData: {
				idPa: "A222401000165",
				tanggalTerbitPa: "2023-11-28",
				customer: "Kejaksaan Negeri Siak",
				lokasi: "(Kejaksaan Negeri Siak) Komplek Perkantoran Tanjung Agung, Sei Mempura, Mempura, Sungai Mempura, Kec. Siak, Kabupaten Siak, Riau 28773",
				layanan: "LAIN-LAIN - LAIN-LAIN",
				bandwidth: 100,
				mitra: mitra[0].user_id,
				panjangTarikan: 150,
				jumlahJb: 5,
			},
		})
	})
})

describe("getPa", () => {
	test("Successfully get pa", async () => {
		const pa = await knex("pa").select("id_pa").orderByRaw("RAND()").limit(1)

		return getPa({ idPa: pa[0].id_pa })
	})
})

describe("updatePa", () => {
	test("Successfully update pa", async () => {
		const pa = await knex("pa").select("id_pa").limit(1)

		return updatePa({
			idPa: pa[0].id_pa,
			updatedPaData: {
				fotoBriefingK3: "https://google.com",
				progresTarikan: 50,
				tracingCore: 50,
				testcom: 50,
				fileTestcom: "https://google/com",
				baiUser: 50,
				fileBaiBakl: "https://google/com",
				tanggalBai: "2023-12-05",
				kendala: "Ada kendala",
			},
		})
	})

	test("Failed to update pa using invalid id pa", async () => {
		return await expect(
			updatePa({
				idPa: "invalid-id-pa",
				updatedPaData: {
					fotoBriefingK3: "https://google.com",
					progresTarikan: 50,
					tracingCore: 50,
					testcom: 50,
					fileTestcom: "https://google/com",
					baiUser: 50,
					fileBaiBakl: "https://google/com",
					tanggalBai: "2023-12-05",
					kendala: "Ada kendala",
				},
			})
		).rejects.toEqual(expect.objectContaining({ error: "pa-service/updatePa/invalid-id-pa" }))
	})
})

describe("deletePa", () => {
	test("Successfully delete pa", async () => {
		const pa = await knex("pa").select("id_pa").limit(1)

		return deletePa({ idPa: pa[0].id_pa })
	})
})

describe("searchPa", () => {
	test("Successfully search pa using id pa", async () => {
		const pa = await knex("pa").select("id_pa").orderByRaw("RAND()").limit(1)

		return searchPa({
			searchTerms: {
				idPa: pa[0].id_pa.substring(pa[0].id_pa.length - 3),
			},
		})
	})

	test("Successfully search pa using tanggal terbit pa", async () => {
		const pa = await knex("pa").select("tanggal_terbit_pa").orderByRaw("RAND()").limit(1)
		const date = new Date(pa[0].tanggal_terbit_pa)

		return searchPa({
			searchTerms: {
				tanggalTerbitPa: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
			},
		})
	})

	test("Successfully search pa using customer", async () => {
		const pa = await knex("pa").select("customer").orderByRaw("RAND()").limit(1)

		return searchPa({
			searchTerms: {
				customer: pa[0].customer.substring(pa[0].customer.length - 3),
			},
		})
	})

	test("Successfully search pa using lokasi", async () => {
		const pa = await knex("pa").select("lokasi").orderByRaw("RAND()").limit(1)

		return searchPa({
			searchTerms: {
				lokasi: pa[0].lokasi.substring(pa[0].lokasi.length - 3),
			},
		})
	})

	test("Successfully search pa using layanan", async () => {
		const pa = await knex("pa").select("layanan").orderByRaw("RAND()").limit(1)

		return searchPa({
			searchTerms: {
				layanan: pa[0].layanan.substring(pa[0].layanan.length - 3),
			},
		})
	})
})

describe("exportPaToExcel", () => {
	test("Successfully export pa to excel", async () => {
		const pa = await knex("pa").limit(1)
		const camelCasePa = pa.map((pa) => snakeKeyToCamelCase(pa))

		return exportPaToExcel({ paData: camelCasePa })
	}, 30000)
})
