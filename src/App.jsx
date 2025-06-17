import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import './App.css'
import SubirImagenWebP from './Componentes/SubirImagenWebp'
import Carrito from './Componentes/Carrito';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

import { loginWhihtGoogle, cerrarSesion, crearCategorias } from './firebase/auth.js';

function App() {
  const [ isLogin, setIsLogin ] = useState(true);
  const [ initBtn, setInitBtn ] = useState(false);
  const [ isCategorias, setIsCategorias ] = useState(false)
  const [ add, setAdd ] = useState(false);
  const [ isCarrito, setIsCarrito ] = useState(false)
  const [ user, setUser ] = useState(null);
  const [ usuario, setUsuario ] = useState(null);
  const [ categorias, setCategorias ] = useState([])

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

const subMit = (data) => {
 
  console.log('formulario cargado: ', data)

  crearCategorias(data)
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
        />
      }

    </>
  )
}

export default App
