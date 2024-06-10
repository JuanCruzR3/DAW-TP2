const menuIcon = document.querySelector(".header__menu-icon");
const nav = document.querySelector(".nav");
const subscriptionForm = document.getElementById("subscription-form");
const modal = document.getElementById("modal");
const closeButton = document.getElementById("close-button");
const modalMessage = document.getElementById("modal-message");

// Event listener para el icono del menú
menuIcon.addEventListener("click", () => {
    nav.classList.toggle("open");
});

// Close the modal
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

// Permitir solo números en un textbox
const allowOnlyNumbers = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
    }
};

// Permitir solo letras 
const allowOnlyLetters = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    
    // Permitir letras (mayúsculas y minúsculas y espacio) 
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
};


// Validaciones del formulario de suscripción
const validateField = (field, condition, errorMessage) => {
    const errorElement = document.getElementById(`error-${field.id}`);
    if (!condition) {
        errorElement.textContent = errorMessage;
        return false;
    } else {
        errorElement.textContent = '';
        return true;
    }
};

const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePassword = password => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
};

// Validación de cada campo en el evento "blur"
document.querySelectorAll("#subscription-form input").forEach(input => {
    input.addEventListener("blur", (event) => {
        switch(event.target.id) {
            case "full-name":
                validateField(event.target, event.target.value.split(' ').length > 1 && event.target.value.length > 6, "El nombre completo debe tener más de 6 letras y al menos un espacio.");
                break;
            case "email":
                validateField(event.target, validateEmail(event.target.value), "Formato de email no válido.");
                break;
            case "password":
                validateField(event.target, validatePassword(event.target.value), "La contraseña debe tener al menos 8 caracteres, formados por letras y números.");
                break;
            case "confirm-password":
                validateField(event.target, event.target.value === document.getElementById("password").value, "Las contraseñas no coinciden.");
                break;
            case "phone":
                validateField(event.target, /^\d{7,}$/.test(event.target.value), "El teléfono debe ser un número de al menos 7 dígitos.");
                break;
            case "address":
                validateField(event.target, event.target.value.length >= 5 && /\s/.test(event.target.value), "La dirección debe tener al menos 5 caracteres, incluyendo letras, números y un espacio.");
                break;
            case "city":
                validateField(event.target, event.target.value.length >= 3, "La ciudad debe tener al menos 3 caracteres.");
                break;
            case "postal-code":
                validateField(event.target, event.target.value.length >= 3, "El código postal debe tener al menos 3 caracteres.");
                break;
            case "dni":
                validateField(event.target, /^\d{7,8}$/.test(event.target.value), "El DNI debe ser un número de 7 u 8 dígitos.");
                break;
            default:
                break;
                case "age":
                validateField(event.target, Number.isInteger(parseInt(event.target.value)) && parseInt(event.target.value) >= 18 && parseInt(event.target.value) <= 100, "La edad debe ser un número entero entre 18 y 100.");
                break;
              }

    });


    // Limpieza del mensaje de error en el evento "focus"
    input.addEventListener("focus", (event) => {
        const errorElement = document.getElementById(`error-${event.target.id}`);
        errorElement.textContent = '';
    });
});

// Validación del formulario en el evento "submit"
subscriptionForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let isValid = true;
    const formData = new FormData(subscriptionForm);

    isValid &= validateField(
        document.getElementById("full-name"),
        formData.get("full-name").split(' ').length > 1 && formData.get("full-name").length > 6,
        "El nombre completo debe tener más de 6 letras y al menos un espacio."
    );

    isValid &= validateField(
        document.getElementById("email"),
        validateEmail(formData.get("email")),
        "Formato de email no válido."
    );

    isValid &= validateField(
        document.getElementById("password"),
        validatePassword(formData.get("password")),
        "La contraseña debe tener al menos 8 caracteres, formados por letras y números."
    );

    isValid &= validateField(
        document.getElementById("confirm-password"),
        formData.get("confirm-password") === formData.get("password"),
        "Las contraseñas no coinciden."
    );

    isValid &= validateField(
        document.getElementById("age"),
        Number.isInteger(parseInt(formData.get("age"))) && parseInt(formData.get("age")) >= 18,
        "Debe ser un número entero mayor o igual a 18."
    );

    isValid &= validateField(
        document.getElementById("phone"),
        /^\d{7,}$/.test(formData.get("phone")),
        "El teléfono debe ser un número de al menos 7 dígitos."
    );

    isValid &= validateField(
        document.getElementById("address"),
        formData.get("address").length >= 5 && /\s/.test(formData.get("address")),
        "La dirección debe tener al menos 5 caracteres, incluyendo letras, números y un espacio."
    );

    isValid &= validateField(
        document.getElementById("city"),
        formData.get("city").length >= 3,
        "La ciudad debe tener al menos 3 caracteres."
    );

    isValid &= validateField(
        document.getElementById("postal-code"),
        formData.get("postal-code").length >= 3,
        "El código postal debe tener al menos 3 caracteres."
    );

    isValid &= validateField(
        document.getElementById("dni"),
        /^\d{7,8}$/.test(formData.get("dni")),
        "El DNI debe ser un número de 7 u 8 dígitos."
    );

    if (!isValid) {
        alert("Hay errores en el formulario. Por favor, corríjalos y vuelva a intentarlo.");
        return;
    }

    // Enviar datos al servidor
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const responseData = await response.json();
        localStorage.setItem('userData', JSON.stringify(responseData));

  
        alert(`Suscripción exitosa. Datos recibidos: ${JSON.stringify(responseData)}`);

        //redirigir a index 
        window.location.href = "inicio.html";
    }
     catch (error) {
        modalMessage.textContent = `Error en la suscripción: ${error.message}`;
        modal.style.display = 'block';
    }
});
