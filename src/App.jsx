import { useState, useEffect } from 'react'

import './App.css'
import SubirImagenWebP from './Componentes/SubirImagenWebp'
import Carrito from './Componentes/Carrito';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

import { loginWhihtGoogle, cerrarSesion } from './firebase/auth.js';

function App() {
  const [ isLogin, setIsLogin ] = useState(true);
  const [ initBtn, setInitBtn ] = useState(false);
  const [ add, setAdd ] = useState(false);
  const [ isCarrito, setIsCarrito ] = useState(false)
  const [ user, setUser ] = useState(null);
  const [ usuario, setUsuario ] = useState(null)

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
      { isLogin && 
        <Login />
      }
      { initBtn && <InitButon /> }
      { add && <SubirImagenWebP 
        setInitBtn={setInitBtn}
        setAdd={setAdd}
        />
      }
      { isCarrito &&
        <Carrito 
          setInitBtn={setInitBtn}
          setIsCarrito={setIsCarrito}
          user={user}
        />
      }

    </>
  )
}

export default App
