import React, { useState, useEffect } from 'react';
import { getData } from '../firebase/auth.js';
import './contenedorProductos.css';

const Carrito = ({ setInitBtn, setIsCarrito, user }) => {
  const [productos, setProductos] = useState([]);

  const sacarOferta = (precio, porcentaje) => {
    const precioOff = precio * porcentaje / 100
    return precio - precioOff
  }

  useEffect(() => {
    if (user) {
      getData((datos) => {
        console.log('Datos cargados: ', datos);
        setProductos(datos);
      });
    } else {
      setProductos([]); // Opcional: limpiar productos si no hay usuario
    }
  }, [user]);

  return (
    <>
      <h2>Carrito de compras</h2>
      <button
        onClick={() => {
          setIsCarrito((prev) => !prev);
          setInitBtn((prev) => !prev);
        }}
      >
        X
      </button>

      <div className="contenedor-productos">
        {productos.length > 0 ? (
          productos.map((prod) => (
            <div key={prod.id} className="card-producto">
              <h3>{prod.titulo}</h3>
              <img src={prod.urlImg} alt={prod.titulo} />
              <p>{prod.descripcion}</p>
              <p className="precio">${prod.oferta ? sacarOferta(prod.precio,prod.porcentajeOff):prod.precio}</p>
              <button>Comprar</button>
            </div>
          ))
        ) : (
          <p>No hay productos para mostrar.</p>
        )}
      </div>
    </>
  );
};

export default Carrito;
