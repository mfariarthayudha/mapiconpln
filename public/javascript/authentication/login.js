"use strict"

document.querySelector("#login-form").addEventListener("submit", async (event) => {
	event.preventDefault()

	const username = document.querySelector("#username-input").value
	const password = document.querySelector("#password-input").value

	const usernameInputErrorMessage = document.querySelector("#username-input-error-message")
	const passwordInputErrorMessage = document.querySelector("#password-input-error-message")
	const loginButton = document.querySelector("#login-button")

	usernameInputErrorMessage.textContent = ""
	passwordInputErrorMessage.textContent = ""
	loginButton.disabled = true

	await axios({
		url: `${baseUrl}/api/authentication/login`,
		method: "post",
		headers: { Accept: "application/json" },
		data: {
			username: username,
			password: password,
		},
	})
		.then(() => {
			return window.location.replace(baseUrl)
		})
		.catch((error) => {
			switch (error.response.data.error) {
				case "validation-fails":
					Object.entries(error.response.data.errorMessages).forEach(([field, error]) => {
						document.querySelector(`#${field}-input-error-message`).textContent = error
					})

					break

				case "user-not-found":
					usernameInputErrorMessage.textContent = "Username yang anda masukkan tidak ditemukan"
					break

				case "invalid-password":
					passwordInputErrorMessage.textContent = "Password yang anda masukkan salah"
					break
			}

			loginButton.disabled = false
		})
})
