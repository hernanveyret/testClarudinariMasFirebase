import e from "cors";
import { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';

function SubirImagenWebP() {
  const [url, setUrl] = useState(null);
  const [ nuevoProducto, setNuevoProducto ] = useState();
  const [ archivoOriginal, setAchivoOriginal ] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const handleChange = async (e) => {
    
    console.log('haciendo handleChange')
    if (!archivoOriginal) return;
    console.log('cargando el archivo: ', archivoOriginal)
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
      console.log("✅ Imagen subida:", url);
    }
  }, [url]);

  const onSubmit = async (data) => {
  if (!archivoOriginal) {
    alert('Debes seleccionar una imagen');
    return;
  }
  console.log("Datos del producto:", data);
  await handleChange(); // subir imagen
  // Aquí podrías guardar también el producto con la imagen subida
};


  useEffect(() => {
    console.log(archivoOriginal)
  },[archivoOriginal])
  
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>

        <input type="text" placeholder="Ingrese titulo del producto" 
          {...register('titulo', {
            required: {
              value: true,
              message:'Campo requerido'
            }
          })}
        />
        { errors.titulo?.message && <p>{errors.titulo.message}</p>}

        <input type="text" placeholder="Ingrese una descripcion" 
          {...register('descripcion', {
            required:{
              value: true,
              message: 'Campo requerido'
            }
          })}
        />
        { errors.descripcion?.message && <p>{errors.descripcion.message}</p>}

        <label>$<input type="text" placeholder="precio"
          {...register('precio', {
            required: {
              value: true,
              message:'Campo requerido',
            },
            pattern: {
              value: /^[0-9]+([.][0-9]+)?$/,
              message:'Solo números'
            }

          })}
        />
        </label>
          { errors.precio?.message && <p>{errors.precio.message}</p>}

        <label>Oferta<input type="checkbox" /></label>
        <input type="text" placeholder="Ingrese porsetaje de la oferta" />      
      <label>Ingrese una imagen del producto</label>
      <input type="file" accept="image/*" onChange={(e) => {setAchivoOriginal(e.target.files[0])}} />
      <input type="submit" />
      </form>
      {url && (
        <div style={{ marginTop: "1rem" }}>
          <p>Imagen subida como WebP:</p>
          <img src={url} alt="webp" width={300} />
          <p>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Ver en nueva pestaña
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default SubirImagenWebP;

