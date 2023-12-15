"use strict"

document.querySelector("#submit-button").addEventListener("click", async (event) => {
	event.preventDefault()

	const paData = {
		idPa: document.querySelector("#id-pa-input").value,
		idMitra: document.querySelector("#id-mitra-input").value,
		tanggalTerbitPa: document.querySelector("#tanggal-terbit-pa-input").value,
		layanan: document.querySelector("#layanan-input").value,
		customer: document.querySelector("#customer-input").value,
		lokasi: document.querySelector("#lokasi-input").value,
		bandwidth: document.querySelector("#bandwidth-input").value,
		panjangTarikan: document.querySelector("#panjang-tarikan-input").value,
		jumlahJb: document.querySelector("#jumlah-jb-input").value,
	}

	const submitButton = event.target

	document.querySelectorAll(".form-group small").forEach((inputError) => {
		inputError.textContent = ""
	})

	await axios({
		url: `${baseUrl}/api/pa`,
		method: "post",
		headers: { Accept: "application/json" },
		data: paData,
	})
		.then(() => {
			return axios({
				url: `${baseUrl}/api/pa`,
				method: "get",
				headers: { Accept: "application/json" },
			})
		})
		.then((response) => {
			toastr["success"]("Berhasil submit PA")

			$("#pa-table-body").empty()
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
					<td>${pa.mitra}</td>
					<td>${pa.panjangTarikan}</td>
					<td>${pa.jumlahJb}</td>
				</tr>
			`)
			})
		})
		.catch((error) => {
			switch (error.response.data.error) {
				case "validation-fails":
					Object.entries(error.response.data.errorMessages).forEach(([field, error]) => {
						document.querySelector(`#${field.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}-input-error-message`).textContent = error
					})

					break
			}

			submitButton.disabled = false
		})
})
