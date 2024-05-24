// script.js

const form = document.getElementById('client-form');
const searchForm = document.getElementById('search-form');
const cedulaInput = document.getElementById('cedula');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const birthdateInput = document.getElementById('birthdate');
const searchCedulaInput = document.getElementById('search-cedula');
const searchResult = document.getElementById('search-result');
const exportDateInput = document.getElementById('export-date');
const exportTodayButton = document.getElementById('export-today-button');
const exportDateButton = document.getElementById('export-date-button');

// Cargar clientes desde localStorage
const loadClientes = () => {
    const clientes = localStorage.getItem('clientesDB');
    return clientes ? JSON.parse(clientes) : {};
};

// Guardar clientes en localStorage
const saveClientes = (clientes) => {
    localStorage.setItem('clientesDB', JSON.stringify(clientes));
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cedula = cedulaInput.value;
    const name = nameInput.value;
    const phone = phoneInput.value;
    const birthdate = birthdateInput.value;
    
    const clientesDB = loadClientes();

    if (clientesDB[cedula]) {
        alert(`Cliente ya registrado:\nNombre: ${clientesDB[cedula].name}\nTeléfono: ${clientesDB[cedula].phone}`);
    } else {
        clientesDB[cedula] = { name, phone, birthdate };
        saveClientes(clientesDB);
        alert('Cliente registrado exitosamente');
        form.reset();
    }
});

// Función para calcular la edad
const calculateAge = (birthdate) => {
    const birthdateObj = new Date(birthdate);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = currentDate.getMonth() - birthdateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthdateObj.getDate())) {
        age--;
    }
    return age;
};

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchCedula = searchCedulaInput.value;
    const clientesDB = loadClientes();

    if (clientesDB[searchCedula]) {
        const { name, phone, birthdate } = clientesDB[searchCedula];
        const age = calculateAge(birthdate);
        searchResult.innerHTML = `
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Edad:</strong> ${age}</p>
        `;
    } else {
        searchResult.innerHTML = '<p>Cliente no encontrado.</p>';
    }
});

// Función para exportar datos a un archivo CSV
const exportData = (clientes, dateFilter) => {
    let csvContent = "data:text/csv;charset=utf-8,"
        + "Cédula,Nombre,Teléfono,Fecha de Nacimiento\n";

    Object.values(clientes).forEach(cliente => {
        const { cedula, name, phone, birthdate } = cliente;
        const formattedBirthdate = new Date(birthdate).toLocaleDateString('es-ES');
        if (!dateFilter || (new Date(birthdate).toDateString() === new Date(dateFilter).toDateString())) {
            csvContent += `${cedula},${name},${phone},${formattedBirthdate}\n`;
        }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clientes_${dateFilter || 'hoy'}.csv`);
    document.body.appendChild(link);
    link.click();
};

// Función para obtener la fecha actual en formato YYYY-MM-DD
const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Evento para el botón de exportar datos del día
exportTodayButton.addEventListener('click', (e) => {
    e.preventDefault();
    const clientesDB = loadClientes();
    const currentDate = getCurrentDate();
    exportData(clientesDB, currentDate);
});
// Obtener el botón de registro
const registerButton = document.getElementById('register-button');

// Agregar un evento de clic al botón de registro
registerButton.addEventListener('click', () => {
    // Ocultar la sección de consulta
    document.querySelector('.container').style.display = 'none';
    // Mostrar la sección de registro
    document.getElementById('client-form').style.display = 'block';
});
// Obtener referencia al botón de retroceso
const backButton = document.getElementById('back-button');

// Evento de clic en el botón de retroceso
backButton.addEventListener('click', () => {
    // Mostrar la sección de consulta
    document.querySelector('.container').style.display = 'block';
    document.getElementById('search-form').style.display = 'block';
    document.getElementById('search-result').style.display = 'block';
    
    // Ocultar la sección de registro y la de exportar
    document.getElementById('client-form').style.display = 'none';
    document.getElementById('export-container').style.display = 'none';
});

// Evento para el botón de exportar datos de una fecha específica
exportDateButton.addEventListener('click', (e) => {
    e.preventDefault();
    const clientesDB = loadClientes();
    const selectedDate = exportDateInput.value;
    exportData(clientesDB, selectedDate);
});






