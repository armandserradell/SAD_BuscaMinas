let filas = 10
let columnas = 10
let lado = 40

let marcas = 0

let minas =  Math.floor(columnas * filas * 0.1)

let tablero = []
let enJuego = true
let juegoIniciado = false

let pista = true

let sonidoStart = new Audio("sonidos/start.mp3")
let sonidoAbrir = new Audio("sonidos/dig.mp3")
let sonidoBomba = new Audio("sonidos/bomba.mp3")
let sonidoPista = new Audio("sonidos/pista.mp3")
let sonidoWin = new Audio("sonidos/victoria.mp3")
let sonidoMarcar = new Audio("sonidos/marcar.mp3")

nuevoJuego()

function nuevoJuego() {
    console.log("Iniciando nuevo juego con las siguientes configuraciones:");
    console.log("Filas:", filas);
    console.log("Columnas:", columnas);
    console.log("Minas:", minas);


    sonidoStart.play()
    generarTableroHTML()
    reiniciarVariables()
    añadirEventos()
    generarTableroJuego()
    refrescarTablero()

}

function actualizarPanel(){
    let panel = document.getElementById("minas");
    panel.innerHTML = minas - marcas;
}


function reiniciarVariables(){
    marcas = 0;
    enJuego = true;
    juegoIniciado = false;

}

function mostrarMenuConfiguracion() {
    let menuConfiguracion = document.getElementById("menu-configuracion");
    if (menuConfiguracion.style.display === "none") {
        menuConfiguracion.style.display = "block";
    } else {
        menuConfiguracion.style.display = "none";
    }
}

function cerrarMenuConfiguracion() {
    document.getElementById("menu-configuracion").style.display = "none";
}

function aplicarConfiguracion() {
    let nuevasFilas = parseInt(document.getElementById("input-filas").value);
    let nuevasColumnas = parseInt(document.getElementById("input-columnas").value);
    let nuevasMinas = parseInt(document.getElementById("input-minas").value);

    if (isNaN(nuevasFilas) || isNaN(nuevasColumnas) || isNaN(nuevasMinas)) {
        alert("Por favor, introduce valores numéricos válidos para filas, columnas y minas.");
        return;
    }

    // Actualizar variables con los nuevos valores
    filas = nuevasFilas;
    columnas = nuevasColumnas;
    minas = nuevasMinas;

    console.log("Nuevas filas:", filas);
    console.log("Nuevas columnas:", columnas);
    console.log("Nuevas minas:", minas);


    // Reiniciar el juego con las nuevas configuraciones
    nuevoJuego();
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
            if(tablero[c][f].valor != -1 ){
                sonidoAbrir.currentTime = 0
                sonidoAbrir.play()
                setTimeout(function() {
                    sonidoAbrir.pause();
                }, 2000);
            }
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
                sonidoMarcar.play()
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
    actualizarPanel()
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
    sonidoAbrir.pause()
    sonidoWin.play()
    ganador.style.display = "block"
    ganador.style.display = "flex"
    setTimeout(function() {
        ganador.style.display = "none";
    }, 2500); // ms
    enJuego = false
   

}

function verificarPerdedor(){
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if(tablero[c][f].valor == -1 && tablero[c][f].estado == "descubierto"){
                sonidoBomba.play()
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
    sonidoPista.currentTime = 0
    sonidoPista.play()
    setTimeout(function() {
        sonidoPista.pause();
    }, 2000);
    celda.style.background = "red"

    pista = false
    //refrescarTablero()
    
}


