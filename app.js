import { db, collection, addDoc, getDocs } from './firebase.js';

const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

async function cargarMascotas() {
  lista.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "mascotas"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "mascota";
    div.innerHTML = `
      <h3>${data.nombre}</h3>
      <p><strong>📍 Ubicación:</strong> ${data.ubicacion}</p>
      <p><strong>🩺 Cuidados:</strong> ${data.cuidados}</p>
      ${data.imagen ? `<img src="${data.imagen}" />` : ""}
    `;
    lista.appendChild(div);
  });
}

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const ubicacion = document.getElementById("ubicacion").value;
  const cuidados = document.getElementById("cuidados").value;
  const foto = document.getElementById("foto").files[0];

  let url = "";
  if (foto) {
    const data = new FormData();
    data.append("file", foto);
    data.append("upload_preset", "mascotas_upload");
    const res = await fetch("https://api.cloudinary.com/v1_1/dcuzftznb/image/upload", {
      method: "POST",
      body: data
    });
    const file = await res.json();
    url = file.secure_url;
  }

  await addDoc(collection(db, "mascotas"), {
    nombre,
    ubicacion,
    cuidados,
    imagen: url
  });

  formulario.reset();
  cargarMascotas();
});

cargarMascotas();
