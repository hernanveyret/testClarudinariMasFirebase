import { useState } from 'react'

import './App.css'
import SubirImagenWebP from './Componentes/SubirImagenWebp'

function App() {
  const [ add, setAdd ] = useState(false);
  const [ ver, setVer ] = useState(false)

  return (
    <>
      <h1>Prueba de carrito con base de datos</h1>
      <button onClick={() => { setAdd((prev) => !prev) }}>Ingresar productos</button>
      <button>Carrito</button>
      { add && <SubirImagenWebP />}

    </>
  )
}

export default App
