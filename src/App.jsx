import { useEffect, useState } from 'react';
import './App.css';
import { firebase } from './firebase';

function App() {
  const [lista, setLista] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore();
        const data = await db.collection('usuarios').get();
        const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLista(arrayData);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerDatos();
  }, []);

  // Función para validar que los campos contengan solo letras y espacios
  const validarTexto = (texto) => /^[a-zA-Z\s]+$/.test(texto);

  // Función para guardar datos (registrar un nuevo usuario)
  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!nombre || !apellido) {
      alert("Falta el Nombre o Apellido");
      return;
    }
    if (!validarTexto(nombre) || !validarTexto(apellido)) {
      alert("El nombre y apellido solo deben contener letras y espacios.");
      return;
    }
    if (nombre.length < 4 || apellido.length < 4) {
      alert("El nombre y apellido deben tener al menos 4 caracteres.");
      return;
    }

    try {
      const db = firebase.firestore();
      const usuariosExistentes = await db
        .collection('usuarios')
        .where('nombre', '==', nombre)
        .where('apellido', '==', apellido)
        .get();

      if (!usuariosExistentes.empty) {
        alert("El usuario ya está registrado.");
        return;
      }

      const nuevoUsuario = { nombre, apellido };
      const dato = await db.collection('usuarios').add(nuevoUsuario);
      setLista([...lista, { id: dato.id, ...nuevoUsuario }]);
      setNombre('');
      setApellido('');
    } catch (error) {
      console.log(error);
    }
  };

  // Función para eliminar un usuario
  const eliminarUsuario = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('usuarios').doc(id).delete();
      setLista(lista.filter(user => user.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Función para editar un usuario
  const editarUsuario = (user) => {
    setNombre(user.nombre);
    setApellido(user.apellido);
    setId(user.id);
    setModoEdicion(true);
  };

  // Función para actualizar un usuario
  const actualizarUsuario = async (e) => {
    e.preventDefault();
    if (!nombre || !apellido) {
      alert("Falta el Nombre o Apellido");
      return;
    }
    if (!validarTexto(nombre) || !validarTexto(apellido)) {
      alert("El nombre y apellido solo deben contener letras y espacios.");
      return;
    }

    try {
      const db = firebase.firestore();
      await db.collection('usuarios').doc(id).update({ nombre, apellido });
      // Actualizar la lista de usuarios
      setLista(lista.map((user) => (user.id === id ? { id, nombre, apellido } : user)));
      // Restablecer los valores
      setNombre('');
      setApellido('');
      setId('');
      setModoEdicion(false);
      setError(null);
    } catch (error) {
      setError("Error al actualizar el usuario.");
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{modoEdicion ? 'Editar Usuario' : 'Registrar Usuario'}</h1>
          <form onSubmit={modoEdicion ? actualizarUsuario : guardarDatos}>
            <input
              type="text"
              placeholder="Ingrese su Nombre"
              className="form-control mb-2"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
            />
            <input
              type="text"
              placeholder="Ingrese su Apellido"
              className="form-control mb-2"
              onChange={(e) => setApellido(e.target.value)}
              value={apellido}
            />
            {error && <p className="text-danger">{error}</p>} {/* Mostrar error si ocurre */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                {modoEdicion ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
        <div className="col-12">
          <h1 className="text-center">Usuarios Registrados</h1>
          <ul className="list-group">
            {lista.map((user) => (
              <li className="list-group-item" key={user.id}>
                {user.nombre} {user.apellido}
                <button className="btn btn-danger ms-3 float-end" onClick={() => eliminarUsuario(user.id)}>
                  Eliminar
                </button>
                <button className="btn btn-warning ms-2 float-end" onClick={() => editarUsuario(user)}>
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
