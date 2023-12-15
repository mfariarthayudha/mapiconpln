"use strict"

let timeout

async function searchPa() {
	const idPa = document.querySelector("#search-id-pa-input").value
	const tanggalTerbitPa = document.querySelector("#tanggal-terbit-pa-input").value
	const customer = document.querySelector("#customer-input").value
	const lokasi = document.querySelector("#lokasi-input").value
	const layanan = document.querySelector("#layanan-input").value

	await axios({
		url: `${baseUrl}/api/pa/search`,
		method: "post",
		headers: {
			"content-type": "application/json",
			Accept: "application/json",
		},
		data: {
			idPa: idPa,
			tanggalTerbitPa: tanggalTerbitPa,
			customer: customer,
			lokasi: lokasi,
			layanan: layanan,
		},
	})
		.then((response) => {
			console.log(response)
			$("#pa-table-body > :not(:first-child)").remove()

			response.data.forEach((pa, index) => {
				$("#pa-table-body").append(`
                    <tr>
                        <td>${index + 1}</td>
                        <td>${pa.idPa}</td>
                        <td>${pa.tanggalTerbitPa}</td>
                        <td>${pa.customer}</td>
                        <td>${pa.lokasi}</td>
                        <td>${pa.layanan}</td>
                        <td>${pa.bandwidth}</td>
                        <td>${pa.fotoBriefingK3 != null ? '<a href="' + baseUrl + "/uploaded-files/" + pa.fotoBriefingK3 + '" target="_blank">Lihat</a>' : ""}</td>
                        <td>${pa.panjangTarikan}</td>
                        <td>${pa.progresTarikan}</td>
                        <td>${pa.jumlahJb}</td>
                        <td>${pa.tracingCore}</td>
                        <td>${pa.testcom}</td>
                        <td>${pa.fileTestcom != null ? '<a href="' + baseUrl + "/uploaded-files/" + pa.fileTestcom + '" target="_blank">Lihat</a>' : ""}</td>
                        <td>${pa.baiUser}</td>
                        <td>${pa.fileBaiBakl != null ? '<a href="' + baseUrl + "/uploaded-files/" + pa.fileBaiBakl + '" target="_blank">Lihat</a>' : ""}</td>
                        <td>${pa.tanggalBai}</td>
                        <td>${pa.kendala}</td>
                        <td>Aging</td>
                    </tr>
                `)
			})
		})
		.catch((error) => console.log(error.response))
}

document.querySelectorAll(".table-search-input").forEach((tableSearchInput) => {
	tableSearchInput.addEventListener("keyup", () => {
		clearTimeout(timeout)

		timeout = setTimeout(searchPa(), 1000)
	})
})
