const API_URL = 'http://localhost:8081/api/agenda'; 

window.addEventListener('DOMContentLoaded', () => {
  fetchAgendas();

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

  if (agendas.length === 0) {
    const fila = document.createElement('tr');
    fila.innerHTML = `<td colspan="7">No hay agendas registradas.</td>`;
    tbody.appendChild(fila);
    return;
  }

  agendas.forEach(agenda => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${agenda.id}</td>
      <td>${agenda.apellido}</td>
      <td>${agenda.domicilio}</td>
      <td>${agenda.email}</td>
      <td>${agenda.nombre}</td>
      <td>${agenda.telefono}</td>
      <td>
        <button class="edit-btn" data-id="${agenda.id}">Modificar</button>
        <button class="delete-btn" data-id="${agenda.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Eventos botones
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

// ---------- MODIFICAR CONTACTO ----------

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

// ---------- AGREGAR CONTACTO ----------

function mostrarFormularioAdd() {
  document.getElementById('addFormContainer').style.display = 'block';
  document.getElementById('editFormContainer').style.display = 'none';
  limpiarFormularioAdd();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function ocultarFormularioAdd() {
  document.getElementById('addFormContainer').style.display = 'none';
}

function limpiarFormularioAdd() {
  document.getElementById('addApellido').value = '';
  document.getElementById('addDomicilio').value = '';
  document.getElementById('addEmail').value = '';
  document.getElementById('addNombre').value = '';
  document.getElementById('addTelefono').value = '';
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
