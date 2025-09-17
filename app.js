const API_URL = 'http://localhost:8081/api/agenda';

window.addEventListener('DOMContentLoaded', () => {
  fetchAgendas();

  // Botones buscadores
  document.getElementById('btnMostrarBuscarId').addEventListener('click', () => {
    document.getElementById('buscadorIdContainer').style.display = 'block';
    document.getElementById('buscadorTextoContainer').style.display = 'none';
  });
  document.getElementById('btnMostrarBuscarTexto').addEventListener('click', () => {
    document.getElementById('buscadorTextoContainer').style.display = 'block';
    document.getElementById('buscadorIdContainer').style.display = 'none';
  });
  document.querySelectorAll('.btnCerrarBuscador').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.target.getAttribute('data-target');
      document.getElementById(target).style.display = 'none';
    });
  });

  // Buscar por ID
  document.getElementById('btnBuscarPorId').addEventListener('click', () => {
    const id = document.getElementById('buscarPorId').value.trim();
    if (id !== '') {
      buscarAgendaPorId(id);
    }
  });

  // Buscar nombre o apellido
  document.getElementById('btnBuscarPorTexto').addEventListener('click', () => {
    const filtro = document.getElementById('buscarPorTexto').value.trim();
    if (filtro !== '') {
      buscarAgendaPorTexto(filtro);
    }
  });

  // Limpiar búsqueda
  document.getElementById('btnLimpiarBusqueda').addEventListener('click', () => {
    document.getElementById('buscarPorId').value = '';
    document.getElementById('buscarPorTexto').value = '';
    document.getElementById('buscadorIdContainer').style.display = 'none';
    document.getElementById('buscadorTextoContainer').style.display = 'none';
    fetchAgendas();
  });

  // Modificar contacto
  document.getElementById('editForm').addEventListener('submit', guardarCambios);
  document.getElementById('cancelEdit').addEventListener('click', ocultarFormularioEdit);

  // Agregar contacto
  document.getElementById('btnAgregar').addEventListener('click', mostrarFormularioAdd);
  document.getElementById('addForm').addEventListener('submit', agregarContacto);
  document.getElementById('cancelAdd').addEventListener('click', ocultarFormularioAdd);
});

function fetchAgendas() {
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error('Error al obtener las agendas');
      return response.json();
    })
    .then(agendas => {
      llenarTabla(agendas);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('No se pudieron cargar las agendas.');
    });
}

function llenarTabla(agendas) {
  const tbody = document.querySelector('#agendaTable tbody');
  tbody.innerHTML = '';

  if (!agendas || agendas.length === 0) {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td colspan="7">No hay agendas registradas.</td>`;
    tbody.appendChild(fila);
    return;
  }

  agendas.forEach(agenda => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${agenda.id}</td>
      <td>${agenda.nombre}</td>
      <td>${agenda.apellido}</td>
      <td>${agenda.domicilio}</td>
      <td>${agenda.telefono}</td>
      <td>${agenda.email}</td>
      <td>
        <button class="edit-btn" data-id="${agenda.id}">Modificar</button>
        <button class="delete-btn" data-id="${agenda.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Agregar listeners modificar y eliminar
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      eliminarAgenda(id);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      mostrarFormularioEdit(id);
    });
  });
}

function eliminarAgenda(id) {
  if (!confirm('¿Querés eliminar este contacto?')) return;

  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        alert('Contacto eliminado');
        fetchAgendas();
      } else {
        throw new Error('No se pudo eliminar el contacto');
      }
    })
    .catch(error => {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el contacto');
    });
}

function mostrarFormularioEdit(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error('No se encontró el contacto');
      return res.json();
    })
    .then(contacto => {
      document.getElementById('editId').value = contacto.id;
      document.getElementById('editApellido').value = contacto.apellido;
      document.getElementById('editDomicilio').value = contacto.domicilio;
      document.getElementById('editEmail').value = contacto.email;
      document.getElementById('editNombre').value = contacto.nombre;
      document.getElementById('editTelefono').value = contacto.telefono;

      document.getElementById('editFormContainer').style.display = 'block';
      document.getElementById('addFormContainer').style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
      alert('Error al cargar los datos del contacto');
      console.error(error);
    });
}

function ocultarFormularioEdit() {
  document.getElementById('editFormContainer').style.display = 'none';
}

function guardarCambios(event) {
  event.preventDefault();

  const id = document.getElementById('editId').value;
  const contactoEditado = {
    id: Number(id), 
    apellido: document.getElementById('editApellido').value,
    domicilio: document.getElementById('editDomicilio').value,
    email: document.getElementById('editEmail').value,
    nombre: document.getElementById('editNombre').value,
    telefono: document.getElementById('editTelefono').value
  };

  fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactoEditado)
  })
    .then(response => {
      if (response.ok) {
        alert('Contacto actualizado correctamente');
        ocultarFormularioEdit();
        fetchAgendas();
      } else {
        throw new Error('Error al actualizar el contacto');
      }
    })
    .catch(error => {
      alert('Error al actualizar el contacto');
      console.error(error);
    });
}

function mostrarFormularioAdd() {
  // resetear formulario
  document.getElementById('addApellido').value = '';
  document.getElementById('addDomicilio').value = '';
  document.getElementById('addEmail').value = '';
  document.getElementById('addNombre').value = '';
  document.getElementById('addTelefono').value = '';

  document.getElementById('addFormContainer').style.display = 'block';
  document.getElementById('editFormContainer').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ocultarFormularioAdd() {
  document.getElementById('addFormContainer').style.display = 'none';
}

function agregarContacto(event) {
  event.preventDefault();

  const nuevoContacto = {
    apellido: document.getElementById('addApellido').value,
    domicilio: document.getElementById('addDomicilio').value,
    email: document.getElementById('addEmail').value,
    nombre: document.getElementById('addNombre').value,
    telefono: document.getElementById('addTelefono').value
  };

  fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevoContacto)
  })
    .then(response => {
      if (response.ok) {
        alert('Contacto agregado correctamente');
        ocultarFormularioAdd();
        fetchAgendas();
      } else {
        throw new Error('Error al agregar el contacto');
      }
    })
    .catch(error => {
      alert('Error al agregar el contacto');
      console.error(error);
    });
}

// ------- Búsquedas --------

function buscarAgendaPorId(id) {
  fetch(`${API_URL}/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('No se encontró el contacto');
      return response.json();
    })
    .then(agenda => {
      llenarTabla([agenda]); 
    })
    .catch(error => {
      console.error('Error al buscar por ID:', error);
      alert('No se encontró ningún contacto con ese ID.');
    });
}

function buscarAgendaPorTexto(filtro) {
  fetch(`${API_URL}/buscar?filtro=${encodeURIComponent(filtro)}`)
    .then(response => {
      if (!response.ok) throw new Error('Error en búsqueda');
      return response.json();
    })
    .then(agendas => {
      if (!agendas || agendas.length === 0) {
        alert('No se encontraron contactos con ese nombre o apellido.');
      }
      llenarTabla(agendas);
    })
    .catch(error => {
      console.error('Error al buscar por texto:', error);
      alert('Error al realizar la búsqueda.');
    });
}
