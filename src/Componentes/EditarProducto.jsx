import React, { useEffect, useState} from 'react'
import './edit-producto.css'

const EditarProducto = ({setIsEditProducto, productoEditar, categorias}) => {
  const [ isOfertaEdit, setIsOfertaEdit] = useState(false)
  useEffect(() => {
    console.log(productoEditar)
    
  },[productoEditar]);

  return (
    <div className="contenedor-edit-producto">
      <form>
        <button 
          onClick={() => { setIsEditProducto((prev) => !prev)}}
          className="btn">
            X
        </button>
        <select>
          <option value={productoEditar.categoria}>{productoEditar.categoria}</option>
          { categorias && 
            categorias.map(cat => (
              <option key={cat.id} value={cat.categoria}>{cat.categoria}</option>
            ))
          }
        </select>
        <input type="text" value={productoEditar.titulo}/> { /* titulo */ }
        <input type="text" value={productoEditar.descripcion}/> { /* descripcion */ }
        <label>$<input type="text" value={productoEditar.precio}/></label> { /* precio */ }
        <label>Oferta<input type="checkbox" onChange={(e) => { setIsOfertaEdit((prev) => !prev)}}/></label>
        { isOfertaEdit && <input type="text" /> }
        <input type="file" /> { /* foto */ }
        <input type="submit" />
      </form>
    </div>
  )
};
export default EditarProducto;