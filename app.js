
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAynLTFAirT4tgskPxoEe5TSmHKQbkos_M",
  authDomain: "registro-mascotas-5b60e.firebaseapp.com",
  projectId: "registro-mascotas-5b60e",
  storageBucket: "registro-mascotas-5b60e.appspot.com",
  messagingSenderId: "1079594379423",
  appId: "1:1079594379423:web:700968cf81fb80bcb19aaa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

async function cargarMascotas() {
  const querySnapshot = await getDocs(collection(db, "mascotas"));
  querySnapshot.forEach((doc) => {
    mostrarMascota(doc.data());
  });
}

function mostrarMascota(m) {
  const div = document.createElement("div");
  div.className = "mascota";
  div.innerHTML = `
    <h3>${m.nombre}</h3>
    <p><strong>📍 Ubicación:</strong> ${m.ubicacion}</p>
    <p><strong>🩺 Cuidados:</strong> ${m.cuidados}</p>
    <img src="${m.imagen}" />
  `;
  lista.appendChild(div);
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const cuidados = document.getElementById('cuidados').value;
  const file = document.getElementById('foto').files[0];

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "mascotas_upload");

  const res = await fetch("https://api.cloudinary.com/v1_1/dcuzftznb/image/upload", {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  const imagenUrl = data.secure_url;

  await addDoc(collection(db, "mascotas"), {
    nombre,
    ubicacion,
    cuidados,
    imagen: imagenUrl
  });

  formulario.reset();
  lista.innerHTML = "";
  cargarMascotas();
});

cargarMascotas();
