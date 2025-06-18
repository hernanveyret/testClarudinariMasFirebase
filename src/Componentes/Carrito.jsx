import React, { useState, useEffect } from 'react';
import { getData, getDataCategorias, borrarCategoria } from '../firebase/auth.js';
import './contenedorProductos.css';

const Carrito = ({ setInitBtn, setIsCarrito, user, categorias, setCategorias, setIsEditProducto, productos, setProductos, productoEditar, setProductoEditar }) => {
  

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
      getDataCategorias((datos) => {
        console.log('Datos cargados: ', datos);
        setCategorias(datos);
      });
    } else {
      setProductos([]); // Opcional: limpiar productos si no hay usuario
    }
  }, [user]);

  useEffect(() => {
    console.log('Categorias: ',categorias)
  },[categorias])

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
        <section className="categorias">
          { categorias && 
          categorias.map(c => (
            <button key={c.id}>{c.categoria}</button>
          ))}
        </section>
      <div className="contenedor-productos">        
        {productos.length > 0 ? (
          productos.map((prod) => (
            <div key={prod.id} className="card-producto">
              <button 
                onClick={() => { 
                  setIsEditProducto((prev) => !prev);
                  console.log(prod.id)
                  const filtro = productos.find(p => p.id === prod.id)
                  setProductoEditar(filtro)
                }}
                style={{background:'transparent'}}>
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="black">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                  </svg>
              </button>
              <button 
               style={{background:'transparent'}}
               onClick={() => {borrarCategoria('productos', prod.id)}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  height="24px" 
                  viewBox="0 -960 960 960" 
                  width="24px" 
                  fill="black">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                  </svg>
              </button>
              <h3>{prod.titulo}</h3>
              <img src={prod.urlImg} alt={prod.titulo} />
              <p>{prod.categoria}</p>
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
