import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

const productos = [
    { nombre: "Huevo", precio: 0.75, unidad: "unidad" },
    { nombre: "Yogurt griego natural", precio: 20.90, unidad: "1 litro" },
    { nombre: "Pollo", precio: 9.50, unidad: "1 kg" },
    { nombre: "Plátano", precio: 4.50, unidad: "1 kg" },
    { nombre: "Pescado", precio: 15.00, unidad: "1 kg" },
    { nombre: "Leche fresca", precio: 3.50, unidad: "1 litro" },
    { nombre: "Papa", precio: 3.00, unidad: "1 kg" },
    { nombre: "Tomate", precio: 3.00, unidad: "1 kg" },
    { nombre: "Cebolla", precio: 2.50, unidad: "1 kg" },
    { nombre: "Zanahoria", precio: 3.00, unidad: "1 kg" },
    { nombre: "Limón", precio: 3.00, unidad: "1 kg" },
    { nombre: "Palta", precio: 7.00, unidad: "1 kg" },
    { nombre: "Manzana", precio: 5.00, unidad: "1 kg" },
    { nombre: "Pera", precio: 4.80, unidad: "1 kg" },
    { nombre: "Papaya", precio: 4.50, unidad: "1 kg" },
    { nombre: "Fresa", precio: 8.00, unidad: "1 kg" },
    { nombre: "Espinaca", precio: 2.00, unidad: "1 atado" },
    { nombre: "Brócoli", precio: 6.50, unidad: "1 kg" },
    { nombre: "Zapallo", precio: 2.80, unidad: "1 kg" },
    { nombre: "Camote", precio: 2.70, unidad: "1 kg" },
    { nombre: "Arroz integral", precio: 6.00, unidad: "1 kg" },
    { nombre: "Quinua", precio: 9.00, unidad: "1 kg" },
    { nombre: "Lentejas", precio: 5.00, unidad: "1 kg" },
    { nombre: "Garbanzos", precio: 6.50, unidad: "1 kg" },
    { nombre: "Avena entera", precio: 4.00, unidad: "1 kg" },
    { nombre: "Aceite de oliva", precio: 14.00, unidad: "500 ml" },
    { nombre: "Pan integral", precio: 10.50, unidad: "unidad grande" },
    { nombre: "Hígado de cordero", precio: 10.50, unidad: "1 kg" },
    { nombre: "Carne de res (molida)", precio: 19.00, unidad: "1 kg" },
    { nombre: "Huevos de codorniz", precio: 0.35, unidad: "unidad" },
    { nombre: "Tofu", precio: 9.00, unidad: "500 g" }
];

const productosContainer = document.getElementById('productos-container');
const precioTotalEl = document.getElementById('precio-total');
const btnGuardar = document.getElementById('btn-guardar');

