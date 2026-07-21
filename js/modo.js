//---------------------------Funciones para modo claro/oscuro---------------------------
//Guardar configuracion
window.addEventListener("DOMContentLoaded", () => {
    const modo = localStorage.getItem("modo");
    const icon = document.getElementById("modo-claro-oscuro");

    if(modo === "dark"){
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        if (icon) icon.src = "img/claro.png";
    }
    else{
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        if (icon) icon.src = "img/oscuro.png";
    }
});

function cambiarModo(){
    const icon = document.getElementById("modo-claro-oscuro");
    if (!icon) return;

    if(document.body.classList.contains("dark")){
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        localStorage.setItem("modo", "light");
        icon.src = "img/oscuro.png";
    }
    else{
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        localStorage.setItem("modo", "dark");
        icon.src = "img/claro.png";
    }
}