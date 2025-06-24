import React, { useEffect } from 'react';
import { getData, getDataCategorias, borrarCategoria } from '../firebase/auth.js';
import './contenedorProductos.css';

const Carrito = ({
  setInitBtn,
  setIsCarrito,
  user,
  categorias,
  setCategorias,
  setIsEditProducto,
  productos,
  setProductos,
  productoEditar,
  setProductoEditar,
  eliminarImagen
}) => {
  const sacarOferta = (precio, porcentaje) => {
    const precioOff = precio * porcentaje / 100;
    return (precio - precioOff).toFixed(2);
  };

  useEffect(() => {
    if (user) {
      getData(setProductos);
      getDataCategorias(setCategorias);
    } else {
      setProductos([]);
    }
  }, [user]);

  return (
    <>
      <p style={{ fontSize: '18px', fontWeight: 'bold' }}>* Vista de productos</p>
      <button
        onClick={() => {
          setIsCarrito((prev) => !prev);
          setInitBtn((prev) => !prev);
        }}
      >
        X
      </button>

      <section className="categorias">
        {categorias && categorias.map(c => (    
          <button key={c.id}>{c.categoria}</button>    
        
        ))}
      </section>

      <div className="contenedor-productos">
        {productos.length > 0 ? (
          productos.map((prod) => (
            <div key={prod.id} className="fila-producto">
              {/* Imagen */}
              <img src={prod.urlImg} alt={prod.titulo} />

              {/* Datos */}
              <div className="fila-datos">
                <p><strong>{prod.titulo}</strong></p>
                <p>{prod.descripcion}</p>
                <p>$ {prod.oferta ? sacarOferta(prod.precio, prod.porcentajeOff) : prod.precio}</p>

                <label>
                  <input type="checkbox" checked={prod.oferta} readOnly /> Oferta
                </label>

                {prod.oferta && (
                  <p>{prod.porcentajeOff}% OFF</p>
                )}
              </div>

              {/* Botones */}
              <div className="fila-botones">
                <button
                  onClick={() => {
                    setIsEditProducto(true);
                    const filtro = productos.find(p => p.id === prod.id);
                    setProductoEditar(filtro);
                  }}
                  title="Editar"
                >
                  ✏️
                </button>

                <button
                  onClick={() => {
                    borrarCategoria('productos', prod.id);
                    eliminarImagen(prod.public_id);
                  }}
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
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
