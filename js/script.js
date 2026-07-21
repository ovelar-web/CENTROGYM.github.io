//---------------------------Funcion para enlaces de navegacion del header---------------------------
window.addEventListener("scroll", () => {
    let seccionActiva = "";
    document.querySelectorAll('section[id]').forEach(sec => {
        if(window.scrollY >= sec.offsetTop - 300) seccionActiva = sec.id;
    });
    document.querySelectorAll('.nav-enlaces a').forEach(a => {
        a.classList.remove('activo');
        if(a.getAttribute('href') === '#' + seccionActiva || (seccionActiva === 'inicio' 
            && a.getAttribute('href') === '#')){ 
                a.classList.add('activo');
        }
    })
})

//------------------------------------Funcion para modal llamada------------------------------------
function mostrarModalLlamada(){
    document.getElementById('div-modal-llamada').style.display = "block";
}
function cerrarModalLlamada(){
    document.getElementById('div-modal-llamada').style.display = "none";
}

//---------------------------------Funcion para carrucel de imagenes---------------------------------
const carrucel = document.querySelector('.carrucel');
const slides = document.querySelectorAll('.div-galeria');
const btnIzq = document.querySelector('.btn-izquierda');
const btnDer = document.querySelector('.btn-derecha');

let actual = 0;
let timer;

function inicializar(){
    slides.forEach((slide, i) => {
        slide.classList.remove('activa', 'saliendo');
        if(i === actual){
            slide.classList.add('activa');
        }
    });
}

let animando = false;
function irA(indexNuevo, direccion = 'derecha'){
    if(animando) return;
    animando = true;

    const anterior = actual;
    actual = (indexNuevo + slides.length) % slides.length;
    if(anterior === actual){
        animando = false;
        return;
    }

    const slideAnterior = slides[anterior];
    const slideNueva = slides[actual];
    slideNueva.style.transition = 'none';
    slideNueva.classList.remove('saliendo');
    slideNueva.style.transform = direccion === 'derecha' ? 'translateX(100%)' : 'translateX(-100%)';
    slideNueva.style.opacity = '0';
    slideNueva.style.position = 'absolute';
    slideNueva.style.zIndex = '2';

    void slideNueva.offsetWidth;
    slideNueva.style.transition = '';

    slideAnterior.classList.remove('activa');
    slideAnterior.classList.add('saliendo');
    if(direccion === 'izquierda'){
        slideAnterior.style.transform = 'translateX(100%)';
    }

    requestAnimationFrame(() => {
        slideNueva.style.transform = 'translateX(0)';
        slideNueva.style.opacity = '1';
    });

    setTimeout(() => {
        slideAnterior.classList.remove('saliendo');
        slideAnterior.style.transform = '';
        slideAnterior.style.position = '';
        slideAnterior.style.zIndex = '';

        slideNueva.classList.add('activa');
        slideNueva.style.transform = '';
        slideNueva.style.opacity = '';
        slideNueva.style.position = '';
        slideNueva.style.zIndex = '';

        animando = false;
    }, 600);
}
function siguiente(){
    irA(actual + 1, 'derecha');
}
function anterior(){
    irA(actual - 1, 'izquierda');
}
function reiniciarTimer(){
    clearInterval(timer);
    timer = setInterval(siguiente, 3000);
}

btnDer.addEventListener('click', () => { siguiente(); reiniciarTimer(); });
btnIzq.addEventListener('click', () => { anterior(); reiniciarTimer(); });

inicializar();
reiniciarTimer();
carrucel.addEventListener('mouseenter', () => clearInterval(timer));
carrucel.addEventListener('mouseleave', () => reiniciarTimer());