function renderizarProductos() {
    productosContainer.innerHTML = '';
    productos.forEach((producto, index) => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        card.dataset.index = index;
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p class="precio-unidad">S/ ${producto.precio.toFixed(2)} / ${producto.unidad}</p>
            <div class="control-cantidad">
                <label for="cantidad-${index}">Cantidad:</label>
                <input type="number" id="cantidad-${index}" min="0" value="0" class="cantidad-input">
            </div>
            <p class="subtotal">Subtotal: S/ 0.00</p>
        `;
        productosContainer.appendChild(card);
    });
}

function calcularTotal() {
    let total = 0;
    const cards = productosContainer.getElementsByClassName('producto-card');
    for (const card of cards) {
        const index = card.dataset.index;
        const precio = productos[index].precio;
        const cantidad = card.querySelector('.cantidad-input').value;
        const subtotal = precio * cantidad;
        card.querySelector('.subtotal').textContent = `Subtotal: S/ ${subtotal.toFixed(2)}`;
        total += subtotal;
    }
    precioTotalEl.textContent = `S/ ${total.toFixed(2)}`;
}

productosContainer.addEventListener('input', (e) => {
    if (e.target.classList.contains('cantidad-input')) {
        calcularTotal();
    }
});

async function cargarListasGuardadas() {
    const listasGuardadasContainer = document.getElementById('listas-guardadas');
    listasGuardadasContainer.innerHTML = '<h3>Cargando listas...</h3>';

    try {
        const querySnapshot = await getDocs(collection(db, "listasDeCompras"));
        if (querySnapshot.empty) {
            listasGuardadasContainer.innerHTML = '<p>No hay listas guardadas.</p>';
            return;
        }

        listasGuardadasContainer.innerHTML = ''; // Limpiar antes de renderizar
        querySnapshot.forEach(doc => {
            const lista = doc.data();
            const fecha = lista.fecha.toDate().toLocaleString('es-ES');

            const listaEl = document.createElement('div');
            listaEl.classList.add('lista-guardada');

            let itemsHtml = '<ul>';
            lista.items.forEach(item => {
                itemsHtml += `<li>${item.nombre} - Cantidad: ${item.cantidad}, Subtotal: S/ ${item.subtotal.toFixed(2)}</li>`;
            });
            itemsHtml += '</ul>';

            listaEl.innerHTML = `
                <h4>Lista del ${fecha}</h4>
                <p><strong>Total: S/ ${lista.total.toFixed(2)}</strong></p>
                ${itemsHtml}
                <button class="btn-editar-lista" data-id="${doc.id}">Editar</button>
                <button class="btn-eliminar-lista" data-id="${doc.id}">Eliminar</button>
            `;
            listasGuardadasContainer.appendChild(listaEl);
        });
    } catch (error) {
        console.error("Error al cargar las listas: ", error);
        listasGuardadasContainer.innerHTML = '<p>Error al cargar las listas.</p>';
    }
}

btnGuardar.addEventListener('click', async () => {
    const totalTexto = precioTotalEl.textContent;
    if (confirm(`El precio total es ${totalTexto}. ¿Desea guardar la lista?`)) {
        const listaParaGuardar = {
            fecha: new Date(),
            items: [],
            total: parseFloat(totalTexto.replace('S/ ', ''))
        };

        const cards = productosContainer.getElementsByClassName('producto-card');
        for (const card of cards) {
            const cantidad = parseInt(card.querySelector('.cantidad-input').value);
            if (cantidad > 0) {
                const index = card.dataset.index;
                const producto = productos[index];
                listaParaGuardar.items.push({
                    nombre: producto.nombre,
                    precio: producto.precio,
                    unidad: producto.unidad,
                    cantidad: cantidad,
                    subtotal: producto.precio * cantidad
                });
            }
        }

        if (listaParaGuardar.items.length > 0) {
            try {
                await addDoc(collection(db, "listasDeCompras"), listaParaGuardar);
                alert('¡Lista guardada con éxito!');
                // Resetear cantidades
                productosContainer.querySelectorAll('.cantidad-input').forEach(input => input.value = 0);
                calcularTotal();
                cargarListasGuardadas(); // Recargar listas
            } catch (error) {
                console.error("Error al guardar la lista: ", error);
                alert('Hubo un error al guardar la lista.');
            }
        } else {
            alert('No hay productos en la lista para guardar.');
        }
    }
});

const listasGuardadasContainer = document.getElementById('listas-guardadas');

listasGuardadasContainer.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.classList.contains('btn-eliminar-lista')) {
        const docId = target.dataset.id;
        if (confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
            try {
                await deleteDoc(doc(db, "listasDeCompras", docId));
                alert('¡Lista eliminada con éxito!');
                cargarListasGuardadas(); // Recargar listas
            } catch (error) {
                console.error("Error al eliminar la lista: ", error);
                alert('Hubo un error al eliminar la lista.');
            }
        }
    } else if (target.classList.contains('btn-editar-lista')) {
        const docId = target.dataset.id;
        try {
            const docRef = doc(db, "listasDeCompras", docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const lista = docSnap.data();
                const inputs = cuerpoTabla.querySelectorAll('.cantidad-input');

                inputs.forEach(input => input.value = 0);

                lista.items.forEach(item => {
                    const productoIndex = productos.findIndex(p => p.nombre === item.nombre);
                    if (productoIndex !== -1) {
                        const input = inputs[productoIndex];
                        input.value = item.cantidad;
                    }
                });
                calcularTotal();
                window.scrollTo(0, 0);
                if (confirm('La lista ha sido cargada para editar. ¿Desea eliminar la lista original al guardar los nuevos cambios?')) {
                    await deleteDoc(doc(db, "listasDeCompras", docId));
                    cargarListasGuardadas();
                }
            } else {
                alert("No se encontró la lista para editar.");
            }
        } catch (error) {
            console.error("Error al editar la lista: ", error);
            alert('Hubo un error al editar la lista.');
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    calcularTotal();
    cargarListasGuardadas();
});
