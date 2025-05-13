import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCuFzU5PXe7gt87mK5DYvuvy7k813rCF0",
  authDomain: "mascotas-2404b.firebaseapp.com",
  projectId: "mascotas-2404b",
  storageBucket: "mascotas-2404b.appspot.com",
  messagingSenderId: "514178447311",
  appId: "1:514178447311:web:baf57f0dce52da42a004ba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const formulario = document.getElementById('formularioMascota');
const lista = document.getElementById('listaMascotas');

async function cargarMascotas() {
  const querySnapshot = await getDocs(collection(db, "mascotas"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    agregarMascotaALista(data);
  });
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const ubicacion = document.getElementById('ubicacion').value;
  const cuidados = document.getElementById('cuidados').value;
  const fotoInput = document.getElementById('foto');
  const file = fotoInput.files[0];

  let imageUrl = "";
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "mascotas_upload");

    const response = await axios.post("https://api.cloudinary.com/v1_1/dcuzftznb/image/upload", formData);
    imageUrl = response.data.secure_url;
  }

  const nuevaMascota = { nombre, ubicacion, cuidados, imagen: imageUrl };
  await addDoc(collection(db, "mascotas"), nuevaMascota);
  agregarMascotaALista(nuevaMascota);
  formulario.reset();
});

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
