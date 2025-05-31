const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const cuidados = document.getElementById('cuidados').value.trim();
  const file = document.getElementById('foto').files[0];

  let imageUrl = "";

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mascotas_upload"); // tu preset de Cloudinary

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcuzftznb/image/upload",
        formData
      );
      imageUrl = response.data.secure_url;
    } catch (error) {
      alert("Error al subir la imagen");
      console.error(error);
      return;
    }
  }

  agregarMascotaALista({ nombre, ubicacion, cuidados, imagen: imageUrl });
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
