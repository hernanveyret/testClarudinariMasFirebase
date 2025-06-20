import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { editarCategoria } from '../firebase/auth.js'
const EditarCategoria = ({setIsEditCategorias, nombreCategoria, idCategoria}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const subMit = async (data) => {

    await editarCategoria(idCategoria, data.categoria)
    reset();
    setIsEditCategorias(false);
  }
  return (
       <div className="contenedor-edit-producto">
        <div style={{display:'flex', flexDirection:'column', padding:'20px', backgroundColor:'beige', borderRadius:'10px'}}>
        <button onClick={() => { setIsEditCategorias((prev) => !prev) }}>X</button>
        <h3>Editar Categorias</h3>
        <form onSubmit={handleSubmit(subMit)}>
          <input type="text" defaultValue={nombreCategoria}
            {...register('categoria', {
              required: {
                value: true,
                message:'Campo Obligatorio'
              }
            })}
          />
          { errors.categoria?.message && <p>{errors.categoria.message}</p>}

          <input type="submit" value="EDITAR" />
        </form>
    </div>
    </div>
  )
};
export default EditarCategoria;