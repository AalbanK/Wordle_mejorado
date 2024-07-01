const API = "https://random-word-api.herokuapp.com/word?lang=es&length=5"
let oportunidades = 6;
let diccionario = ['ALBAN', 'COSAS', 'TECHO', 'GENTE']
let random = Math.random() * diccionario.length
random = Math.floor(random)
let palabraSecreta = diccionario[random]

fetch(API)
    .then((response) => {
        response.json()
            .then((data) => {
                palabraSecreta = data[0].toUpperCase()
                console.log(palabraSecreta)
            })
    }).catch((e) => {
        console.log("ERROR")
    })

window.addEventListener('load', init)

function init() {
    const button = document.getElementById("guess-button");
    button.addEventListener("click", intentar);
    const tecladoButtons = document.querySelectorAll('.teclado-button');
    tecladoButtons.forEach(button => {
        button.addEventListener('click', tecladoVirtual);
    });
}

function intentar() {
    const intento = leerIntento();

    if (intento === null) {
        return;
    }

    const grid = document.getElementById("grid");
    const row = document.createElement('div');
    row.className = 'row';

    if (intento === palabraSecreta) {
        terminar("<h1>GANASTE!😀</h1>")
        return
    }

    for (let i in palabraSecreta) {
        const span = document.createElement('span');
        span.className = 'letter';

        if (intento[i] === palabraSecreta[i]) {
            console.log(intento[i], "VERDE")
            span.innerHTML = intento[i];
            span.style.backgroundColor = '#79b851';
        } else if (palabraSecreta.includes(intento[i])) {
            console.log(intento[i], "AMARILLO")
            span.innerHTML = intento[i];
            span.style.backgroundColor = '#f3c237';
        } else {
            console.log(intento[i], "GRIS")
            span.innerHTML = intento[i];
            span.style.backgroundColor = '#ccc';
        }

        row.appendChild(span)

    }

    grid.appendChild(row)
    oportunidades--

    if (oportunidades == 0) {
        terminar("<h1>PERDISTE!😖</h1><h3>La palabra correcta era: </h3>" + palabraSecreta)
    }
}

function leerIntento() {
    let intento = document.getElementById("guess-input");
    intento = intento.value;
    intento = intento.toUpperCase();

    if (intento.length !== 5) {
        mostrarError("La palabra debe tener exactamente 5 letras.");
        return null;
    }

    limpiarError();
    return intento;
}

function terminar(mensaje) {
    const input = document.getElementById("guess-input");
    const boton = document.getElementById("guess-button");
    input.disabled = true;
    boton.disabled = true;
    let contenedor = document.getElementById('guesses');
    contenedor.innerHTML = mensaje;
    crearBtnReintentar();
}

function mostrarError(mensaje) {
    let mensajeError = document.getElementById('error');
    if (!mensajeError) {
        mensajeError = document.createElement('p');
        mensajeError.id = 'error';
        mensajeError.className = 'error';
        document.body.insertBefore(mensajeError, document.getElementById('grid'));
    }
    mensajeError.innerHTML = mensaje;
}

function limpiarError() {
    let mensajeError = document.getElementById('error');
    if (mensajeError) {
        mensajeError.innerHTML = '';
    }
}

function crearBtnReintentar() {
    const botonReintentar = document.createElement('button');
    botonReintentar.id = 'boton-reintentar';
    botonReintentar.innerHTML = 'Reintentar';
    botonReintentar.addEventListener('click', function () {
        location.reload();
    });

    const contenedor = document.getElementById('guesses');
    contenedor.appendChild(botonReintentar);
}

function tecladoVirtual(event) {
    const buttonValue = event.target.innerHTML.toUpperCase();
    const input = document.getElementById('guess-input');

    if (buttonValue === 'DEL') {
        input.value = input.value.slice(0, -1);
    } else if (buttonValue === 'ENTER') {
        intentar();
    } else {
        if (input.value.length < 5) {
            input.value += buttonValue;
        }
    }
}