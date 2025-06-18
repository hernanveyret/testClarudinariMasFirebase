import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { guardarProducto } from "../firebase/auth.js";

function SubirImagenWebP({setAdd, setInitBtn, categorias}) {
  const [url, setUrl] = useState(null);
  const [ nuevoProducto, setNuevoProducto ] = useState();
  const [ archivoOriginal, setAchivoOriginal ] = useState(null)
  const [ isOferta, setIsOferta ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const handleChange = async (e) => {
        
    if (!archivoOriginal) return;
    //console.log('cargando el archivo: ', archivoOriginal)
    const webpBlob = await convertirAWebP(archivoOriginal);
    const urlWebP = await subirACloudinary(webpBlob, archivoOriginal.name);
    setUrl(urlWebP);
    
  };

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
    // Reemplazar la extensión por .webp
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

  useEffect(() => {
    if (url) {
      //console.log("✅ Imagen subida:", url);      
      const productoNuevo = {
        titulo: watch('titulo'),
        descripcion: watch('descripcion'),
        precio: watch('precio'),
        oferta: isOferta,
        porcentajeOff: isOferta ? watch('porcentaje'): 0,
        urlImg: url,
        categoria: watch('categoria')
      }
    guardarProducto(productoNuevo);
    console.log(productoNuevo)
    reset();
    }
  }, [url]);

  const onSubmit = async (data) => {
  if (!archivoOriginal) {
    alert('Debes seleccionar una imagen');
    return;
  }
  //console.log("Datos del producto:", data); // data trae lo que esta en el input
  await handleChange(); // subir imagen
  // Aquí podrías guardar también el producto con la imagen subida

};

/*
  useEffect(() => {
    console.log(archivoOriginal)
  },[archivoOriginal])
  */
  return (
    <div>
      <button onClick={() => {
        setAdd((prev) => !prev);
        setInitBtn((prev) => !prev)
      }}>X</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select 
          id="selectCategoria"
          {...register('categoria', {
            required: {
              value: true,
              message:'Campo Obligatorio'
            }
          })}
          >            
          <option value="">Seleccione una categoria</option>
          { categorias && 
            categorias.map(c => (
              <option key={c.id} value={c.categoria}>{c.categoria}</option>
            ))
          }
        </select>
        { errors.categoria?.message && <p>{errors.categoria.message}</p>}
        <input type="text" placeholder="Ingrese titulo del producto" 
          {...register('titulo', {
            required: {
              value: true,
              message:'Campo obligatorio'
            }
          })}
        />
        { errors.titulo?.message && <p>{errors.titulo.message}</p>}

        <input type="text" placeholder="Ingrese una descripcion" 
          {...register('descripcion', {
            required:{
              value: true,
              message:'Campo obligatorio'
            }
          })}
        />
        { errors.descripcion?.message && <p>{errors.descripcion.message}</p>}

        <label>$<input type="text" placeholder="precio"
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
        />
        </label>
          { errors.precio?.message && <p>{errors.precio.message}</p>}

        <label>Oferta<input type="checkbox" onChange={(e) => { setIsOferta((prev) => !prev)}}/></label>
        { isOferta && 
        <input type="text" placeholder="Ingrese porsetaje de la oferta" 
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
        />   
        }
      <label>Ingrese una imagen del producto</label>
      <input type="file" accept="image/*" onChange={(e) => {setAchivoOriginal(e.target.files[0])}} />
      <input type="submit" />
      </form>
      { url && (
        <h3 style={{color:'green'}}>Producto subido con exito!!!</h3>
      )}
    </div>
  );
}

export default SubirImagenWebP;

