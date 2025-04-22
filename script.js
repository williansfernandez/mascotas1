
const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const cuidados = document.getElementById('cuidados').value;
  const fotoInput = document.getElementById('foto');
  const file = fotoInput.files[0];

  const mascotaDiv = document.createElement('div');
  mascotaDiv.className = 'mascota';
  mascotaDiv.innerHTML = `
    <h3>${nombre}</h3>
    <p><strong>Ubicación:</strong> ${ubicacion}</p>
    <p><strong>Cuidados:</strong> ${cuidados}</p>
  `;

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.createElement('img');
      img.src = event.target.result;
      mascotaDiv.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  lista.appendChild(mascotaDiv);
  formulario.reset();
});
