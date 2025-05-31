const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const cuidados = document.getElementById('cuidados').value.trim();
  const file = document.getElementById('foto').files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      agregarMascotaALista({
        nombre,
        ubicacion,
        cuidados,
        imagen: event.target.result, // base64 local
      });
    };
    reader.readAsDataURL(file);
  } else {
    agregarMascotaALista({
      nombre,
      ubicacion,
      cuidados,
      imagen: "", // sin imagen
    });
  }

  formulario.reset();
});

function agregarMascotaALista(data) {
  const div = document.createElement('div');
  div.className = 'mascota';
  div.innerHTML = `
    <h3>${data.nombre}</h3>
    <p><strong>📍 Ubicación:</strong> ${data.ubicacion}</p>
    <p><strong>🩺 Cuidados:</strong> ${data.cuidados}</p>
    ${data.imagen ? `<img src="${data.imagen}" alt="${data.nombre}" />` : ''}
  `;
  lista.appendChild(div);
}
