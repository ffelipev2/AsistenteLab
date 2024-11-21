let audioInterval; // Variable para almacenar el intervalo de animación de las barras

// Agregar event listener para las teclas
document.addEventListener('keydown', function(event) {
    // Verificar si la tecla presionada es 'q' o 'Q'
    if (event.key.toLowerCase() === 'q') {
        activarMicrofono();
    }
    // Verificar si la tecla presionada es 'w' o 'W'
    else if (event.key.toLowerCase() === 'w') {
        const form = document.querySelector("form");
        if (form) {
            mostrarCargando();
            form.requestSubmit(); // Usar requestSubmit en lugar de submit() para trigger los event listeners
        }
    }
});

function leerRespuesta() {
    const respuesta = document.getElementById("response_text").innerText.trim();

    if (respuesta) {
        const utterance = new SpeechSynthesisUtterance(respuesta);
        utterance.lang = "es-ES";

        // Inicia la animación de las barras de audio
        animarBarras();

        // Hablar y detener la animación al terminar
        utterance.onend = () => {
            detenerAnimacionBarras(); // Detener la animación al finalizar
            ocultarCargando();  // Oculta el círculo de carga al recibir respuesta
        };

        // Inicia el síntesis de voz
        window.speechSynthesis.speak(utterance);
    }
}

// Animación de las barras de audio
function animarBarras() {
    const bars = document.querySelectorAll('.bar');
    const heights = Array.from(bars).map(() => 20); // Inicializa las alturas en 20px

    audioInterval = setInterval(() => {
        bars.forEach((bar, index) => {
            const maxHeight = Math.random() * 60 + 20; // Altura máxima aleatoria entre 20 y 80
            heights[index] = maxHeight; // Actualiza la altura correspondiente
            bar.style.height = `${heights[index]}px`; // Cambia la altura de la barra
        });
    }, 100); // Cambia la altura cada 200ms
}

// Detener animación de las barras
function detenerAnimacionBarras() {
    clearInterval(audioInterval); // Limpiar el intervalo de animación
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.height = '20px'; // Regresar todas las barras a la altura inicial
    });
}

// Muestra el círculo de carga
function mostrarCargando() {
    document.getElementById("loading_overlay").style.display = "flex";
}

// Oculta el círculo de carga
function ocultarCargando() {
    document.getElementById("loading_overlay").style.display = "none";
}

// Inicia el reconocimiento de voz
function activarMicrofono() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const transcripcion = event.results[0][0].transcript;
        document.getElementById("user_message").value = transcripcion;
    };

    recognition.onerror = (event) => {
        console.error("Error en el reconocimiento de voz: ", event.error);
    };
}

// Configura eventos al cargar la página
window.onload = function() {
    ocultarCargando();  // Asegura que el círculo de carga esté oculto al cargar la página
    const form = document.querySelector("form");
    form.addEventListener("submit", function() {
        mostrarCargando(); // Mostrar círculo de carga al enviar el formulario
    });
    leerRespuesta();  // Ejecuta leerRespuesta cada vez que la página se carga o actualiza
};