import React, { useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import { editarProducto } from '../firebase/auth.js'
import './edit-producto.css'

const EditarProducto = ({setIsEditProducto, productoEditar, categorias}) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const [ isOfertaEdit, setIsOfertaEdit] = useState(productoEditar.oferta)

  useEffect(() => {
    console.log(productoEditar)    
  },[productoEditar]);



    const onSubmit = async (data) => {
      /*
  if (!archivoOriginal) {
    alert('Debes seleccionar una imagen');
    return;
  }
    */
  //console.log("Datos del producto actualizado:", data); // data trae lo que esta en el input
    const productoActualizado = {
      titulo: watch('titulo') || productoEditar.titulo,
      descripcion: watch('descripcion') || productoEditar.descripcion,
      precio: watch('precio') || productoEditar.precio,
      oferta: isOfertaEdit,
      porcentajeOff: isOfertaEdit ? watch('porcentaje') : '',
      urlImg: productoEditar.urlImg,
      categoria: watch('categoria') || productoEditar.categoria
  }

  
  await editarProducto(productoEditar.id, productoActualizado)
  reset();
  setIsEditProducto(false)
  //await handleChange(); // subir imagen
  // Aquí podrías guardar también el producto con la imagen subida

};

  return (
    <div className="contenedor-edit-producto">
      <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button 
          onClick={() => { setIsEditProducto((prev) => !prev)}}
          className="btn">
            X
        </button>
        <select
          id="selectCategoria"
            {...register('categoria', {
              required: {
                value: true,
                message:'Campo Obligatorio'
              }
            })}
          >
          <option defaultValue={productoEditar.categoria}>{productoEditar.categoria}</option>
          { categorias && 
            categorias.map(cat => (
              <option key={cat.id} value={cat.categoria}>{cat.categoria}</option>
            ))
          }
        </select>
        <input type="text" defaultValue={productoEditar.titulo || ''}
          {...register('titulo', {
            required: {
              value: true,
              message:'Campo obligatorio'
            }
          })}
        />
        { errors.titulo?.message && <p>{errors.titulo.message}</p>}
        <input type="text" defaultValue={productoEditar.descripcion || ''}
          {...register('descripcion', {
            required:{
              value: true,
              message:'Campo obligatorio'
            }
          })}
        /> 
        { errors.descripcion?.message && <p>{errors.descripcion.message}</p>}
        <label>$<input type="text" defaultValue={productoEditar.precio || ''}
          {...register('precio', {
            required: {
              value: true,
              message:'Campo obligatorio',
            },
            pattern: {
              value: /^[0-9]+([.][0-9]+)?$/,
              message:'Ingrese solo números'
            }
          })}
        /></label>
        { errors.precio?.message && <p>{errors.precio.message}</p>}
        <label>Oferta<input type="checkbox" checked={isOfertaEdit} onChange={(e) => { setIsOfertaEdit((prev) => !prev)}}/></label>
        { isOfertaEdit && <input type="text" defaultValue={productoEditar.porcentajeOff || ''}
          {...register('porcentaje', {
            required:{
              value: true,
              message:'Campo obligatorio'
            },
            pattern: {
              value: /^[0-9]+([.][0-9]+)?$/,
              message:'Ingrese solo numeros'
            }
          })}
        /> }
        <input type="file" /> { /* foto */ }
        <input type="submit" />
      </form>
    </div>
  </div>
  )
};
export default EditarProducto;