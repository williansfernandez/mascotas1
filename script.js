// Configuración de Firebase - usa tu propia configuración aquí
const firebaseConfig = {
  apiKey: "AIzaSyAynLTFAirT4tgskPxoEe5TSmHKQbkos_M",
  authDomain: "registro-mascotas-5b60e.firebaseapp.com",
  projectId: "registro-mascotas-5b60e",
  storageBucket: "registro-mascotas-5b60e.appspot.com",
  messagingSenderId: "1079594379423",
  appId: "1:1079594379423:web:700968cf81fb80bcb19aaa"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias Firestore y Storage
const db = firebase.firestore();
const storage = firebase.storage();

// Referencias DOM
const formulario = document.getElementById('formulario');
const lista = document.getElementById('lista');

// Función para agregar mascota al DOM
function agregarMascotaALista(data) {
  const div = document.createElement('div');
  div.className = 'mascota';
  div.innerHTML = `
    <h3>${data.nombre}</h3>
    <p><b>Ubicación:</b> ${data.ubicacion}</p>
    <p><b>Cuidados:</b> ${data.cuidados}</p>
    ${data.imagen ? `<img src="${data.imagen}" alt="${data.nombre}" />` : ''}
  `;
  lista.appendChild(div);
}

// Cargar mascotas desde Firestore
async function cargarMascotas() {
  lista.innerHTML = '';
  try {
    const querySnapshot = await db.collection('mascotas').orderBy('fecha', 'desc').get();
    querySnapshot.forEach(doc => {
      agregarMascotaALista(doc.data());
    });
  } catch (error) {
    console.error('Error al cargar mascotas:', error);
  }
}

// Manejar envío del formulario
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const cuidados = document.getElementById('cuidados').value.trim();
  const fotoInput = document.getElementById('foto');
  const file = fotoInput.files[0];

  let fotoURL = '';

  if (file) {
    try {
      const storageRef = storage.ref();
      const fotoRef = storageRef.child('fotos/' + Date.now() + '_' + file.name);
      await fotoRef.put(file);
      fotoURL = await fotoRef.getDownloadURL();
    } catch (error) {
      alert('Error al subir la foto');
      console.error(error);
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

    alert('Mascota registrada con éxito');
    formulario.reset();
    cargarMascotas();
  } catch (error) {
    alert('Error al registrar mascota');
    console.error(error);
  }
});

// Cargar las mascotas al iniciar
cargarMascotas();

