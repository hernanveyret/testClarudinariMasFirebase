import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import './App.css'
import SubirImagenWebP from './Componentes/SubirImagenWebp'
import Carrito from './Componentes/Carrito';
import EditarProducto from './Componentes/EditarProducto.jsx';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

import { loginConMail ,loginWhihtGoogle, cerrarSesion, crearCategorias, borrarCategoria, getDataCategorias, cambiarContrasena, cambiarCorreo} from './firebase/auth.js';
import EditarCategoria from './Componentes/EditarCategoria.jsx';
import FormAuth from './Componentes/FormAuth.jsx';

function App() {
  const [ isLogin, setIsLogin ] = useState(true);
  const [ initBtn, setInitBtn ] = useState(false);
  const [ isCategorias, setIsCategorias ] = useState(false)
  const [ add, setAdd ] = useState(false);
  const [ isCarrito, setIsCarrito ] = useState(false)
  const [ user, setUser ] = useState(null);
  const [ usuario, setUsuario ] = useState(null);
  const [ categorias, setCategorias ] = useState([]);
  const [ idCategoria, setIdCategoria ] = useState(null);
  const [ nombreCategoria, setNombreCategoria ] = useState(null)
  const [ isEditProducto, setIsEditProducto ] = useState(false);
  const [ isEditCategorias, setIsEditCategorias ] = useState(false);
  const [ isActualizar, setIsActualizar ] = useState(false)
  const [ productos, setProductos ] = useState([]);

  const [ usuarioActual, setUsuarioActual ] = useState(null) 

  const [ productoEditar, setProductoEditar ] = useState(null)
  const [ archivoOriginal, setAchivoOriginal ] = useState(null)

  // Para guardar URL subida
  const [ url, setUrl ] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ UID del admin:", user.uid);
        setUsuario(user)
        setIsLogin(false);
        setInitBtn(true)
        setUser(true)
        const currentUsuario = auth.currentUser
        setUsuarioActual(currentUsuario)
      } else {
        console.log("⛔ No hay usuario logueado");
        setUser(false)
      }
    });
  },[]);

  useEffect(() => {
    console.log(usuario)
    usuario?.photoURL && console.log(usuario.photoURL)  
  },[usuario]);

  //Escucha firebase cuando hay categorias para mostrar
  useEffect(() => {
    const unsubscribe = getDataCategorias(setCategorias);
    return () => unsubscribe(); // Limpia el listener cuando se desmonta
  }, []);

  // eliminar imagen de cloudinary
  const eliminarImagen = async (publicId) => {
    try {
      const res = await fetch('http://localhost:4000/api/eliminar-imagen', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      const data = await res.json();
      if (data.success) {
        console.log('✅ Imagen eliminada con éxito:', data.resultado);
      } else {
        console.error('❌ Error al eliminar:', data.error);
      }
    } catch (err) {
      console.error('❌ Error en fetch:', err);
    }
  };

  // Funciones para subir imagen
  const convertirAWebP = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/webp",
          0.8 // calidad
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const subirACloudinary = async (webpBlob, originalName) => {
    const baseName = originalName.split(".").slice(0, -1).join(".");
    const webpFileName = `${baseName}.webp`;

    const formData = new FormData();
    formData.append("file", webpBlob, webpFileName);
    formData.append("upload_preset", "carrito_upload");
    formData.append("folder", "productos");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dujru85ae/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      console.error("Error al subir:", data);
      return null;
    }
  };

  // Esta es la función que sube la imagen y luego crea la categoria
  const onSubmit = async (data) => {
    if (!archivoOriginal) {
      alert('Debes seleccionar una imagen');
      return;
    }

    try {
      // Convertir a webp
      const webpBlob = await convertirAWebP(archivoOriginal);
      // Subir a cloudinary y obtener URL
      const urlSubida = await subirACloudinary(webpBlob, archivoOriginal.name);

      if (!urlSubida) {
        alert('Error al subir la imagen');
        return;
      }

      // Crear objeto categoria
      const nuevaCategoria = {
        categoria: data.categoria,
        urlImg: urlSubida
      };

      // Crear en firebase
      await crearCategorias(nuevaCategoria);

      reset();
      setAchivoOriginal(null);
      alert('Categoría creada con éxito');
    } catch (error) {
      console.error('Error creando categoría:', error);
      alert('Error creando categoría');
    }
  };

  const CrearCategorias = () => {
    return (
      <div>
        <button onClick={() => { setInitBtn((prev) => !prev); setIsCategorias((prev) => !prev) }}>X</button>
        <h3>Crear Categorias</h3>
        <form 
          style={{width:'200px', margin:'0 auto'}}
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text" 
            placeholder="Nombre de la categoría"
            {...register('categoria', {
              required: {
                value: true,
                message:'Campo Obligatorio'
              }
            })}
          />
          { errors.categoria?.message && <p style={{color:'red'}}>{errors.categoria.message}</p>}

          <label>Ingrese una imagen del producto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {setAchivoOriginal(e.target.files[0])}}
          />

          <input type="submit" value="CARGAR" />
        </form>
        <ul className='lista-categorias'>
          {categorias.length === 0 ? (
            <li>No hay categorías aún</li>
          ) : (
            categorias.map(c => (
              <li key={c.id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px'}}>
                <div style={{display:'flex', alignItems:'center'}}>
                  <img src={c.urlImg} alt={c.categoria} style={{width:'40px', height:'40px', marginRight:'8px', objectFit:'cover', borderRadius:'4px'}}/>
                  <span>{c.categoria}</span>
                </div>
                <div>
                  <button
                    className="btn"
                    onClick={() => {setIsEditCategorias((prev) => !prev); setIdCategoria(c.id); setNombreCategoria(c.categoria)}}
                    title="Editar categoría"
                    style={{marginRight:'4px'}}
                  >
                    {/* ícono editar */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      height="24px" 
                      viewBox="0 -960 960 960" 
                      width="24px" 
                      fill="white">
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                    </svg>
                  </button>
                  <button
                    className='btn'
                    onClick={() => borrarCategoria('categorias', c.id)}
                    title="Borrar categoría"
                  >
                    {/* ícono borrar */}
                    <svg xmlns="http://www.w3.org/2000/svg" 
                      height="24px" 
                      viewBox="0 -960 960 960" 
                      width="24px" 
                      fill="white">
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                    </svg>
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    )
  };

  // -- resto del componente igual --

  const ActualizarEmailContraseña = () => {

    const actualizar = async (data) => {
      console.log(data)
      console.log('usuario actual ', usuarioActual)
      await cambiarContrasena(usuarioActual, data.contraseña, data.contraseñaNueva)
      //await cambiarCorreo(usuarioActual, data.contraseña, data.correoNuevo)
    }

    return (
      <div className="contenedor-actualizar">
        <button onClick={() => { setIsActualizar((prev) => !prev)}}>X</button>
        <FormAuth 
          titulo={'Actualizar Email y Contraseña'}
          subMitLogin={actualizar}
          actualizar={true}
        />
      </div>
    ) 
  }

  const Login = () => {

    const subMitLogin = async (data) => {
      console.log(data)
      await loginConMail (data)
      reset();
    }

    return (
      <>      
        <FormAuth
          titulo={'Iniciar Sesion'}
          subMitLogin={subMitLogin}
        />
      </>
    )
  };

  const InitButon = () => { 
    return (
      <>
        <h3 style={{backgroundColor:'orange'}}>Administrador de produtos</h3>
        <h4 style={{textAlign:'center'}}>{usuario.displayName}</h4>
        <div className="contenedor-btn">
          <button onClick={() => { setInitBtn((prev) => !prev); setIsCategorias((prev) => !prev) }} title="Crear/editar/borrar Catgorias">Categorias</button>
          <button onClick={() => { setAdd((prev) => !prev); setInitBtn((prev) => !prev) }} title="Ingresar productos">Ingresar productos</button>
          <button onClick={() => { setInitBtn((prev) => !prev); setIsCarrito((prev) => !prev) }}>Lista de productos</button>
          <button onClick={() => { setIsActualizar((prev) => !prev)}}>Cambio de contraseña</button>
          <button onClick={() => { cerrarSesion() ; setInitBtn((prev) => !prev) ; setIsLogin((prev) => !prev)}}>Cerrar Sesion
            <img
              src={usuario.photoURL ? usuario.photoURL : '/icons/icon-192x192.png'}

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
        </div>
        
      </>
    )
  }

  return (
    <> 
      { isActualizar && 
        <ActualizarEmailContraseña />
      }
      { isCategorias && 
        <CrearCategorias 
          categorias={categorias}
        />
      }
      {
        isEditCategorias &&
        <EditarCategoria 
          setIsEditCategorias={setIsEditCategorias}
          nombreCategoria={nombreCategoria}
          idCategoria={idCategoria}
        />
      }
      { isLogin && 
        <Login />
      }
      { initBtn && <InitButon /> }
      { add && <SubirImagenWebP 
        setInitBtn={setInitBtn}
        setAdd={setAdd}
        categorias={categorias}
      />
      }
      { isCarrito &&
        <Carrito 
          setInitBtn={setInitBtn}
          setIsCarrito={setIsCarrito}
          user={user}
          categorias={categorias}
          setCategorias={setCategorias}
          setIsEditProducto={setIsEditProducto}
          setProductos={setProductos}
          productos={productos}
          productoEditar={productoEditar}
          setProductoEditar={setProductoEditar}
          eliminarImagen={eliminarImagen}
        />
      }
      { isEditProducto && 
        <EditarProducto 
          setIsEditProducto={setIsEditProducto}
          productoEditar={productoEditar}
          categorias={categorias}
        />
      }
    </>
  )
}

export default App;
