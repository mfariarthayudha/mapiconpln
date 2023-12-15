"use strict"

document.querySelector("#update-button").addEventListener("click", (event) => {
	event.preventDefault()

	const idPa = document.querySelector("#id-pa-input").value
	const customer = document.querySelector("#customer-input").value
	const fotoBriefingK3 = document.querySelector("#foto-briefing-k3-input").files
	const panjangTarikan = document.querySelector("#panjang-tarikan-input").value
	const progresTarikan = document.querySelector("#progres-tarikan-input").value
	const jumlahJb = document.querySelector("#jumlah-jb-input").value
	const tracingCore = document.querySelector("#tracing-core-input").value
	const testcom = document.querySelector("#testcom-input").value
	const fileTestcom = document.querySelector("#file-testcom-input").files
	const baiUser = document.querySelector("#bai-user-input").value
	const fileBaiBakl = document.querySelector("#file-bai-bakl-input").files
	const tanggalBai = document.querySelector("#tanggal-bai-input").value
	const kendala = document.querySelector("#kendala-input").value

	const updateButton = document.querySelector("#update-button")

	const formData = new FormData()

	formData.append("customer", customer)
	formData.append("panjangTarikan", panjangTarikan)
	formData.append("progresTarikan", progresTarikan)
	formData.append("jumlahJb", jumlahJb)
	formData.append("tracingCore", tracingCore)
	formData.append("testcom", testcom)
	formData.append("baiUser", baiUser)
	formData.append("tanggalBai", tanggalBai)
	formData.append("kendala", kendala)

	if (fotoBriefingK3.length > 0) {
		formData.append("fotoBriefingK3", fotoBriefingK3[0])
	}

	if (fileTestcom.length > 0) {
		formData.append("fileTestcom", fileTestcom[0])
	}

	if (fileBaiBakl.length > 0) {
		formData.append("fileBaiBakl", fileBaiBakl[0])
	}

	updateButton.setAttribute("disabled", true)

	axios
		.post(`${baseUrl}/api/pa/${idPa}`, formData)
		.then((response) => {
			toastr["success"]("Berhasil update PA")
		})
		.catch((error) => {
			toastr["error"]("Gagal update PA")
		})
})
