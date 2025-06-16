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
  const [ user, setUser ] = useState(null)

useEffect(() => {
    onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ UID del admin:", user.uid);
    setIsLogin(false);
    setInitBtn(true)
    setUser(true)
  } else {
    console.log("⛔ No hay usuario logueado");
    setUser(false)
  }
});
},[]);

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
        <button onClick={() => { setAdd((prev) => !prev); setInitBtn((prev) => !prev) }}>Ingresar productos</button>
        <button onClick={() => { setInitBtn((prev) => !prev); setIsCarrito((prev) => !prev) }}>Carrito</button>
        <button onClick={() => { cerrarSesion() ; setInitBtn((prev) => !prev) ; setIsLogin((prev) => !prev)}}>Cerrar Sesion</button>
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
