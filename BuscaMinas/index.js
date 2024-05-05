let filas = 10
let columnas = 10
let lado = 40

let marcas = 0

let minas = columnas * filas * 0.1

let tablero = []
let enJuego = true
let juegoIniciado = false

let pista = true

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

   /* for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            let celda = document.getElementById(`celda-${c}-${f}`)
            if(celda.estado == undefined && (c+f)%2==0){
                celda.style.background = "#7DCEA0"
            }else{
                celda.style.background = "#A9DFBF"

            }
        }
    }

*/
   

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

    if (celda.style.backgroundColor == "red") {
        celda.style.backgroundImage = "url(img/suelo.avif)" 
        celda.style.backgroundSize = "cover"
    }

    switch (me.button) {
        case 0: //izquierdo
            if (tablero[c][f].estado == "marcado") {
                break;
            }
            tablero[c][f].estado = "descubierto"
            juegoIniciado = true

            if(tablero[c][f].valor == 0){
                abrirArea(c,f)
            }
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
                celda.classList.add("tierra")
               celda.style.boxShadow = "none"
              /* if((c+f)%2 == 0){
                celda.style.background = "#F5CBA7"
               }else{
                celda.style.background = "#FDEBD0"
                
               }*/

                
                switch (tablero[c][f].valor) {
                    case -1:
                       celda.innerHTML = "&#128163" //bomba , diana 127919
                       //celda.innerHTML = '<img src="img/bomba.png" style="width: 100%; height: 100%; object-fit: cover; ">';
                       celda.style.background = "white" 
                        break;


                    case 0:
                        break;
                    default:
                        celda.innerHTML = tablero[c][f].valor
                        break;
                }
            }
            if(tablero[c][f].estado == "marcado"){
                celda.innerHTML = "&#127919" //diana
                celda.style.background = "lightgreen"

            }
            if(tablero[c][f].estado == undefined){
                celda.innerHTML= ""
                celda.style.background = ""
            }

        }
    }
    verificarGanador()
    verificarPerdedor()
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

function abrirArea(c, f) {
   
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) {
         
          continue
        }
        try { //para evitar posiciones negativas
          if (tablero[c + i][f + j].estado != "descubierto") {
            if (tablero[c + i][f + j].estado != "marcado") {
              tablero[c + i][f + j].estado = "descubierto" 
              
              if (tablero[c + i][f + j].valor == 0) { 
                abrirArea(c + i, f + j)
              }
            }
          }
        } catch (e) {}
      }
    }
  }

function verificarGanador(){
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
          if (tablero[c][f].estado != "descubierto") { //Si la mina está cubeirta
            if (tablero[c][f].valor == -1) { //y es una mina
              //entonces vamos bien
              continue
            } else {
              //Si encuentra una celda cubierta, que no sea una mina, aún no se ha ganado
              return
            }
          }
        }
      }

    let ganador = document.getElementById("ganador")
    ganador.style.display = "block"
    setTimeout(function() {
        ganador.style.display = "none";
    }, 2500); // ms
    enJuego = false
   

}

function verificarPerdedor(){
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if(tablero[c][f].valor == -1 && tablero[c][f].estado == "descubierto"){
                let explosion = document.getElementById("explosion")
                explosion.style.display = "block"
                setTimeout(function() {
                    explosion.style.display = "none";
                }, 2500); // ms
                enJuego = false

            }
        }
    } //Mostrar todas las minas
    if(enJuego){
        return
    }
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if(tablero[c][f].valor == -1){
                let celda = document.getElementById(`celda-${c}-${f}`)
                celda.innerHTML = "&#128163"
                celda.style.color = "black"
                
            }
        }
    }

}

function darPista(){
    if(!juegoIniciado || !pista){
        return
    }
    let posicionesVacias = []
    
    // Recorrer el tablero y guardar las posiciones vacías (undefined)
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if ((tablero[c][f].estado == undefined) && (tablero[c][f].valor != -1) ) {
                posicionesVacias.push([c, f]);
            }
        }
    }
    
    // Seleccionar aleatoriamente una posición vacía
    let indiceAleatorio = Math.floor(Math.random() * posicionesVacias.length);
    let posicionAleatoria = posicionesVacias[indiceAleatorio];
    
    let[c, f] = posicionAleatoria
    let celda = document.getElementById(`celda-${c}-${f}`)
    celda.style.background = "red"

    pista = false
    //refrescarTablero()
    
}


