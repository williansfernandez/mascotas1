const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const cuidados = document.getElementById('cuidados').value;
  const fotoInput = document.getElementById('foto');
  const file = fotoInput.files[0];

  const formData = new FormData();
  formData.append('nombre', nombre);
  formData.append('ubicacion', ubicacion);
  formData.append('cuidados', cuidados);
  if (file) formData.append('foto', file);

  try {
    const res = await axios.post('http://localhost:3000/mascotas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert(res.data.mensaje);
    formulario.reset();
    cargarMascotas();
  } catch (error) {
    alert('Error al registrar mascota');
    console.error(error);
  }
});

async function cargarMascotas() {
  try {
    const res = await axios.get('http://localhost:3000/mascotas');
    lista.innerHTML = '';
    res.data.forEach(data => {
      agregarMascotaALista(data);
    });
  } catch (error) {
    console.error('Error al cargar mascotas', error);
  }
}

function agregarMascotaALista(data) {
  const mascotaDiv = document.createElement('div');
  mascotaDiv.className = 'mascota';
  mascotaDiv.innerHTML = `
    <h3>${data.nombre}</h3>
    <p><strong>📍 Ubicación:</strong> ${data.ubicacion}</p>
    <p><strong>🩺 Cuidados:</strong> ${data.cuidados}</p>
    ${data.imagen ? `<img src="${data.imagen}" />` : ''}
  `;
  lista.appendChild(mascotaDiv);
}

cargarMascotas();
