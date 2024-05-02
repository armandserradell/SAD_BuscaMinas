let filas = 10
let columnas = 10
let lado = 40

let marcas = 0

let minas = columnas * filas * 0.1

let tablero = []
let enJuego = true
let juegoIniciado = false

nuevoJuego()

function nuevoJuego() {
    generarTableroHTML()
    añadirEventos()
    generarTableroJuego()
    refrescarTablero()

}
function generarTableroHTML() {
    let html = ""
    for (let f = 0; f < filas; f++) {
        html += `<tr>`
        for (let c = 0; c < columnas; c++) {
            //Asignamos coordenadas a cada celda
            html += `<td id="celda-${c}-${f}" style="width:${lado}px;height:${lado}px"`
            // html += `${c}-${f}`
            html += `</td>`

        }
        html += `</tr>`

    }

    let tableroHTML = document.getElementById("tablero")
    tableroHTML.innerHTML = html
    tableroHTML.style.width = columnas * lado + "px"
    tableroHTML.style.height = filas * lado + "px"

}

function añadirEventos() { //eventos mouse
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            let celda = document.getElementById(`celda-${c}-${f}`)
            celda.addEventListener("mouseup", me => {
                clicSimple(celda, c, f, me)
            })

        }
    }
}

function clicSimple(celda, c, f, me) {
    if (!enJuego) {
        return //Juego finalizado
    }
    if (tablero[c][f].estado == "descubierto") {
        return //celdas desc no puedes interactuar
    }

    switch (me.button) {
        case 0: //izquierdo
            if (tablero[c][f].estado == "marcado") {
                break;
            }
            tablero[c][f].estado = "descubierto"
            juegoIniciado = true
            break;

        case 2: //derecho
            if (tablero[c][f].estado == "marcado") {
                tablero[c][f].estado = undefined
                marcas--

            } else {
                tablero[c][f].estado = "marcado"
                marcas++
            }
            break;

        default:
            break;
    }
    refrescarTablero()
}


function refrescarTablero() { //Estado visual tablero
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            let celda = document.getElementById(`celda-${c}-${f}`)
            //celda.innerHTML = tablero[c][f].valor

            if (tablero[c][f].estado == "descubierto") {
                celda.style.background = "rgb(206, 146, 146)"
               celda.style.boxShadow = "none"
                
                switch (tablero[c][f].valor) {
                    case -1:
                        celda.innerHTML = "B"
                        break;


                    case 0:
                        break;
                    default:
                        celda.innerHTML = tablero[c][f].valor
                        break;
                }
            }

        }
    }
}

function generarTableroJuego() {
    vaciarTablero()
    ponerMinas()
    contadoresMinas()
}

function vaciarTablero() { //poner tablero estado inicial
    tablero = []
    for (let c = 0; c < columnas; c++) {
        tablero.push([])
    }

}

function ponerMinas() {
    for (let i = 0; i < minas; i++) {
        let c
        let f

        do {
            c = Math.floor(Math.random() * columnas) //floor para que sea num entero
            f = Math.floor(Math.random() * filas)

        } while (tablero[c][f]) //NO dos minas mismo sitio
        tablero[c][f] = { valor: -1 }
    }

}

function contadoresMinas() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (!tablero[c][f]) {
                let contador = 0
                //Se van a recorrer todas las celdas que están al rededor 
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i == 0 && j == 0) {
                            continue
                        }
                        try { //evitar errores con las posiciones negativas
                            if (tablero[c + i][f + j].valor == -1) {
                                contador++
                            }
                        } catch (e) { }
                    }
                }
                tablero[c][f] = { valor: contador }

            }


        }

    }
}



