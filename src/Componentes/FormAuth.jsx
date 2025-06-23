import React from 'react';
import { useForm } from 'react-hook-form';


const FormAuth = ({subMitLogin, titulo, actualizar}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  return (
    <div>
        <h2 style={{backgroundColor:'orange', padding:'0 20px'}}>{titulo}</h2>
      <form onSubmit={handleSubmit(subMitLogin)}>
                
                <input type="text" placeholder='Ingrese su correo'
                  {...register("correo", {
                    required: {
                      value: true,
                      message: "Campo obligatorio"
                    }
                  })}
                />
                { errors.correo?.message && <p>{errors.correo.message}</p>}
                { actualizar &&
                  <input type='text' placeholder='Ingrese su nuevo correo' 
                  {...register('correoNuevo', {
                    required: {
                      value: true,
                      message:'Campo obligatorio'
                    }
                  })}
                />                
                }
                <input type='password' placeholder='Ingrese su contraseña' 
                  {...register('contraseña', {
                    required: {
                      value: true,
                      message:'Campo obligatorio'
                    }
                  })}
                />
                { actualizar &&
                  <input type='password' placeholder='Ingrese su contraseña nueva' 
                  {...register('contraseñaNueva', {
                    required: {
                      value: true,
                      message:'Campo obligatorio'
                    }
                  })}
                />
                }
                
                <button type="submit">ENTRAR</button>
              </form>
    </div>
  )
};
export default FormAuth;