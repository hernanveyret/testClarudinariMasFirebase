import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import './App.css'
import SubirImagenWebP from './Componentes/SubirImagenWebp'
import Carrito from './Componentes/Carrito';
import EditarProducto from './Componentes/EditarProducto.jsx';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

import { loginWhihtGoogle, cerrarSesion, crearCategorias, borrarCategoria, getDataCategorias} from './firebase/auth.js';

function App() {
  const [ isLogin, setIsLogin ] = useState(true);
  const [ initBtn, setInitBtn ] = useState(false);
  const [ isCategorias, setIsCategorias ] = useState(false)
  const [ add, setAdd ] = useState(false);
  const [ isCarrito, setIsCarrito ] = useState(false)
  const [ user, setUser ] = useState(null);
  const [ usuario, setUsuario ] = useState(null);
  const [ categorias, setCategorias ] = useState([]);
  const [ isEditProducto, setIsEditProducto ] = useState(false);
  const [ productos, setProductos ] = useState([]);  

  const [ productoEditar, setProductoEditar ] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

useEffect(() => {
    onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ UID del admin:", user.uid);
    setUsuario(user)
    setIsLogin(false);
    setInitBtn(true)
    setUser(true)
  } else {
    console.log("⛔ No hay usuario logueado");
    setUser(false)
  }
});
},[]);

useEffect(() => {
  console.log(usuario)
 usuario?.photoURL && console.log(usuario.photoURL)  
},[usuario])

//Escucha firebase cuando hay ctegorias para mostrar
useEffect(() => {
  const unsubscribe = getDataCategorias(setCategorias);
  return () => unsubscribe(); // Limpia el listener cuando se desmonta
}, []);


const subMit = (data) => { 
  console.log('formulario cargado: ', data)
  crearCategorias(data);
  reset();
}

  const CrearCategorias = () => {
    return (
      <div>
        <button onClick={() => { setInitBtn((prev) => !prev); setIsCategorias((prev) => !prev) }}>X</button>
        <h3>Crear Categorias</h3>
        <form onSubmit={handleSubmit(subMit)}>
          <input type="text" 
            {...register('categoria', {
              required: {
                value: true,
                message:'Campo Obligatorio'
              }
            })}
          />
          { errors.categoria?.message && <p>{errors.categoria.message}</p>}

          <input type="submit" value="CARGAR" />
        </form>
        <ul className='lista-categorias'>
          {categorias.length === 0 ? (
            <li>No hay categorías aún</li>
          ) : (
            categorias.map(c => (
              <li key={c.id}>
                {c.categoria}
                
                <button
                  className="btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="white">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                  </svg>
                </button>
                <button
                  className='btn'
                  onClick={() => borrarCategoria('categorias', c.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="white">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                  </svg>
                </button>
      </li>
    ))
  )}
</ul>

      </div>
    )
  };

  const Login = () => {
    return (
      <>
        <h2>Iniciar Sesion</h2>
        <button onClick={loginWhihtGoogle}>Inciar sesion con Google</button>
      </>
    )
  };

  const InitButon = () => { 
    return (
      <>
        <h3 style={{backgroundColor:'orange'}}>Prueba de carrito con base de datos</h3>
        <h4 style={{textAlign:'center'}}>{usuario.displayName}</h4>
        
          <button onClick={() => { setInitBtn((prev) => !prev); setIsCategorias((prev) => !prev) }}>Crear categorias</button>
          <button onClick={() => { setAdd((prev) => !prev); setInitBtn((prev) => !prev) }}>Ingresar productos</button>
          <button onClick={() => { setInitBtn((prev) => !prev); setIsCarrito((prev) => !prev) }}>Carrito</button>
          <button onClick={() => { cerrarSesion() ; setInitBtn((prev) => !prev) ; setIsLogin((prev) => !prev)}}>Cerrar Sesion
            <img
              src={usuario.photoURL}
              alt="Imagen de perfil"
              title={usuario.displayName}
              width={30}
              height={30}
              style={{
                borderRadius: '50%',
                marginLeft: '8px',
                verticalAlign: 'middle'
              }}
            />
          </button>
        
        
      </>
    )
  }

  return (
    <> 
      { isCategorias && 
        <CrearCategorias 
        categorias={categorias}
        />
      }
      { isLogin && 
        <Login />
      }
      { initBtn && <InitButon /> }
      { add && <SubirImagenWebP 
        setInitBtn={setInitBtn}
        setAdd={setAdd}
        categorias={categorias}
        
        />
      }
      { isCarrito &&
        <Carrito 
          setInitBtn={setInitBtn}
          setIsCarrito={setIsCarrito}
          user={user}
          categorias={categorias}
          setCategorias={setCategorias}
          setIsEditProducto={setIsEditProducto}
          setProductos={setProductos}
          productos={productos}
          productoEditar={productoEditar}
          setProductoEditar={setProductoEditar}
        />
      }
      { isEditProducto && 
          <EditarProducto 
          setIsEditProducto={setIsEditProducto}
          productoEditar={productoEditar}
          categorias={categorias}
          />
      }

    </>
  )
}

export default App