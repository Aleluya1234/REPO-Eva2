// Datos de experiencias
const experiencias = [
    {
        id: 1,
        nombre: "Capillas de Mármol",
        categoria: "Navegación",
        lugar: "Puerto Río Tranquilo",
        precio: 35000,
        cuposDisponibles: 8,
        descripcion: "Navegación por el Lago General Carrera para admirar las formaciones de mármol."
    },
    {
        id: 2,
        nombre: "Trekking Cerro Castillo",
        categoria: "Trekking",
        lugar: "Cerro Castillo",
        precio: 25000,
        cuposDisponibles: 10,
        descripcion: "Caminata por senderos rodeados de bosques nativos y vistas espectaculares."
    },
    {
        id: 3,
        nombre: "Laguna San Rafael",
        categoria: "Navegación",
        lugar: "Puerto Chacabuco",
        precio: 65000,
        cuposDisponibles: 15,
        descripcion: "Navegación hacia el glaciar San Rafael, uno de los mayores atractivos de la Patagonia."
    },
    {
        id: 4,
        nombre: "Pesca con Mosca",
        categoria: "Pesca",
        lugar: "Río Simpson",
        precio: 40000,
        cuposDisponibles: 6,
        descripcion: "Pesca deportiva en aguas cristalinas del río Simpson."
    },
    {
        id: 5,
        nombre: "Kayak en Fiordos",
        categoria: "Navegación",
        lugar: "Puerto Aysén",
        precio: 30000,
        cuposDisponibles: 8,
        descripcion: "Recorrido en kayak por los fiordos patagónicos."
    },
    {
        id: 6,
        nombre: "Cultura Chilota",
        categoria: "Cultura",
        lugar: "Chile Chico",
        precio: 20000,
        cuposDisponibles: 12,
        descripcion: "Descubre las tradiciones y leyendas de la cultura chilota."
    }
];

// Renderizar tarjetas
function renderExperiencias(lista) {
    const contenedor = document.getElementById('lista-experiencias');
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:40px; color:#5d6d7e;">No hay experiencias en esta categoría</p>';
        return;
    }

    lista.forEach(exp => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.innerHTML = `
            <h3>${exp.nombre}</h3>
            <p class="lugar">📍 ${exp.lugar}</p>
            <span class="categoria">${exp.categoria}</span>
            <p class="precio">$${exp.precio.toLocaleString()} CLP</p>
            <p class="cupos">🎫 Cupos: ${exp.cuposDisponibles}</p>
            <p class="descripcion">${exp.descripcion}</p>
            <button class="btn-ver-mas">Ver más</button>
        `;
        contenedor.appendChild(tarjeta);

        const btn = tarjeta.querySelector('.btn-ver-mas');
        const desc = tarjeta.querySelector('.descripcion');
        btn.addEventListener('click', () => {
            desc.classList.toggle('mostrar');
            btn.textContent = desc.classList.contains('mostrar') ? 'Ver menos' : 'Ver más';
        });
    });
}

// Filtrar por categoría
function filtrarPorCategoria(categoria) {
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.categoria === categoria);
    });

    const filtradas = categoria === 'Todos' 
        ? experiencias 
        : experiencias.filter(exp => exp.categoria === categoria);
    renderExperiencias(filtradas);
}

// Validar email
function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Mostrar error
function mostrarError(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    const errorSpan = campo.closest('.campo').querySelector('.error');
    const contenedor = campo.closest('.campo');
    
    errorSpan.textContent = mensaje || '';
    contenedor.classList.toggle('error', !!mensaje);
}

// Descontar cupos
function descontarCupo(id, personas) {
    const experiencia = experiencias.find(exp => exp.id === id);
    if (experiencia) {
        experiencia.cuposDisponibles -= personas;
        const categoriaActiva = document.querySelector('.filtro-btn.active').dataset.categoria;
        filtrarPorCategoria(categoriaActiva);
    }
}

// Validar formulario
function validarFormulario(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const select = document.getElementById('experiencia-select');
    const personas = document.getElementById('personas');
    const fecha = document.getElementById('fecha');
    const exito = document.getElementById('mensaje-exito');

    ['nombre', 'email', 'experiencia-select', 'personas', 'fecha'].forEach(id => mostrarError(id, ''));

    let valido = true;

    if (!nombre.value.trim()) {
        mostrarError('nombre', 'El nombre es obligatorio');
        valido = false;
    }

    if (!email.value.trim() || !esEmailValido(email.value)) {
        mostrarError('email', 'Ingresa un email válido');
        valido = false;
    }

    if (!select.value) {
        mostrarError('experiencia-select', 'Selecciona una experiencia');
        valido = false;
    }

    const numPersonas = parseInt(personas.value);
    if (!personas.value || numPersonas < 1) {
        mostrarError('personas', 'Ingresa un número válido');
        valido = false;
    } else if (select.value) {
        const exp = experiencias.find(e => e.id === parseInt(select.value));
        if (exp && numPersonas > exp.cuposDisponibles) {
            mostrarError('personas', `Solo hay ${exp.cuposDisponibles} cupos disponibles`);
            valido = false;
        }
    }

    if (!fecha.value) {
        mostrarError('fecha', 'Selecciona una fecha');
        valido = false;
    }

    if (valido) {
        const exp = experiencias.find(e => e.id === parseInt(select.value));
        descontarCupo(exp.id, numPersonas);
        
        exito.style.display = 'block';
        exito.textContent = `✅ ¡Reserva confirmada! ${numPersonas} persona(s) para "${exp.nombre}" el ${fecha.value}`;
        
        select.value = '';
        personas.value = '1';
        fecha.value = '';
        nombre.value = '';
        email.value = '';
        
        setTimeout(() => exito.style.display = 'none', 5000);
    } else {
        exito.style.display = 'none';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderExperiencias(experiencias);

    const select = document.getElementById('experiencia-select');
    experiencias.forEach(exp => {
        const option = document.createElement('option');
        option.value = exp.id;
        option.textContent = `${exp.nombre} - ${exp.lugar} (${exp.cuposDisponibles} cupos)`;
        select.appendChild(option);
    });

    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => filtrarPorCategoria(btn.dataset.categoria));
    });

    document.getElementById('formulario-reserva').addEventListener('submit', validarFormulario);
});
