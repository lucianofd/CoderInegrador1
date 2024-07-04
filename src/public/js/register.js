const registerUser = async () => {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let age = document.getElementById("age").value;
    let password = document.getElementById("password").value;

    const user = { first_name, last_name, email, age, password };

    try {
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        const messageElement = document.getElementById("message");

        if (response.ok) {
            // Registro exitoso, mostrar mensaje y redirigir
            messageElement.innerHTML = `<div class="alert alert-success">${data.message || '¡Registro exitoso! Redirigiendo...'}</div>`;
            setTimeout(() => {
                window.location.href = '/login';  // Redirigir a la página de login
            }, 2000); // Espera 2 segundos antes de redirigir
        } else {
            // Error en el registro, mostrar mensaje de error
            messageElement.innerHTML = `
            <div class="alert alert-danger">
              ${data.message || 'Error en el registro'}
              ${data.details ? `<pre>${data.details}</pre>` : ''}
            </div>`;
        }
    } catch (error) {
        console.error("Error registering user:", error);
        const messageElement = document.getElementById("message");
        messageElement.innerHTML = `<div class="alert alert-danger">Error de servidor. Por favor, inténtelo más tarde.</div>`;
    }
}

document.getElementById("btnRegister").onclick = registerUser;