//-----------------------------------Funcion para boton ir arriba-----------------------------------
function verificarScroll(){
    if(window.scrollY > 700){
        document.getElementById('arriba').style.display = "flex";
    }
    else{
        document.getElementById('arriba').style.display = "none";
    }
}
window.addEventListener("scroll", verificarScroll);
window.addEventListener("load", verificarScroll);
function irArriba(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

//------------------------------------Funcion para achicar header------------------------------------
function actualizarHeaderChico(){
    const header = document.querySelector('header');
    const esMobile = window.innerWidth <= 768;
    const umbral = esMobile ? 150 : 500;
    if(window.scrollY > umbral){
        header.classList.add('header-chico');
    }
    else{
        header.classList.remove('header-chico');
    }
}

window.addEventListener('scroll', actualizarHeaderChico);
window.addEventListener('load', actualizarHeaderChico);
window.addEventListener('resize', actualizarHeaderChico); // por si rotan el celular o cambian de tamaño

//-----------------------------------Funcion para combo + textarea-----------------------------------
const select = document.getElementById('opciones');
const textarea = document.getElementById('mensaje');
let lineaFija = "";

select.addEventListener('change', () => {
    //Borra la línea fija anterior (la que está entre ***)
    const comentarioUsuario = textarea.value.replace(/^\*\*\*.*\*\*\*\n\n?/, '');

    if(select.value === ""){
        lineaFija = "";
        textarea.value = comentarioUsuario;
    }
    else{
        lineaFija = `***${select.options[select.selectedIndex].text}***\n\n`;
        textarea.value = lineaFija + comentarioUsuario;
    }
    //Si eligió "Realizar una pregunta", poner el cursor en el textarea
    if(select.value === 'libre'){
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
});

textarea.addEventListener('input', () => {
    if(lineaFija && !textarea.value.startsWith(lineaFija)){
        const comentarioUsuario = textarea.value.replace(/^\*\*\*.*\*\*\*\n\n?/, '');
        textarea.value = lineaFija + comentarioUsuario;
    }
});

//---------------------------------------Funcion para EmailJS---------------------------------------
const btn = document.getElementById('button');

document.getElementById('formCorreo').addEventListener('submit', function (event){
    event.preventDefault();
    btn.value = 'Enviando...';

    //Concatenar nombre + apellido
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const nombreCompleto = `${nombre} ${apellido}`;

    //Obtener teléfono y correo
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();

    //El mensaje ya viene armado (opción + comentario) desde el textarea
    const mensajeFinal = document.getElementById('mensaje').value.trim();

    //Objeto con los datos que la plantilla de EmailJS espera
    const params = {
        nombre: nombreCompleto,
        telefono: telefono,
        correo: correo,
        mensaje: mensajeFinal
    };

    const serviceID = 'default_service';
    const templateID = 'template_v5acvuv';

    emailjs.send(serviceID, templateID, params).then(() => {
        btn.value = 'Enviar';
        alert('Enviado!');
        this.reset();
        lineaFija = '';
    }, (err) => {
        btn.value = 'Enviar';
        alert(JSON.stringify(err));
    });
});

//---------------------------------Funcion para modal de servicios---------------------------------
const datosServicios = {
    cardio: {
        tipo: "PROGRAMA: CARDIO",
        dias: "DIAS: Lunes, Miércoles y Viernes",
        horarios: "HORARIOS: 06:00 - 11:00 / 13:00 - 18:00"
    },
    musculacion: {
        tipo: "PROGRAMA: MUSCULACIÓN",
        dias: "DIAS: Lunes, Martes y Jueves",
        horarios: "HORARIOS: 06:00 - 11:00 / 13:00 - 18:00 / 19:00 - 23:00"
    },
    funcional: {
        tipo: "PROGRAMA: FUNCIONAL",
        dias: "DIAS: Martes, Jueves y Sábado",
        horarios: "HORARIOS: 06:00 - 11:00 / 13:00 - 18:00"
    },
    fitDance: {
        tipo: "PROGRAMA: FIT DANCE",
        dias: "DIAS: Martes, Miércoles, Jueves y Viernes",
        horarios: "HORARIOS: 06:00 - 11:00 / 13:00 - 18:00 / 19:00 - 23:00"
    },
    hiit: {
        tipo: "PROGRAMA: ENTRENAMIENTO POTENCIADO",
        dias: "DIAS: Martes, Miércoles, Jueves y Sábado",
        horarios: "HORARIOS: 06:00 - 11:00 / 13:00 - 18:00 / 19:00 - 23:00"
    }
};

const modal = document.getElementById('div-modal-servicio');
const tipoServicioEl = document.getElementById('tipo');
const diasEl = document.getElementById('dias');
const horariosEl = document.getElementById('horarios');
const cerrarModal = document.getElementById('cerrar-modal-servicio');
const botonAceptar = document.getElementById('boton-modal-servicio');

//Abrir modal al hacer clic en cualquier "Ver más"
document.querySelectorAll('.div-servicios-programas .div-servicio').forEach(tarjeta => {
    const boton = tarjeta.querySelector('.div-boton-servicio button');
    boton.addEventListener('click', () => {
        const servicio = tarjeta.getAttribute('data-servicio');
        const datos = datosServicios[servicio];

        if(datos){
            tipoServicioEl.textContent = datos.tipo;
            diasEl.textContent = datos.dias;
            horariosEl.textContent = datos.horarios;
        }
        modal.classList.add('activo');
    });
});

//Cerrar modal con la X
cerrarModal.addEventListener('click', () => {
    modal.classList.remove('activo');
});

//Cerrar modal con el botón "Aceptar"
botonAceptar.addEventListener('click', () => {
    modal.classList.remove('activo');
});

//---------------------------------------Funcion para modal de infraestructura---------------------------------------

const datosInfraestructura = {
    maquinas: {
        imagen: "img/infra1.webp",
        titulo: "EQUIPAMIENTOS MODERNOS",
        descripcion: "En CENTRO GYM contamos con instalaciones modernas y seguras, diseñadas para ofrecer comodidad y eficiencia en cada entrenamiento."
    },
    coach: {
        imagen: "img/infra2.avif",
        titulo: "PERSONALES CAPACITADOS",
        descripcion: "Contamos con un equipo de profesionales altamente preparados, dedicados a guiar y acompañar cada entrenamiento de manera segura y efectiva."
    },
    sanitarios: {
        imagen: "img/infra3.jpg",
        titulo: "SANITARIOS MODERNOS",
        descripcion: "Ofrecemos sanitarios amplios, higiénicos y equipados con instalaciones modernas que garantizan comodidad y seguridad para todos los clientes."
    },
    estacionamiento: {
        imagen: "img/infra4.jpeg",
        titulo: "ESTACIONAMIENTO AMPLIO",
        descripcion: "Estacionamiento cómodo y seguro, pensado para que los clientes puedan acceder con tranquilidad y facilidad a nuestras instalaciones."
    },
    cantina: {
        imagen: "img/cantina.jpg",
        titulo: "ESPACIO GASTRONÓMICO",
        descripcion: "Un espacio para disfrutar opciones saludables y refrescantes en un ambiente moderno, con suplementos deportivos que potencian tu entrenamiento."
    }
};

const modalInfraestructura = document.getElementById('div-modal-infraestructura');
const imagenInfraEl = document.getElementById('img-modal-infraestructura');
const tituloInfraEl = document.getElementById('titulo-modal-infra');
const descripcionInfraEl = document.getElementById('descripcion-modal-infra');
const cerrarModalInfra = document.getElementById('cerrar-modal-infra');
const botonAceptarInfra = document.getElementById('boton-modal-infra');

//Abrir modal al hacer clic en "Ver más" de cada tarjeta de infraestructura
document.querySelectorAll('.div-servicios-infraestructura .div-servicio').forEach(tarjeta => {
    const boton = tarjeta.querySelector('.div-boton-servicio button');
    boton.addEventListener('click', () => {
        const item = tarjeta.getAttribute('data-servicio');
        const datos = datosInfraestructura[item];

        if (datos) {
            imagenInfraEl.src = datos.imagen;
            tituloInfraEl.textContent = datos.titulo;
            descripcionInfraEl.textContent = datos.descripcion;
        }

        modalInfraestructura.classList.add('activo');
    });
});

cerrarModalInfra.addEventListener('click', () => {
    modalInfraestructura.classList.remove('activo');
});

botonAceptarInfra.addEventListener('click', () => {
    modalInfraestructura.classList.remove('activo');
});