// Configuración Firebase v8
const firebaseConfig = {
  apiKey: "AIzaSyAynLTFAirT4tgskPxoEe5TSmHKQbkos_M",
  authDomain: "registro-mascotas-5b60e.firebaseapp.com",
  projectId: "registro-mascotas-5b60e",
  storageBucket: "registro-mascotas-5b60e.appspot.com",
  messagingSenderId: "1079594379423",
  appId: "1:1079594379423:web:700968cf81fb80bcb19aaa"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista');

function agregarMascotaALista(data) {
  const div = document.createElement('div');
  div.className = 'mascota';
  div.innerHTML = `
    <h3>${data.nombre}</h3>
    <p><b>📍 Ubicación:</b> ${data.ubicacion}</p>
    <p><b>🩺 Cuidados:</b> ${data.cuidados}</p>
    ${data.imagen ? `<img src="${data.imagen}" alt="${data.nombre}" />` : ''}
  `;
  lista.appendChild(div);
}

async function cargarMascotas() {
  lista.innerHTML = '';
  try {
    const querySnapshot = await db.collection('mascotas').orderBy('fecha', 'desc').get();
    querySnapshot.forEach(doc => agregarMascotaALista(doc.data()));
  } catch (error) {
    console.error('Error al cargar mascotas:', error);
  }
}

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const cuidados = document.getElementById('cuidados').value.trim();
  const file = document.getElementById('foto').files[0];
  let fotoURL = '';

  if (file) {
    try {
      const fotoRef = storage.ref('fotos/' + Date.now() + '_' + file.name);
      await fotoRef.put(file);
      fotoURL = await fotoRef.getDownloadURL();
    } catch (err) {
      alert('Error al subir la imagen.');
      console.error(err);
      return;
    }
  }

  try {
    await db.collection('mascotas').add({
      nombre,
      ubicacion,
      cuidados,
      imagen: fotoURL,
      fecha: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('Mascota registrada con éxito.');
    formulario.reset();
    cargarMascotas();
  } catch (err) {
    alert('Error al registrar mascota.');
    console.error(err);
  }
});

cargarMascotas();
